export class LogEntry {
  #logId;
  #payload;
  #timestamp;

  constructor(json) {
    const { logId, payload } = json;
    this.#logId = logId;
    this.#payload = payload;

    if (this.#payload.timestamp) {
      const ms = Date.parse(this.#payload.timestamp);
      if (ms) {
        this.#timestamp = new Date(ms);
      }
    }
    if (!this.#timestamp) {
      this.#timestamp = new Date();
    }
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
