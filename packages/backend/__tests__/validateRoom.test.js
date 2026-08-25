const validateRoom = require('../src/validation/validateRoom');

describe('validateRoom', () => {
  it('accepts a room with positive dimensions', () => {
    expect(validateRoom({ name: 'Office', length: 120, width: 96 })).toEqual({});
  });

  it.each([
    [0, 96],
    [-1, 96],
    [120, 0],
    [120, -1],
  ])('rejects non-positive dimensions: %p x %p', (length, width) => {
    const errors = validateRoom({ name: 'Office', length, width });

    if (length <= 0) {
      expect(errors.length).toBe('Length must be a number greater than zero');
    }

    if (width <= 0) {
      expect(errors.width).toBe('Width must be a number greater than zero');
    }
  });

  it('requires a non-empty name and rejects an empty unit', () => {
    expect(validateRoom({ name: ' ', length: 120, width: 96, unit: '' })).toEqual({
      name: 'Name is required',
      unit: 'Unit must be a non-empty string',
    });
  });
});