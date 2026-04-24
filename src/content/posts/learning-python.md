---
title: "Python and Junior Developers"
description: "Why Python's simplicity and popularity can become a problem at times"
date: "2024-12-02"
tags: ["python", "job market", "programming"]
---

I wanted to talk about this ever since I started feeling confident enough to say
“I KNOW Python” (a bit cocky of me since I have a lot to learn of course, but
you understand the point). As everyone reading this probably knows, Python has
an extremely simple syntax, the typical coding example you may show to someone
that has never coded before reads just as plain English language in most of it.

## The Problem: Overconfidence vs Competence

What I’ve found is that this provides some so called “Software Engineers” (as
self proclaimed in their portfolios and resumes) with the illusion of possessing
great programming skills and deserve a job straight away. Don't get me wrong, it
is to celebrate that there is a language that empowers newcomers so much, but
still, as said in the title, there is a great difference between being competent
up to some extent, and just being overconfident.

What I'm trying to say is that, this is a problem I feel is not addressed often
nor well enough, and it is similar to what I like to call “The React myriad” in
web development, where you find a lot of “self taught developers” everywhere
that pretend to be web devs, wielding their To-Do apps as mighty swords of
engineering, without having basic HTML knowledge.

And then you ask this “Python devs” to implement some coding example that is not
really that complicated if we are being honest, like some iterator:

```python
class PrimeGenerator:
    def __init__(self):
        self._sieve = {}  # Dictionary for sieve storage
        self.current = 2  # Start checking from 2

    def __iter__(self):
        return self

    def __next__(self) -> int:
        while self.current in self._sieve:
            # Move multiples to their next multiple
            for prime in self._sieve[self.current]:
                self._sieve
                    .setdefault(prime + self.current, [])
                    .append(prime)

            del self._sieve[self.current]
            self.current += 1

        # Found a prime
        self._sieve[self.current * 2] = [self.current]
        prime = self.current
        self.current += 1

        return prime

    def take(self, n: int) -> list[int]:
        return [next(self) for _ in range(n)]
```

They may not even know what to do, some of them having no clue or previous
knowledge of the `yield` keyword existing in Python, neither what `__iter__` or
`__next__` are or why they should be used rather than creating a custom method
yourself.

As you can see this is a pretty straight forward example that well explained
should present no problem to anyone that has been learning how to code for a
while. The little quircks that show if you actually know the language, the tool,
you claim to know. Just 27 lines of python code are demonstraiting key concepts
like custom iterators, generator logic, and algorithmic efficiency, which to may
of you are probably a no brainer, but of course that new people need to learn it
at some point, and not fall into **Dunning-Kruger** syndrome. As a result of
this they may even dismiss more complex features as unnecessary and not worth
the time to learn, deepening even more the gap between surface level semantics
and the actual richness of the language.

This makes me honestly sad since I love this language for being so versatile and
adaptable for many use cases, but still these people give it a bad name, making
it a toy language or making it seem like it has bad DX (which I understand that
to a certain extent is a subjective quality to have) although it not being like
this for a lot of people that use it daily.

## YouTube tutorial syndrome

A major contributor to this issue is what I like to call the "YouTube Tutorial
Syndrome." Online tutorials are fantastic starting points, but they tend to
focus on **replication** rather than **understanding**. A developer may follow
along with a video to create a simple application but struggle to extend or
modify it because they lack a firm grasp of the principles behind the code.

This over-reliance on tutorials can create a false sense of accomplishment. When
faced with unique challenges, these developers often freeze, unable to deviate
from the patterns shown in tutorials.

## Bridging the Gap: From Syntax to Engineering

I know that in this list everything has been mentioned several times in the
software community, but they are not repeated/regarded enough apparently:

- **Emphasize Computer Science Fundamentals:** Encourage learners to study data
  structures, algorithms, and design patterns. These concepts are
  language-agnostic and form the backbone of software engineering. Most people
  do not need to be experts of course, but basic knowledge always comes in
  handy. And even if you end up disagreeing with some of this, because even
  experienced engineers may come up with bad abstractions, you have learned
  **"the why"** of the problem, you have a fundamented opinion, a perfectly
  valid one even if subjective.
- **Promote Project-Based Learning:** Encourage developers to build complex,
  real-world projects that go beyond simple scripts or To-Do apps. This advice
  is very cliche, but it is the only way to truly understand software
  architecture and system design, which is something most tend to not pay enough
  attention about and when they find themselves in a situation where they need
  to make a decision, they tend to go with the simplest solution, which is not
  always the best one.
- **Foster a culture of Continuous Learning:** The tech industry evolves
  rapidly. Instill the importance of staying updated with new technologies, best
  practices, and industry trends.
- **Encourage Code Reviews and Collaboration:** Participate in open-source
  projects or peer code reviews. This exposure to different coding styles and
  problem-solving approaches is crucial for growth. We benefit from other
  developers' experience and knowledge, as we've said before, even if we don't
  agree, a bad lesson is sometimes a better lesson.

By implementing these strategies, we can help bridge the gap between knowing
Python syntax and becoming a proficient software engineer, ensuring that
Python's simplicity becomes a stepping stone rather than a stumbling block in a
developer's journey.

### Bonus: The obscurity of Decorators

This is a very interesting topic, and I'm not going to go into too much detail
here, but I think it's worth mentioning. Even by really talented and experienced
developers this is something that tends to produce resentment and criticism,
because decorators modify the behavior of a function, which is some argue could
make the code harder to trace and debug.

There are very idiomatic and simple ways of using them, which, being a Rust
developer myself and these being very similar to procedural macros at a higher
level, I think it's safe to say that they are not that obscure and are a pretty
powerful tool. Many frameworks even relying on them heavily to enhance the DX of
their code.

And can even be used personally to make your life easier without much effort,
like:

```python
import time

def benchmark(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        dt = end_time - start_time
        print(f"Benchmark executed in {dt:.6f} seconds.")
        return result
    return wrapper

@benchmark
def slow_function():
    for _ in range(10**6):
        pass

slow_function()
```

This is a very simple example, but it shows how you can use decorators to add
functionality to a function without modifying its code, which is something that
is very common in Python and can be done in Rust and many popular languages
where it is used **heavily**.

## Conclusion

I hope this post has been useful and has given you some insight into the
complexity of Python and the challenges that developers face when learning it.
I'm sure you've learned a lot about the language and how it can be used to solve
problems, but I also hope that you've gained some perspective on the challenges
that developers face when learning a new language.

If you find any issue with this posts content or the way I express myself,
please let me know ;), I'm always open to feedback and suggestions as a very
unexperienced writer myself at the moment I'm writing this.
