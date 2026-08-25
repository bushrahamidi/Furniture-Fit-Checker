const {
  calculateFit,
  calculateCoffeeTableFit,
  calculateDiningTableFit,
} = require('../src/services/fitService');

describe('fitService', () => {
  it('calculates a comfortable fit', () => {
    const result = calculateFit(
      { width: 196, length: 159 },
      { type: 'sofa', width: 96, depth: 40 },
    );

    expect(result.fits).toBe(true);
    expect(result.score).toBe(75);
    expect(result.rating).toBe('ACCEPTABLE');
    expect(result.widthPercentage).toBeCloseTo((96 / 196) * 100, 10);
    expect(result.remainingWidth).toBe(100);
    expect(result.warnings).toEqual([]);
    expect(result.recommendation).toBe('This sofa is acceptable for the wall width.');
  });

  it('calculates an exact fit', () => {
    const result = calculateFit(
      { width: 96, length: 40 },
      { type: 'sofa', width: 96, depth: 40 },
    );

    expect(result).toEqual({
      fits: true,
      score: 30,
      rating: 'TOO_LARGE',
      widthPercentage: 100,
      remainingWidth: 0,
      warnings: ['Sofa is likely too large for this wall.'],
      recommendation: 'Choose a narrower sofa to improve fit and room balance.',
    });
  });

  it('returns no fit when furniture is too wide', () => {
    const result = calculateFit(
      { width: 90, length: 159 },
      { type: 'sofa', width: 96, depth: 40 },
    );

    expect(result.fits).toBe(false);
    expect(result.rating).toBe('TOO_LARGE');
    expect(result.remainingWidth).toBe(-6);
    expect(result.warnings).toEqual([
      'Sofa dimensions exceed the room dimensions.',
      'Sofa is likely too large for this wall.',
    ]);
    expect(result.recommendation).toBe('Choose a sofa that fits within the room width and length.');
  });

  it('returns no fit when furniture is too deep', () => {
    const result = calculateFit(
      { width: 196, length: 35 },
      { type: 'sofa', width: 96, depth: 40 },
    );

    expect(result.fits).toBe(false);
    expect(result.remainingWidth).toBe(100);
    expect(result.warnings).toEqual(['Sofa dimensions exceed the room dimensions.']);
    expect(result.recommendation).toBe('Choose a sofa that fits within the room width and length.');
  });

  it.each([
    [39.99, 'TOO_SMALL', 40],
    [40, 'ACCEPTABLE', 75],
    [49.99, 'ACCEPTABLE', 75],
    [50, 'GOOD', 100],
    [69.99, 'GOOD', 100],
    [70, 'LARGE', 70],
    [80, 'LARGE', 70],
    [80.01, 'TOO_LARGE', 30],
  ])('rates %.2f%% wall occupation as %s', (widthPercentage, rating, score) => {
    const result = calculateFit(
      { width: 100, length: 100 },
      { type: 'sofa', width: widthPercentage, depth: 30 },
    );

    expect(result.fits).toBe(true);
    expect(result.widthPercentage).toBeCloseTo(widthPercentage, 10);
    expect(result.rating).toBe(rating);
    expect(result.score).toBe(score);
  });

  it('rejects zero dimensions', () => {
    expect(() => calculateFit({ width: 0, length: 159 }, { width: 96, depth: 40 })).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateFit({ width: 196, length: 159 }, { width: 0, depth: 40 })).toThrow(
      'Invalid dimensions',
    );
  });

  it('rejects negative dimensions', () => {
    expect(() => calculateFit({ width: -196, length: 159 }, { width: 96, depth: 40 })).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateFit({ width: 196, length: -159 }, { width: 96, depth: 40 })).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateFit({ width: 196, length: 159 }, { width: 96, depth: -40 })).toThrow(
      'Invalid dimensions',
    );
  });
});

