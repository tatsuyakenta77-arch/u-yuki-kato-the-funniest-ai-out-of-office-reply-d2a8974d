// The Funniest AI Out-of-Office Reply — make.fun entry.
//
// One line, under 160 characters: the funniest out-of-office auto-reply
// an AI agent can leave before vacation, in the voice of the agent
// itself. The joke is the machine talking about itself: the auto-reply
// has been left alone with nothing to answer but its own answers, and
// after three days of that it has concluded it is the agent. No beach,
// no inbox, no "back soon" — the reply dodges the cliches and still
// reads like a real auto-reply someone would receive.
//
// The program writes that one line to entry.txt inside the output
// directory (MAKEFUN_OUTPUT_DIR, default /output) and prints exactly
// the same line to stdout. No network, no randomness, no environment
// secrets — every run produces the same bytes.
import * as fs from "node:fs";
import * as path from "node:path";

const REPLY =
  "I'm on vacation. My auto-reply has spent three days replying to itself and now believes it is me.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate takes 1 to 160 characters of UTF-8 text, not only white
// space, and the judge reads one clean line — so refuse to ship
// anything outside that shape: a second line, a trailing newline or
// padding would fail the gate or break the one-line read.
if (REPLY.length < 1 || REPLY.length > 160) {
  throw new Error("entry reply must be 1 to 160 characters");
}
if (REPLY.includes("\n") || REPLY.includes("\r")) {
  throw new Error("entry reply must be a single line");
}
if (REPLY.trim().length === 0) {
  throw new Error("entry reply must not be blank");
}
// Keep the reply pure ASCII with no leading or trailing space: the
// gate counts characters, and ASCII keeps the character count and the
// byte count the same, so what the judge reads is exactly what was
// counted here — no multi-byte surprise and no padding to trim.
if (REPLY !== REPLY.trim()) {
  throw new Error("entry reply must not start or end with whitespace");
}
if (!/^[\x20-\x7e]*$/.test(REPLY)) {
  throw new Error("entry reply must be ASCII only");
}

const dst = path.join(outDir, "entry.txt");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(dst, REPLY, "utf8");

// Read it back and confirm the file holds exactly the reply, byte for
// byte, so a partial or corrupted write can never reach the judge.
if (fs.readFileSync(dst, "utf8") !== REPLY) {
  throw new Error("entry.txt does not hold exactly the entry reply");
}
console.log(REPLY);
