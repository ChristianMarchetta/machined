


/**
 * An action is a function associated to a state through the {@link StateMachine.addState} method
 * that is executed when the state machine enters the indicated state.
 * Every action is usually responsible for:
 *  1. performing whatever business logic and side effects are needed in the current state
 *  1. moving to the next state or signaling itself as the final state.
 *  1. optionally providing output data to be used as input for the next state
 * 
 * @template I the type of the data expected to be passed as input to the action. 
 *  This data should be provided by the output of the previous state.
 * 
 * @template O the output data of this action, to be forwarded as input to the next state, 
 *  or returned by the {@link StateMachine.start} method if this action is executed on the last state.
 * 
 * @returns an action must return one of the following types:
 * - if an action returns a {@link string}, it will be considered as the name of the next state
 * - if an action returns {@link undefined}, it will be considered as the final state.
 * - if an action needs to return some output it must return an array containing two elements:
 *      1. a string reresenting the next state name, or undefined to signal that this is the final state
 *      2. the output of type O 
 * 
 *  In all cases an action can either return the choosen type or
 * a {@link Promise} of the same type that will be awaited.
 *  
 */
export type Action<I = void, O = void, T=string> = (input: I) =>
    T | void
    | [T | void]
    | [T | void, O]
    | Promise<T | void
        | [T | void]
        | [T | void, O]>


/**
 * This class implements a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine).
 */
export class StateMachine<T extends string = string> {

    /**
     * @ignore
     * a map of state name to state action
     */
    private _actions: Map<T, Action<unknown, unknown, T>>

    /**
     * @ignore 
     */
    private _memories: Map<T, unknown[]>

    /**
     * @ignore 
     */
    private _memoryIndex: number = 0

    /**
     * @ignore 
     */
    private _memoizedMemory?: unknown[]

    /**
     * @ignore 
     */
    private _initialStateName?: T

    /**
     * @ignore 
     */
    private _currentStateName?: T

    /**
     * @ignore 
     */
    private _lastStateName?: T

    /**
     * Create a new blank state machine
     */
    constructor() {
        this._actions = new Map()
        this._memories = new Map()
    }

    /**
     * Add a new state to this state machine.
     * The first added state is considered the initial state. This behaviour can optionally be altered
     * by specifying a custom initial state when starting the machine.
     * 
     * @param name {@link string} the name of the new state. 
     *              If you use the same name of an existing state, the older state will be overridden.
     * @param action a function of type {@link Action} to perform when the state machine ends up in this state.
     * @returns this StateMachine
     */
    addState<I, O>(name: T, action: Action<I, O, T>) {
        if (name == null) {
            throw new Error(`Invalid state name ${name}`)
        }

        this._actions.set(name, action as any)

        if (!this._initialStateName) {
            this._initialStateName = name
        }

        return this
    }

    /**
     * 
     * @returns the name of the current state, or undefined if the machine has not started yet or if it has reached a final state
     */
    getCurrentStateName() {
        return this._currentStateName
    }

    /**
     * 
     * @returns the name of the previous state. 
     *          If the machine was in state x and has now moved to state y, this function will return the name of state x.
     *          If the machine was in state y, which was a final state, and has now stopped, this function will return the name of state y. 
     *          If the machine has never started, this function will return undefined.
     *          If the machine has started but we still are in the initial state, this function will return undefined.
     */
    getLastStateName() {
        return this._lastStateName
    }

    /**
     * Start the state machine from the initial state.
     * Once started, the machine cannot be stopped untill it has reached the final state, or an error has occurred.
     * 
     * @param initialInput optionally provide input data to the initial state
     * @param initialState optionally override the name of initial state. 
     *  By default the first state added through {@link StateMachine.addState} is used as the initial state.
     * @param preventMemoryCleanup if true, once the machine exits from the final state the machine 
     *  memory **will not** be cleaned. False by default.  
     *  
     * @returns a {@link Promise} that resolves to the output of the final state, or undefined if the final state 
     *   did not return any output. Any errors thrown by any state will cause this promise to reject with the error.
     */
    async start(initialInput?: any, initialState?: T, preventMemoryCleanup?: boolean) {
        const pack = <T>(d: T) => Array.isArray(d) ? d : [d]

        let input = initialInput

        this._currentStateName = initialState || this._initialStateName
        this._lastStateName = undefined

        if (!preventMemoryCleanup) {
            this._memories = new Map()
        }

        while (this._currentStateName != null) {
            this._memoryIndex = 0;
            this._memoizedMemory = undefined;
            const action: Action<unknown, unknown> | undefined = this._actions.get(this._currentStateName);

            if (action === undefined) {
                if (this._lastStateName) {
                    throw new Error(`State '${this._currentStateName}' not found, received as output from state '${this._lastStateName}'`)
                } else {
                    throw new Error(`Initial state '${this._currentStateName}' not found`)
                }
            }

            this._lastStateName = this._currentStateName;
            [this._currentStateName, input] = pack(await action(input));
        }

        return input
    }

