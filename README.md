# logup (heavily WIP)

_A no-config, streaming webview for logs_

logup streams your log entries in real-time into a web GUI with live searching and filtering. Logs can be passed into logup via stdin, syslog (and others TBD).

## Usage

You can't yet.

## Development

To run the backend:

```sh
deno run --allow-net --allow-read backend/src/main.ts
```

Then open [http://localhost:8080/](http://localhost:8080/) in your browser.
