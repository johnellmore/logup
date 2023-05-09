import { LogFilters } from "./LogFilters.ts";
import { LogStore } from "./logStore.ts";

const LOG_STORE = new LogStore();

function payloadEvent(name: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(
    `\nevent: ${name}\n${JSON.stringify(data)}\n`
  );
}

export async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await handleReq(requestEvent);
  }
}

async function handleReq(reqEv: Deno.RequestEvent): Promise<void> {
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

  try {
    await reqEv.respondWith(
      new Response(body, {
        headers: {
          "content-type": "text/event-stream",
        },
        status: 200,
      })
    );
  } catch (e) {
    // connection was aborted--no way to detect in Deno besides thrown error
    throw e;
  }
}