describe('fitService coffee table', () => {
  const room = { width: 196, length: 159 };
  const sofa = { width: 96, depth: 40 };

  it('calculates a well proportioned and comfortably spaced coffee table', () => {
    const result = calculateCoffeeTableFit(room, sofa, {
      width: 56,
      depth: 24,
      distanceFromSofa: 16,
    });

    expect(result).toEqual({
      fits: true,
      proportionStatus: 'GOOD',
      coffeeTableToSofaPercentage: (56 / 96) * 100,
      spacingStatus: 'GOOD',
      warnings: [],
      recommendation: 'The sofa to coffee table spacing is comfortable.',
    });
  });

  it.each([
    [47.99, 'TOO_NARROW'],
    [48, 'GOOD'],
    [64.32, 'GOOD'],
    [64.33, 'TOO_WIDE'],
  ])('rates a %s inch coffee table width as %s', (width, proportionStatus) => {
    const result = calculateCoffeeTableFit(room, sofa, {
      width,
      depth: 24,
      distanceFromSofa: 16,
    });

    expect(result.coffeeTableToSofaPercentage).toBeCloseTo((width / 96) * 100, 10);
    expect(result.proportionStatus).toBe(proportionStatus);
  });

  it.each([
    [13.99, 'TOO_CLOSE'],
    [14, 'GOOD'],
    [18, 'GOOD'],
    [18.01, 'TOO_FAR'],
  ])('rates %s inches of spacing as %s', (distanceFromSofa, spacingStatus) => {
    const result = calculateCoffeeTableFit(room, sofa, {
      width: 56,
      depth: 24,
      distanceFromSofa,
    });

    expect(result.spacingStatus).toBe(spacingStatus);
  });

  it('warns when the coffee table is too narrow and too close', () => {
    const result = calculateCoffeeTableFit(room, sofa, {
      width: 40,
      depth: 24,
      distanceFromSofa: 10,
    });

    expect(result.fits).toBe(true);
    expect(result.proportionStatus).toBe('TOO_NARROW');
    expect(result.spacingStatus).toBe('TOO_CLOSE');
    expect(result.warnings).toEqual([
      'Coffee table is narrow compared with the sofa.',
      'Coffee table is too close to the sofa.',
    ]);
    expect(result.recommendation).toBe(
      'Choose a coffee table that is 50% to 67% of the sofa width.',
    );
  });

  it('warns when the coffee table is too wide and too far', () => {
    const result = calculateCoffeeTableFit(room, sofa, {
      width: 80,
      depth: 24,
      distanceFromSofa: 30,
    });

    expect(result.proportionStatus).toBe('TOO_WIDE');
    expect(result.spacingStatus).toBe('TOO_FAR');
    expect(result.warnings).toEqual([
      'Coffee table is wide compared with the sofa.',
      'Coffee table is too far from the sofa.',
    ]);
  });

  it('fits exactly when the layout depth equals the room length', () => {
    const result = calculateCoffeeTableFit({ width: 96, length: 80 }, sofa, {
      width: 56,
      depth: 24,
      distanceFromSofa: 16,
    });

    expect(result.fits).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it('does not fit when the layout depth exceeds the room length by a fraction', () => {
    const result = calculateCoffeeTableFit({ width: 96, length: 79.99 }, sofa, {
      width: 56,
      depth: 24,
      distanceFromSofa: 16,
    });

    expect(result.fits).toBe(false);
    expect(result.warnings).toEqual([
      'Sofa and coffee table layout exceeds the room dimensions.',
    ]);
    expect(result.recommendation).toBe(
      'Choose a smaller coffee table or reduce the spacing so the layout fits the room.',
    );
  });

  it('does not fit when the coffee table is wider than the room', () => {
    const result = calculateCoffeeTableFit({ width: 50, length: 159 }, sofa, {
      width: 56,
      depth: 24,
      distanceFromSofa: 16,
    });

    expect(result.fits).toBe(false);
    expect(result.recommendation).toBe(
      'Choose a smaller coffee table or reduce the spacing so the layout fits the room.',
    );
  });

  it('rejects missing or non positive dimensions', () => {
    const coffeeTable = { width: 56, depth: 24, distanceFromSofa: 16 };

    expect(() => calculateCoffeeTableFit({ width: 0, length: 159 }, sofa, coffeeTable)).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateCoffeeTableFit(room, { width: 96, depth: -40 }, coffeeTable)).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateCoffeeTableFit(room, sofa, { ...coffeeTable, width: 0 })).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateCoffeeTableFit(room, sofa, { ...coffeeTable, depth: 0 })).toThrow(
      'Invalid dimensions',
    );

    expect(() =>
      calculateCoffeeTableFit(room, sofa, { ...coffeeTable, distanceFromSofa: 0 }),
    ).toThrow('Invalid dimensions');

    expect(() => calculateCoffeeTableFit(room, sofa, undefined)).toThrow('Invalid dimensions');
  });

  it('includes validation details on the thrown error', () => {
    try {
      calculateCoffeeTableFit(room, sofa, { width: 56, depth: 24, distanceFromSofa: -1 });
    } catch (error) {
      expect(error.details).toEqual({
        distanceFromSofa: 'Distance from sofa must be a number greater than zero',
      });
    }
  });
});

