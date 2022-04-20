import { extractISODate } from './time-format'

describe('Extract date part from iso datetime', () => {
  test('date of datetime', () => {
    expect(extractISODate('2021-11-04T18:55:55Z')).toBe('2021-11-04');
  });
});
