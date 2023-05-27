export class LogTable extends EventTarget {
  #tableEl;
  #maxSize;
  #tbody;
  #headerRow;
  #columns = new Map();
  #logs = [];

  constructor({ tableEl, maxSize }) {
    super();
    this.#tableEl = tableEl;
    this.#maxSize = maxSize;
    this.#initDom();
  }

  #initDom() {
    const thead = document.createElement("thead");
    thead.id = "log-headings";
    this.#tableEl.appendChild(thead);

    this.#headerRow = document.createElement("tr");
    thead.appendChild(this.#headerRow);

    this.#tbody = document.createElement("tbody");
    this.#tbody.id = "log-entries";
    this.#tableEl.appendChild(this.#tbody);
  }

  push(logEntries) {
    const rows = logEntries.map((logEntry) => this.#rowForLog(logEntry));
    rows.forEach(row => {
      this.#tbody.prepend(row);
      if (this.#tbody.children.length > this.#maxSize) {
        this.#tbody.removeChild(this.#tbody.lastChild);
      }
    });
  }

  setColumns(colPaths) {
    this.#columns.clear();
    for (const colPath of colPaths) {
      const th = document.createElement("th");
      th.setAttribute("data-colpath", colPath);
      let label;
      if (colPath === "timestamp") {
        label = "timestamp (UTC)";
      } else {
        label = colPath;
      }
      th.textContent = label;
      this.#columns.set(colPath, th);
    }
    this.#headerRow.replaceChildren(...this.#columns.values());
  }

  #rowForLog(logEntry) {
    const row = document.createElement("tr");

    // hack: attach the log entry to the DOM object, so we can reuse it in case
    // we need to show its details or adjust its columns
    row._logEntry = logEntry;

    for (const colPath of this.#columns.keys()) {
      let value;
      if (colPath === "timestamp") {
        value = formatTimestamp(logEntry.timestamp);
      } else if (colPath === "message") {
        value = logEntry.message;
      } else {
        // TODO handle nested paths
        value = logEntry.payload[colPath];
      }
      const cell = document.createElement("td");
      row.appendChild(cell);
      cell.textContent = value;
    }

    row.addEventListener("click", (ev) => {
      console.log(logEntry);
      const event = new CustomEvent("rowclick", {
        detail: logEntry,
      });
      this.dispatchEvent(event);
    });
    return row;
  }
}

function formatTimestamp(ts) {
  return ts.toISOString().replace("T", " ").replace("Z", "");
}