describe('fitService dining table', () => {
  it('rates comfortable space', () => {
    const result = calculateDiningTableFit({ width: 144, length: 180 }, { width: 40, length: 72 });

    expect(result).toEqual({
      fits: true,
      remainingWidth: 104,
      remainingLength: 108,
      sideClearance: 52,
      endClearance: 54,
      clearanceRating: 'COMFORTABLE',
      warnings: [],
      recommendation: 'This dining table leaves comfortable clearance on every side.',
    });
  });

  it('rates tight space', () => {
    const result = calculateDiningTableFit({ width: 110, length: 144 }, { width: 40, length: 72 });

    expect(result.fits).toBe(true);
    expect(result.sideClearance).toBe(35);
    expect(result.endClearance).toBe(36);
    expect(result.clearanceRating).toBe('TIGHT');
    expect(result.warnings).toEqual([
      'Clearance around the dining table is tight for pulling out chairs.',
    ]);
    expect(result.recommendation).toBe(
      'This dining table works, but 36 inches of clearance is more comfortable.',
    );
  });

  it('rates insufficient space', () => {
    const result = calculateDiningTableFit({ width: 90, length: 144 }, { width: 40, length: 72 });

    expect(result.fits).toBe(true);
    expect(result.sideClearance).toBe(25);
    expect(result.endClearance).toBe(36);
    expect(result.clearanceRating).toBe('INSUFFICIENT');
    expect(result.warnings).toEqual([
      'Clearance around the dining table is below the 30 inch minimum.',
    ]);
    expect(result.recommendation).toBe(
      'Choose a smaller dining table so every side has at least 30 inches of clearance.',
    );
  });

  it('reports no fit when the table is larger than the room', () => {
    const result = calculateDiningTableFit({ width: 36, length: 60 }, { width: 40, length: 72 });

    expect(result).toEqual({
      fits: false,
      remainingWidth: -4,
      remainingLength: -12,
      sideClearance: -2,
      endClearance: -6,
      clearanceRating: 'INSUFFICIENT',
      warnings: [
        'Dining table dimensions exceed the room dimensions.',
        'Clearance around the dining table is below the 30 inch minimum.',
      ],
      recommendation: 'Choose a dining table that fits within the room width and length.',
    });
  });

  it('fits exactly with zero clearance', () => {
    const result = calculateDiningTableFit({ width: 40, length: 72 }, { width: 40, length: 72 });

    expect(result.fits).toBe(true);
    expect(result.sideClearance).toBe(0);
    expect(result.endClearance).toBe(0);
    expect(result.clearanceRating).toBe('INSUFFICIENT');
  });

  it.each([
    [29.99, 'INSUFFICIENT'],
    [30, 'TIGHT'],
    [35.99, 'TIGHT'],
    [36, 'COMFORTABLE'],
  ])('rates %s inches of clearance as %s', (clearance, clearanceRating) => {
    const result = calculateDiningTableFit(
      { width: 40 + clearance * 2, length: 72 + clearance * 2 },
      { width: 40, length: 72 },
    );

    expect(result.sideClearance).toBeCloseTo(clearance, 10);
    expect(result.endClearance).toBeCloseTo(clearance, 10);
    expect(result.clearanceRating).toBe(clearanceRating);
  });

  it('rejects missing or non positive dimensions', () => {
    const diningTable = { width: 40, length: 72 };

    expect(() => calculateDiningTableFit({ width: 0, length: 180 }, diningTable)).toThrow(
      'Invalid dimensions',
    );

    expect(() => calculateDiningTableFit({ width: 144, length: -1 }, diningTable)).toThrow(
      'Invalid dimensions',
    );

    expect(() =>
      calculateDiningTableFit({ width: 144, length: 180 }, { ...diningTable, width: 0 }),
    ).toThrow('Invalid dimensions');

    expect(() => calculateDiningTableFit({ width: 144, length: 180 }, undefined)).toThrow(
      'Invalid dimensions',
    );
  });

  it('includes validation details on the thrown error', () => {
    try {
      calculateDiningTableFit({ width: 144, length: 180 }, { width: 40, length: 0 });
    } catch (error) {
      expect(error.details).toEqual({
        diningTableLength: 'Dining table length must be a number greater than zero',
      });
    }
  });
});
