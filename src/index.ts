/**
 * T O D O   L I S T
 *
 * ! CHANGE ALL ERRORS TO CUSTOM QUO ERRORS, CHECK THAT CALLSTACK AND CUSTOM ERRORS WORK
 *
 * Basic language features
 * - First-order functions, closures, and lambdas
 * - Control flow
 *
 * Standard library
 * - Extended list operations
 * - String utility
 *
 * UI/UX
 * - Better error handling and messages
 * - CLI for executing scripts
 * - Package manager
 * - Custom script debugger
 * - VSCode language support extension
 *
 * Namespaces
 * - Namespace delimiter
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
 * - Change behaviour of actions
 *
 * Specifications
 *
 * Tutorial
 */

import { execute } from "./interaction/execute";

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

; (defn fib (n) (
;     (if (<= n 2)
;         (1)
;         (+ (fib (- n 1)) (fib (- n 2))))
; ))

; (if (> 3 2)
;     (print "true")
;     (print "false"))

;;;
multi line comments
;;;

; (for (def i 0) (i < 10) (set i (+ i 1)) (
;     
; ))

(def foo "bar")
(print foo)
(set foo "baz")
(print foo)
(drop foo)
(print foo)
`);
