const validateFurniture = require('../src/validation/validateFurniture');

describe('validateFurniture', () => {
  it('accepts supported furniture with positive dimensions', () => {
    expect(
      validateFurniture({
        name: 'Three-seater',
        type: 'sofa',
        width: 96,
        depth: 40,
      }),
    ).toEqual({});
  });

  it.each([
    ['sofa'],
    ['coffeeTable'],
    ['diningTable'],
  ])('accepts supported type: %s', (type) => {
    expect(validateFurniture({ name: 'Item', type, width: 48, depth: 24 })).toEqual({});
  });

  it('rejects unsupported furniture type', () => {
    expect(validateFurniture({ name: 'Item', type: 'bed', width: 60, depth: 40 })).toEqual({
      type: 'Type must be one of: sofa, coffeeTable, diningTable',
    });
  });

  it.each([
    [0, 24],
    [-1, 24],
    [48, 0],
    [48, -1],
  ])('rejects non-positive dimensions: %p x %p', (width, depth) => {
    const errors = validateFurniture({ name: 'Item', type: 'sofa', width, depth });

    if (width <= 0) {
      expect(errors.width).toBe('Width must be a number greater than zero');
    }

    if (depth <= 0) {
      expect(errors.depth).toBe('Depth must be a number greater than zero');
    }
  });

  it('requires a non-empty name', () => {
    expect(validateFurniture({ name: ' ', type: 'sofa', width: 48, depth: 24 })).toEqual({
      name: 'Name is required',
    });
  });
});
