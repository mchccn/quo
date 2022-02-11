![Quo](./quo.png)

<div align="center">
        <h2>@cursorsdottsx/quo</h2>
        <p>An interpreted Lisp-like scripting language for data processing.</p>
        <img src="https://forthebadge.com/images/badges/built-with-love.svg" />
        <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" />
        <img src="https://forthebadge.com/images/badges/powered-by-black-magic.svg" />
        <img src="https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg" />
        <img src="https://forthebadge.com/images/badges/fixed-bugs.svg" />
</div>

> Modernized Lisp for automating tasks and data processing.

### About

Lisp was always one of the more beautiful and simple languages at the core.
It had few concepts that built upon each other to give way to a powerful language for data processing.
In fact, Lisp is named after **LIS**t **P**rocessing (and not because you'll get a lisp if you try to read it).

But it's old. Really old. There are many more alternatives to Lisp that are just way easier to use.
Screw that. Let's remake Lisp to be more with the times.

**Quo** is a small dialect of Lisp with a few different rules.
Its primary purpose is to provide an easy interface to script task automation and data processing, just like Lisp was doing.
However, arguably, Quo is a bit more modern, in the sense of behaviour and features.
Hopefully, Quo will provide _you_ some good times, with good old Lisp syntax.

### Usage

Say you think Qip sounds pretty cool, but you don't know how to get started?
Well my friend, it's the same as any other language: install, learn, use.

**Installation**

```bash
$ npm install @cursorsdottsx/quo -g
```

```bash
$ yarn global add @cursorsdottsx/quo
```

**Learn**

Luckily, Quo is very easy to pick up and learn, just like Lisp.
If you aren't familiar with Lisp syntax, refer to the [documentation](https://cursorsdottsx.github.io/quo). There are also some examples in the [`spec/`](./spec/README.md) folder as well, if you want to learn by example.

**Use**

Quo comes with a CLI, but you can of course also use it programmatically.

CLI documentation is available [here](https://cursorsdottsx.github.io/quo/cli), or you can run this to figure it out for yourself.

```
$ quo -h
```

The programmatic way is to import the library like so:

```ts
import Quo from "@cursorsdottsx/quo";

const interpreter = new Quo.Interpreter();

interpreter.interpret(`
    (print "hello world")
`);
```

For the full public API, please see [this](https://cursorsdottsx.github.io/quo/api) page.

### Help

Something not working correctly? Interpreter bugs, strange errors, and expectations not being met?
Either open an [issue](https://github.com/cursorsdottsx/quo/issues/new) or better yet, a [pull request](https://github.com/cursorsdottsx/quo/pulls/new) to fix it!
_Still_ having trouble? Contact me on Discord and we'll have a chat!

### Contributing

Seems like you enjoyed using Quo and have ideas to improve it? You're in the right place.

Unlike most other open source projects, I'm a pretty lax cursor when it comes to pull requests and guidelines. All you have to do is open a pull request, have decently descriptive commit messages, and describe the pull request!

Please note that it might take a long time for me to respond since I'm busy most of the time. Thank you!
