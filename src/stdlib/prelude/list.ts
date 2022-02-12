import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("list", function (...args) {
        return args.map(this.evaluate.bind(this));
    });
