/** @typedef {import("./tree.js").EulerTree} EulerTree */
/**
 * @param {EulerTree} tree 
 * @returns {EulerTree}
 */
export function replaceVariables(tree) {
    const replaced = {...tree};
    replaced.valueChain = replaced.valueChain.map(v => v.replaceAll("$", ""));
    return replaced;
}
/**
 * @param {EulerTree} tree 
 * @param {string} postfix 
 * @returns {EulerTree}
 */
export function postfixVariables(tree, postfix) {
    const replaced = {...tree};
    replaced.valueChain = replaced.valueChain.map(v => v.replaceAll("$", "") + (v.startsWith("$") ? postfix : ""));
    return replaced;
}
/**
 * @param {EulerTree} tree 
 * @param {string} postfix 
 * @returns {EulerTree}
 */
export function makePostfixesVariables(tree, postfix) {
    const replaced = {...tree};
    replaced.valueChain = replaced.valueChain.map(v => (v.endsWith(postfix) ? "$" : "") + v.replaceAll(postfix, ""));
    return replaced;
}
