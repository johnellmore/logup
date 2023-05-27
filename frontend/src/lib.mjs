import { DetailPane } from "./DetailPane.mjs";
import { LogStreamer } from "./LogStreamer.mjs";
import { LogTable } from "./LogTable.mjs";

export function initializeInterface({
  tableEl,
  filterInput,
  detailPaneEl,
}) {
  const stream = new LogStreamer();
  const logTable = new LogTable({ tableEl, maxSize: 100 });
  const detailPane = new DetailPane({ detailPaneEl });

  logTable.setColumns(["timestamp", "message"]);
  logTable.addEventListener("rowclick", (ev) => {
    detailPane.show(ev.detail);
  });
  stream.addEventListener('logs', (ev) => {
    logTable.push(ev.detail);
  });
  stream.start();
}
