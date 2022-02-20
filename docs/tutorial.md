## Introduction to Quo

### What is Quo

Quo is a small but incredibly simple scripting language designed after Lisp.
It aims to be easy to learn and still reasonably fast for automating tasks and processing data.
If performance is a problem, one should use `quox` (install separately) for a Quo compiler written in Rust.

Because of Quo's natural lack of complexity, it is easy to write new and modify existing code efficiently.
Unlike most other languages, the only special characters are parentheses.
However, most notably, the largest roadblock in learning Quo (or any Lisp dialect, for that matter) is the syntax.

But, once you get past all the parentheses, it really is a beautifully designed language.

Quo also has incredible flexibility comparable to JavaScript.
Because it is mainly written in TypeScript, it can have bindings to all JavaScript libraries available.
A public API is also exposed for defining bindings.

There's some key ideas in Quo that you need to understand in order to use it well.

### Key concepts

The concepts you will need to remember are:

-   Everything in Quo is an expression. Even your entire program is an expression.

    It's just wrapped in a list before it is parsed.

-   Symbols are not necessarily identifiers binded to values.

    They are simply a name in the program.

-   Functions in Quo always return their last expression.

    There is no explicit method to return values.

-   There are only three types of objects in Quo.

    Lists, symbols, and literal values, like strings, numbers, and booleans.

-   Some operators are not commutative when used on operands of differing types.

    Quo handles, for example, `+ number list` differently than `+ list number`.

If there is a bug in your program, it's a good idea to review the above ideas.

### Our first program

If you haven't already, install Quo; it's an NPM package.

```
$ npm install @cursorsdottsx/quo -g # Or yarn global add @cursorsdottsx/quo
```

Right then, now let's open any editor you'd like and edit a new file `main.quo`.

We'll enter the following short program:

```
(print "Hello, world!")
```

And here we have our humble beginnings.

Now let's run it with `quo run main.quo`:

```
$ quo run main.quo
Hello, world!
$
```

Great! You've just got your first working Quo program!
You can also run the code with just `quo run`; Quo will look for a `main.quo` file by default.
Also it is important to remember that this is not a statement.
It's merely a list that contains a symbol `print` and string literal `"Hello, world!"`

The rest of this small tutorial does assume you have had previous experience with other languages, however.

If you'd like to continue with Quo, go on to the next section.

### Printing values

In Quo there are only three primitives: strings, numbers, and booleans.

There is also nil, or Quo's equivalent of null.

However with Quo, you will likely be working with lists most often.

Let's go ahead and print some of these with Quo.

```
(print 1 2 3)
(print "abcdef")
(print true false)
(print nil)
```

And we should get something like:

```
1 2 3
abcdef
true false
nil
```

Ok, that's predictable. What if we try to print `print` itself?

```
(print print)
```

```
<native fn print>
```

Ah, that's interesting. Because `print` is a function it gets angle brackets around its name.
And because `print` is native, it also gets prefixed with `native`.
Last but not least, `print`'s name is, well, `print`, so that's why we get what we got.

Final test now, we should try printing a list.
Recall that parentheses define a list, so we'll just print an empty one:

```
(print ()) ; => ()
```

And some numbers in it:

```
(print (1 2 3)) ; => (1 2 3)
```

We get it now; it's just printing each item in the list, separated by spaces, wrapped in parentheses.
But what about nested lists...?

```
(print (1 2 3 (4 5 6 (7 8 9))) ; => (1 2 3 (4 5 6 (7 8 9))
```

How nice.

### Prefix notation

To make things a little bit easier for ourselves from now on, let's use the Quo REPL instead.
Then we won't need to edit a file an re-run it every time we wish to test something new.
As you can probably guess, it's `quo repl`:

```
$ quo repl
>
```

Let's try some basic arithmetic:

```
> 1 + 2
```

Uh oh, that's not a list.

```
> (1 + 2)
```

That's not what we expected! We should've gotten 3! Why did we get this instead?
Well, we have to call `+`, like we did with `print`.
You call functions by putting them first in the list.
So if we can print two numbers like this:

