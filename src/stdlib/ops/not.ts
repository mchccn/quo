import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("!", function (...args) {
        try {
            return !this.istruthy(this.evaluate(args[0]));
        } finally {
            args.slice(1).map(this.evaluate.bind(this));
        }
    });
