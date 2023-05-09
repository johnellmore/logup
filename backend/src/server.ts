import { LogFilters } from "./LogFilters.ts";
import { LogStore } from "./logStore.ts";

const LOG_STORE = new LogStore();

function payloadEvent(name: string, data: unknown): string {
  const eventLine = new TextEncoder().encode(`event: ${name}\n`);
  const payload = new TextEncoder().encode(`${JSON.stringify(data)}\n`);
  return `\n${eventLine}${payload}`;
}

export async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    handleReq(requestEvent);
  }
}

function handleReq(reqEv: Deno.RequestEvent): void {
  const [logs, release] = LOG_STORE.listen(new LogFilters());
  const body = new ReadableStream({
    async start(controller) {
      for await (const log of logs) {
        const payload = payloadEvent("log", log);
        controller.enqueue(payload);
      }
    },
    cancel() {
      release();
    },
  });

  reqEv.respondWith(
    new Response(body, {
      status: 200,
    })
  );
}
