---
trigger: always_on
---

# Agent Rule – Type Safety

* Do not use the `any` keyword anywhere in the codebase
* Avoid bypassing type checks under any condition
* All types must be explicitly defined or safely inferred
* Use proper alternatives such as:

  * unknown
  * specific interfaces
  * union types
  * generics
* Code using the `any` keyword must be rejected during review
