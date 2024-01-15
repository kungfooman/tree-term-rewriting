/**
 * @template T
 * @param {IterableIterator<T>} iterable 
 * @param {(t: T) => void} fn 
 */
export function forEach(iterable, fn) {
  for (const item of iterable) {
    fn(item);
  }
}
/**
 * @template TIn
 * @template TOut
 * @param {IterableIterator<TIn>} iterable 
 * @param {(t: TIn) => TOut} fn 
 * @returns {IterableIterator<TOut>}
 */
export function* map(iterable, fn) {
  for (const item of iterable) {
    yield fn(item);
  }
}
/**
 * @template T
 * @param {IterableIterator<T>} iterable 
 * @param {(t: T) => boolean} fn 
 * @returns {boolean}
 */
export function any(iterable, fn) {
  for (const item of iterable) {
    if (fn(item)) {
      return true;
    }
  }
  return false;
}
/**
 * @template T
 * @param {IterableIterator<T>} iterable 
 * @param {(t: T) => boolean} fn 
 * @returns {boolean}
 */
export function all(iterable, fn) {
  for (const item of iterable) {
    if (!fn(item)) {
      return false;
    }
  }
  return true;
}
/**
 * @template T
 * @param {IterableIterator<T>} iterable 
 * @param {(t: T) => boolean} fn 
 * @returns {IterableIterator<T>}
 */
export function* filter(iterable, fn) {
  for (const item of iterable) {
    if (fn(item)) {
      yield item;
    }
  }
}
/**
 * @template T
 * @param {IterableIterator<IterableIterator<T>>} iterable 
 * @returns {IterableIterator<T>}
 */
export function* flatten(iterable) {
  for (const item of iterable) {
    yield* item;
  }
}
/**
 * @template TIn
 * @template TOut
 * @param {IterableIterator<TIn>} iterable 
 * @param {(t: TIn) => IterableIterator<TOut>} fn 
 * @returns {IterableIterator<TOut>}
 */
export function* flatMap(iterable, fn) {
  yield* flatten(map(iterable, fn));
}
/**
 * @template T
 * @param {IterableIterator<T>} iterable 
 * @returns {T | undefined}
 */
export function first(iterable) {
  const t = iterable.next();
  if (!t.done) {
    return t.value;
  }
}
