/**
 * @template T
 * @param {T[]} a 
 * @param {T[]} b 
 * @returns {boolean}
 */
export function sequenceEqual(a, b) {
  return a.length === b.length && a.every((aItem, i) => aItem === b[i]);
}
/**
 * @template T
 * @param {T[]} a 
 * @param {T[]} sub
 * @param {number} startIndex
 * @returns {boolean}
 */
export function subsequenceEqual(a, sub, startIndex) {
  return sequenceEqual(a.slice(startIndex, startIndex + sub.length), sub);
}
/**
 * @template T
 * @param {T[]} items 
 * @returns {Generator<T[]>}
 */
export function* pairCombinations(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      yield [items[i], items[j]];
    }
  }
}
/**
 * @template T
 * @param {T[]} items 
 */
export function* pairPermutations(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      yield [items[i], items[j]];
    }
  }
}
/**
 * @template T
 * @param {T[]} items 
 */
export function* pairCombinationsWithReplacement(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i; j < items.length; j++) {
      yield [items[i], items[j]];
    }
  }
}
