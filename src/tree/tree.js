import { AhoCorasick } from "../matching/ahocorasick.js";
import { sequenceEqual, subsequenceEqual } from "../util.js";
/** @typedef {object} TreeNode
 * @property {number} index
 * @property {string} value
 * @property {TreeNode[]} children
 */
/**
 * @param {TreeNode} root 
 * @returns {IterableIterator<TreeNode>}
 */
export function* depthFirst(root) {
    const nodeStack = [root];
    while (nodeStack.length > 0) {
        /** @type {TreeNode} */
        // @ts-ignore
        const node = nodeStack.pop();
        yield node;
        for (const child of node.children) {
            nodeStack.push(child);
        }
    }
}
/**
 * @param {TreeNode} root 
 * @returns {TreeNode[]}
 */
export function eulerTour(root) {
    /** @type {TreeNode[]} */
    const chain = [];
    /**
     * @param {TreeNode} node 
     * @param {TreeNode} [parent] 
     */
    function recurse(node, parent) {
        chain.push(node);
        node.children.forEach(child => recurse(child, node));
        if (parent) {
            chain.push(parent);
        }
    }
    recurse(root);
    return chain;
}
/**
 * @param {EulerTree} eulerTree 
 * @returns {TreeNode}
 */
export function treeFromEulerTree(eulerTree) {
    /** @type {TreeNode} */
    const root = {
        index: eulerTree.indexChain[0],
        value: eulerTree.valueChain[0],
        children: [],
    }
    /** @type {TreeNode[]} */
    const parents = [];
    /** @type {TreeNode} */
    let currentNode = root;
    for (let i = 1; i < eulerTree.indexChain.length; i++) {
        if (parents.length !== 0 && eulerTree.indexChain[i] === parents[parents.length - 1].index) {
            const parentNode = parents.pop();
            // @ts-ignore
            currentNode = parentNode;
        } else {
            /** @type {TreeNode} */
            const newNode = {
                index: eulerTree.indexChain[i],
                value: eulerTree.valueChain[i],
                children: []
            };
            currentNode.children.push(newNode)
            parents.push(currentNode)
            currentNode = newNode
        }
    }
    return root;
}
/**
 * @typedef {object} EulerTree
 * @property {number[]} indexChain
 * @property {string[]} valueChain
 */
/**
 * @param {TreeNode} root 
 * @returns {EulerTree}
 */
export function makeEulerTree(root) {
    const tour = eulerTour(root)
    return {
        indexChain: tour.map(node => node.index),
        valueChain: tour.map(node => node.value),
    }
}
/**
 * @typedef {object} NumbersFirstLastOccurence
 * @property {boolean[]} isFirst
 * @property {boolean[]} isLast
 * @property {Record<number, number>} lastIndices
 */
/**
 * @todo optimize this function...
 * @param {number[]} ns 
 * @returns {NumbersFirstLastOccurence}
 */
function numbersFirstLastOccurence(ns) {
    /**
     * Whether a number has been seen before.
     * @type {Set<number>}
     */
    const seen = new Set(); // 
    /**
     * Whether each number is the first occurence.
     * @type {boolean[]}
     */
    const isFirst = [];
    /**
     * number -> last index of number
     * @type {Record<number, number>}
     */
    const lastIndices = {};
    let i = 0;
    // Find the first ones by checking whether we've seen the number before.
    // Also keep track of the last index for each number
    for (const n of ns) {
        isFirst.push(!seen.has(n));
        seen.add(n);
        lastIndices[n] = i++;
    }
    // Now build the last booleans by checking which indices are in lastIndices' values
    /** @type {boolean[]} */
    const isLast = [];
    /** @type {Set<number>} */
    const lastIndicesSet = new Set(Object.values(lastIndices));
    for (i = 0; i < ns.length; i++) {
        isLast.push(lastIndicesSet.has(i));
    }
    return {isFirst, isLast, lastIndices};
}
/**
 * @typedef {object} SplitByVariables
 * @property {string[]} variables
 * @property {string[][]} patterns
 */
/**
 * @param {string[]} valueChain 
 * @returns {SplitByVariables}
 */
function splitByVariables(valueChain) {
    /** @type {string[]} */
    const variables = [];
    /** @type {string[][]} */
    const patterns = [];
    /** @type {string[]} */
    let currentPattern = [];
    for (const value of valueChain) {
        if (value.startsWith("$")) {
            patterns.push(currentPattern);
            currentPattern = [];
            variables.push(value);
        } else {
            currentPattern.push(value);
        }
    }
    patterns.push(currentPattern);
    return {patterns, variables};
}
/**
 * @template T
 * @param {T[]} input 
 * @param {T[]} match 
 * @param {number} [startIndex] 
 * @returns {number}
 */
function indexOfSequence(input, match, startIndex) {
    for (let i = (startIndex ?? 0); i < input.length; i++) {
        if (subsequenceEqual(input, match, i)) {
            return i;
        }
    }
    return -1;
}
/**
 * @template T
 * @param {T[]} input 
 * @param {T[]} match 
 * @param {T[]} replacement 
 * @returns {T[]}
 */
function replaceSequence(input, match, replacement) {
    let index = 0;
    let output = [...input];
    while (true) {
        index = indexOfSequence(output, match, index);
        if (index !== -1) {
            output = output.slice(0, index).concat(replacement).concat(output.slice(index + match.length));
        } else {
            break;
        }
        index++;
    }
    return output;
}
/**
 * @param {EulerTree} input 
 * @param {EulerTree} pattern 
 * @returns {IterableIterator<Record<string, EulerTree>>}
 */
