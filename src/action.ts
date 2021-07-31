import { UseMemory } from "./useMemory";

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
 export type Action<I, O, T extends string> = (input:I, useMemory:UseMemory) =>
 T | void
 | [T | void]
 | [T | void, O]
 | Promise<T | void
     | [T | void]
     | [T | void, O]>