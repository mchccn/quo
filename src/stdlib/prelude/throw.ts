import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("throw", function (...args) {
        const [err] = args.map(this.evaluate.bind(this));

        throw err;
    });
