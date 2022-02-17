import { Environment } from "../../engine/main/Environment";
import { ListExpr, SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../priv/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("namespace", function (...args) {
        const [name, body, ...rest] = args;

        if (!(name instanceof SymbolExpr)) throw new QuoSyntaxError(this.source, name.token, `Expected namespace name.`);

        if (!(body instanceof ListExpr)) throw new QuoSyntaxError(this.source, name.token, `Expected namespace body.`);

        this.nsactive = true;

        this.nsdepth++;

        const previous = this.environment;

        this.environment = new Environment(this, this.environment);

        const captured = [] as [string, unknown][];

        try {
            this.evaluate(body);

            const entries = this.environment.entries();

            for (const [entry, value] of entries) captured.push([`${name.token.lexeme}:${entry}`, value]);

            captured.push([name.token.lexeme, Object.assign(new Map(entries), { name: name.token.lexeme })]);

            return null;
        } finally {
            this.environment = previous;

            this.environment.ancestor(1 + this.nsdepth - 1).fillsafe(captured);

            rest.map(this.evaluate.bind(this));

            this.nsdepth--;

            if (!this.nsdepth) this.nsactive = false;
        }
    });
