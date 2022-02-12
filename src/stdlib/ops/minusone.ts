import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("-1", function (...args) {
        return args
            .map(this.evaluate.bind(this))
            .map(this.numberify.bind(this))
            .map((n) => n - 1);
    });
