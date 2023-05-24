export class LogTable {
  #headerRow;
  #columns = new Map();

  constructor(tableThead, tableTbody) {
    this.thead = tableThead;
    this.tbody = tableTbody;
  }

  init() {
    this.#headerRow = document.createElement("tr");
    this.thead.appendChild(this.#headerRow);
  }

  push(logEntries) {
    const rows = logEntries.map((logEntry) => this.#rowForLog(logEntry));
    this.tbody.prepend(...rows);
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
    return row;
  }
}

function formatTimestamp(ts) {
  return ts.toISOString().replace("T", " ").replace("Z", "");
}
