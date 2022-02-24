import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("+1", function (...args) {
        if (!args.length) return 1;

        if (args.length === 1) return this.numberify(this.evaluate(args[0])) + 1;

        return args
            .map(this.evaluate.bind(this))
            .map(this.numberify.bind(this))
            .map((n) => n + 1);
    });
