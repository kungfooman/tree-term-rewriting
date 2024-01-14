import { Dot } from "./dot.js"
import { EulerTree, treeFromEulerTree } from "./tree.js"
import { TRSEquation, TRSRule } from "../trs/index.js"

export function ruleUrl(rewriteRule: TRSRule) {
    const dot = new Dot("Rewrite rule")
    dot.addTree("From", treeFromEulerTree(rewriteRule.from))
    dot.addTree("To", treeFromEulerTree(rewriteRule.to))
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`
}

export function equationUrl(rewriteRule: TRSEquation) {
    const dot = new Dot("Equation")
    dot.addTree("Lhs", treeFromEulerTree(rewriteRule.lhs))
    dot.addTree("Rhs", treeFromEulerTree(rewriteRule.rhs))
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`
}

export function treeUrl(tree: EulerTree) {
    const dot = new Dot("Tree")
    dot.addTree("T", treeFromEulerTree(tree))
    return `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`
}