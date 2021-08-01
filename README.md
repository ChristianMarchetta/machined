# Machined
A minimal State Machine implementation. Zero dependencies, browser and node compatible.

## Getting Started

### 1. Install via npm
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

By now you are probably wondering how `useMemory()` works. This special function (inspired by [Reacts's useState() hook](https://reactjs.org/docs/hooks-state.html)) let's you save, read and modify data inside a state. So that you don't need to bother declaring and managing external global variables. In this case we are storing the `index` of the current name, with an initial value of `0`, and increasing it by `1` every iteration untill `index` has reached the end of the names array. At that point we simply `return` without providing the name of the next state, meaning we are terminating the execution of the machine.

By default, the first state added to the machine is considered the initial state, hence, as you can probably already tell, in this machine `'initial-state'` is both an initial and final state. 


## API reference
Take a look at our [API reference](docs/modules.md) to master state machines.