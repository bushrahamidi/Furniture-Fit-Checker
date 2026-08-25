const designRules = {
  furniture: {
    sofa: {
      wallOccupation: [
        {
          rating: 'TOO_SMALL',
          minPercentage: 0,
          maxPercentage: 40,
          includeMax: false,
          score: 40,
          warning: 'Sofa may look too small for this wall.',
          recommendation: 'Choose a wider sofa or place it with complementary seating.',
        },
        {
          rating: 'ACCEPTABLE',
          minPercentage: 40,
          maxPercentage: 50,
          includeMax: false,
          score: 75,
          recommendation: 'This sofa is acceptable for the wall width.',
        },
        {
          rating: 'GOOD',
          minPercentage: 50,
          maxPercentage: 70,
          includeMax: false,
          score: 100,
          recommendation: 'This sofa is well proportioned for the wall width.',
        },
        {
          rating: 'LARGE',
          minPercentage: 70,
          maxPercentage: 80,
          includeMax: true,
          score: 70,
          warning: 'Sofa may feel large for this wall.',
          recommendation: 'Confirm nearby walkways and visual balance before choosing this sofa.',
        },
        {
          rating: 'TOO_LARGE',
          minPercentage: 80,
          includeMin: false,
          score: 30,
          warning: 'Sofa is likely too large for this wall.',
          recommendation: 'Choose a narrower sofa to improve fit and room balance.',
        },
      ],
      physicalFitWarning: 'Sofa dimensions exceed the room dimensions.',
      physicalFitRecommendation: 'Choose a sofa that fits within the room width and length.',
    },
    coffeeTable: {
      sofaWidthRatio: [
        {
          status: 'TOO_NARROW',
          minPercentage: 0,
          maxPercentage: 50,
          includeMax: false,
          warning: 'Coffee table is narrow compared with the sofa.',
          recommendation: 'Choose a coffee table that is 50% to 67% of the sofa width.',
        },
        {
          status: 'GOOD',
          minPercentage: 50,
          maxPercentage: 67,
          includeMax: true,
          recommendation: 'This coffee table is well proportioned for the sofa.',
        },
        {
          status: 'TOO_WIDE',
          minPercentage: 67,
          includeMin: false,
          warning: 'Coffee table is wide compared with the sofa.',
          recommendation: 'Choose a coffee table that is 50% to 67% of the sofa width.',
        },
      ],
      sofaSpacing: [
        {
          status: 'TOO_CLOSE',
          minInches: 0,
          maxInches: 14,
          includeMax: false,
          warning: 'Coffee table is too close to the sofa.',
          recommendation: 'Leave 14 to 18 inches between the sofa and the coffee table.',
        },
        {
          status: 'GOOD',
          minInches: 14,
          maxInches: 18,
          includeMax: true,
          recommendation: 'The sofa to coffee table spacing is comfortable.',
        },
        {
          status: 'TOO_FAR',
          minInches: 18,
          includeMin: false,
          warning: 'Coffee table is too far from the sofa.',
          recommendation: 'Leave 14 to 18 inches between the sofa and the coffee table.',
        },
      ],
      physicalFitWarning: 'Sofa and coffee table layout exceeds the room dimensions.',
      physicalFitRecommendation:
        'Choose a smaller coffee table or reduce the spacing so the layout fits the room.',
    },
    diningTable: {
      minimumClearance: 30,
      preferredClearance: 36,
      clearance: [
        {
          rating: 'INSUFFICIENT',
          minInches: Number.NEGATIVE_INFINITY,
          maxInches: 30,
          includeMax: false,
          warning: 'Clearance around the dining table is below the 30 inch minimum.',
          recommendation: 'Choose a smaller dining table so every side has at least 30 inches of clearance.',
        },
        {
          rating: 'TIGHT',
          minInches: 30,
          maxInches: 36,
          includeMax: false,
          warning: 'Clearance around the dining table is tight for pulling out chairs.',
          recommendation: 'This dining table works, but 36 inches of clearance is more comfortable.',
        },
        {
          rating: 'COMFORTABLE',
          minInches: 36,
          recommendation: 'This dining table leaves comfortable clearance on every side.',
        },
      ],
      physicalFitWarning: 'Dining table dimensions exceed the room dimensions.',
      physicalFitRecommendation: 'Choose a dining table that fits within the room width and length.',
    },
  },
};

module.exports = designRules;