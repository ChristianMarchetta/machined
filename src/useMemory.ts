/**
 * This type of function is inspired by [React's useState() hook](https://reactjs.org/docs/hooks-state.html)
 * and let's you keep track of data inside states that should persist when states are visited multiple times.
 * 
 * **Similar to React's useState(), this method also comes with rules**:
 *  - you should only call useMemory() from inside the {@link Action} function it was passed to. Do not pass it to other states. 
 *  - every time an action function is executed for a state, useMemory() must be called the exact same number of times.
 *      This means that you should avoid calling useMemory() inside if statements or variable length loops. 
 *  - if you are calling useMemory() multiple times, you must always perform the calls in the same order in order 
 *      to consistently get the correct values returned.
 *  - If you call {@link StateMachine.start} multiple times, every resulting run will have its own isolated memory. 
 *  
 * Failure to comply with these rule might result in unexpected behaviour or errors.
 * 
 * In a world without this method, if you want to persist state data you are forced to do it in in the global scope.
 * E.g. if you want to increment a counter every time the machine is a given state, you need to store that counter in a global variable. 
 * This is not ideal because when multiple states need to keep track of multiple variables the situation will get messy very quickly,
 * moreover every state can modify some other state's data and make the code more error prone. 
 * To complicate matter even worse, if you run an asyncronous state machine concurrently there's a very high chanche states might modify
 * global variables inconsistently if you are not carefull with it.
 * 
 * The useMemory() method solves these problems
 * 
 * @template T the type of the value you want to store in the state memory.
 *  
 * @param initialValue an optional initial value to use as the memory value the first time it is called, defaults to undefined
 * @returns an array containing two elements:
 *  - the current memory value, or initialValue if it was provided and it is the first execution of useMemor(), or undefined 
 *      if the initial value was not provided 
 *  - a function that takes a value with which to update the memory
 * 
 * It is important to understand that the value returned in the array is a static **shallow** copy of the current memory value, 
 * modifying it will not have any effect on actual memory unless you use the provided callback, or unless you are using an object
 * as memory and are modyfying one of its property.
 * Moreover, multiple calls to the callback in the same state will result in only the last passed value to be stored in the memory.    
 */
export type UseMemory = <T>(initialValue: T) => readonly [T, (v: T) => void]

export const makeUseMemory = (memory: unknown[]) => {

    let index = 0

    return <T>(initialValue: T) => {
        const staticIndexCopy = index;
        index++;
        const storedValue = memory[staticIndexCopy];

        if (storedValue === undefined && initialValue !== undefined) {
            memory[staticIndexCopy] = initialValue
        }

        const value = storedValue || initialValue;

        const setValue = (v: T) => {
            memory[staticIndexCopy] = v;
        }

        return [value as T, setValue] as const
    }
}