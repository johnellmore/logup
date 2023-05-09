import { LogFilters } from "./LogFilters.ts";
import { generateMockLogEntry } from "./logMock.ts";

export type Log = Record<string, unknown>;
export type LogGenerator = AsyncGenerator<Log>;
export type Listener = [LogGenerator, () => void];

export class LogStore {
  constructor() {}

  listen(_: LogFilters): Listener {
    let cancelFlag = false;
    const release = () => {
      cancelFlag = true;
    };
    async function* gen() {
      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
      while (!cancelFlag) {
        yield generateMockLogEntry();
        await sleep(1000);
      }
    }
    return [gen(), release];
  }
}
