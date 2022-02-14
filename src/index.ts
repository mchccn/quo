/**
 * T O D O   L I S T
 *
 * ! WRITE TESTS FOR STDLIB
 *
 * ? Make CLI
 *
 * Standard library
 * - Extended list operations
 * - String utility
 *
 * UI/UX
 * - CLI for executing scripts
 * - Package manager
 * - VSCode language support extension
 *
 * Namespaces
 * - Define namespaces
 * - Use namespaces
 * - Fully qualified name
 *
 * Modules
 * - Import modules as whole or a few symbols
 * - Export symbols
 *
 * Bindings
 * - File system
 * - Operating system
 * - Networking
 * - JavaScript libraries
 *
 * Metaprogramming
 * - Create native-like functions
 * - Special permissions to expression representation
 * - Direct bindings to evaluation and symbol names
 *
 * Specifications
 *
 * Tutorial
 */

import { execute } from "./interaction/execute";

// console.log(
//     bindings(
//         stdlib,
//         defstdfn,
//         nativebind(
//             String,
//             [
//                 "charAt",
//                 "charCodeAt",
//                 "codePointAt",
//                 "concat",
//                 "endsWith",
//                 "includes",
//                 "indexOf",
//                 "lastIndexOf",
//                 "padEnd",
//                 "padStart",
//                 "slice",
//                 "split",
//                 "startsWith",
//                 "substring",
//                 "toLowerCase",
//                 "toUpperCase",
//                 "trim",
//                 "trimEnd",
//                 "trimLeft",
//                 "trimRight",
//                 "trimStart",
//             ],
//             function (target: unknown, expr: Expr) {
//                 if (typeof target !== "string") throw new QuoTypeError(this, expr.token, `Target must be a string.`);
//             }
//         ),
//         "str"
//     )
// );

execute(`\
; Metaprogramming example
;
; (s hello world) ; => "hello world"
;
; (mdefn s args (
;     (def mapped (std:list:map args (lambda (e) (
;         (if (missymbol e)
;            (msymbolname e)
;            (meval e))
;     ))))
;     (std:list:join mapped " ")
; ))

(namespace myspace (
    (def i 0)

    (namespace nested (
        (def j 1)
    ))
))

(print myspace)
(print myspace:i)
(print myspace:nested)
(print myspace:nested:j)

; (defn closure (x) (
;     (lambda () (print x))
; ))
; 
; (def call (closure 1))
; 
; (print call)
; 
; (print (call))

; (print (lambda (x) (* x x)))
; 
; (def sq (lambda (x) (* x x)))
; 
; (print sq)
; 
; (print (sq 2))

; (defn fib (n) (
;     (if (<= n 2)
;         (1)
;         (+ (fib (- n 1)) (fib (- n 2))))
; ))
; 
; (defn factorial (n) (
;     (if (<= n 1)
;         (1)
;         (* n (factorial (- n 1))))
; ))
; 
; (for (def i 1) (<= i 10) (inc i) (
;     (print (fib i))

; ))

; (defn echo args (
;     (print args)
; ))
; 
; (echo 1 2 3)

; (if (> 2 3)
;     (print "if")
; elif (> 2 3)
;     (print "elif1")
; elif (< 3 2)
;     (print "elif2")
; else
;     (print "else"))

;;;
multi line comments
;;;

; (for (def i 0) (< i 10) (inc i) (
;     (print i)
; ))

; (for e of (1 2 3) (
;     (print "e is:" e)
; ))

; (def i 0)
; (do (
;     (print i)
;     (inc i)
; ) while (< i 10))

; (def foo "bar")
; (print foo)
; (set foo "baz")
; (print foo)
; (drop foo)
; (print foo)
`);
