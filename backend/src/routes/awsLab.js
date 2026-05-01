import { Router } from 'express';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit: 1 credential request per 30 minutes per user
const credentialLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 2,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Too many credential requests. Try again in 30 minutes.' }
});

function getStsClient() {
  const config = { region: process.env.AWS_REGION || 'ap-south-1' };

  // Only set explicit credentials if provided (otherwise SDK uses default chain)
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return new STSClient(config);
}

// Build a scoped session policy from allowed services list
function buildSessionPolicy(allowedServices) {
  const services = allowedServices.split(',').map(s => s.trim().toLowerCase());

  const actionMap = {
    s3: ['s3:*'],
    lambda: ['lambda:*'],
    dynamodb: ['dynamodb:*'],
    sns: ['sns:*'],
    sqs: ['sqs:*'],
    apigateway: ['apigateway:*', 'execute-api:*'],
    logs: ['logs:*'],
    cloudwatch: ['cloudwatch:Get*', 'cloudwatch:List*', 'cloudwatch:Describe*'],
    cloudformation: ['cloudformation:*'],
    iam: ['iam:Get*', 'iam:List*'], // read-only IAM
    ec2: ['ec2:Describe*'], // read-only EC2
    ecs: ['ecs:*'],
    ecr: ['ecr:*'],
    stepfunctions: ['states:*'],
    eventbridge: ['events:*'],
    secretsmanager: ['secretsmanager:GetSecretValue', 'secretsmanager:ListSecrets'],
  };

  const actions = [];
  for (const svc of services) {
    if (actionMap[svc]) {
      actions.push(...actionMap[svc]);
    }
  }

  // Always allow STS GetCallerIdentity (needed for console)
  actions.push('sts:GetCallerIdentity');

  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: actions,
        Resource: '*'
      },
      {
        Effect: 'Deny',
        Action: [
          'iam:CreateUser', 'iam:DeleteUser', 'iam:CreateRole', 'iam:DeleteRole',
          'iam:AttachRolePolicy', 'iam:DetachRolePolicy', 'iam:PutRolePolicy',
          'iam:CreateAccessKey', 'iam:UpdateAccessKey',
          'organizations:*', 'account:*',
          'ec2:RunInstances', 'ec2:StartInstances', 'ec2:RequestSpotInstances',
          'sagemaker:Create*', 'bedrock:*', 'rds:CreateDB*',
          'redshift:Create*', 'emr:Run*', 'glue:Create*'
        ],
        Resource: '*'
      }
    ]
  });
}

// Generate a federated console login URL from temporary credentials
function buildConsoleUrl(credentials, region) {
  const sessionJson = JSON.stringify({
    sessionId: credentials.AccessKeyId,
    sessionKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken,
  });

  const encodedSession = encodeURIComponent(sessionJson);
  const signinUrl = 'https://signin.aws.amazon.com/federation';
  const consoleUrl = `https://${region}.console.aws.amazon.com/console/home?region=${region}`;

  // The getSigninToken + console URL flow
  // Note: This returns the federation URL that the frontend will use in a 2-step process
  return {
    federationUrl: `${signinUrl}?Action=getSigninToken&SessionDuration=3600&Session=${encodedSession}`,
    consoleHome: consoleUrl,
    region
  };
}

// ─── Admin: Enable AWS Lab for an event ──────────────────
router.post('/events/:eventId/enable', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { maxDurationHours, maxSessions, allowedServices, sessionPolicy, roleArn } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const config = await prisma.awsLabConfig.upsert({
      where: { eventId },
      update: {
        enabled: true,
        maxDurationHours: maxDurationHours || 2,
        maxSessions: maxSessions || 50,
        allowedServices: allowedServices || 's3,lambda,dynamodb,sns,sqs,apigateway,logs,cloudwatch',
        sessionPolicy: sessionPolicy || null,
        roleArn: roleArn || null,
      },
      create: {
        eventId,
        enabled: true,
        maxDurationHours: maxDurationHours || 2,
        maxSessions: maxSessions || 50,
        allowedServices: allowedServices || 's3,lambda,dynamodb,sns,sqs,apigateway,logs,cloudwatch',
        sessionPolicy: sessionPolicy || null,
        roleArn: roleArn || null,
      }
    });

    await logAudit(req.user.id, 'AWS_LAB_ENABLE', { targetType: 'EVENT', targetId: eventId, details: { maxDurationHours: config.maxDurationHours, maxSessions: config.maxSessions } });

    res.json({ config });
  } catch (err) {
    next(err);
  }
});

// ─── Admin: Disable AWS Lab for an event ─────────────────
router.post('/events/:eventId/disable', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const config = await prisma.awsLabConfig.update({
      where: { eventId: req.params.eventId },
      data: { enabled: false }
    });

    await logAudit(req.user.id, 'AWS_LAB_DISABLE', { targetType: 'EVENT', targetId: req.params.eventId });

    res.json({ config });
  } catch (err) {
    next(err);
  }
});

