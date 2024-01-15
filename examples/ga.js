import {
    Dot, KnuthBendixCompletion, LexicographicPathOrdering, parseExpression,
    makeEulerTree, treeFromEulerTree, applyRules
} from "tree-term-rewriting";
/**
 * @typedef {import('tree-term-rewriting').EulerTree} EulerTree
 * @typedef {import('tree-term-rewriting').TermRewriteSystem} TermRewriteSystem
 */
export const lpo = new LexicographicPathOrdering(["~", "-", "!", "grade", "*", "^", "+", "="])
export const kb = new KnuthBendixCompletion(lpo)
/**
 * @param {[string, string][]} equationStrs 
 * @returns {TermRewriteSystem}
 */
function parseTrs(equationStrs) {
    /** @type {TermRewriteSystem} */
    const trs = {
        equations: [],
        rules: []
    }
    for (const equationStr of equationStrs) {
        const lhs = makeEulerTree(parseExpression(equationStr[0]))
        const rhs = makeEulerTree(parseExpression(equationStr[1]))
        rhs.indexChain = rhs.indexChain.map(index => index + 1000)
        const complexityComparison = lpo.compare(treeFromEulerTree(lhs), treeFromEulerTree(rhs))
        if (complexityComparison === 0) {
            trs.equations.push({ lhs, rhs })
        } else if (complexityComparison > 0) {
            trs.rules.push({ from: lhs, to: rhs })
        } else {
            trs.rules.push({ from: rhs, to: lhs })
        }
    }

    return trs
}
export const trs = parseTrs([
    ["grade($x, 0) + grade($y, 0)", "grade($x + $y, 0)"], // grade 0 distr
    ["grade($x, 2) + grade($y, 2)", "grade($x + $y, 2)"], // grade 2 distr
    ["grade(0, $n)", "0"],
    ["grade(0, 0)", "0"],
    ["grade(1, 0)", "1"],

    ["0 + $x", "$x"], // + null
    ["$x + 0", "$x"], // + null
    ["-$x + $x", "0"], // + inv
    ["--$x", "$x"],

    ["($x + $y) + $z", "$x + ($y + $z)"], // + assoc

    ["1 * $x", "$x"], // * id
    ["$x * 1", "$x"], // * id
    ["0 * $x", "0"], // * null
    ["$x * 0", "0"], // * null

    ["($a * $b) * $c", "$a * ($b * $c)"], // * assoc

    ["grade(-$x, $n)", "-grade($x, $n)"],

    ["grade(grade($x, $n), $n)", "grade($x, $n)"], // grade idempotent
    ["grade(grade($x, 0), 2)", "0"],
    ["grade(grade($x, 2), 0)", "0"],

    ["-(grade($x, 2) * grade($y, 2))", "grade($y, 2) * grade($x, 2)"], // bivector mul anticomm
    ["grade($x, 2) * grade($y, 1)", "grade($x * grade($y, 1), 2)"], // bivector mul scalar

    ["~($x + $y)", "~$x + ~$y"], // rev distr
    ["~~$x", "$x"],
    ["-~$x", "~-$x"],
    ["~grade($x, 0)", "grade($x, 0)"],
    ["~grade($x, 2)", "-grade($x, 2)"],
    ["grade(~$x, 0)", "grade($x, 0)"],
    ["grade(~$x, 2)", "-grade($x, 2)"],

    ["$x + $c = $y + $c", "$x = $y"],
    ["$x * $c = $y * $c", "$x = $y"],
    ["$x = $x", "true"],
]);
/**
 * @example
 * const {dot} = simplifyGA('~grade(a, 0) + grade(~grade(b, 2), 0) = grade(a, 0)');
 * document.body.append(viz.renderSVGElement(dot.text));
 * @param {TermRewriteSystem} newTrs - The term rewrite system.
 * @param {string} str - The input string.
 */
export function simplifyGA(newTrs, str) {
    const treeNode = parseExpression(str);
    const input = makeEulerTree(treeNode);
    const simplified = applyRules(input, newTrs, lpo);
    simplified.indexChain = simplified.indexChain.map(idx => idx + 10000);
    const dot = new Dot(`Simplify equation`);
    dot.addTree("Input", treeFromEulerTree(input));
    dot.addTree("Simplified", treeFromEulerTree(simplified));
    // console.log(`Simplified: https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`);
    return {treeNode, input, simplified, dot};
}
