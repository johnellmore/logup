export type LogPayload = Record<string, unknown>;

export type LogEnvelope = {
  logId: string;
  payload: LogPayload;
};
