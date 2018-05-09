export function unique<T>(arr: Array<T>, equals_op: (a: T, b: T) => boolean): Array<T> {
  return arr;
  /*
  let result = new Array<T>();
  if (!arr || arr.length == 1)
    return arr;
  let read = 0;
  let write = 0;
  let end = arr.length;
  result.push(arr[read]);
  read += 1;
  while (true) {
    if (read == end)
      break;
    if (equals_op(result[write], arr[read]))
      read += 1;
    else {
      // console.dir(arr[read]); console.dir(result[write]);
      result.push(arr[read]);
      read += 1;
      write += 1;
    }
  }
  return result;
  */
}