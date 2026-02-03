import { describe, it, expect } from 'vitest';
const { convertUnit } = require('./logic.js');

describe('Unit Converter Logic', () => {

  describe('Length', () => {
    it('should convert 1km to 1000m', () => {
      expect(convertUnit(1, 'km', 'm', 'length')).toBe(1000);
    });
    it('should convert 100cm to 1m', () => {
      expect(convertUnit(100, 'cm', 'm', 'length')).toBe(1);
    });
  });

  describe('Digital', () => {
    it('should convert 1GB to 1024MB', () => {
      expect(convertUnit(1, 'gb', 'mb', 'digital')).toBe(1024);
    });
  });

  describe('Temperature', () => {
    it('should convert 0C to 32F', () => {
      expect(convertUnit(0, 'c', 'f', 'temperature')).toBe(32);
    });
    it('should convert 100C to 212F', () => {
      expect(convertUnit(100, 'c', 'f', 'temperature')).toBe(212);
    });
  });

});