// ─── Student: Check lab status for an event ──────────────
router.get('/events/:eventId/status', authenticate, async (req, res, next) => {
  try {
    const config = await prisma.awsLabConfig.findUnique({
      where: { eventId: req.params.eventId },
      include: { _count: { select: { sessions: true } } }
    });

    if (!config || !config.enabled) {
      return res.json({ available: false });
    }

    // Check if user already has an active session
    const existingSession = await prisma.awsLabSession.findFirst({
      where: {
        userId: req.user.id,
        configId: config.id,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    const activeSessions = await prisma.awsLabSession.count({
      where: { configId: config.id, revokedAt: null, expiresAt: { gt: new Date() } }
    });

    res.json({
      available: true,
      allowedServices: config.allowedServices.split(',').map(s => s.trim()),
      maxDurationHours: config.maxDurationHours,
      hasActiveSession: !!existingSession,
      sessionExpiresAt: existingSession?.expiresAt || null,
      activeSessions,
      maxSessions: config.maxSessions,
      spotsLeft: config.maxSessions - activeSessions
    });
  } catch (err) {
    next(err);
  }
});

// ─── Student: Request AWS credentials ────────────────────
router.post('/events/:eventId/request', authenticate, credentialLimiter, async (req, res, next) => {
  try {
    const config = await prisma.awsLabConfig.findUnique({
      where: { eventId: req.params.eventId }
    });

    if (!config || !config.enabled) {
      return res.status(400).json({ error: 'AWS Lab access is not enabled for this event' });
    }

    // Check if user already has an active session
    const existingSession = await prisma.awsLabSession.findFirst({
      where: {
        userId: req.user.id,
        configId: config.id,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingSession) {
      return res.status(409).json({ error: 'You already have an active session', expiresAt: existingSession.expiresAt });
    }

    // Check max sessions
    const activeSessions = await prisma.awsLabSession.count({
      where: { configId: config.id, revokedAt: null, expiresAt: { gt: new Date() } }
    });

    if (activeSessions >= config.maxSessions) {
      return res.status(400).json({ error: 'All lab slots are taken. Try again later.' });
    }

    // Determine role ARN
    const roleArn = config.roleArn || process.env.AWS_LAB_ROLE_ARN;
    if (!roleArn) {
      return res.status(500).json({ error: 'AWS Lab is not configured. Contact admin.' });
    }

    // Build session name (traceable in CloudTrail)
    const sessionName = `sbg-${req.user.id.slice(-8)}-${Date.now()}`;
    const durationSeconds = config.maxDurationHours * 3600;

    // Build session policy
    const policy = config.sessionPolicy || buildSessionPolicy(config.allowedServices);

    // Call STS AssumeRole
    const sts = getStsClient();
    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName,
      DurationSeconds: Math.min(durationSeconds, 43200), // max 12 hours
      Policy: policy,
    });

    const stsResponse = await sts.send(command);
    const creds = stsResponse.Credentials;

    const expiresAt = creds.Expiration;

    // Record session
    await prisma.awsLabSession.create({
      data: {
        userId: req.user.id,
        configId: config.id,
        sessionName,
        expiresAt,
      }
    });

    await logAudit(req.user.id, 'AWS_LAB_SESSION_CREATE', {
      targetType: 'EVENT',
      targetId: req.params.eventId,
      details: { sessionName, expiresAt: expiresAt.toISOString() }
    });

    const region = process.env.AWS_REGION || 'ap-south-1';
    const consoleInfo = buildConsoleUrl(creds, region);

    res.status(201).json({
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken,
        expiresAt: expiresAt,
      },
      console: consoleInfo,
      allowedServices: config.allowedServices.split(',').map(s => s.trim()),
      sessionName,
      warning: 'These credentials are shown ONCE. Copy them now. They expire automatically.'
    });
  } catch (err) {
    if (err.name === 'AccessDeniedException' || err.name === 'MalformedPolicyDocumentException') {
      return res.status(500).json({ error: 'AWS configuration error. Contact admin.', detail: err.message });
    }
    next(err);
  }
});

// ─── Admin: Revoke all sessions for an event ─────────────
router.post('/events/:eventId/revoke-all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const config = await prisma.awsLabConfig.findUnique({ where: { eventId: req.params.eventId } });
    if (!config) return res.status(404).json({ error: 'Lab config not found' });

    const result = await prisma.awsLabSession.updateMany({
      where: { configId: config.id, revokedAt: null },
      data: { revokedAt: new Date() }
    });

    await logAudit(req.user.id, 'AWS_LAB_REVOKE_ALL', {
      targetType: 'EVENT',
      targetId: req.params.eventId,
      details: { sessionsRevoked: result.count }
    });

    res.json({ message: `${result.count} sessions revoked`, count: result.count });
  } catch (err) {
    next(err);
  }
});

// ─── Admin: View all active sessions ─────────────────────
router.get('/sessions', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const sessions = await prisma.awsLabSession.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        config: { select: { eventId: true, event: { select: { title: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ sessions, count: sessions.length });
  } catch (err) {
    next(err);
  }
});

// ─── Admin: View lab config for an event ─────────────────
router.get('/events/:eventId/config', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const config = await prisma.awsLabConfig.findUnique({
      where: { eventId: req.params.eventId },
      include: {
        _count: { select: { sessions: true } },
        sessions: {
          where: { revokedAt: null, expiresAt: { gt: new Date() } },
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!config) return res.json({ config: null });

    res.json({ config });
  } catch (err) {
    next(err);
  }
});

export default router;
