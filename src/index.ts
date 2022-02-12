/**
 * T O D O   L I S T
 *
 * Basic language features
 * - Fully-featured variables
 * - First-order functions, closures, and lambdas
 * - Control flow
 * - Arithmetic and basic operations
 *
 * Standard library
 * - Extended list operations
 * - String utility
 * - Boolean logic
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

const code = '(print "hello")';

const length = '(print "hello")'.length;

const size = 217 * 1024;

const program = code.repeat(size / length);

execute(program);

// execute(`\
// ; Metaprogramming example
// ;
// ; (s hello world) ; => "hello world"
// ;
// ; (mdefn s args (
// ;     (def mapped (std:list:map args (lambda (e) (
// ;         (if (missymbol e)
// ;            (msymbolname e)
// ;            (meval e))
// ;     ))))
// ;     (std:list:join mapped " ")
// ; ))

// ; (defn fib (n) (
// ;     (if (<= n 2)
// ;         (1)
// ;         (+ (fib (- n 1)) (fib (- n 2))))
// ; ))

// ; (if (= (+ 1 1) 2)
// ;     (print "true")
// ;     (print "false"))

// ; (def foo "bar")
// ; (print foo)
// ; (set foo "baz")
// ; (print foo)
// ; (drop foo)
// ; (print foo)
// `);
