export class LogTable {
  constructor(tableThead, tableTbody) {
    this.thead = tableThead;
    this.tbody = tableTbody;
  }

  push(logEntries) {
    const rows = logEntries.map((logEntry) => this.rowForLog(logEntry));
    this.tbody.append(...rows);
  }

  rowForLog(logEntry) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    row.appendChild(cell);
    cell.textContent = JSON.stringify(logEntry.payload);
    return row;
  }
}
