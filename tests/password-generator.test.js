/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const pg = require('../src/features/password-generator/script.js');

describe('Password Generator Logic', () => {
  const defaultOptions = {
    length: 12,
    quantity: 1,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true,
    excludeAmbiguous: false,
    easySay: false
  };

  it('should generate password of correct length', () => {
    const res = pg.generatePasswordsLogic(defaultOptions);
    expect(res).toHaveLength(1);
    expect(res[0]).toHaveLength(12);
  });

  it('should exclude ambiguous characters when requested', () => {
    const options = { ...defaultOptions, excludeAmbiguous: true, length: 100 };
    const res = pg.generatePasswordsLogic(options);
    const ambiguous = ['l', 'I', '1', 'O', '0', 'o'];
    ambiguous.forEach(c => {
      expect(res[0]).not.toContain(c);
    });
  });

  it('should calculate strength correctly', () => {
    const weak = pg.calculateStrength('abc');
    expect(weak.label).toBe('Weak');

    const strong = pg.calculateStrength('Abc123!@#LongPassword');
    expect(strong.label).toBe('Very Strong');
  });
});