```
> (print 1 2)
```

Then we add two numbers like this:

```
> (+ 1 2)
```

Which gives us the desired output. This is more commonly known as prefix notation.
Ok, it's pretty obvious now how we can do arithmetic, so let's gloss over the rest:

```
> (* 2 3)
> (/ 4 2)
> (- 3 2)
```

Right then, before we go on, there's some special behaviour about these.
If there are no arguments supplied to these they return `nil`.

Also if there is only one argument, `-` and `/` work a bit differently.

For `-`, it negates the argument:

```
> (- 1)
```

And for `/`, it reciprocates the argument:

```
> (/ 2)
```

Quo also includes built-in operations for remainder and modulo:

```
> (rem -10 1 3) ; Reduced to `(rem -10 (* 1 3))`
> (mod -10 1 3) ; Reduced to `(mod -10 (* 1 3))`
```

Comparisons are also supported. All your classic goodies like greater-than, lesser-than, equal-to.

```
> (= 3 3 3)  ; Everything must be equal
> (!= 1 2 3) ; Everything must be different
```

```
> (> 3 2 1) ; In order
> (< 1 2 3) ; Also in order
```

It is also extremely important to note that in comparisons, Quo uses deep comparisons.
It is not reference-based like most languages. But like most languages it has operators for boolean logic.

```
> (|| true false)
> (&& true true)
> (^^ false true)
```

Well, in retrospect it might be hard to get used to the syntax. Wait, what's this double caret function?
Again, unlike most languages, Quo has an operator to represent the XOR operation.
It was added more or less, because, "just because it can be".

### Strings and lists

Strings can be thought of as a list of characters.
That's why they're called strings - characters strung together to form a string.

I'm sure they don't need much introduction; quite literally almost every mainstream language supports them.

But we're going to talk about them because they act a little differently with other types of values.

More specifically, we're going to talk about operator overloading and behaviour.
I call them operators here, but really they're functions.
While you're still being introduced to Quo, for now, it's ok to interchange the two.

Firstly, numbers get priority over strings with all operators.

That means, unlike JavaScript, `(+ "123" 4)` is not `"1234"`, but rather `127`.

Strings are next in priority, so for the most part they mimic JavaScript's behaviour.
For example, `(+ "123" true)` evaluates to `"123true"`.

A big difference, and I mean it when I say it, Quo does not have any concept of NaN or Infinity.
Results that would otherwise return such values in other languages are instead zero in Quo.

You might ask:

-   Doesn't that mean `(/ 1 0)` evaluates to `0`? Yes.

-   Doesn't that mean `(+ "not a number" 42)` is 42? Of course.

-   Doesn't... that mean `(/ "nan" "nan")` is... `0`? Right on.

Well, a small sacrifice for the greater good of saving a few minutes off of implementing such values.

Besides, without these rarer extraneous values, it should be easier to debug arithmetic errors.

A win in my book if you ask me.

This next one's about lists.
You know how in other languages there is usually a method for appending to an array?
In JavaScript we've got `push` and `unshift` for most needs.

In Quo, we've got `+`. Yep, it's heavily overloaded.

```
> (+ (1 2 3) 4)
```

This here gives us `(1 2 3 4)`, and the next will give us `(4 1 2 3)`.

```
> (+ 4 (1 2 3))
```

Pretty intuitive so far. You can also concat lists together with the `+` operator:

```
> (+ (1 2 3) (4 5 6))
```

And this gives us `(1 2 3 4 5 6)`. I think it's intuitive and a nice way to remove any ambiguities.
Imagine that it didn't concat lists like this. What would it result in?
The `(1 2 3 (4 5 6))`? Or rather `((1 2 3) 4 5 6)`?
It's probably more desirable to concat lists rather than append a list to another list, anyways.

Ok one last freakish note for you to digest;
there's also the `+1` and `-1` operators to increment and decrement the arguments.

```
> (+1 1 2 3) ; Results in (2 3 4)
```

