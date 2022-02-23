import type { Interpreter } from "../engine/main/Interpreter";
import type { Token } from "../engine/main/Token";

function formatstack(this: Error, interpreter: Interpreter, token: Token) {
    const { source, callstack } = interpreter;

    return `\
${token.line === 1 ? "" : `${token.line - 1} | ${source.split("\n")[token.line - 1 - 1]}\n`}${token.line} | ${
        source.split("\n")[token.line - 1]
    }
${" ".repeat(Math.log10(token.line) + 3 + token.col)}${
        token.lexeme.length === 1 ? "^" : "~".repeat(token.lexeme.length)
    }
${this.name}: ${this.message}
${callstack
    .slice(-10)
    .map(
        ({ file, token, target }) =>
            `    at ${interpreter.modname}:${target.name || "anonymous"} (${file} ${token.line}:${token.col})`
    )
    .join("\n")}\
`;
}

export class QuoSyntaxError extends Error {
    public name = "SyntaxError";

    public constructor(source: string, token: Token, message: string) {
        super(message);

        this.stack = `\
${token.line === 1 ? "" : `${token.line - 1} | ${source.split("\n")[token.line - 1 - 1]}\n`}${token.line} | ${
            source.split("\n")[token.line - 1]
        }
${" ".repeat(Math.log10(token.line) + 3 + token.col)}${
            token.lexeme.length === 1 ? "^" : "~".repeat(token.lexeme.length)
        }
${this.name}: ${this.message}
    at line ${token.line}, column ${token.col}\
`;
    }
}

export class QuoRuntimeError extends Error {
    public name = "RuntimeError";

    public constructor(interpreter: Interpreter, token: Token, message: string) {
        super(message);

        this.stack = formatstack.call(this, interpreter, token);
    }
}

export class QuoTypeError extends Error {
    public name = "TypeError";

    public constructor(interpreter: Interpreter, token: Token, message: string) {
        super(message);

        this.stack = formatstack.call(this, interpreter, token);
    }
}

export class QuoReferenceError extends Error {
    public name = "ReferenceError";

    public constructor(interpreter: Interpreter, token: Token, message: string) {
        super(message);

        this.stack = formatstack.call(this, interpreter, token);
    }
}

export class QuoAssertionError extends Error {
    public name = "AssertionError";

    public constructor(message: string) {
        super(message);

        this.stack = "";
    }
}

export class QuoBindingError extends Error {
    public name = "BindingError";

    public constructor(message: string) {
        super(message);

        this.stack = "";
    }
}
