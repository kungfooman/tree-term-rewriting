import {instance} from './node_modules/@viz-js/viz/lib/viz-standalone.mjs';
import {graphs1, graphs2} from './dist/examples/ga.js';
export const viz = await instance();
async function start() {
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
}
const buttonStart = document.createElement('button');
buttonStart.textContent = 'Start';
buttonStart.onclick = start;
document.body.append(buttonStart, document.createElement('hr'));
Object.assign(window, {
  viz,
  graphs1,
  graphs2
});
