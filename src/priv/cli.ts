if (process.env.QUO_EXEC_CLI !== "true") throw new Error(`Attempted to use CLI module programatically.`);

// actual cli thing
console.log("hello world");

const [, , command, ...args] = process.argv;

if (!command) {
}
