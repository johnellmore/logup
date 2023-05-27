import { LogStreamer } from "./LogStreamer.mjs";
import { LogTable } from "./LogTable.mjs";

export function initializeInterface({
  tableEl,
  filterInput,
  detailPane,
}) {
  const stream = new LogStreamer();
  const logTable = new LogTable({ tableEl, maxSize: 100 });

  logTable.setColumns(["timestamp", "message"]);
  stream.addEventListener('logs', (ev) => {
    logTable.push(ev.detail);
  });
  stream.start();
}
