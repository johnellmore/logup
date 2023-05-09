import { handleConn } from "./server.ts";

if (import.meta.main) {
  // TODO use env.PORT, fallback to dynamic port
  const port = 8080;

  const server = Deno.listen({ port });
  console.log(`HTTP server running. Access it at: http://localhost:${port}/`);

  // Connections to the server will be yielded up as an async iterable.
  for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection
    // individually without awaiting the function
    handleConn(conn);
  }
}