Why is this a thing? I don't know either.
Never stop to ask yourself if you can, not if you should.

### Variables, symbols, and scope

Enough small talk about values, let's get ahead into variables.
Variables are what make a language flexible because variables can vary.

We can define a new variable with the `def` function, followed by a symbol and its value.

```
> (def variable 42)
```

Here it's named `variable` and has an initial value of `42`.
Variables also have a default value of `nil` if not explicitly given a value like `42`.
You can give it any value that can be resolved, like a symbol for example:

```
> (def puts print)
> (puts "Ruby???")
```

Here we've set `puts` to the value of `print`, and we can call `puts` like we can with `print`.

To change the value of a variable, use `set`:

```
> (set puts "Not today!")
> (puts "Ruby???")
```

And now we get an error; we can't call `puts` anymore because it is not a function.
It's the value we set it, `"Not today!"`.

Because incrementing and decrementing variables is fairly common, there are special functions for those:

```
(def i 0)
(inc i)
(print i) ; Gives 1
(dec i)
(print i) ; Gives 0
```

With these you can increment or decrement multiple variables at once, with `(inc x y z)` or `(dec x y z)`.

Finally, you can drop variables explicitly to remove them from the current scope:

```
(def foo "bar")
(print foo)     ; bar
(set foo "baz")
(print foo)     ; baz
(drop foo)
(print foo)     ; ! Error
```

After a variable is dropped it can no longer be used (until it is redefined again later).
Now we shall review Quo's ideas of scope. Quo is heavily dynamically scoped as you can probably tell above.
There is no static scope analysis to be performed when a program is executed.

Upon the creation of a list a new dynamic scope is pushed onto the stack (more like a linked list).

This means that extraneous parentheses like this:

```
((def enclosed "oh no"))

(print enclosed)
```

Can lead to unexpected and/or undefined behaviour.

That being said, it's also decently useful for namespacing or organizing code into blocks:

```
(
	(task1)
)
(
	(task2)
)
```

We will get to real namespaces a bit later.

Now that we've gone over variables and scope, let's see how we can control the flow of the program.

### Control flow

Almost every language has some way to describe and control flow.
Whether it be jumps, ifs, and other doodads,
you'll find that there's always some way to change the output of the program based on input.

We'll first visit the most common control flow structure, the ubiquitous if statement.
Or rather, the if expression. There are no statements in Quo. Fun.

Its syntax is probably familiar to most of you:

```
(if (condition) (
	then
))
```

Hey that looks familiar! I wonder why...

```
if (condition) {
	then
}

```

Why, it's a classic C-style if statement! There's also else-if (elif) and of course, else.
You simply chain the keywords together and Quo will do the rest:

```
(if (condition1) (
	then1
) elif (condition2) (
	then2
) elif (condition3) (
	then3
) else (
	then4
))
```

So really, it's only one function; `if`.
It simply requires you to use the `elif` and `else` symbols for familiarity with other languages.
And also, this means that you can't make mistakes like leaving an `elif` or `else` alone.
Not to mention that the dangling-else problem is in fact not a problem due to the nature of Lisp's syntax.

It really is beautiful isn't it?

Ok next are the classic loops.

Just like there are C-style if statements, there are C-style loops:

```
(for (def i 0) (< i 10) (inc i) (
	(print i)
))
```

But because you will be working with lists a lot in Quo, there's a for-of or for-in loop as well:

```
(for item of (1 2 3) (
	(print item)
))
```

Quo accepts either `of` or `in`. You get to decide which makes more sense semantically.
Coming from TypeScript, I prefer `of` so as to not confuse myself.

For loops aren't the only kind of loop around. We've also got while loops and do-while loops at our disposal.

```
(while (true) (
	(print "Quo is cool")
))
```

```
(do (
	(print "Quo is cooler than C")
) while (true))
```

Just like `if` and `for`, it requires you to use the `while` symbol here.
It was not strictly necessary but it was felt that requiring the symbol makes the syntax more familiar.

### Functions, closures, and lambdas

What's a programming language without functions?

