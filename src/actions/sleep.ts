import { Action } from "../action";

/**
 * Create an action function that sleeps for the provided number of milliseconds, then goes to the next state.
 * @template I the input type
 * @template T the string type representing the next state
 * @param nextState the next state to go to after sleeping
 * @param millis the number of milliseconds to sleep
 * @returns an {@link Action} function. Input is forwarded to the next state
 */
export const sleep = <I, T extends string>(nextState: T, millis: number): Action<I, I, T> =>
    (input: I) => new Promise<[T, I]>(resolve => {
        setTimeout(() => {
            resolve([nextState, input])
        }, millis)
    })


/**
 * Create an action function that sleeps for a variable number of milliseconds, then goes to the next state.
 * 
 * @template O the output type
 * @template T the string type representing the next state
 * @param nextState the next state to go to after sleeping
 * @returns an {@link Action} function that accepts input as `millis:number | [millis:number, output:O]` where `millis` 
 * is the number of milliseconds to sleep and `output`, when provided, will be forwarded to the next state.       
 */
export const variableSleep = <O, T extends string>(nextState: T): Action<number | [number, O], O | undefined, T> =>
    (input) => new Promise<[T, O]>(resolve => {

        const [millis, output] = typeof input === 'number'
            ? [input, undefined]
            : Array.isArray(input)
                ? input.length === 2
                    ? input
                    : [undefined, undefined]
                : [undefined, undefined]

        if (millis === undefined) {
            throw new Error(`Did not received valid input. Received input:${input}`)
        }

        if (millis < 0) {
            throw new Error(`Cannot sleep for ${millis} milliseconds, only positive values are accepted.`)
        }

        setTimeout(() => {
            resolve([nextState, output!])
        }, millis)
    })