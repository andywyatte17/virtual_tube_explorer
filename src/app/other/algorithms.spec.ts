import { unique } from '../other/algorithm';
import { TestBed } from '@angular/core/testing';

describe('unique', () => {
  it('should return correct result for [1,1,2,2,3,4]', () => {
    let a = unique([1, 1, 2, 2, 3, 4], (a: number, b: number) => a == b);
    expect(a).toEqual([1, 2, 3, 4]);
  });

  it('should return correct result for [1,2,3,4]', () => {
    let a = unique([1, 2, 3, 4], (a: number, b: number) => a == b);
    expect(a).toEqual([1, 2, 3, 4]);
  });

  it('should return correct result for ["1","2","1","2","2","1"]', () => {
    let a = unique(["1", "2", "1", "2", "2", "1"], (a: string, b: string) => a == b);
    expect(a).toEqual(["1", "2", "1", "2", "1"]);
  });
});
