import { ulid } from "npm:ulid@2";
import { LogFilters } from "./LogFilters.ts";
import { generateMockLogEntry } from "./logMock.ts";
import { LogEnvelope, LogPayload } from "./types.ts";

export type Log = Record<string, unknown>;
export type LogGenerator = AsyncGenerator<Log>;
export type Listener = [LogGenerator, () => void];

function generateMockLogEnvelope(): LogEnvelope {
  return encloseLogInEnvelope(generateMockLogEntry());
}

function encloseLogInEnvelope(log: LogPayload): LogEnvelope {
  return {
    logId: ulid(),
    payload: log,
  };
}

export class LogStore {
  constructor() {}

  listen(_: LogFilters): Listener {
    let cancelFlag = false;
    const release = () => {
      cancelFlag = true;
    };
    async function* gen() {
      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

      // TEMP generate mock log stream
      for (const entry of Array(10).fill(0).map(generateMockLogEnvelope)) {
        yield entry;
      }
      while (!cancelFlag) {
        yield generateMockLogEnvelope();
        await sleep(1000);
      }
    }
    return [gen(), release];
  }
}
