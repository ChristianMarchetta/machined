[machined](README.md) / Exports

# machined

## Table of contents

### Classes

- [StateMachine](classes/StateMachine.md)

### Type aliases

- [MachineOutput](modules.md#machineoutput)

## Type aliases

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

[index.ts:9](https://github.com/ChristianMarchetta/machined/blob/87597e3/src/index.ts#L9)
