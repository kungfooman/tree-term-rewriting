What's the point of this function?

```ts
function numbersFirstLastOccurence(ns: number[]): NumbersFirstLastOccurence {
    const seen = new Set<number>() // whether a number has been seen before
    const isFirst: boolean[] = [] // whether each number is the first occurence
    const lastIndices: Record<number, number> = {} // number -> last index of number

    let i = 0;
    // Find the first ones by checking whether we've seen the number before.
    // Also keep track of the last index for each number
    for (const n of ns) {
        isFirst.push(!seen.has(n))
        seen.add(n)
        lastIndices[n] = i++
    }

    // Now build the last booleans by checking which indices are in lastIndices' values
    const isLast: boolean[] = []
    const lastIndicesSet = new Set<number>(Object.values(lastIndices))
    for (i = 0; i < ns.length; i++) {
        isLast.push(lastIndicesSet.has(i))
    }

    return { isFirst, isLast, lastIndices }
}
```

The point of this function is to find the indices of the first and last occurences of each number in a given array, and to return this information in a structured object. This is achieved by using a set to keep track of which numbers have been seen before, and an object to store the last index for each number. The function then iterates through the array, updating the appropriate data structures, and finally returns an object containing the isFirst and isLast flags, along with the lastIndices object. This information could be useful for performing other operations on the array, such as finding the index of the first or last occurrence of a specific number.

The function is very slow, can you optimize it?

Possible optimization could include using a map instead of an object for the lastIndices data structure, as maps have faster lookup times. Additionally, instead of iterating through the array twice, the function could be modified to only iterate through the array once, updating the isFirst, isLast, and lastIndices data structures as it goes. This would reduce the time complexity of the function from O(n^2) to O(n).