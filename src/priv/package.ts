import { readFileSync } from "fs";
import { join } from "path";

export const pkg = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), "utf8"));
