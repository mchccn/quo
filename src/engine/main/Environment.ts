import { QuoAssertionError, QuoReferenceError, QuoRuntimeError } from "../../priv/error";
import type { Interpreter } from "./Interpreter";
import type { Token } from "./Token";

let envid = 0;

export class Environment {
    public id = `env-${envid++}`;

    private map = new Map<string, unknown>();

    private exports = new Map<string, unknown>();

    public constructor(public readonly interpreter: Interpreter, public readonly parent?: Environment) {}

    public get(key: Token): unknown {
        if (this.map.has(key.lexeme)) return this.map.get(key.lexeme);

        if (this.parent?.has(key)) return this.parent.get(key);

        throw new QuoReferenceError(this.interpreter, key, `Undefined symbol '${key.lexeme}'.`);
    }

    public define(key: string, value: unknown): unknown {
        this.map.set(key, value);

        return value;
    }

    public assign(key: Token, value: unknown): unknown {
        if (this.map.has(key.lexeme)) {
            this.map.set(key.lexeme, value);

            return value;
        }

        if (this.parent?.has(key)) {
            this.parent.assign(key, value);

            return value;
        }

        throw new QuoReferenceError(this.interpreter, key, `Undefined symbol '${key.lexeme}'.`);
    }

    public has(key: Token): boolean {
        return this.map.has(key.lexeme) || this.parent?.has(key) || false;
    }

    public getAt(distance: number, name: string) {
        return this.ancestor(distance).map.get(name);
    }

    public assignAt(distance: number, name: Token, value: unknown) {
        this.ancestor(distance).assign(name, value);
    }

    public drop(key: Token): boolean {
        return this.map.delete(key.lexeme) || this.parent?.drop(key) || false;
    }

    public dropAt(distance: number, key: Token): boolean {
        return this.ancestor(distance).drop(key);
    }

    public ancestor(distance: number) {
        let environment = this as Environment;

        for (let i = 0; i < distance; i++) {
            environment = environment.parent!;
        }

        return environment;
    }

    public clear() {
        this.map = new Map();

        return this;
    }

    public fill(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            this.map.set(key, value);
        }

        return this;
    }

    public fillsafe(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            if (this.map.has(key)) throw new QuoAssertionError(`Symbol '${key}' already defined in this scope.`);

            this.map.set(key, value);
        }
    }

    public entries() {
        return [...this.map.entries()];
    }

    public export(key: Token, value: unknown) {
        if (this.exports.has(key.lexeme))
            throw new QuoRuntimeError(this.interpreter, key, `Symbol '${key.lexeme}' already exported.`);

        this.exports.set(key.lexeme, value);
    }

    public getexports() {
        return [...this.exports.entries()];
    }

    public root() {
        let environment = this as Environment;

        while (environment.parent) {
            environment = environment.parent;
        }

        return environment;
    }
}
