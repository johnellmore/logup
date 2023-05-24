import { LogStreamer } from "./LogStreamer.mjs";
import { LogTable } from "./LogTable.mjs";

export function initializeInterface({
  tableThead,
  tableTbody,
  filterInput,
  detailPane,
}) {
  const stream = new LogStreamer();
  const logTable = new LogTable(tableThead, tableTbody);

  stream.addEventListener('logs', (ev) => {
    logTable.push(ev.detail);
  });
  stream.start();
}
