import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoThrownError } from "../../priv/error.js";

export const lib = (defstdfn: typeof _) =>
    defstdfn("throw", function (...args) {
        const [err] = args.map(this.evaluate.bind(this));

        throw new QuoThrownError(this, args[0].token, this.stringify(err));
    });
