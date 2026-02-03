/**
 * Unit Conversion Logic
 * Pure functions and conversion mapping
 */

const CONVERSIONS = {
  length: {
    base: 'm',
    rates: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      inch: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    }
  },
  weight: {
    base: 'kg',
    rates: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.0283495231,
      ton: 1000
    }
  },
  volume: {
    base: 'l',
    rates: {
      l: 1,
      ml: 0.001,
      m3: 1000,
      gal: 3.78541,
      floz: 0.0295735,
      cup: 0.236588,
      pt: 0.473176,
      qt: 0.946353,
      tsp: 0.00492892,
      tbsp: 0.0147868
    }
  },
  area: {
    base: 'm2',
    rates: {
      m2: 1,
      km2: 1000000,
      ha: 10000,
      acre: 4046.856
    }
  },
  speed: {
    base: 'mps',
    rates: {
      mps: 1,
      kph: 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444
    }
  },
  temperature: {
    custom: true,
    toBase: {
      c: v => v,
      f: v => (v - 32) * 5 / 9,
      k: v => v - 273.15
    },
    fromBase: {
      c: v => v,
      f: v => (v * 9 / 5) + 32,
      k: v => v + 273.15
    }
  },
  digital: {
    base: 'byte',
    rates: {
      bit: 0.125,
      byte: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
      tb: 1099511627776,
      pb: 1125899906842624
    }
  }
};

/**
 * Converts a value from one unit to another
 * @param {number} value
 * @param {string} from
 * @param {string} to
 * @param {string} category
 * @returns {number} Converted value
 */
function convertUnit(value, from, to, category) {
  const catData = CONVERSIONS[category];
  if (!catData) return value;

  if (catData.custom) {
    const baseVal = catData.toBase[from](value);
    return catData.fromBase[to](baseVal);
  } else {
    const baseVal = value * catData.rates[from];
    return baseVal / catData.rates[to];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONVERSIONS,
    convertUnit
  };
}
