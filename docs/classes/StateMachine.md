[machined](../README.md) / [Exports](../modules.md) / StateMachine

# Class: StateMachine

This class implements a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine).

## Table of contents

### Constructors

- [constructor](StateMachine.md#constructor)

### Properties

- [\_currentStateName](StateMachine.md#_currentstatename)
- [\_initialStateName](StateMachine.md#_initialstatename)
- [\_lastStateName](StateMachine.md#_laststatename)
- [\_memoizedMemory](StateMachine.md#_memoizedmemory)
- [\_memories](StateMachine.md#_memories)
- [\_memoryIndex](StateMachine.md#_memoryindex)
- [\_states](StateMachine.md#_states)

### Methods

- [addState](StateMachine.md#addstate)
- [getCurrentStateName](StateMachine.md#getcurrentstatename)
- [getLastStateName](StateMachine.md#getlaststatename)
- [start](StateMachine.md#start)
- [toState](StateMachine.md#tostate)
- [useMemory](StateMachine.md#usememory)

## Constructors

### constructor

• **new StateMachine**()

Create a new blank state machine

#### Defined in

index.ts:57

## Properties

### \_currentStateName

• `Private` `Optional` **\_currentStateName**: `string`

#### Defined in

index.ts:51

___

### \_initialStateName

• `Private` `Optional` **\_initialStateName**: `string`

#### Defined in

index.ts:50

___

### \_lastStateName

• `Private` `Optional` **\_lastStateName**: `string`

#### Defined in

index.ts:52

___

### \_memoizedMemory

• `Private` `Optional` **\_memoizedMemory**: `unknown`[]

#### Defined in

index.ts:48

___

### \_memories

• `Private` **\_memories**: `Map`<`string`, `unknown`[]\>

#### Defined in

index.ts:46

___

### \_memoryIndex

• `Private` **\_memoryIndex**: `number` = `0`

#### Defined in

index.ts:47

___

### \_states

• `Private` **\_states**: `Map`<`string`, [`Action`](../modules.md#action)<`unknown`, `unknown`\>\>

#### Defined in

index.ts:45

## Methods

### addState

▸ **addState**<`I`, `O`\>(`name`, `action`): [`StateMachine`](StateMachine.md)

Add a new state to this state machine.
The first added state is considered the initial state. This behaviour can optionally be altered
by specifying a custom initial state when starting the machine.

#### Type parameters

| Name |
| :------ |
| `I` |
| `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | {@link string} the name of the new state.              If you use the same name of an existing state, the older state will be overridden. |
| `action` | [`Action`](../modules.md#action)<`I`, `O`\> | a function of type [Action](../modules.md#action) to perform when the state machine ends up in this state. |

#### Returns

[`StateMachine`](StateMachine.md)

this StateMachine

#### Defined in

index.ts:72

___

### getCurrentStateName

▸ **getCurrentStateName**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

the name of the current state, or undefined if the machine has not started yet or if it has reached a final state

#### Defined in

index.ts:90

___

### getLastStateName

▸ **getLastStateName**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

the name of the previous state.
         If the machine was in state x and has now moved to state y, this function will return the name of state x.
         If the machine was in state y, which was a final state, and has now stopped, this function will return the name of state y.
         If the machine has never started, this function will return undefined.
         If the machine has started but we still are in the initial state, this function will return undefined.

#### Defined in

index.ts:102

___

### start

▸ **start**(`initialInput?`, `initialState?`, `preventMemoryCleanup?`): `Promise`<`any`\>

Start the state machine from the initial state.
Once started, the machine cannot be stopped untill it has reached the final state, or an error has occurred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialInput?` | `any` | optionally provide input data to the initial state |
| `initialState?` | `string` | optionally override the name of initial state.  By default the first state added through [StateMachine.addState](StateMachine.md#addstate) is used as the initial state. |
| `preventMemoryCleanup?` | `boolean` | if true, once the machine exits from the final state the machine  memory **will not** be cleaned. False by default. |

#### Returns

`Promise`<`any`\>

a {@link Promise} that resolves to the output of the final state, or undefined if the final state
  did not return any output. Any errors thrown by any state will cause this promise to reject with the error.

#### Defined in

index.ts:119

___

### toState

▸ **toState**<`I`, `O`\>(`nextState?`, `initialState?`, `preventMemoryCleanup?`): (`input`: `I`) => `Promise`<[`undefined` \| `string`, `O`]\>

Transform this state machine into an action function to be used as a state.
In other words, you can use this function to run an entire state machine as single state
of another, bigger state machine.
This allows for an high degree of reusability.

#### Type parameters

| Name |
| :------ |
| `I` |
| `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nextState?` | `string` \| (`lastState`: `string`) => `string` | either   - a string containing the next state to move to once the this machine as reached its final state   - a function that takes the name of the final state this machine reached      and returns a string representing the name of the next state. |
| `initialState?` | `string` | optionally override the name of the initial state of this machine. |
| `preventMemoryCleanup?` | `boolean` | - |

#### Returns

`fn`

an action function that resolves when the machine reaches a final state.

Output from the outer machine will be forwarded as input to the initial state of this machine.
Output from this machine will be forwarded as input to the next state in the outer machine.

▸ (`input`): `Promise`<[`undefined` \| `string`, `O`]\>

Transform this state machine into an action function to be used as a state.
In other words, you can use this function to run an entire state machine as single state
of another, bigger state machine.
This allows for an high degree of reusability.

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `I` |

##### Returns

`Promise`<[`undefined` \| `string`, `O`]\>

an action function that resolves when the machine reaches a final state.

Output from the outer machine will be forwarded as input to the initial state of this machine.
Output from this machine will be forwarded as input to the next state in the outer machine.

#### Defined in

index.ts:252

___

### useMemory

▸ **useMemory**<`T`\>(`initialValue?`): [`T`, (`value`: `T`) => `void`]

This method is inspired by [React's useState() hook](https://reactjs.org/docs/hooks-state.html)
and let's you keep track of data inside states that should persist when states are visited multiple times.

**Similar to React's useState(), this method also comes with rules**:
 - you should only call useMemory() from inside an action function passed to [StateMachine.addState](StateMachine.md#addstate), or inside
     other functions that are still called by state actions.
 - every time an action function is executed for a state, useMemory() must be called the exact same number of times.
     This means that you should avoid calling useMemory() inside if statements.
 - if you are calling useMemory() multiple times, you must always perform the calls in the same order in order
     to consistently get the correct values returned.
 - useMemory() relies on the current state name, therefore if you use the same action function for two different states
     the resulting memories will be complitely independent from one another.
 - useMemory() is an instance method, you must only call it from a [StateMachine](StateMachine.md) instance inside one of its actions.

Failure to comply with these rule might result in unexpected behaviour or errors.

For the curious, all these rules are a consequence of the implementation. As stated above, useMemory() relies on
the current state name, and stores data inside a Map<'stateName', []>, where the array contains the data for a single state.
The first call to useMemory() stores the data at index 0 in the array, the second call stores the data at index 1,
the third call at indexe 2, and so on. This is why the order and number of calls is important to be identical when ever a state
is executed more than once.

In a world without this method, if you want to persist state data you are forced to do it in in the global scope.
E.g. if you want to increment a counter every time the machine is a given state, you need to store that counter in a global variable.
This is not ideal because when multiple states need to keep track of multiple variables the situation will get messy very quickly,
moreover every state can modify some other state's data and make the code more error prone.
The useMemory() method solves these problems.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue?` | `T` | an optional initial value to use as the memory value the first time it is called, defaults to undefined |

#### Returns

[`T`, (`value`: `T`) => `void`]

an array containing two elements:
 - the current memory value, or initialValue if it was provided and it is the first execution of useMemor(), or undefined
     if the initial value was not provided
 - a function that takes a value with which to update the memory

It is important to understand that the value returned in the array is a static **shallow** copy of the current memory value,
modifying it will not have any effect on actual memory unless you use the provided callback, or unless you are using an object
as memory and are modyfying one of its property.
Moreover, multiple calls to the callback in the same state will result in only the last passed value to be stored in the memory.

#### Defined in

index.ts:211
