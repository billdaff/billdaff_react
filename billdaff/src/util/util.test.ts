import { getAge, slugify, splitList } from './util';

describe('getAge', () => {
  it.each([
    [new Date(2026, 0, 1), 38],
    [new Date(2026, 6, 10), 38],
    [new Date(2026, 6, 11), 39],
    [new Date(2026, 6, 20), 39],
    [new Date(2026, 11, 31), 39],
  ])('on %s is %i', (today, age) => {
    expect(getAge(today)).toBe(age);
  });
});

describe('splitList', () => {
  it('splits on commas and trims each item', () => {
    expect(splitList('React, PHP,MySQL ')).toEqual(['React', 'PHP', 'MySQL']);
  });

  it('drops empty items', () => {
    expect(splitList(', React,,')).toEqual(['React']);
  });
});

describe('slugify', () => {
  it('replaces spaces and dots and lowercases', () => {
    expect(slugify('Gamma.App Site')).toBe('gamma-app-site');
  });
});
