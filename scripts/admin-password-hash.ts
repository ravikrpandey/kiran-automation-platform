import { scrypt as scryptCallback, randomBytes } from "node:crypto";

const scrypt = (password: string, salt: Buffer) => new Promise<Buffer>((resolve, reject) => {
  scryptCallback(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key as Buffer));
});

async function hiddenPrompt(label: string): Promise<string> {
  if (!process.stdin.isTTY) throw new Error("Run this script in an interactive terminal.");
  process.stdout.write(label);
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  let value = "";
  try {
    for await (const chunk of stdin) {
      const text = chunk.toString("utf8");
      for (const char of text) {
        if (char === "\u0003") throw new Error("Cancelled");
        if (char === "\r" || char === "\n") {
          process.stdout.write("\n");
          return value;
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    }
  } finally {
    stdin.setRawMode(false);
    stdin.pause();
  }
  return value;
}

try {
  const first = await hiddenPrompt("Admin password (hidden, min 12 chars): ");
  const second = await hiddenPrompt("Confirm password (hidden): ");
  if (first.length < 12 || first.length > 256) throw new Error("Password length must be 12–256 characters.");
  if (first !== second) throw new Error("Passwords do not match.");
  const salt = randomBytes(16);
  const key = await scrypt(first, salt);
  process.stdout.write(`\nADMIN_BOOTSTRAP_PASSWORD_HASH=scrypt$${salt.toString("base64url")}$${key.toString("base64url")}\n`);
} catch {
  process.stderr.write("Password hash generation failed or was cancelled. No password or hash was printed.\n");
  process.exitCode = 1;
}
