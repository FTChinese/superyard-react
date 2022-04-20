import { extractDate } from './time-format'

describe('Extract date part from iso datetime', () => {
  test('date of datetime', () => {
    expect(extractDate('2021-11-04T18:55:55Z')).toBe('2021-11-04');
  });
});
