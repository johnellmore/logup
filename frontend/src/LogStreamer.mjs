import { LogEntry } from "./LogEntry.mjs";

export class LogStreamer extends EventTarget {
  #eventSource;
  #lastLogId;

  constructor() {
    super();
  }

  start() {
    // TODO incorporate lastLogId
    this.#eventSource = new EventSource("/logs");
    this.#eventSource.addEventListener("logs", (e) => {
      const logsData = JSON.parse(e.data);
      const logs = logsData.map((logData) => new LogEntry(logData));
      this.#lastLogId = logs.at(-1).id;
      const event = new CustomEvent("logs", {
        detail: logs,
      });
      this.dispatchEvent(event);
    });
  }

  pause() {
    this.#eventSource.close();
    this.#eventSource = null;
  }
}
