import { Ordering } from "../ordering/index.js";
import {eulerTreeSubstitute, treeFromEulerTree} from '../tree/tree.js';
import {sequenceEqual                         } from '../util.js';
import {getTrsRules                           } from './trs.js';
/**
 * @typedef {import("../tree/tree.js").EulerTree} EulerTree
 * @typedef {import("./trs.js").EulerRewriteRule} EulerRewriteRule
 * @typedef {import("./trs.js").TermRewriteSystem} TermRewriteSystem
 */
/**
 * @param {EulerTree} input 
 * @param {TermRewriteSystem} trs 
 * @param {Ordering} ordering 
 * @param {number} [maxIters] 
 * @returns {EulerTree}
 */
export function applyRules(input, trs, ordering, maxIters) {
    let rewritten = {
        indexChain: [...input.indexChain],
        valueChain: [...input.valueChain]
    };
    for (let i = 0; maxIters === undefined || i < maxIters; i++) {
        const rewriteResults = rewrite(rewritten, trs, ordering);
        if (rewriteResults) {
            rewritten = rewriteResults.rewritten;
        } else {
            break;
        }
    }
    return rewritten;
}
/**
 * @typedef RewriteResults
 * @property {EulerRewriteRule} rule
 * @property {EulerTree} rewritten
 */
/**
 * @param {EulerTree} input 
 * @param {TermRewriteSystem} trs 
 * @param {Ordering} ordering 
 * @returns {RewriteResults | undefined}
 */
export function rewrite(input, trs, ordering) {
    // Apply all rules once
    for (const rule of getTrsRules(trs)) {
        const rewritten = eulerTreeSubstitute(input, rule.from, rule.to);
        // Only allow rules from equations if they decrease complexity after substitution.
        // Also check that applying the rule actually changed something.
        if ((!rule.fromEquation || ordering.compare(treeFromEulerTree(rewritten), treeFromEulerTree(input)) < 0) &&
            !sequenceEqual(input.valueChain, rewritten.valueChain)) {
            return {rewritten, rule};
        }
    }
}
