import { describe, it, expect } from 'vitest';
import { formatPhoneInput, cleanPhoneNumber } from '../lib/utils';

describe('Phone Input Mask', () => {
  describe('formatPhoneInput', () => {
    it('should auto-prefix +33 when user types 0', () => {
      expect(formatPhoneInput('0')).toBe('+33');
      expect(formatPhoneInput('06')).toBe('+33 6');
      expect(formatPhoneInput('0612')).toBe('+33 6 12');
      expect(formatPhoneInput('0612345678')).toBe('+33 6 12 34 56 78');
    });

    it('should auto-prefix +33 when user types a digit', () => {
      expect(formatPhoneInput('6')).toBe('+33 6');
      expect(formatPhoneInput('612')).toBe('+33 6 12');
      expect(formatPhoneInput('612345678')).toBe('+33 6 12 34 56 78');
    });

    it('should format with spaces correctly', () => {
      expect(formatPhoneInput('+336')).toBe('+33 6');
      expect(formatPhoneInput('+3361')).toBe('+33 6 1');
      expect(formatPhoneInput('+33612')).toBe('+33 6 12');
      expect(formatPhoneInput('+336123')).toBe('+33 6 12 3');
      expect(formatPhoneInput('+3361234')).toBe('+33 6 12 34');
      expect(formatPhoneInput('+33612345')).toBe('+33 6 12 34 5');
      expect(formatPhoneInput('+336123456')).toBe('+33 6 12 34 56');
      expect(formatPhoneInput('+3361234567')).toBe('+33 6 12 34 56 7');
      expect(formatPhoneInput('+33612345678')).toBe('+33 6 12 34 56 78');
    });

    it('should limit to 9 digits after +33', () => {
      expect(formatPhoneInput('+336123456789')).toBe('+33 6 12 34 56 78');
      expect(formatPhoneInput('+3361234567890')).toBe('+33 6 12 34 56 78');
    });

    it('should remove non-numeric characters except +', () => {
      expect(formatPhoneInput('+33 6 12 34 56 78')).toBe('+33 6 12 34 56 78');
      expect(formatPhoneInput('+33-6-12-34-56-78')).toBe('+33 6 12 34 56 78');
      expect(formatPhoneInput('+33.6.12.34.56.78')).toBe('+33 6 12 34 56 78');
      expect(formatPhoneInput('+33 (6) 12-34.56 78')).toBe('+33 6 12 34 56 78');
    });

    it('should handle empty input', () => {
      expect(formatPhoneInput('')).toBe('');
    });

    it('should handle partial input', () => {
      expect(formatPhoneInput('+')).toBe('+');
      expect(formatPhoneInput('+3')).toBe('+3');
      expect(formatPhoneInput('+33')).toBe('+33');
    });
  });

  describe('cleanPhoneNumber', () => {
    it('should remove all spaces', () => {
      expect(cleanPhoneNumber('+33 6 12 34 56 78')).toBe('+33612345678');
      expect(cleanPhoneNumber('+33   6   12   34   56   78')).toBe('+33612345678');
    });

    it('should handle numbers without spaces', () => {
      expect(cleanPhoneNumber('+33612345678')).toBe('+33612345678');
    });

    it('should handle empty input', () => {
      expect(cleanPhoneNumber('')).toBe('');
    });
  });
});
