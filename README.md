# Machined
A minimal State Machine implementation. Zero dependencies, browser and node compatible. 100% Typescript.

### Table of contents
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Hello World](#hello-world)
- [Concepts](#concepts)
    - [States](#states)
    - [useMemory](#usememory)
    - [Execution](#execution)
    - [Reusability](#reusability)
- [API](#api-reference)

## Getting Started

### 1. Installation
```
npm install machined
```

### 2 Hello World
We'll try to implement this simple state machine:

![Hello world state machine](/docs/imgs/HelloWorld.png)

The `initial-state` will pass a string to the `printer` state, which is going to print it.
Then, the `printer` state will move to the `initial-state` again without passingn any values.
The cicle continues untill the `intial-state` decides to stop.

Let's look at the code:

```typescript

import {StateMachine} from 'machined'

const machine = new StateMachine()  //creating a new state machine

const names = ['Anna', 'Peter', 'Maria', 'Joe']

machine.addState('initial-state', (_, useMemory) => {       // adding the initial-state along with the action to execute
                                                            // when we are in this state

    const [index, setIndex] = useMemory(0)                  // store a number called index into this state's memory

    if(index === names.length){
        return                                              // terminating the machine when there are no more names
    }else{
        setIndex(index +1)                                  // incrementing index
    }

    const name = names[index]                               // getting the current name

    return ['printer', name]                                // moving to the printer state and passing the name
})

machine.addState('printer', (input) => {                    // adding the printer state

    console.log("Hello", input)                             // printing the input 
    return 'initial-state'                                  // and going back to the initial state
})

machine.start()
```
The above program results in the following output:

```
Hello Anna
Hello Peter
Hello Maria
Hello Joe
```

#### What is going on?

We are creating a new state machine and adding two states to it:
 - one called `'initial-state'`
 - the other called `'printer'`

`'printer'` is a simple state that justs prints 'Hello' followed by whatever is passed to it as input and then moves to the `'initial-state'`.

`'initial-state'` is a bit more involved than `'printer'`. It calls `useMemory()` and uses the returned index value to access the `names` array. After getting the current name it moves to the `'printer'` state and passes the currenr name as input.

Finally we start the machine.

By now you are probably wondering how `useMemory()` works. This special function (inspired by [Reacts's useState() hook](https://reactjs.org/docs/hooks-state.html)) let's you save, read and modify data inside a state. So that you don't need to bother declaring and managing external global variables.

In this case we are storing the `index` of the current name, with an initial value of `0`, and increasing it by `1` every iteration untill `index` has reached the end of the names array. At that point we simply `return` without providing the name of the next state, meaning we are terminating the execution of the machine.

By default, the first state added to the machine is considered the initial state, hence, as you can probably already tell, in this machine `'initial-state'` is both an initial and final state. 


## Concepts
The idea of state machine we use in this module is a bit different than other state machine libraries and it is worth spending some time learning how our machines work.

### States
At the heart of a state machine there are its states. Every state is made of two parts:
 - a name
 - an action function


While a machine is running, the action function of the current state is run. Once this function has returned the machine either moves to the next state or terminates. By default, the first state added to the machine is considered the initial state, but you can change this when starting the machine.

One of the responsibility of an action function is to tell the name of the next state. This is usually done by returning a `string`. If the action want's to terminate the machine instead, it can simply return `undefined`, and the machine will terminate right after.

As you have already seen from the [Hello World](#hello-world) example above, an action function takes an `input` argument and can return some output. The output returned by the current state will be given as input to the next state. If we are visiting the initial state for the first time (i.e. we just started the machine), or if the previous state did not return any output, then `input` will be undefined. If the current state wants to pass some output to the next state it must return an array with two elements `[name, output]`, where `name` is the name of the next state, and `output` is the data it wants to pass to it. It is also possible to terminate the machine and returning some output, this can be done by returning `[undefined, output]`.

In any case, action functions can be async, i.e. they can return a promise. This promise will be always be awaited and the resulting value will be forwaded to the next state.

As you can see, this simple but flexible interface let's you define states very easily, and the state machine takes care of the plumbing between states.
 
### useMemory
Always from the [Hello World](#hello-world) example above, you can see that an action function receives a `useMemory()` function. If you are familiar with [Reacts's useState() hook](https://reactjs.org/docs/hooks-state.html), this is exactly how `useMemory()` works, the reason the names are different is because we didn't want to create confunsion with the term `state`, which in the context of a state machine refers to something else.

If you are not familiar with React, don't worry. The `useMemory()` function let's you keep track of data inside states that should persist when states are visited multiple times. In other words, if you want to persist data inside a state `x` such that every time you visit state `x` you have access to that data and can modify it, you need to use `useMemory()`.

`useMemory()` returns an array with two items: 
    - the current value
    - a setter function you can use to change the current value

Note that the current value is a constant, and if modifying it manually will have no effect, i.e. the new value will be forgotten the next time `x` is visited. Instead you should modify it with the setter function. Again, the current value is a constant, therefore the change will only take place the next time you visit `x`.

The first time state `x` is visited, the value is set to an optional `initialValue` you can pass to `useMemory()`, or `undefined` otherwise.

Moreover, if you need multiple values, you can call `useMemory()` as many times as you want, as long as you abide to the [rules described below](#useMemory-rules)

By now you might be a bit confused with `useMemory()`, however, it turns out this is a very powerfull and usefull function and here is why:

> In a world without this function, if you want to persist state data you are forced to do it in in the global scope. E.g. if you want to increment a counter every time the machine is in a given state, you need to store that counter in a global variable. 
>
> This is not ideal because when multiple states need to keep track of multiple variables the situation will get messy very quickly, moreover every state could modify some other state's data and make the code more error prone.
>
> To complicate matter even worse, if you run the same asyncronous state machine concurrently multiple time, there's a very high chanche that states functions might modify global variables inconsistently if you are not carefull with it.
>
> The useMemory() method solves these problems

#### useMemory rules
**Similar to React's useState(), this function also comes with rules**:
 - you should only call `useMemory()` from inside the Action function it was passed to. Do not pass it to other states.
 - every time an action function is executed for a state, `useMemory()` must be called the exact same number of times. This means that you should avoid calling `useMemory()` inside `if` statements or variable length loops.
 - if you are calling `useMemory()` multiple times, you must always perform the calls in the same order in order to consistently get the correct values returned.

Failure to comply with these rule might result in unexpected behaviour or errors.


### Execution
The nice thing about `useMemory()` is that it let's us eliminate global variables, and our machines become stateless (in the sense that they do not have to rely on global state). 

Therefore, as long as we do not use global variables (or are carefull enough), once we have declared a state machine, we can simply call the `start()` method as many times as we want, and there will be no critical sections, even if the machine runs asyncronously.

In facts, every time we call `start()`, our machine is "cloned" behind the scenes, and every clone get's its own isolated memory. 
 
### Reusability
The only other important method you haven't seen so far is `toAction()`. This method is capable of transforming your entire state machine into a single action function that can be used as part of another bigger state machine. 

When you use `toAction()` the output of the previous state (from the outer machine) will be given as input to the initial state of the inner machine. Similarly, the output of the inner machine will be given as input to the next state. 

This alone tremendously increases reusability by composition, and let's you easily create machines that can be reused in common situations.

Note that when you define a state machine that will later be transformed with `toAction()`, you do not need to care about what the next state will be in the outer machine once the inner machine has finished. This makes sense because the same machine can be reused by multiple different machines, therefore you need to provide this information only when you call `toAction()`, right before passing the result to the `addState()` method.

You can do this by simply passing a `string` corresponding to the next state name in the outer machine, or by passing a function that takes the name of the final state of the terminal machine and returns a `string` corresponding to the next state name.


## API reference
Take a look at our [API reference](docs/modules.md) to master state machines.