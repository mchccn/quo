import type { Token } from "./Token";

export class Environment {
    private map = new Map<string, unknown>();

    public constructor(public readonly parent?: Environment) {}

    public get(key: Token): unknown {
        return (
            this.map.get(key.lexeme) ??
            this.parent?.get(key) ??
            (() => {
                throw new Error(`Undefined symbol '${key.lexeme}'.`);
            })()
        );
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

        throw new Error(`Undefined symbol '${key.lexeme}'.`);
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

    public fill(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            this.map.set(key, value);
        }

        return this;
    }
}
