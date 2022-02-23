import fs from "fs";
import { bindfssync } from "./bind";

export const lib = Object.assign(
    new Map([
        //
        ...bindfssync(Object.getOwnPropertyNames(fs).filter((k) => k.endsWith("Sync")) as (keyof typeof fs)[]),
    ]),
    { name: "fs" }
);
