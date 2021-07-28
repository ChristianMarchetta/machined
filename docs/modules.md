[machined](README.md) / Exports

# machined

## Table of contents

### Classes

- [StateMachine](classes/StateMachine.md)

### Type aliases

- [Action](modules.md#action)

## Type aliases

### Action

Ƭ **Action**<`I`, `O`\>: (`input`: `I`) => `OrPromise`<`string` \| `void`\> \| `OrPromise`<[`string` \| `void`]\> \| `OrPromise`<[`string` \| `void`, `O`]\>

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `I` | `void` | the type of the data expected to be passed as input to the action.  This data should be provided by the output of the previous state. |
| `O` | `void` | the output data of this action, to be forwarded as input to the next state,  or returned by the [StateMachine.start](classes/StateMachine.md#start) method if this action is executed on the last state. |

#### Type declaration

▸ (`input`): `OrPromise`<`string` \| `void`\> \| `OrPromise`<[`string` \| `void`]\> \| `OrPromise`<[`string` \| `void`, `O`]\>

An action is a function associated to a state through the [StateMachine.addState](classes/StateMachine.md#addstate) method
that is executed when the state machine enters the indicated state.
Every action is usually responsible for:
 1. performing whatever business logic and side effects are needed in the current state
 1. moving to the next state or signaling itself as the final state.
 1. optionally providing output data to be used as input for the next state

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `I` |

##### Returns

`OrPromise`<`string` \| `void`\> \| `OrPromise`<[`string` \| `void`]\> \| `OrPromise`<[`string` \| `void`, `O`]\>

an action must return one of the following types:
- if an action returns a {@link string}, it will be considered as the name of the next state
- if an action returns {@link undefined}, it will be considered as the final state.
- if an action needs to return some output it must return an array containing two elements:
     1. a string reresenting the next state name, or undefined to signal that this is the final state
     2. the output of type O

 In all cases an action can either return the choosen type or
a {@link Promise} of the same type that will be awaited.

#### Defined in

index.ts:34
