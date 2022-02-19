import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { execute } from "../pub/execute";
import { repl } from "../pub/repl";
import { helpmap, helpmsg } from "./help";

if (process.env.QUO_EXEC_CLI !== "true") throw new Error(`Attempted to use CLI module programatically.`);

(async () => {
    const [, , command, ...args] = process.argv;

    if (!command) {
        console.log(helpmsg);

        process.exit(0);
    }

    if (command === "run") {
        const [filename = "main.quo"] = args;

        if (!existsSync(join(process.cwd(), filename)) || statSync(join(process.cwd(), filename)).isDirectory()) {
            console.error(`Path '${filename}' does not exist or is a directory.`);

            process.exit(1);
        }

        const contents = readFileSync(join(process.cwd(), filename), "utf8");

        // ! Does not include imports/third-party packages

        execute(filename, contents);

        process.exit(0);
    }

    if (command === "repl") {
        await repl();

        process.exit(0);
    }

    if (command === "help") {
        const [cmd = ""] = args;

        const msg = helpmap.get(cmd.toLowerCase());

        if (!msg) {
            console.log(helpmsg);

            process.exit(0);
        }

        console.log(msg);

        process.exit(0);
    }

    console.warn(`Unknown command '${command}'.`);

    process.exit(0);
})();
