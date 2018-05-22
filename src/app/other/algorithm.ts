/** Make an array from 'arr' that contains only adjacently unique items. */
export function unique<T>(arr: Array<T>, equals_op: (a: T, b: T) => boolean): Array<T> {
  let result = new Array<T>();
  arr.forEach((t: T) => {
    if (result.length == 0 || !(equals_op(result[result.length - 1], t)))
      result.push(t);
  });
  return result;
}