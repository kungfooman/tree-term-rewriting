import {sequenceEqual} from "../util.js";
/** @typedef {import("../tree/tree.js").EulerTree} EulerTree */
/** @typedef {import("../tree/tree.js").TreeNode} TreeNode */
/**
 * @typedef {object} RewriteRule
 * @property {TreeNode} from
 * @property {TreeNode} to
 */
/**
 * @typedef {object} EulerRewriteRule
 * @property {EulerTree} from
 * @property {EulerTree} to
 * @property {boolean} [applicationMustSimplify]
 */
/**
 * @typedef {object} TRSEquation
 * @property {EulerTree} lhs
 * @property {EulerTree} rhs
 */
/**
 * @typedef {object} TRSRule
 * @property {EulerTree} from
 * @property {EulerTree} to
 * @property {TRSEquation} [fromEquation]
 */
/**
 * @typedef {object} TermRewriteSystem
 * @property {TRSEquation[]} equations
 * @property {TRSRule[]} rules
 */
/**
 * @typedef {object} TermRewriteSystemChange
 * @property {TRSRule} [addRule]
 * @property {TRSRule} [removeRule]
 * @property {TRSEquation} [addEquation]
 * @property {TRSEquation} [removeEquation]
*/
/**
 * @param {TermRewriteSystem} trsA 
 * @param {TermRewriteSystem} trsB 
 * @returns {boolean}
 */
export function trsEqual(trsA, trsB) {
  return trsA.equations.every(eqA   => trsB.equations.some(eqB   => equationsEqual(eqA, eqB))) &&
         trsA.rules  .every(ruleA => trsB.rules  .some(ruleB => rulesEqual(ruleA, ruleB)))
}
/**
 * @param {TRSEquation} eqA 
 * @param {TRSEquation} eqB 
 * @returns {boolean}
 */
export function equationsEqual(eqA, eqB) {
  const canonicalA = makeEquationVariablesCanonical(eqA)
  const canonicalB = makeEquationVariablesCanonical(eqB)
  return sequenceEqual(canonicalA.lhs.valueChain, canonicalB.lhs.valueChain) &&
         sequenceEqual(canonicalA.rhs.valueChain, canonicalB.rhs.valueChain)
}
/**
 * @param {TRSRule} ruleA 
 * @param {TRSRule} ruleB 
 * @returns {boolean}
 */
export function rulesEqual(ruleA, ruleB) {
  const canonicalA = makeRuleVariablesCanonical(ruleA)
  const canonicalB = makeRuleVariablesCanonical(ruleB)
  return sequenceEqual(canonicalA.from.valueChain, canonicalB.from.valueChain) &&
         sequenceEqual(canonicalA.to.valueChain  , canonicalB.to.valueChain  );
}
/**
 * @param {TRSEquation} equation 
 * @returns {TRSEquation}
 */
export function makeEquationVariablesCanonical(equation) {
  /** @type {Record<string, string>} */
  const variableNameMap = {};
  /** @type {Set<string>} */
  const variableNames = new Set(equation.lhs.valueChain.concat(equation.rhs.valueChain).filter(x => x.startsWith("$")))
  let nextVariableIndex = 0
  for (const variableName of variableNames) {
    variableNameMap[variableName] = `$${nextVariableIndex++}`
  }
  /**
   * @param {EulerTree} eulerTree 
   */
  const subVars = (eulerTree) => {
    eulerTree.valueChain = eulerTree.valueChain.map(x => x in variableNameMap ? variableNameMap[x] : x)
  };
  const canonical = {
    lhs: {
      indexChain: [...equation.lhs.indexChain],
      valueChain: [...equation.lhs.valueChain],
    },
    rhs: {
      indexChain: [...equation.rhs.indexChain],
      valueChain: [...equation.rhs.valueChain],
    },
  };
  subVars(canonical.lhs);
  subVars(canonical.rhs);
  return canonical;
}
/**
 * @param {TRSRule} rule 
 * @returns {TRSRule}
 */
export function makeRuleVariablesCanonical(rule) {
  /** @type {Record<string, string>} */
  const variableNameMap = {};
  /** @type {Set<string>} */
  const variableNames = new Set(rule.from.valueChain.concat(rule.to.valueChain).filter(x => x.startsWith("$")))
  let nextVariableIndex = 0;
  for (const variableName of variableNames) {
    variableNameMap[variableName] = `$${nextVariableIndex++}`;
  }
  /**
   * @param {EulerTree} eulerTree 
   */
  const subVars = (eulerTree) => {
    eulerTree.valueChain = eulerTree.valueChain.map(x => x in variableNameMap ? variableNameMap[x] : x)
  }
  const canonical = {
    from: {
      indexChain: [...rule.from.indexChain],
      valueChain: [...rule.from.valueChain],
    },
    to: {
      indexChain: [...rule.to.indexChain],
      valueChain: [...rule.to.valueChain],
    },
  };
  subVars(canonical.from);
  subVars(canonical.to);
  return canonical;
}
/**
 * @param {TermRewriteSystem} trs 
 * @returns {TRSRule[]}
 */
export function getTrsRules(trs) {
  /** @type {TRSRule[]} */
  const equationRules = trs.equations.flatMap(eq => [
    {from: eq.lhs, to: eq.rhs, fromEquation: eq},
    {from: eq.rhs, to: eq.lhs, fromEquation: eq},
  ])
  return trs.rules.concat(equationRules);
}
/**
 * @param {TermRewriteSystemChange} change 
 * @returns {boolean}
 */
export function isChangeEmpty(change) {
  return change.addEquation    !== undefined ||
         change.addRule        !== undefined ||
         change.removeEquation !== undefined ||
         change.removeRule     !== undefined;
}
/**
 * @param {TermRewriteSystemChange} changeA 
 * @param {TermRewriteSystemChange} changeB 
 * @returns {boolean}
 */
export function isChangePairEmpty(changeA, changeB) {
  return (changeA.addEquation === undefined || changeB.removeEquation === changeA.addEquation) &&
         (changeA.addRule     === undefined || changeB.removeRule     === changeA.addRule    );
}
/**
 * @param {TermRewriteSystem} trs 
 * @param {TermRewriteSystemChange} change 
 * @returns {TermRewriteSystem}
 */
export function applyChange(trs, change) {
  /** @type {TermRewriteSystem} */
  const newTrs = {
    equations: trs.equations.filter(eq => !change.removeEquation || !equationsEqual(eq, change.removeEquation)),
    rules: trs.rules.filter(rule => !change.removeRule || !rulesEqual(rule, change.removeRule))
  }
  if (change.addEquation) {
    newTrs.equations.push(change.addEquation);
  }
  if (change.addRule) {
    newTrs.rules.push(change.addRule);
  }
  return newTrs;
}
