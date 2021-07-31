import { Action } from "./action"
import { makeUseMemory } from './useMemory'
export * from './action'
export {UseMemory} from './useMemory'

/**
 * A MachineOutput object is considered the output of an entire state machine.
 * This consists of the output of the final state, or undefined if the final state 
 * did not return any output, and the name of the final state.
 * 
 * @template T a string type that represents all possible output states
 * @template O the output type
 */
export type MachineOutput<T extends string, O=any> = {
    lastState: T,
    output: O
}


/**
 * This class implements a [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine).
 * 
 * @template T a string type that represents all possible state names
 */
export class StateMachine<T extends string> {

    /**
     * @ignore
     * A map of state name to actions
     */
    private _actions: Map<T, Action<unknown, unknown, T>>

    /**
     * @ignore
     * This variable is initialized when the first state is added
     * and never modified again
     */
    private _initialStateName?: string

    /**
     * @ignore
     * True if this is a mother machine, flase if this is a clone machine.
     */
    private _isMoterMachine: boolean

    /**
     * @ignore
     * True if this machine has been built, false otherwise.
     * A mother machine becomes built as soon as start() is called.
     * Clone machines are true from birth.
     */
    private _isBuilt?: boolean

    /**
     * Instanitate a new machine
     */
    constructor() {
        this._actions = new Map()
        this._isMoterMachine = true
    }

    /**
     * @ignore
     * Set this machine as built
     */
    private _build() {
        if (this._actions.size === 0) {
            throw new Error("Cannot start an empty machine")
        }
        this._isBuilt = true
    }

     /**
     * Add a new state to this state machine.
     * The first added state is considered the initial state. This behaviour can optionally be altered
     * by specifying a custom initial state when starting the machine.
     * 
     * @template I the input type received by the action
     * @template O the output type received by the action
     * 
     * @param name the name of the new state. 
     *              If you use the name of an existing state, an error is thrown.
     * 
     * @param action an {@link Action} to perform when the state machine ends up in this state.
     * 
     * @returns this {@link StateMachine}
     */
    addState<I, O>(name: T, action: Action<I, O, T>) {
        if (this._isBuilt) {
            throw new Error("Can't add states after the machine was built")
        }

        if (name == null || typeof name !== 'string' || name.length === 0) {
            throw new Error(`Invalid state name ${name}`)
        }

        if (action == null || typeof action !== 'function') {
            throw new Error(`Invalid action function for state ${name}`)
        }

        if (this._actions.has(name)) {
            throw new Error(`State name ${name} was already defined`)
        }

        this._actions.set(name, action as any)

        if (!this._initialStateName) {
            this._initialStateName = name
        }

        return this
    }


    /**
     * @ignore
     * Actually starts the machine after it has been cloned.
     */
    private async _start<O>(initialInput?: any, initialState?: T):Promise<MachineOutput<T, O>> {
        if (this._isMoterMachine) {
            throw new Error('Cannot _start a mother machine')
        }
        const pack = <T>(d: T) => Array.isArray(d) ? d : [d]

        let input = initialInput

        const memories = new Map<T, []>()


        let previousState: T = undefined as unknown as T
        let currentState: T = initialState || this._initialStateName as T

        const getMemory = () => {
            let memory = memories.get(currentState)

            if (memory === undefined) {
                memory = []
                memories.set(currentState, memory)
            }

            return memory
        }


        while (currentState != null) {
            console.log('state:', currentState)

            const useMemory = makeUseMemory(getMemory())

            const action: Action<unknown, unknown, string> | undefined = this._actions.get(currentState);

            if (action === undefined) {
                throw new Error(`State '${currentState}' not found, received as output from state '${previousState}'`)
            }

            previousState = currentState;
            [currentState, input] = pack(await action(input, useMemory))

        }

        return {
            lastState: previousState,
            output: input
        }
    }


     /**
     * Start the state machine from the initial state.
     * Once started, the machine cannot be stopped untill it has reached the final state, or an error has occurred.
     * 
     * @template O the output type of the final state of the machine 
     * 
     * @param initialInput use this data as input to the initial state
     * 
     * @param initialState pass a `string` to override the name of initial state. 
     *  By default the first state added through {@link StateMachine.addState} is used as the initial state.
     *  
     * @returns a {@link Promise} that resolves to a {@link MachineOutput} object.  
     *  Any errors thrown by any state will cause this promise to reject with the error.
     */
    async start<O>(initialInput?: any, initialState?: T):Promise<MachineOutput<T, O>> {
        if (!this._isMoterMachine) {
            throw new Error('Cannot start a clone machine')
        }

        this._build()

        return await this._clone()._start(initialInput, initialState)
    }

    /**
     * @ignore
     * Create a clone of the mother machine
     */
    private _clone() {
        const clone = new StateMachine<T>()
        clone._isMoterMachine = false
        clone._isBuilt = true
        clone._actions = this._actions
        clone._initialStateName = this._initialStateName

        return clone
    }

    /**
     * Transform this state machine into an action function to be used in a state of another machine.
     * In other words, you can use this function to run an entire state machine as single state 
     * of another, bigger state machine.
     * This allows for an high degree of reusability.
     * 
     * Output from the outer machine will be forwarded as input to the initial state of this machine.
     * Output from this machine will be forwarded as input to the next state in the outer machine.
     * 
     * @template I the input type for the initial state
     * @template O the output type of the final state
     * @TT a stryng type representing all possible state names of the outer state machine
     *  
     * @param nextState either a `string` containing the next state to move to once the this machine 
     * as reached its final state, or a function that takes the name of the final state this machine reached
     * and returns a `string` representing the name of the next state.
     * 
     * @param initialState optionally override the name of the initial state of this machine.
     * 
     * @returns an action function that resolves when the machine reaches a final state.
     * 
     */
    toAction<I, O, TT extends string = string>(
        nextState?: TT | ((lastState: T) => TT),
        initialState?: T

    ): (input: I) => Promise<[TT | undefined, O]> {

        if (!this._isMoterMachine) {
            throw new Error("You cannot transform a clone machine into an action function, only mother machines can.")
        }

        this._build()

        return async (input: I) => {

            const { lastState, output } = (await this.start(input, initialState)) as { lastState: T, output: O }

            if (nextState === undefined || typeof nextState === 'string')
                return [nextState, output]

            else if (typeof nextState === 'function')
                return [nextState(lastState as T), output]

            else
                throw new Error("Invalid value for argument nextState")
        }
    }
}