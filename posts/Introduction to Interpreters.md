---
title: "An Introduction to Interpreters: A logic evaluator"
description: "Tutorial on how to write a simple interpreter that evaluates logical expressions"
date: "2025-08-16"
tags: ["tutorial", "interpreter", "parser", "lexer", "evaluator", "python"]
---

## Table of Contents

- [What is a logic evaluator?](#what-is-a-logic-evaluator)
- [Interpreter](#interpreter)
  - [The Lexer](#the-lexer)
    - [1. Concept](#1-concept)
    - [2. Types of Tokens](#2-types-of-tokens)
    - [3. Lexing](#3-lexing)
  - [The Parser](#the-parser)
    - [1. Concept](#1-concept-1)
    - [2. Types of AST Nodes](#2-types-of-ast-nodes)
    - [3. Parsing](#3-parsing)
  - [The Evaluator](#the-evaluator)
    - [1. Concept](#1-concept-2)
    - [2. Evaluating the AST](#2-evaluating-the-ast)
- [Conclusion](#conclusion)
- [Sponsor](#sponsor)

---

Ever since I started my programming journey I have been amazed at how we achieved human-computer
"communication". The ability to write programs instead of crafting different devices hardcoded for a
single purpose was one of the biggest leaps forward technology has ever faced. If you are a curious
person, this of course makes you wonder "But how?". Well, that is an incredibly broad, interesting,
and complicated topic. But what I can and will be teaching you if you keep reading is the basics of
a certain type of programming languages, **Interpreted Languages**.

> For this example/tutorial it is assumed that you have moderate knowledge of at least `Python`,
> which is the language we will be using in order to help most people understand the concepts rather
> than focusing too much on the code, even though it will of course be present throughout all the
> explanations.

## What is a logic evaluator?

It is a fairly simple interpreter since it just takes a mathematical expression that evaluates to
`true` or `false` given the condition it represents, e.g: `!A | B` will only return _true_ if either
the variable **B** or the opposite of **A** is _true_. Even this seemingly simple example involves:

- Two variables: **A** and **B**.
- Two operators: Logical **OR** `|` and logical **NOT** `!`.

We will also add pretty printing in the form of a truth table to better visualize our work. It would
look something like this:

| A | B | !A \| B |
| - | - | :-----: |
| T | T |    T    |
| T | F |    F    |
| F | T |    T    |
| F | F |    T    |

The first two columns represent respectively the values of **A** and **B**, while the third column
shows the resulting value after evaluating the expression for that specific combination of values.

## Interpreter

Most interpreters follow the same _three_ steps or parts, the `lexer/tokeniser`, the `parser`, and
the `evaluator`. For this we will have the following file structure:

```txt
.
├── evaluator.py
├── lexer.py
├── main.py
└── parser.py
```

### The Lexer

> You can see the full code of
> [lexer.py](https://github.com/4ster-light/py-logic/blob/main/lexer.py)

#### 1. Concept

The simplest way to describe this step is that it takes the raw text of the input and breaks it down
into the actual parts of your language. In this case, it would be variables and operators, but in a
general-purpose language, it would also have to extract keywords (several text characters) and
understand them as a single **token**, and other nuances like treating numbers or special symbols
differently, etc etc.

#### 2. Types of Tokens

As we just mentioned, we need to define the Tokens that exist in our language, we will just define
an Enum with each of them (this is considered good practice instead of repeating strings
everywhere):

```python
class TokenType(Enum):
    LParen = "LParen" # (
    RParen = "RParen" # )
    NotOp = "NotOp" # !
    AndOp = "AndOp" # &
    OrOp = "OrOp" # |
    ImpliesOp = "ImpliesOp" # ->
    BiconditionalOp = "BiconditionalOp" # <->
    Variable = "Variable" # A-Z Upper case
    Eof = "Eof" # The endline character (depends on stdin)
```

And we should also define a class for the shape of each Token to help us later. It will hold both
its type and its _"lexeme"_ (its string form):

```python
@dataclass(frozen=True)
class Token:
    type: TokenType
    lexeme: Optional[str] = None
```

#### 3. Lexing

Now the actual tokenizing. The lexer class will hold both the input string (the logical formula) and
the current position as we move forward through the formula after each token (since as you have
noticed there are two operators that respectively span two and three characters, the **Implies** and
the **Biconditional**).

```python
class Lexer:
    def __init__(self, input: str) -> None:
        self._input = input
        self._position = 0

    def _peek(self, offset: int = 0) -> Optional[str]: ...

    def _advance(self, count: int = 1) -> None: ...

    def lex(self) -> list[Token]: ...
```

As you can already notice we only need to make use of three methods. The two private ones, `_peek()`
and `_advance()`, are helpers for operations repeated several times throughout the actual lexing
performed at `lex()`.

1. **Peek**: Checks whether the character at a certain offset from the current position exists, and
   if that is the case it returns it. If not, it just returns None. This is used in longer than one
   character tokens, so if we encounter the first character, we can check whether the following
   match the expected for the expected token, and if they do not it is an invalid character so we
   just raise an error.

   ```python
   def _peek(self, offset: int = 0) -> Optional[str]:
       if self._position + offset < len(self._input):
           return self._input[self._position + offset]
       return None
   ```

2. **Advance**: Simply moves the current position forward by a certain amount.

   ```python
   def _advance(self, count: int = 1) -> None:
       self._position += count
   ```

3. **Lex**: The main method that performs the actual lexing. It will return the list of tokens that
   can be used by the parser.

   ```python
   def lex(self) -> list[Token]:
       tokens: list[Token] = []
       while self._position < len(self._input):
           current_char = self._input[self._position]
           match current_char:
               ...
   ```

   The first thing we do is create an empty list of tokens, and then we loop through the input
   string, extracting each individual token into that list until we reach the end, at which point we
   return the list. Let us break it down a bit:
   - If the character is a **space**, we just advance the position and continue to the next
     character:

     ```python
     case char if char.isspace():
         self._advance()
     ```

   - If the character is any of the following characters: `(`, `)`, `!`, `&`, `|` the same process
     of creating a token of that type and advancing the position is performed. Since they are single
     character tokens there is no need to check for anything else:

     ```python
     case "(":
         tokens.append(Token(TokenType.LParen, "("))
         self._advance()
     # ...
     # Same for the other characters
     # ...
     case "|":
         tokens.append(Token(TokenType.OrOp, "|"))
         self._advance()
     ```

   - Now the four interesting cases left: `->` and `<->`, as well as the **default** and
     **variables**:
     - If the character is `-` it indicates we are about to encounter the **Implies** operator,
       right? So instead of creating that token right away we make use of the `_peek()` method I
       told you would be helpful to see if indeed the next character is a `>`. If so, we create the
       token and advance the position. If not, we just raise a helpful error since we have available
       information like our current position and character:

       ```python
       case "-":
           if self._peek(1) == ">":
              tokens.append(Token(TokenType.ImpliesOp, "->"))
              self._advance(2)
           else:
               raise Exception(
                   f"Lexer error: Unexpected character '{current_char}' at position {self._position}. Expected '->'."
               )
       ```

     - If the character is `<` it indicates we are about to encounter the **Biconditional**, but yet
       again we need to make the due checks similarly to **Implies**:

       ```python
       case "<":
           if self._peek(1) == "-" and self._peek(2) == ">":
               tokens.append(Token(TokenType.BiconditionalOp, "<->"))
               self._advance(3)
           else:
               raise Exception(
                   f"Lexer error: Unexpected character '{current_char}' at position {self._position}. Expected '<->'."
               )
       ```

     - If the character is any of `A-Z` we create a token of type **Variable** and advance the
       position:

       ```python
       case char if "A" <= char <= "Z":
           tokens.append(Token(TokenType.Variable, char))
           self._advance()
       ```

     - Now if any character has not fallen in any of the above cases, it means that it is an invalid
       character, so we again raise an error:

       ```python
       case _:
           raise Exception(
               f"Lexer error: Unexpected character '{current_char}' at position {self._position}."
           )
       ```

   - The only thing left is to append the corresponding **EOF** token at the end of the list and
     return it:

     ```python
     tokens.append(Token(TokenType.Eof))
     return tokens
     ```

That is about it. We have now created the list of tokens that can be used by the parser. It is
important to notice that this way of checking characters may seem straightforward when presented to
you like this, but the importance of the `_peek()` method is rather significant. You can imagine how
in a more complex lexer, maybe for a general-purpose programming language for example, you would
have to check entire lines or in the next line even.

Also notice how storing the position correctly besides helping on the peeking allows us to give a
lot more precise error messages, which again would be a lot more complex for a general-purpose
language. And see how for example when raising an error in the cases of the **Implies** and
**Biconditional** operators we knew the apparently misplaced character was part of these tokens, we
suggest that could be the typo that has been made.

### The Parser

> You can see the full code of
> [parser.py](https://github.com/4ster-light/py-logic/blob/main/parser.py)

#### 1. Concept

This second step will take the list of tokens we just generated and turn it into the corresponding
nodes of the abstract syntax tree (AST), which simply means representing the tokens that form the
parsed expression accordingly nested within each other in a list, this will be more clear as we move
forward. It is the trickiest part. Taking the example we are building, there are different types of
operators which determine things like the order in which they should be evaluated.

#### 2. Types of AST Nodes

Different operators have different levels of _precedence_, meaning they need to be evaluated first,
and since we just have tokenized the raw expression we need to now turn it into the ordered list of
nodes that can be used to evaluate the expression correctly. In our specific example the precedence
would be as follows:

1. Not: `!`
2. And: `&`
3. Or: `|`
4. Implies: `->`
5. Biconditional: `<->`

So in an expression like `!A & B | C -> D <-> E`, the parser must parse `!A` first, then `&`, then
`|`, and so on to build the AST correctly. This leads us to the concept of _associativity_, which
determines how operators of the same precedence (which in this case can only happen if it is the
same operator) are grouped together:

- Left-associative: The operator is evaluated before the operands, grouped from left to right. In
  the implementation this is represented by a while loop.
  - Example: `A & B & C` ->
    `And(left=And(left=Var(name='A'), right=Var(name='B')), right=Var(name='C'))`
- Right-associative: The operator is evaluated after the operands, grouped from right to left. In
  the implementation this is represented by a conditional instead.
  - Example: `A -> B -> C` ->
    `Implies(left=Var(name='A'), right=Implies(left=Var(name='B'), right=Var(name='C')))`

The right-associative operators are **Not** and **Implies**, while the left-associative operators
are **And**, **Or** and **Biconditional**.

Also, since as you must have noticed all operators besides **Not** hold a left and right branch on
the node tree, we should also define a class for the shape of each node (all inheriting from
`Expression` so they can all be treated as such) to help us later. They will hold both branches or
in the case of **Variables** and **Not** simply the name and the inner expression respectively:

```python
class Expression:
    pass

@dataclass(frozen=True)
class Var(Expression):
    name: str

@dataclass(frozen=True)
class Not(Expression):
    expression: Expression

@dataclass(frozen=True)
class And(Expression):
    left: Expression
    right: Expression

@dataclass(frozen=True)
class Or(Expression):
    left: Expression
    right: Expression

@dataclass(frozen=True)
class Implies(Expression):
    left: Expression
    right: Expression

@dataclass(frozen=True)
class Biconditional(Expression):
    left: Expression
    right: Expression
```

#### 3. Parsing

Just as we did with the lexer we are going to take a look at each of the helper methods of the
`Parser` class, though it is a lot more complex due to mutual recursivity between the different
`_parse_*()` methods. Let us take a look at the helpers first:

1. **Consume**: Since now we have individual tokens, we will be moving linearly through the list.
   This method will consume the next token and return it, raising an error if it is not of the
   expected type:

   ```python
   def _consume(self, expected_type: TokenType) -> None:
       if self._peek().type == expected_type:
           self._position += 1
       else:
           raise Exception(
               f"Parser error: Expected {expected_type} but found {self._peek().type}"
           )
   ```

2. **Peek**: Similar to the `_peek()` method of the lexer, though this method will only check the
   current position and not the next one. It will return the token at the current position if it
   exists, and `EOF` otherwise:

   ```python
   def _peek(self) -> Optional[Token]:
       if self._position < len(self._tokens):
           return self._tokens[self._position]
       return Token(TokenType.Eof)
   ```

3. **Parse**: This is the main method that performs the actual parsing. It will return the AST
   expression that can be used by the evaluator. It works by using a bunch of private parsing
   helpers for each type of token that are mutually recursive one after the other. What this means
   is that, following the order of precedence, each parsing operation will call the next until the
   end of the expression:

   ```txt
   parse()
   └── _parse_biconditional()
       └── _parse_implies()
           └── _parse_or()
               └── _parse_and()
                   └── _parse_not()
                       └── _parse_primary()
   ```

   This is a bit counterintuitive since it may seem "upside down", but it is the correct order. The
   parsing process starts with the lowest precedence operator (`_parse_biconditional`), which calls
   the function for the next higher precedence operator (`_parse_implies`), and so on, until it
   reaches the highest precedence operators (`_parse_primary` and `_parse_not`). This recursive
   descent approach naturally handles the order of operations by delegating to functions for higher-
   precedence expressions.

   ```python
   def _parse_primary(self) -> Expression:
        token = self._peek()
        if token.type == TokenType.Variable:
            self._consume(TokenType.Variable)
            if token.lexeme is None:
                raise Exception("Parser error: Variable name is missing.")
            return Var(token.lexeme)
        elif token.type == TokenType.LParen:
            self._consume(TokenType.LParen)
            expr = self._parse_biconditional()
            self._consume(TokenType.RParen)
            return expr
        else:
            raise Exception(
                f"Parser error: Expected variable or '(' but found {token.type}"
            )

    def _parse_not(self) -> Expression:
        if self._peek().type == TokenType.NotOp:
            self._consume(TokenType.NotOp)
            return Not(self._parse_not())
        return self._parse_primary()

    def _parse_and(self) -> Expression:
        left = self._parse_not()
        while self._peek().type == TokenType.AndOp:
            self._consume(TokenType.AndOp)
            right = self._parse_not()
            left = And(left, right)
        return left

    def _parse_or(self) -> Expression:
        left = self._parse_and()
        while self._peek().type == TokenType.OrOp:
            self._consume(TokenType.OrOp)
            right = self._parse_and()
            left = Or(left, right)
        return left

    def _parse_implies(self) -> Expression:
        left = self._parse_or()
        if self._peek().type == TokenType.ImpliesOp:
            self._consume(TokenType.ImpliesOp)
            right = self._parse_implies()
            left = Implies(left, right)
        return left

    def _parse_biconditional(self) -> Expression:
        left = self._parse_implies()
        while self._peek().type == TokenType.BiconditionalOp:
            self._consume(TokenType.BiconditionalOp)
            right = self._parse_implies()
            left = Biconditional(left, right)
        return left

    def parse(self) -> Expression:
        expr = self._parse_biconditional()
        if self._peek().type != TokenType.Eof:
            raise Exception("Parser error: Unexpected tokens remaining.")
        return expr
   ```

### The Evaluator

> You can see the full code of
> [parser.py](https://github.com/4ster-light/py-logic/blob/main/evaluator.py)

#### 1. Concept

Congratulations! We have already gone through basically all the implementation. Now we just have to
evaluate the already parsed expression and print the result. We will not be getting into the details
of printing, but evaluating since we already have the AST is fairly easy. Given that we will have
already created the different **assignments**, meaning the different possible combinations of the
given variables, when generating the table (if you are curious look at the source code), we can just
create a general `evaluate()` method that will take the expression and the variables and return the
result of each logical computation.

#### 2. Evaluating the AST

To achieve this it is as simple as pattern matching the different branches of the tree, and applying
each operation recursively.

```python
class Evaluator:
    def __init__(self, assignments: dict[str, bool]) -> None:
        self._assignments = assignments

    def evaluate(self, expr: Expression) -> bool:
        match expr:
            case Var(name):
                return self._assignments[name]
            case Not(expression):
                return not self.evaluate(expression)
            case And(left, right):
                return self.evaluate(left) and self.evaluate(right)
            case Or(left, right):
                return self.evaluate(left) or self.evaluate(right)
            case Implies(left, right):
                return not self.evaluate(left) or self.evaluate(right)
            case Biconditional(left, right):
                return self.evaluate(left) == self.evaluate(right)
            case _:
                raise Exception("Evaluation error: Unknown expression type.")
```

In the unlikely case that an error has come this far in the process, we will just raise it with an
adequate message as always. You may have noticed that this is a pattern repeated constantly
throughout the whole codebase: checks everywhere and as informative as possible error messages, even
though no errors should be able to reach this point.

You can see the main file for the actual user interaction and coupling the three parts together
[main.py](https://github.com/4ster-light/py-logic/blob/main/main.py) just for curiosity, but we have
already covered the entire implementation of the interpreter.

## Conclusion

We have now reached the end of the tutorial! And although it is not the most complex example, it
still shows the power of the interpreter and how it can be used to evaluate any kind of computation.

As always, thanks for reading and if you have any questions or comments feel free to reach out to me
on [X/Twitter](https://x.com/4ster_light) or by mail at
[davidvivarbogonez@gmail.com](mailto:davidvivarbogonez@gmail.com), I am always open to criticism,
just like I hope you did by reading this, I am always trying to learn and improve.

> Also, as a bonus, you can find a version of this project in F# in
> [github.com/4ster-light/f-logic](https://github.com/4ster-light/f-logic/), for those who are
> interested and wanna expand their learning further, you will find interesting ways that Functional
> Programming helps in this kind of problems, as well as algebraic data types, discriminated unions,
> pattern matching, etc.

## Sponsor

> If you liked this post and found it useful, consider supporting me by _buying me a coffee_ or
> becoming a member of my community on **Ko-fi** where I post more content like this and advertise
> my own projects as well (link on button below).
