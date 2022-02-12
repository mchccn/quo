if (process.env.QUO_EXEC_CLI !== "true") throw new Error(`Attempted to use CLI module programatically.`);

// actual cli thing
