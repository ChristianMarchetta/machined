[machined](README.md) / Exports

# machined

## Table of contents

### Classes

- [StateMachine](classes/StateMachine.md)

### Type aliases

- [Action](modules.md#action)
- [MachineOutput](modules.md#machineoutput)
- [UseMemory](modules.md#usememory)

## Type aliases

### Action

Ƭ **Action**<`I`, `O`, `T`\>: (`input`: `I`, `useMemory`: [`UseMemory`](modules.md#usememory)) => `T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`] \| `Promise`<`T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`]\>

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `I` | `I` | the type of the data expected to be passed as input to the action.  This data should be provided by the output of the previous state. |
| `O` | `O` | the output data of this action, to be forwarded as input to the next state,  or returned by the [StateMachine.start](classes/StateMachine.md#start) method if this action is executed on the last state. |
| `T` | extends `string` | a string type representing all the possible state names this action can return |

#### Type declaration

▸ (`input`, `useMemory`): `T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`] \| `Promise`<`T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`]\>

An action is a function associated to a state through the [StateMachine.addState](classes/StateMachine.md#addstate) method
that is executed when the state machine enters the indicated state.
Every action is usually responsible for:
 1. performing whatever business logic and side effects are needed in the current state
 1. moving to the next state or signaling itself as the final state.
 1. optionally providing output data to be used as input for the next state

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `I` | the value returned by the previous state, or undefined if this is the initial state or if the   previous state returned no output. |
| `useMemory` | [`UseMemory`](modules.md#usememory) | a [UseMemory](modules.md#usememory) function to controll this state memory. **You must pay attention to [UseMemory](modules.md#usememory) rules** |

##### Returns

`T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`] \| `Promise`<`T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`]\>

an action must return one of the following types:
- if an action returns a {@link string}, it will be considered as the name of the next state
- if an action returns {@link undefined}, it will be considered as the final state.
- if an action needs to return some output it must return an array containing two elements:
     1. a string reresenting the next state name, or undefined to signal that this is the final state
     2. the output of type O

 In all cases an action can either return the choosen type or
a {@link Promise} of the same type that will be awaited.

#### Defined in

[action.ts:35](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/action.ts#L35)

___

### MachineOutput

Ƭ **MachineOutput**<`T`, `O`\>: `Object`

A MachineOutput object is considered the output of an entire state machine.
This consists of the output of the final state, or undefined if the final state
did not return any output, and the name of the final state.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `string` | a string type that represents all possible output states |
| `O` | `any` | the output type |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lastState` | `T` |
| `output` | `O` |

#### Defined in

[index.ts:14](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/index.ts#L14)

___

### UseMemory

Ƭ **UseMemory**: <T\>(`initialValue`: `T`) => readonly [`T`, (`v`: `T`) => `void`]

#### Type declaration

▸ <`T`\>(`initialValue`): readonly [`T`, (`v`: `T`) => `void`]

This type of function is inspired by [React's useState() hook](https://reactjs.org/docs/hooks-state.html)
and let's you keep track of data inside states that should persist when states are visited multiple times.

**Similar to React's useState(), this method also comes with rules**:
 - you should only call useMemory() from inside the [Action](modules.md#action) function it was passed to. Do not pass it to other states.
 - every time an action function is executed for a state, useMemory() must be called the exact same number of times.
     This means that you should avoid calling useMemory() inside if statements or variable length loops.
 - if you are calling useMemory() multiple times, you must always perform the calls in the same order in order
     to consistently get the correct values returned.
 - If you call [StateMachine.start](classes/StateMachine.md#start) multiple times, every resulting run will have its own isolated memory.

Failure to comply with these rule might result in unexpected behaviour or errors.

In a world without this method, if you want to persist state data you are forced to do it in in the global scope.
E.g. if you want to increment a counter every time the machine is a given state, you need to store that counter in a global variable.
This is not ideal because when multiple states need to keep track of multiple variables the situation will get messy very quickly,
moreover every state can modify some other state's data and make the code more error prone.
To complicate matter even worse, if you run an asyncronous state machine concurrently there's a very high chanche states might modify
global variables inconsistently if you are not carefull with it.

The useMemory() method solves these problems

##### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | the type of the value you want to store in the state memory. |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `T` | an optional initial value to use as the memory value the first time it is called, defaults to undefined |

##### Returns

readonly [`T`, (`v`: `T`) => `void`]

an array containing two elements:
 - the current memory value, or initialValue if it was provided and it is the first execution of useMemor(), or undefined
     if the initial value was not provided
 - a function that takes a value with which to update the memory

It is important to understand that the value returned in the array is a static **shallow** copy of the current memory value,
modifying it will not have any effect on actual memory unless you use the provided callback, or unless you are using an object
as memory and are modyfying one of its property.
Moreover, multiple calls to the callback in the same state will result in only the last passed value to be stored in the memory.

#### Defined in

[useMemory.ts:37](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/useMemory.ts#L37)
