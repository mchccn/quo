## The Quo Language Specification

This is the full language specification for Quo. For documentation see kelsny.github.io/quo.

### Notation

The syntax is described using Extended Backus-Naur Form (EBNF):

```ebnf
NIL = "nil"

BOOLEAN = "true" | "false"

literal = NUMBER | STRING | BOOLEAN | NIL

symbol = "+1" | "-1" | ALPHA ALPHANUMERIC*

list = "(" (symbol | literal)* ")"
```

### Lexical Elements

**Comments**

Comments serve as program documentation. There are two forms:

-   Line comments start with the character ';' and stop at the end of a line.

-   Multi-line comments start with the characters ';;;' and stop at the next sequence of ';;;'.

A comment cannot start in a string literal.

**Tokens**

Quo is a simple language. There are only 3 kinds of objects. Lists, symbols, and literals.

However there are a little more token types:

-   BeginList marks the start of a new list

-   EndList marks the end of the list

-   String is a string literal

-   Number is a number literal

-   True is the value true

-   False is the value false

-   Nil is the value nil

-   Symbol holds a symbol name

-   Eof specifies the end of input

**Identifiers**

Identifiers or symbols defined by the user must begin with a letter or underscore.
Any alphanumeric character may follow.

However there are some special cases like `+1` and `-1` that are handled by the scanner.

### Values

**Number literals**

Numbers are simple; they are merely a string of digits. Leading zeroes are allowed and trailing decimal points too.

**String literals**

Strings are also simple; double quotes surround the text. Escapes are not supported as of right now.

**Lists**

Lists begin with '(' and end with ')'. They can hold any length of elements and elements can be of different types.

When the first element in a list is a symbol it will attempt to get and call the symbol from the environment.

### Type coercions\*\*

**Booleans**

-   Function -> true

-   String -> length greater than 0

-   Number -> not equal to 0

-   Boolean -> value

-   List -> length greater than 0

-   Namespace -> member count greater than 0

-   Nil -> false

**Numbers**

-   Function -> 0

-   String -> try parse or 0

-   Number -> value

-   Boolean -> 1 for true else 0

-   List -> list length

-   Namespace -> member count

-   Nil -> 0

**Strings**

-   Function -> if native <native fn functionname> else <fn functionname>

-   String -> value

-   Number -> value as string

-   Boolean -> true if true else false

-   List -> each element to string separated by space wrapped in parentheses

-   Namespace -> if native [native namespace nsname] else [namespace nsname]

-   Nil -> nil
