const designRules = require('../config/designRules');

function calculateFit(room, furniture) {
  const errors = validateDimensions(room, furniture);

  if (Object.keys(errors).length > 0) {
    const error = new Error('Invalid dimensions');
    error.details = errors;
    throw error;
  }

  const fits = furniture.width <= room.width && furniture.depth <= room.length;

  const widthPercentage = (furniture.width / room.width) * 100;
  const remainingWidth = room.width - furniture.width;
  const proportionRule = getProportionRule(furniture.type, widthPercentage);
  const warnings = getWarnings(fits, proportionRule, furniture.type);

  return {
    fits,
    score: proportionRule.score,
    rating: proportionRule.rating,
    widthPercentage,
    remainingWidth,
    warnings,
    recommendation: fits
      ? proportionRule.recommendation
      : designRules.furniture[furniture.type].physicalFitRecommendation,
  };
}

function calculateCoffeeTableFit(room, sofa, coffeeTable) {
  const errors = validateCoffeeTableInput(room, sofa, coffeeTable);

  if (Object.keys(errors).length > 0) {
    const error = new Error('Invalid dimensions');
    error.details = errors;
    throw error;
  }

  const rules = designRules.furniture.coffeeTable;
  const distanceFromSofa = coffeeTable.distanceFromSofa;
  const layoutDepth = sofa.depth + distanceFromSofa + coffeeTable.depth;
  const fits = coffeeTable.width <= room.width
    && sofa.width <= room.width
    && layoutDepth <= room.length;

  const coffeeTableToSofaPercentage = (coffeeTable.width / sofa.width) * 100;
  const proportionRule = findRule(rules.sofaWidthRatio, coffeeTableToSofaPercentage, 'minPercentage', 'maxPercentage');
  const spacingRule = findRule(rules.sofaSpacing, distanceFromSofa, 'minInches', 'maxInches');

  const warnings = [];

  if (!fits) {
    warnings.push(rules.physicalFitWarning);
  }

  if (proportionRule.warning) {
    warnings.push(proportionRule.warning);
  }

  if (spacingRule.warning) {
    warnings.push(spacingRule.warning);
  }

  let recommendation = spacingRule.recommendation;

  if (proportionRule.status !== 'GOOD') {
    recommendation = proportionRule.recommendation;
  }

  if (!fits) {
    recommendation = rules.physicalFitRecommendation;
  }

  return {
    fits,
    proportionStatus: proportionRule.status,
    coffeeTableToSofaPercentage,
    spacingStatus: spacingRule.status,
    warnings,
    recommendation,
  };
}

function calculateDiningTableFit(room, diningTable) {
  const errors = validateDiningTableInput(room, diningTable);

  if (Object.keys(errors).length > 0) {
    const error = new Error('Invalid dimensions');
    error.details = errors;
    throw error;
  }

  const rules = designRules.furniture.diningTable;
  const remainingWidth = room.width - diningTable.width;
  const remainingLength = room.length - diningTable.length;
  const sideClearance = remainingWidth / 2;
  const endClearance = remainingLength / 2;
  const fits = remainingWidth >= 0 && remainingLength >= 0;

  const clearanceRule = findRule(
    rules.clearance,
    Math.min(sideClearance, endClearance),
    'minInches',
    'maxInches',
  );

  const warnings = [];

  if (!fits) {
    warnings.push(rules.physicalFitWarning);
  }

  if (clearanceRule.warning) {
    warnings.push(clearanceRule.warning);
  }

  return {
    fits,
    remainingWidth,
    remainingLength,
    sideClearance,
    endClearance,
    clearanceRating: clearanceRule.rating,
    warnings,
    recommendation: fits ? clearanceRule.recommendation : rules.physicalFitRecommendation,
  };
}

function getProportionRule(furnitureType, widthPercentage) {
  const rules = designRules.furniture[furnitureType]?.wallOccupation;

  if (!rules) {
    const error = new Error(`Missing design rules for furniture type: ${furnitureType}`);
    throw error;
  }

  return findRule(rules, widthPercentage, 'minPercentage', 'maxPercentage');
}

function findRule(rules, value, minKey, maxKey) {
  return rules.find((rule) => {
    const meetsMin = rule.includeMin === false
      ? value > rule[minKey]
      : value >= rule[minKey];
    const meetsMax = rule[maxKey] === undefined || (rule.includeMax
      ? value <= rule[maxKey]
      : value < rule[maxKey]);

    return meetsMin && meetsMax;
  });
}

function getWarnings(fits, proportionRule, furnitureType) {
  const warnings = [];

  if (!fits) {
    warnings.push(designRules.furniture[furnitureType].physicalFitWarning);
  }

  if (proportionRule.warning) {
    warnings.push(proportionRule.warning);
  }

  return warnings;
}

function validateDimensions(room, furniture) {
  const errors = {};

  if (!isPositiveNumber(room?.width)) {
    errors.roomWidth = 'Room width must be a number greater than zero';
  }

  if (!isPositiveNumber(room?.length)) {
    errors.roomLength = 'Room length must be a number greater than zero';
  }

  if (!isPositiveNumber(furniture?.width)) {
    errors.furnitureWidth = 'Furniture width must be a number greater than zero';
  }

  if (!isPositiveNumber(furniture?.depth)) {
    errors.furnitureDepth = 'Furniture depth must be a number greater than zero';
  }

  return errors;
}

function validateCoffeeTableInput(room, sofa, coffeeTable) {
  const errors = {};

  if (!isPositiveNumber(room?.width)) {
    errors.roomWidth = 'Room width must be a number greater than zero';
  }

  if (!isPositiveNumber(room?.length)) {
    errors.roomLength = 'Room length must be a number greater than zero';
  }

  if (!isPositiveNumber(sofa?.width)) {
    errors.sofaWidth = 'Sofa width must be a number greater than zero';
  }

  if (!isPositiveNumber(sofa?.depth)) {
    errors.sofaDepth = 'Sofa depth must be a number greater than zero';
  }

  if (!isPositiveNumber(coffeeTable?.width)) {
    errors.coffeeTableWidth = 'Coffee table width must be a number greater than zero';
  }

  if (!isPositiveNumber(coffeeTable?.depth)) {
    errors.coffeeTableDepth = 'Coffee table depth must be a number greater than zero';
  }

  if (!isPositiveNumber(coffeeTable?.distanceFromSofa)) {
    errors.distanceFromSofa = 'Distance from sofa must be a number greater than zero';
  }

  return errors;
}

function validateDiningTableInput(room, diningTable) {
  const errors = {};

  if (!isPositiveNumber(room?.width)) {
    errors.roomWidth = 'Room width must be a number greater than zero';
  }

  if (!isPositiveNumber(room?.length)) {
    errors.roomLength = 'Room length must be a number greater than zero';
  }

  if (!isPositiveNumber(diningTable?.width)) {
    errors.diningTableWidth = 'Dining table width must be a number greater than zero';
  }

  if (!isPositiveNumber(diningTable?.length)) {
    errors.diningTableLength = 'Dining table length must be a number greater than zero';
  }

  return errors;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

module.exports = { calculateFit, calculateCoffeeTableFit, calculateDiningTableFit };
