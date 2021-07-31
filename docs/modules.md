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
| `T` | extends `string` | - |

#### Type declaration

▸ (`input`, `useMemory`): `T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`] \| `Promise`<`T` \| `void` \| [`T` \| `void`] \| [`T` \| `void`, `O`]\>

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
| `useMemory` | [`UseMemory`](modules.md#usememory) |

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

[action.ts:28](https://github.com/ChristianMarchetta/machined/blob/8347c20/src/action.ts#L28)

___

### MachineOutput

Ƭ **MachineOutput**<`T`, `O`\>: `Object`

A MachineOutput object is considered the output of an entire state machine.
This consists of the output of the final state, or undefined if the final state
did not return any output, and the name of the final state.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |
| `O` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lastState` | `T` |
| `output` | `O` |

#### Defined in

[index.ts:11](https://github.com/ChristianMarchetta/machined/blob/8347c20/src/index.ts#L11)

___

### UseMemory

Ƭ **UseMemory**: <T\>(`initialValue`: `T`) => readonly [`T`, (`v`: `T`) => `void`]

#### Type declaration

▸ <`T`\>(`initialValue`): readonly [`T`, (`v`: `T`) => `void`]

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `T` |

##### Returns

readonly [`T`, (`v`: `T`) => `void`]

#### Defined in

[useMemory.ts:1](https://github.com/ChristianMarchetta/machined/blob/8347c20/src/useMemory.ts#L1)
