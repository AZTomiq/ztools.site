import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Mock paths and logic similar to data.js
const paths = { SRC: SRC_DIR };
const LOCALES = ['vi', 'en'];

function loadLocales(lang) {
  const translations = {};
  const srcDir = paths.SRC;

  // 1. Load module folders (common.yaml etc)
  const dirPath = path.join(srcDir, 'locales', lang);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const content = yaml.load(fs.readFileSync(path.join(dirPath, file), 'utf8'));
        Object.assign(translations, content);
      }
    }
  }

  // 2. Load Feature Bundled Locales
  const featuresDir = path.join(srcDir, 'features');
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
      const localePath = path.join(featuresDir, feature, 'locales', `${lang}.yaml`);
      if (fs.existsSync(localePath)) {
        const content = yaml.load(fs.readFileSync(localePath, 'utf8'));
        Object.assign(translations, content);
      }
    }
  }
  return translations;
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe('Locale Integrity Tests', () => {
  const translations = {};
  LOCALES.forEach(lang => {
    translations[lang] = loadLocales(lang);
  });

  it('should have the same translation keys across all locales', () => {
    const viKeys = getAllKeys(translations['vi']);
    const enKeys = getAllKeys(translations['en']);

    const missingInEn = viKeys.filter(k => !enKeys.includes(k));
    const missingInVi = enKeys.filter(k => !viKeys.includes(k));

    expect(missingInEn, `Keys present in VI but missing in EN: ${missingInEn.join(', ')}`).toEqual([]);
    expect(missingInVi, `Keys present in EN but missing in VI: ${missingInVi.join(', ')}`).toEqual([]);
  });

  it('should not have empty translation values', () => {
    LOCALES.forEach(lang => {
      const keys = getAllKeys(translations[lang]);
      keys.forEach(key => {
        const value = key.split('.').reduce((o, i) => o[i], translations[lang]);
        expect(value, `Empty translation for key "${key}" in ${lang}`).not.toBe('');
        expect(value, `Null/Undefined translation for key "${key}" in ${lang}`).not.toBeNull();
      });
    });
  });
});
