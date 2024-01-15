import {Dot              } from "./dot.js";
import {treeFromEulerTree} from "./tree.js";
/** @typedef {import("../trs/index.js").TRSRule} TRSRule */
/** @typedef {import("../trs/index.js").TRSEquation} TRSEquation */
/** @typedef {import("./tree.js").EulerTree} EulerTree */
/**
 * @param {TRSRule} rewriteRule
 */
export function ruleUrl(rewriteRule) {
    const dot = new Dot("Rewrite rule");
    dot.addTree("From", treeFromEulerTree(rewriteRule.from));
    dot.addTree("To", treeFromEulerTree(rewriteRule.to));
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`;
}
/**
 * @param {TRSEquation} rewriteRule 
 * @returns {string}
 */
export function equationUrl(rewriteRule) {
    const dot = new Dot("Equation");
    dot.addTree("Lhs", treeFromEulerTree(rewriteRule.lhs));
    dot.addTree("Rhs", treeFromEulerTree(rewriteRule.rhs));
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`;
}
/**
 * @param {EulerTree} tree 
 * @returns {string}
 */
export function treeUrl(tree) {
    const dot = new Dot("Tree");
    dot.addTree("T", treeFromEulerTree(tree));
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`;
}
