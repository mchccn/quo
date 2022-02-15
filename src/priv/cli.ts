import { helpmsg } from "./helpmsg";

if (process.env.QUO_EXEC_CLI !== "true") throw new Error(`Attempted to use CLI module programatically.`);

const [, , command, ...args] = process.argv;

if (!command) {
    console.log(helpmsg);

    process.exit(0);
}
