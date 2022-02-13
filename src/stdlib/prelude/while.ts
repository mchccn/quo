import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("while", function (...args) {
        const [condition, body, ...rest] = args;

        const v = [];

        while (this.istruthy(this.evaluate(condition))) {
            v.push(this.evaluate(body));
        }

        try {
            return v.pop();
        } finally {
            rest.map(this.evaluate.bind(this));
        }
    });
