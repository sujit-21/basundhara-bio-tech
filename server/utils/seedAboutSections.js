const AboutSection = require('../models/AboutSection');

const seedAboutSections = async () => {
  try {
    const count = await AboutSection.countDocuments();
    if (count === 0) {
      console.log('Seeding initial About page sections...');
      await AboutSection.create([
        // Vision & Values
        {
          type: 'vision_values',
          title: 'Our Vision',
          content: 'To create a global agro-ecosystem where agricultural yields are optimized bio-metagenomically, waste is entirely upcycled into biodegradable items, and clean food supplements are accessible worldwide.',
          icon: 'bi-eye',
          color: 'success',
          order: 1,
        },
        {
          type: 'vision_values',
          title: 'Our Values',
          content: 'Farmer empowerment, certified organic purity, circular zero-waste upcycling, strict phytosanitary compliance, and transparent international supply corridors define our day-to-day operations.',
          icon: 'bi-shield-check',
          color: 'primary',
          order: 2,
        },
        // History Timeline
        {
          type: 'history',
          title: 'Agro-Start',
          content: 'Founded as a local seed and organic compost advisory group, coordinating with 200 farmers in Bengal.',
          year: '2020',
          color: 'success',
          order: 1,
        },
        {
          type: 'history',
          title: 'Food Dehydration',
          content: 'Commissioned our state-of-the-art cold-dehydration and spice CTC processing units, launching local food processing.',
          year: '2023',
          color: 'primary',
          order: 2,
        },
        {
          type: 'history',
          title: 'Global Upcycling',
          content: 'Began recycling agricultural husks into biodegradable coir pots and established regular export corridors to Rotterdam and the Gulf.',
          year: '2026',
          color: 'success',
          order: 3,
        },
        // Operating Coordinates / Facilities
        {
          type: 'facility',
          title: 'Processing Unit I: Dehydration',
          content: 'Equipped with low-temperature moisture extractor tunnels drying ginger, moringa leaves, and fruits under absolute dust-free guidelines.',
          icon: 'bi-egg-fried',
          color: 'success',
          order: 1,
        },
        {
          type: 'facility',
          title: 'Processing Unit II: Upcycling',
          content: 'Hydraulic fiber press filters converting coconut coir husks and stalks into high-density biodegradable pots and livestock feeding blocks.',
          icon: 'bi-recycle',
          color: 'primary',
          order: 2,
        },
        {
          type: 'facility',
          title: 'Organic Cooperatives',
          content: 'Collaborating directly with 10,000+ organic farmers across North-East India to harvest spices, leaves, and medicinal barks.',
          icon: 'bi-patch-check',
          color: 'success',
          order: 3,
        },
      ]);
      console.log('Initial About page sections seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding About page sections:', error.message);
  }
};

module.exports = seedAboutSections;
