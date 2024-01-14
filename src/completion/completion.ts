import { TermRewriteSystem } from "../trs/index.js";

export interface Completion {
    complete(trs: TermRewriteSystem): TermRewriteSystem
}
