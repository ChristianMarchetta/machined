[machined](../README.md) / [Exports](../modules.md) / StateMachine

# Class: StateMachine<T\>

This class implements a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine).

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `string` | a string type that represents all possible state names |

## Table of contents

### Constructors

- [constructor](StateMachine.md#constructor)

### Methods

- [addState](StateMachine.md#addstate)
- [start](StateMachine.md#start)
- [toAction](StateMachine.md#toaction)

## Constructors

### constructor

• **new StateMachine**<`T`\>()

Instanitate a new machine

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Defined in

[index.ts:57](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/index.ts#L57)

## Methods

### addState

▸ **addState**<`I`, `O`\>(`name`, `action`): [`StateMachine`](StateMachine.md)<`T`\>

Add a new state to this state machine.
The first added state is considered the initial state. This behaviour can optionally be altered
by specifying a custom initial state when starting the machine.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `I` | the input type received by the action |
| `O` | the output type received by the action |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `T` | the name of the new state.              If you use the name of an existing state, an error is thrown. |
| `action` | [`Action`](../modules.md#action)<`I`, `O`, `T`\> | an [Action](../modules.md#action) to perform when the state machine ends up in this state. |

#### Returns

[`StateMachine`](StateMachine.md)<`T`\>

this [StateMachine](StateMachine.md)

#### Defined in

[index.ts:88](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/index.ts#L88)

___

### start

▸ **start**<`O`\>(`initialInput?`, `initialState?`): `Promise`<[`MachineOutput`](../modules.md#machineoutput)<`T`, `O`\>\>

Start the state machine from the initial state.
Once started, the machine cannot be stopped untill it has reached the final state, or an error has occurred.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `O` | the output type of the final state of the machine |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialInput?` | `any` | use this data as input to the initial state |
| `initialState?` | `T` | pass a `string` to override the name of initial state.  By default the first state added through [StateMachine.addState](StateMachine.md#addstate) is used as the initial state. |

#### Returns

`Promise`<[`MachineOutput`](../modules.md#machineoutput)<`T`, `O`\>\>

a {@link Promise} that resolves to a [MachineOutput](../modules.md#machineoutput) object.
 Any errors thrown by any state will cause this promise to reject with the error.

#### Defined in

[index.ts:182](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/index.ts#L182)

___

### toAction

▸ **toAction**<`I`, `O`, `TT`\>(`nextState?`, `initialState?`): (`input`: `I`) => `Promise`<[`undefined` \| `TT`, `O`]\>

Transform this state machine into an action function to be used in a state of another machine.
In other words, you can use this function to run an entire state machine as single state
of another, bigger state machine.
This allows for an high degree of reusability.

Output from the outer machine will be forwarded as input to the initial state of this machine.
Output from this machine will be forwarded as input to the next state in the outer machine.

**`tt`** a stryng type representing all possible state names of the outer state machine

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `I` | `I` | the input type for the initial state |
| `O` | `O` | the output type of the final state |
| `TT` | extends `string``string` | - |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nextState?` | `TT` \| (`lastState`: `T`) => `TT` | either a `string` containing the next state to move to once the this machine as reached its final state, or a function that takes the name of the final state this machine reached and returns a `string` representing the name of the next state. |
| `initialState?` | `T` | optionally override the name of the initial state of this machine. |

#### Returns

`fn`

an action function that resolves when the machine reaches a final state.

▸ (`input`): `Promise`<[`undefined` \| `TT`, `O`]\>

Transform this state machine into an action function to be used in a state of another machine.
In other words, you can use this function to run an entire state machine as single state
of another, bigger state machine.
This allows for an high degree of reusability.

Output from the outer machine will be forwarded as input to the initial state of this machine.
Output from this machine will be forwarded as input to the next state in the outer machine.

**`template`** the input type for the initial state

**`template`** the output type of the final state

**`tt`** a stryng type representing all possible state names of the outer state machine

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `I` |

##### Returns

`Promise`<[`undefined` \| `TT`, `O`]\>

an action function that resolves when the machine reaches a final state.

#### Defined in

[index.ts:228](https://github.com/ChristianMarchetta/machined/blob/c207f70/src/index.ts#L228)
