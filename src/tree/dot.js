import {depthFirst} from "./tree.js";
import {forEach   } from "../generatorutil.js";
/** @typedef {import("./tree.js").TreeNode} TreeNode */
export class Dot {
    _text = "";
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.addLine(`digraph ${name.replaceAll(" ", "")} {`)
        this.addLine(`    label="${name}";`)
    }
    /**
     * @private
     * @param {string} line 
     */
    addLine(line) {
        this._text += `${line}\n`
    }
    /**
     * @param {string} name 
     * @param {TreeNode} root 
     */
    addTree(name, root) {
        this.addLine(`    subgraph cluster_${name.replaceAll(" ", "")} {`)
        this.addLine("        style=filled;")
        this.addLine(`        label="${name}";`)
        forEach(depthFirst(root), node => {
            this.addLine(`        ${node.index} [label="${node.value}"];`)
            node.children.forEach(child => this.addLine(`        ${node.index} -> ${child.index};`))
        })
        this.addLine("    }")
    }
    /**
     * @type {string}
     */
    get text() {
        return `${this._text}}`
    }
}
