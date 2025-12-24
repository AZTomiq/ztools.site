import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist-dev');

describe('ZTools Integrity Tests', () => {

  describe('Feature Configurations', () => {
    const featuresDir = path.join(SRC_DIR, 'features');
    if (fs.existsSync(featuresDir)) {
      const features = fs.readdirSync(featuresDir);

      features.forEach(feature => {
        if (!fs.statSync(path.join(featuresDir, feature)).isDirectory()) return;

        it(`should have a valid tool.yaml for feature: ${feature}`, () => {
          const toolYaml = path.join(featuresDir, feature, 'tool.yaml');
          expect(fs.existsSync(toolYaml), `Missing tool.yaml in ${feature}`).toBe(true);

          const config = yaml.load(fs.readFileSync(toolYaml, 'utf8'));
          expect(config.id || config.wid, `Missing id or wid in ${feature}`).toBeDefined();
          expect(config.category, `Missing category in ${feature}`).toBeDefined();
          expect(config.translationKey, `Missing translationKey in ${feature}`).toBeDefined();
        });
      });
    }
  });

  describe('Build Output (dist-dev)', () => {
    if (fs.existsSync(DIST_DIR)) {
      const checkFiles = (dir) => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
            checkFiles(fullPath);
          } else if (item.endsWith('.html')) {
            it(`should not have unrendered EJS tags in ${path.relative(DIST_DIR, fullPath)}`, () => {
              const content = fs.readFileSync(fullPath, 'utf8');
              expect(content.includes('<%=')).toBe(false);
              expect(content.includes('<%')).toBe(false);
            });
          }
        });
      };

      checkFiles(DIST_DIR);
    } else {
      it.skip('Skipping dist-dev check (running build:dev first is recommended)', () => { });
    }
  });

  describe('Logic Regressions', () => {
    it('Tax Logic should return all breakdown fields (Fix verification)', async () => {
      const taxLogicPath = path.join(SRC_DIR, 'features/tax/logic.js');
      expect(fs.existsSync(taxLogicPath)).toBe(true);

      // Load the logic module using require (it has UMD/CJS support)
      const TaxLogic = require(taxLogicPath);
      const result = TaxLogic.calculatePIT(50_000_000, 0, 1);

      expect(result).toHaveProperty('breakdownOld');
      expect(result).toHaveProperty('breakdownNew');
      expect(Array.isArray(result.breakdownOld)).toBe(true);
      expect(Array.isArray(result.breakdownNew)).toBe(true);
      expect(result.breakdownOld.length).toBeGreaterThan(0);
      expect(result.breakdownNew.length).toBeGreaterThan(0);
    });
  });

});
