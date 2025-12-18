/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const json = require('../src/features/json-toolkit/script.js');

describe('JSON Toolkit Logic', () => {
  describe('Relaxed Parser', () => {
    it('should parse strict JSON correctly', () => {
      expect(json.parseRelaxedJSON('{"a": 1}')).toEqual({ a: 1 });
    });

    it('should parse relaxed JSON (JS Object) correctly', () => {
      expect(json.parseRelaxedJSON('{a: 1, b: "c"}')).toEqual({ a: 1, b: 'c' });
    });
  });

  describe('Converters', () => {
    const data = { name: 'Test', count: 10 };

    it('should convert to XML correctly', () => {
      const xml = json.jsonToXML(data);
      expect(xml).toContain('<name>Test</name>');
      expect(xml).toContain('<count>10</count>');
    });

    it('should convert to YAML correctly', () => {
      const yaml = json.jsonToYAML(data);
      expect(yaml).toContain('name: "Test"');
      expect(yaml).toContain('count: 10');
    });

    it('should convert to CSV correctly', () => {
      const csv = json.jsonToCSV([data]);
      expect(csv).toContain('name,count');
      expect(csv).toContain('Test,10');
    });
  });
});