export function* eulerTreePatternMatch(input, pattern) {
    const inputOccurences = numbersFirstLastOccurence(input.indexChain);
    const {patterns, variables} = splitByVariables(pattern.valueChain);
    //console.log("[Pattern Match] patterns:", patterns, "original pattern:", pattern)
    const matcher = new AhoCorasick(patterns);
    /** @type {Record<number, Set<string>>} */
    const matches = {};
    for (const ahoMatch of matcher.search(input.valueChain)) {
        for (const ahoMatchPattern of ahoMatch[1]) {
            const pattern = ahoMatchPattern.join("|")
            const index = ahoMatch[0] - ahoMatchPattern.length + 1
            if (index in matches) {
                matches[index].add(pattern);
            } else {
                matches[index] = new Set([pattern]);
            }
        }
    }
    for (let i = 0; i < input.valueChain.length; i++) {
        /** @type {Record<string, EulerTree>} */
        const subs = {};
        let j = i;
        let fail = false;
        for (let p = 0; p < patterns.length; p++) {
            const pattern = patterns[p]

            if (j in matches && matches[j].has(pattern.join("|"))) {
                // For the last pattern we only care that we match, there is no variable substitution after that
                if (p + 1 < patterns.length) {
                    // Check that the first node of the substitution occured here the first time
                    if (inputOccurences.isFirst[j + pattern.length] || p + 1 >= patterns.length) {
                        const nextNodeIndex = input.indexChain[j + pattern.length]

                        // The substitute is the chain from the next index to the last occurence of the node of the next index (including it)
                        /** @type {EulerTree} */
                        const sub = {
                            valueChain: input.valueChain.slice(j + pattern.length, inputOccurences.lastIndices[nextNodeIndex] + 1),
                            indexChain: input.indexChain.slice(j + pattern.length, inputOccurences.lastIndices[nextNodeIndex] + 1),
                        }
                        const variable = variables[p]

                        // Either there is no substitute for the variable yet or the substitute matches the existing one
                        if (!(variable in subs) || sequenceEqual(subs[variable].valueChain, sub.valueChain)) {
                            subs[variable] = sub
                            j += pattern.length + sub.valueChain.length
                        } else {
                            // Inconsistent substitution, doesn't match the old substitution
                            fail = true
                            break
                        }
                    } else {
                        fail = true
                        break
                    }
                }
            } else {
                fail = true
                break
            }
        }

        if (!fail) {
            yield subs
        }
    }
}
/**
 * @param {EulerTree} input 
 * @param {EulerTree} pattern 
 * @param {EulerTree} substitute 
 * @returns {EulerTree}
 */
export function eulerTreeSubstitute(input, pattern, substitute) {
    const firstSubsIter = eulerTreePatternMatch(input, pattern).next();
    /** @type {EulerTree} */
    const output = {
        indexChain: [...input.indexChain],
        valueChain: [...input.valueChain],
    }

    // No matches found
    if (firstSubsIter.done) {
        return output
    }

    const firstSubs = firstSubsIter.value

    // 1. Insert the variable substitutes into the pattern and substitute.
    // - In the pattern we only need to replace in the value chain.
    // - In the substitute we need to replace in the value chain but we also 
    //   need to make up new unique indices for each node in the substitute 
    //   to fit into the original.
    let patternValueChainSubstituted = pattern.valueChain

    let rndStart = Math.floor(Math.random() * 10000000)

    // Tree to substitute in for the pattern
    /** @type {EulerTree} */
    const substitutedSubstituteTree = {
        indexChain: substitute.indexChain.map(idx => idx + rndStart), // TODO: Make sure indices are not present in the input already
        valueChain: substitute.valueChain
    };
    // Replace all variables in the pattern and substitute tree with the matched parts in the input for the variables
    for (const [subVariable, subTree] of Object.entries(firstSubs)) {
        // Replace variable in pattern with matched part of input
        patternValueChainSubstituted = replaceSequence(patternValueChainSubstituted, [subVariable], subTree.valueChain)

        // Replace variable in substitute tree with matched part of input
        let index = 0
        while (true) {
            index = substitutedSubstituteTree.valueChain.indexOf(subVariable, index)
            if (index === -1) {
                break
            }

            rndStart = Math.floor(Math.random() * 10000000)
            substitutedSubstituteTree.valueChain = substitutedSubstituteTree.valueChain.slice(0, index)
                .concat(subTree.valueChain)
                .concat(substitutedSubstituteTree.valueChain.slice(index + 1))
            substitutedSubstituteTree.indexChain = substitutedSubstituteTree.indexChain.slice(0, index)
                .concat(subTree.indexChain.map(idx => idx + rndStart))
                .concat(substitutedSubstituteTree.indexChain.slice(index + 1))

            patternValueChainSubstituted = replaceSequence(patternValueChainSubstituted, [subVariable], subTree.valueChain)

            index += subTree.valueChain.length
        }
    }

    // 2. Replace all occurences of the substituted pattern with the substituted substitute.
    let index = 0
    while (true) {
        index = indexOfSequence(output.valueChain, patternValueChainSubstituted, index)
        if (index === -1) {
            break
        }

        rndStart = Math.floor(Math.random() * 10000000)
        output.valueChain = output.valueChain.slice(0, index)
            .concat(substitutedSubstituteTree.valueChain)
            .concat(output.valueChain.slice(index + patternValueChainSubstituted.length))
        output.indexChain = output.indexChain.slice(0, index)
            .concat(substitutedSubstituteTree.indexChain.map(idx => idx + rndStart))
            .concat(output.indexChain.slice(index + patternValueChainSubstituted.length))
        index += substitutedSubstituteTree.valueChain.length
    }
    return output;
}
