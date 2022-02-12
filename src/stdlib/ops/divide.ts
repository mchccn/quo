import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("/", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) {
            const v = this.numberify(this.evaluate(args[0]));

            return v ? 1 / v : 0;
        }

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        if (rest.some((v) => this.numberify(v) === 0)) return 0;

        return rest.reduce((acc, val) => {
            return this.numberify(acc) / this.numberify(val);
        }, first);
    });
