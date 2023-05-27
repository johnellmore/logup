export class DetailPane extends EventTarget {
  #contEl;
  #paneEl;
  #logContentsEl;

  constructor({ detailPaneEl }) {
    super();
    this.#contEl = detailPaneEl;
    this.#initDom();
  }

  #initDom() {
    const overlay = document.createElement("div");
    overlay.id = "detail-overlay";
    this.#contEl.appendChild(overlay);

    this.#paneEl = document.createElement("div");
    this.#paneEl.id = "detail-pane";
    this.#contEl.appendChild(this.#paneEl);

    const closeBtn = document.createElement("button");
    closeBtn.id = "detail-close";
    closeBtn.textContent = "x";
    closeBtn.addEventListener("click", () => {
      this.#contEl.classList.remove("visible");
    });
    this.#paneEl.appendChild(closeBtn);

    this.#logContentsEl = document.createElement("div");
    this.#logContentsEl.id = "detail-log-contents";
    this.#paneEl.appendChild(this.#logContentsEl);
  }

  show(logEntry) {
    this.#contEl.classList.add("visible");
    this.#logContentsEl.textContent = JSON.stringify(logEntry.payload, null, 2);
  }
}
