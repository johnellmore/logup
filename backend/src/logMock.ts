import { LogPayload } from "./types.ts";

const nouns = ["world", "country", "state", "planet", "galaxy", "universe"];
const browsers = ["firefox", "brave", "chrome", "safari", "konqueror", "lynx"];

function pick<T>(list: T[]): T {
  const i = Math.floor(Math.random() * nouns.length);
  return list[i];
}

function num(max: number) {
  return Math.ceil(Math.random() * max);
}

export function generateMockLogEntry(): LogPayload {
  const entry = {
    timestamp: new Date().toISOString(),
    message: `Hello ${pick(nouns)}`,
    userAgent: `browser/${pick(browsers)} v${num(40)}.${num(99)}`,
    remoteAddr: `${num(255)}.${num(255)}.${num(255)}.${num(255)}`,
  };
  return entry;
}