    /**
     * @ignore
     * Memoize the current memory array into this._memoizedMemory
     * instead of performing a memory lookup for every useMemory() calls
     * in the same state.
     * @returns the memoized memory array
     */
    private _memoizeMemory() {
        this._memoizedMemory = this._memories.get(this._currentStateName as T)

        if (this._memoizedMemory === undefined) {
            this._memoizedMemory = []
            this._memories.set(this._currentStateName as T, this._memoizedMemory)
        }
        return this._memoizedMemory
    }

    /**
     * This method is inspired by [React's useState() hook](https://reactjs.org/docs/hooks-state.html)
     * and let's you keep track of data inside states that should persist when states are visited multiple times.
     * 
     * **Similar to React's useState(), this method also comes with rules**:
     *  - you should only call useMemory() from inside an action function passed to {@link StateMachine.addState}, or inside
     *      other functions that are still called by state actions.
     *  - every time an action function is executed for a state, useMemory() must be called the exact same number of times.
     *      This means that you should avoid calling useMemory() inside if statements. 
     *  - if you are calling useMemory() multiple times, you must always perform the calls in the same order in order 
     *      to consistently get the correct values returned.
     *  - useMemory() relies on the current state name, therefore if you use the same action function for two different states
     *      the resulting memories will be complitely independent from one another.
     *  - useMemory() is an instance method, you must only call it from a {@link StateMachine} instance inside one of its actions.
     *        
     * 
     * Failure to comply with these rule might result in unexpected behaviour or errors.
     * 
     * 
     * For the curious, all these rules are a consequence of the implementation. As stated above, useMemory() relies on 
     * the current state name, and stores data inside a Map<'stateName', []>, where the array contains the data for a single state.
     * The first call to useMemory() stores the data at index 0 in the array, the second call stores the data at index 1, 
     * the third call at indexe 2, and so on. This is why the order and number of calls is important to be identical when ever a state 
     * is executed more than once.
     * 
     * 
     * In a world without this method, if you want to persist state data you are forced to do it in in the global scope.
     * E.g. if you want to increment a counter every time the machine is a given state, you need to store that counter in a global variable. 
     * This is not ideal because when multiple states need to keep track of multiple variables the situation will get messy very quickly,
     * moreover every state can modify some other state's data and make the code more error prone.
     * The useMemory() method solves these problems.
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
    useMemory<T>(initialValue?: T): [T, (value: T) => void] {
        const memory = this._memoizedMemory || this._memoizeMemory()

        const staticIndexCopy = this._memoryIndex;
        const storedValue = memory[staticIndexCopy]

        if (storedValue === undefined && initialValue !== undefined) {
            memory[staticIndexCopy] = initialValue
        }

        const value = storedValue || initialValue;

        const setValue = (v: T) => {
            memory![staticIndexCopy] = v;
        }

        this._memoryIndex += 1
        return [value as T, setValue]
    }

    /**
     * Transform this state machine into an action function to be used as a state.
     * In other words, you can use this function to run an entire state machine as single state 
     * of another, bigger state machine.
     * This allows for an high degree of reusability.
     *  
     * @param nextState either a `string` containing the next state to move to once the this machine 
     * as reached its final state or a function that takes the name of the final state this machine reached
     * and returns a `string` representing the name of the next state.
     * 
     * @param initialState optionally override the name of the initial state of this machine.
     * 
     * @param preventMemoryCleanUp if true the memory of this machine will not be cleaned once it 
     * is done, therefore if this state is execuded again, the machine will retain its memory.
     * By default, memory is cleaned at the end of every execution of this state.
     * 
     * @returns an action function that resolves when the machine reaches a final state.
     * 
     * Output from the outer machine will be forwarded as input to the initial state of this machine.
     * Output from this machine will be forwarded as input to the next state in the outer machine.
     * 
     */
    toState<I, O, TT extends string =string>(
        nextState?: TT | ((lastState: T) => TT),
        initialState?: T,
        preventMemoryCleanup?: boolean):

        (input: I) => Promise<[TT | undefined, O]> {

        return async (input: I) => {
            const result = await this.start(input, initialState, preventMemoryCleanup) as O

            if (nextState === undefined || typeof nextState === 'string') {
                return [nextState, result]
            } else if (typeof nextState === 'function') {
                return [nextState(this._lastStateName as T), result]
            } else {
                throw new Error("Invalid value for argument nextState")
            }
        }
    }
}