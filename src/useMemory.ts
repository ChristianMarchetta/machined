export type UseMemory = <T>(initialValue: T) => readonly [T, (v: T) => void]

export const makeUseMemory = (memory: unknown[]) => {

    let index = 0

    return <T>(initialValue: T) => {
        const staticIndexCopy = index;
        index ++;
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