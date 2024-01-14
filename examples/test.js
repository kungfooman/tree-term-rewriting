import {instance} from '../node_modules/@viz-js/viz/lib/viz-standalone.mjs';
import * as GA from './ga.js';
import * as TTR from 'tree-term-rewriting';
export const viz = await instance();
async function start() {
  for (const graph of GA.graphs1) {
    const button = document.createElement('button');
    button.textContent = "console.log(graph)";
    button.onclick = () => {
      console.log(graph);
    };
    const svg = viz.renderSVGElement(graph);
    const hr = document.createElement('hr');
    document.body.append(button, svg, hr);
  }
}
const buttonStart = document.createElement('button');
buttonStart.textContent = 'Start';
buttonStart.onclick = start;
document.body.append(buttonStart, document.createElement('hr'));
function live() {
  const input = document.createElement('input');
  input.style.width = '90vw';
  input.value = '~grade(a, 0) + grade(~grade(b, 2), 0) = grade(a, 0)';
  const div = document.createElement('div');
  input.oninput = () => {
    div.innerHTML = '';
    const {dot} = GA.simplifyGA(input.value);
    div.append(viz.renderSVGElement(dot.text));
  }
  input.oninput();
  document.body.append('Input:', input, div);
}
live();
Object.assign(window, {
  viz,
  ...GA,
  ...TTR,
});
