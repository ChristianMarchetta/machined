# Machined
A minimal State Machine implementation. Zero dependencies, browser and node compatible.

## Getting Started

### 1. Install via npm
```
npm install machined
```

### 2 Import in your project
We'll break this down below
```typescript

import {StateMachine} from 'machined'

const machine = new StateMachine()

const names = ['Anna', 'Peter', 'Maria', 'Joe']

machine.addState('initial-state', (_, useMemory) => {
    
    const [index, setIndex] = useMemory(0)

    if(index === names.length){
        return
    }else{
        setIndex(index +1)
    }

    const name = names[index]

    return ['printer', name]
})

machine.addState('printer', (input) => {
    console.log("Hello", input)
    return 'initial-state'
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
