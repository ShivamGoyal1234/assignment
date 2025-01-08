import { formatCurrency } from "../utils/formatters";

describe('formatCurrency', () => {
  test('formats millions correctly', () => {
    expect(formatCurrency(1500000)).toBe('$1.50M');
    expect(formatCurrency(2750000)).toBe('$2.75M');
  });

  test('formats thousands correctly', () => {
    expect(formatCurrency(15000)).toBe('$15.00K');
    expect(formatCurrency(2750)).toBe('$2.75K');
  });

  test('formats regular numbers correctly', () => {
    expect(formatCurrency(150)).toBe('$150.00');
    expect(formatCurrency(27.5)).toBe('$27.50');
  });
});