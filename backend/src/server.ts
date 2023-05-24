import { serveDir } from "https://deno.land/std@0.186.0/http/file_server.ts";
import { LogFilters } from "./LogFilters.ts";
import { LogStore } from "./LogStore.ts";

const LOG_STORE = new LogStore();

function payloadEvent(name: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(
    `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`
  );
}

export async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await handleReq(requestEvent);
  }
}

async function handleReq(reqEv: Deno.RequestEvent): Promise<void> {
  const url = new URL(reqEv.request.url);
  if (url.pathname === "/logs") {
    await handleLogRequest(reqEv);
  } else {
    const res = serveDir(reqEv.request, {
      fsRoot: "./frontend/src",
    });
    reqEv.respondWith(res);
  }
}

async function handleLogRequest(reqEv: Deno.RequestEvent): Promise<void> {
  const [logs, release] = LOG_STORE.listen(new LogFilters());
  const body = new ReadableStream({
    async start(controller) {
      for await (const log of logs) {
        const payload = payloadEvent("logs", [log]);
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
    if (e.message.includes("connection closed before message completed")) {
      return;
    }
    throw e;
  }
}
