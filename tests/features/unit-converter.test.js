/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const converter = require('../../src/features/unit-converter/logic.js');

describe('Unit Converter Logic', () => {
  describe('Length Conversions', () => {
    it('should convert 1km to 1000m', () => {
      expect(converter.convertUnit(1, 'km', 'm', 'length')).toBe(1000);
    });

    it('should convert 100cm to 1m', () => {
      expect(converter.convertUnit(100, 'cm', 'm', 'length')).toBe(1);
    });

    it('should convert 1 inch to 0.0254m', () => {
      expect(converter.convertUnit(1, 'inch', 'm', 'length')).toBe(0.0254);
    });
  });

  describe('Temperature Conversions', () => {
    it('should convert 0°C to 32°F', () => {
      expect(converter.convertUnit(0, 'c', 'f', 'temperature')).toBe(32);
    });

    it('should convert 100°C to 212°F', () => {
      expect(converter.convertUnit(100, 'c', 'f', 'temperature')).toBe(212);
    });

    it('should convert 300K to Celsius', () => {
      expect(converter.convertUnit(300, 'k', 'c', 'temperature')).toBeCloseTo(26.85, 2);
    });
  });

  describe('Digital Storage Conversions', () => {
    it('should convert 1024MB to 1GB', () => {
      expect(converter.convertUnit(1024, 'mb', 'gb', 'digital')).toBe(1);
    });

    it('should convert 1 byte to 8 bits', () => {
      expect(converter.convertUnit(1, 'byte', 'bit', 'digital')).toBe(8);
    });
  });
});
