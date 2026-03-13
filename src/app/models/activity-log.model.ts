export interface ActivityLog {
  id: string;
  eventType: string;
  message: string;
  actorName?: string;
  occurredAt: string;
  referenceId?: string;
}
