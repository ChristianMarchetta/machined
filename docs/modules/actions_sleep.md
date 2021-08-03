[machined](../README.md) / [Modules](../modules.md) / actions/sleep

# Module: actions/sleep

## Table of contents

### Functions

- [sleep](actions_sleep.md#sleep)
- [variableSleep](actions_sleep.md#variablesleep)

## Functions

### sleep

▸ `Const` **sleep**<`I`, `T`\>(`nextState`, `millis`): [`Action`](index.md#action)<`I`, `I`, `T`\>

Create an action function that sleeps for the provided number of milliseconds, then goes to the next state.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `I` | `I` | the input type |
| `T` | extends `string` | the string type representing the next state |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nextState` | `T` | the next state to go to after sleeping |
| `millis` | `number` | the number of milliseconds to sleep |

#### Returns

[`Action`](index.md#action)<`I`, `I`, `T`\>

an [Action](index.md#action) function. Input is forwarded to the next state

#### Defined in

actions/sleep.ts:11

___

### variableSleep

▸ `Const` **variableSleep**<`O`, `T`\>(`nextState`): [`Action`](index.md#action)<`number` \| [`number`, `O`], `undefined` \| `O`, `T`\>

Create an action function that sleeps for a variable number of milliseconds, then goes to the next state.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `O` | `O` | the output type |
| `T` | extends `string` | the string type representing the next state |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nextState` | `T` | the next state to go to after sleeping |

#### Returns

[`Action`](index.md#action)<`number` \| [`number`, `O`], `undefined` \| `O`, `T`\>

an [Action](index.md#action) function that accepts input as `millis:number | [millis:number, output:O]` where `millis`
is the number of milliseconds to sleep and `output`, when provided, will be forwarded to the next state.

#### Defined in

actions/sleep.ts:28
