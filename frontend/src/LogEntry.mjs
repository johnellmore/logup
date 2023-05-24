export class LogEntry {
  #logId;
  #payload;

  constructor(json) {
    const { logId, payload } = json;
    this.#logId = logId;
    this.#payload = payload;
  }

  get payload() {
    return this.#payload;
  }

  get id() {
    return this.#logId;
  }
}
