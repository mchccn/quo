import type { defstdfn as _ } from "../../engine/stdlib";

//TODO: ADD ELIF AND ELSE
export const lib = (defstdfn: typeof _) =>
    defstdfn("if", function (...args) {
        const [condition, truthy, falsey, ...rest] = args;

        try {
            if (this.istruthy(this.evaluate(condition))) return this.evaluate(truthy);

            return this.evaluate(falsey);
        } finally {
            rest.map(this.evaluate.bind(this));
        }
    });
