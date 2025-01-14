import { describe, it, expect } from 'vitest';
import { formatTime } from './utils';

describe('formatTime', () => {
  it('formats seconds correctly for standard cases', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(61)).toBe('01:01');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(86400)).toBe('1440:00'); // Edge case: full day in seconds
  });

  it('formats decimal seconds by flooring to the nearest whole number', () => {
    expect(formatTime(61.5)).toBe('01:01');
    expect(formatTime(59.9)).toBe('00:59');
    expect(formatTime(0.1)).toBe('00:00'); // Very small decimal
  });

  it('handles large numbers', () => {
    expect(formatTime(100000)).toBe('1666:40'); // Large duration
  });

  it('handles edge cases for time boundaries', () => {
    expect(formatTime(59)).toBe('00:59'); // Just under a minute
    expect(formatTime(60)).toBe('01:00'); // Exactly one minute
    expect(formatTime(3600)).toBe('60:00'); // Exactly one hour
  });
});
