export class LogEntry {
  #logId;
  #payload;
  #timestamp;

  constructor(json) {
    const { logId, payload } = json;
    this.#logId = logId;
    this.#payload = payload;
    this.#timestamp = this.#payload.timestamp ?? new Date().toISOString();
  }

  get payload() {
    return this.#payload;
  }

  get id() {
    return this.#logId;
  }

  get timestamp() {
    return this.#timestamp;
  }

  get message() {
    if (this.#payload.message) {
      return this.#payload.message;
    }
    return JSON.stringify(this.#payload);
  }
}
