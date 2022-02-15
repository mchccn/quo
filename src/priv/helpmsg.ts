export const helpmsg = `\
λ quo - An interpreted Lisp-like scripting language for data processing

Usage

    $ quo [command] [args]

Commands
    run [script]              Runs a Quo script
    help [command]            In-depth help messages
    tutor                     Short tutorial on Quo
    docs [query]              Bring up stdlib reference
    spec                      Full language specification
    add [package]             Adds a third-party package
    remove [package]          Removes a third-party package
    publish                   Publishes a package
    patch [package] [data]    Patches a package file
    list                      List installed packages
    version                   Print Quo version

More

    Use Quox for a fast Quo compiler in Rust
`;
