import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("<", function (...args) {
        const values = args.map(this.evaluate.bind(this));

        return values.slice(1).every((a, i) => this.numberify(a) > this.numberify(values[i]));
    });