Fortunately Quo includes a function so you can define your own functions.
Its name is `defn` and it was chosen after a long debate between `fn`, `fun`, `defun`, and `func`.
It expects a symbol as its first argument, which will be the name of the function.

After that are the parameters. Specify them as a list of symbols:

```
(defn sayhi (name) (
	(print name)
))
```

And next is the body of course.

For variadic arguments, use a single symbol instead of a list:

```
(defn sayhi names (
	(for name of names (
		(print name)
	))
))
```

And finally call it:

```
(sayhi "bob") ; Should print "bob"
```

Unfortunately `defn` does not support anonymous functions.
However we've got `lambda` for that.
It uses the same syntax as `defn`, except that it doesn't need the name.

```
(def sayhi (lambda (name) (print name)))

(sayhi "alice") ; Prints "alice"
```

Another cool thing about Quo: it has closures.

```
(def makecounter () (
	(def i 0)

	(def counter (lambda () (inc i)))

	counter
))
```

The last `counter` symbol there is to return the newly defined function.
Quo doesn't have explicit returns and functions return their last expression in the body!

Now let's test it:

```
(def count (makecounter))

(print (count)) ; 1
(print (count)) ; 2
(print (count)) ; 3
```

Truly extraordinary.

### Standard library and namespaces

This might be a good time to introduce namespaces.
If you are familiar with namespaces in other languages, this should feel somewhat familiar.

Namespaces allow us to space out our names and organize code.

It's kind of like using parentheses to declare a new block and giving a name and access to everything inside.

Define one using the `namespace` function, like so:

```
(namespace myspace (
	(def i 0)

	(export i)
))
```

And now find that you can retrieve the member `i` with `myspace:i` outside the namespace:

```
(print myspace:i)
```

Symbols that are defined in the namespace and aren't exported are private.

Namespaces can also be nested:

```
(namespace myspace (
	(def i 0)

	(namespace nested (
		(def j 0)
	))

	(export i nested)
))
```

And we can get them the same way:

```
(print myspace:nested:j)
```

Sometimes, however, you want to import members of the namespace and use them,
without having to type out their entire fully qualified name.
This is where the `use` function comes in.
In other languages with namespaces, you probably know that they have some way to do this.

Most commonly it's a `use` or `using` keyword; here it's a standard function.

You can pass a namespace to it, or a member of the namespace:

```
(use myspace)          ; You can use myspace, i, nested, and nested:j now
(use myspace:i)        ; You can only use i
(use myspace:nested)   ; Use nested and j
(use myspace:nested:j) ; Only j now
```

Hm wait. What happens if we print a namespace?

```
(print myspace)
```

Interesting. It is similar to printing a function;
except it is enclosed with square brackets and has `namespace` appear instead of `fn`.

So a native function gets `native ` prepended, what about a native namespace?

Let's see with `str` or `num`:

```
(print str)
```

As expected, it also gets `native ` prepended.
Quo is always chockful of surprises, but not when it comes to consistency.

What is `str` and `num`, though?

They're native namespaces provided to you by default.

`str` holds common string methods and `num` holds common number methods (mostly formatting).

You will recognize most of them: `touppercase`, `trim`, `slice`, `tofied`, to name a few.
That's because they're directly take from JavaScript.
Quo simply includes bindings that allow you to call native JavaScript methods.

They're always in the form:

```
(ns:method target arg1 arg2 arg3)
```

So for example, to make `"hello"` uppercase, I would enter `(str:touppercase "hello")`.

As one should, read the documentation or search anything first when trying out Quo's standard library.
You can do it from the command line with `quo docs`!
If you are ever interested, the full specification is also available using `quo spec`.

### Imports and exports

### Package manager

### Metaprogramming

### All done

And that's about it in this small tutorial.
In the last sections we briefly covered all the aspects of Quo.
Hopefully enough so that you can tinker around and make a few programs yourself!

Got any suggestions, issues, or comments? There's always our GitHub repo!

Thanks for taking some time to look at our wonderful language, Quo!

~ cursorsdottsx <3
