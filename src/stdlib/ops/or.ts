import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("||", function (...args) {
        return args.map(this.evaluate.bind(this)).some((e) => this.istruthy(e));
    });
