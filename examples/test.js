import {instance} from '../node_modules/@viz-js/viz/lib/viz-standalone.mjs';
import {kb, trs} from './ga.js';
import * as GA from './ga.js';
import * as TTR from 'tree-term-rewriting';
import {Dot, treeFromEulerTree} from "tree-term-rewriting";
export const viz = await instance();
async function start(trs) {
  /** @type {string[]} */
  const graphs1 = [];
  for (let i = 0; i < trs.rules.length; i++) {
      const rule = trs.rules[i];
      const dot = new Dot(`Rewrite rule ${i}`);
      dot.addTree("From", treeFromEulerTree(rule.from));
      dot.addTree("To", treeFromEulerTree(rule.to));
      graphs1.push(dot.text);
      // console.log(i, `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`);
  }
  /** @type {string[]} */
  const graphs2 = [];
  for (let i = 0; i < trs.equations.length; i++) {
      const equation = trs.equations[i];
      const dot = new Dot(`Equation ${i}`);
      dot.addTree("Lhs", treeFromEulerTree(equation.lhs));
      dot.addTree("Rhs", treeFromEulerTree(equation.rhs));
      graphs2.push(dot.text);
      // console.log(i, `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot.text)}`);
  }
  for (const graph of graphs1) {
    const button = document.createElement('button');
    button.textContent = "console.log(graph)";
    button.onclick = () => {
      console.log(graph);
    };
    const svg = viz.renderSVGElement(graph);
    const hr = document.createElement('hr');
    document.body.append(button, svg, hr);
  }
  live(trs);
  Object.assign(window, {graphs1, graphs2});
}
const button_GA_trs = document.createElement('button');
button_GA_trs.textContent = 'start(GA.trs)';
button_GA_trs.onclick = () => start(GA.trs);
const buttonStart = document.createElement('button');
buttonStart.textContent = 'Start';
buttonStart.onclick = () => {
  const newTrs = kb.complete(trs);
  start(newTrs);
};
document.body.append(button_GA_trs, buttonStart, document.createElement('hr'));
/**
 * @param {import('tree-term-rewriting').TermRewriteSystem} trs - The term rewrite system.
 */
function live(trs) {
  const input = document.createElement('input');
  input.style.width = '90vw';
  input.value = '~grade(a, 0) + grade(~grade(b, 2), 0) = grade(a, 0)';
  const div = document.createElement('div');
  input.oninput = () => {
    div.innerHTML = '';
    const {dot} = GA.simplifyGA(trs, input.value);
    div.append(viz.renderSVGElement(dot.text));
  }
  input.oninput();
  document.body.append('Input:', input, div);
}
Object.assign(window, {
  viz,
  GA,
  TTR,
  ...GA,
  ...TTR,
  live,
});
