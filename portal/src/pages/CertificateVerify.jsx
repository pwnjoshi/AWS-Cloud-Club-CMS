import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, Check, X, Shield } from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

export default function CertificateVerify() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/certificates/verify/${code}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ valid: false, error: 'Network error' }))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Shield className="w-10 h-10 text-[#FF9900] mx-auto mb-2" />
          <h1 className="text-xl font-bold">Certificate Verification</h1>
          <p className="text-xs text-gray-400 mt-1">AWS Student Builder Group GEU</p>
        </div>

        <div className="bg-[#0a0e17] border border-white/10 rounded-2xl p-6">
          {data?.valid ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <Check className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Valid Certificate</span>
              </div>

              <div className="text-center py-4">
                <Award className="w-12 h-12 text-[#FF9900] mx-auto mb-3" />
                <h2 className="text-lg font-bold">{data.certificate.title}</h2>
                {data.certificate.description && <p className="text-sm text-gray-400 mt-1">{data.certificate.description}</p>}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Recipient</span>
                  <span className="font-semibold">{data.certificate.recipientName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Type</span>
                  <span className="font-semibold">{data.certificate.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Issued</span>
                  <span className="font-semibold">{new Date(data.certificate.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Verify Code</span>
                  <code className="text-xs font-mono text-[#FF9900]">{data.certificate.verifyCode}</code>
                </div>
              </div>

              {data.certificate.qrCode && (
                <div className="flex justify-center pt-2">
                  <img src={data.certificate.qrCode} alt="Verification QR" className="w-32 h-32 rounded-lg" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                <X className="w-5 h-5" />
                <span className="text-sm font-semibold">Invalid Certificate</span>
              </div>
              <p className="text-sm text-gray-400">{data?.error || 'This certificate could not be verified.'}</p>
              <p className="text-xs text-gray-600 mt-2">Code: {code}</p>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-4">
          Verify at: {window.location.origin}/verify/{code}
        </p>
      </div>
    </div>
  );
}
