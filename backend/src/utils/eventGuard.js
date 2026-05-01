import prisma from '../lib/prisma.js';

/**
 * Check if an event is currently active (not past).
 * An event is considered "past" if its endDate (or date + 4 hours if no endDate) has passed.
 */
export async function isEventActive(eventId) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return false;

  const now = new Date();
  const endTime = event.endDate || new Date(new Date(event.date).getTime() + 4 * 60 * 60 * 1000); // default: event date + 4 hours
  return now <= endTime;
}
