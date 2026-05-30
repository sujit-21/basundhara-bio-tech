const About = require('../models/About');

const seedAbout = async () => {
  try {
    const count = await About.countDocuments();
    if (count === 0) {
      console.log('Seeding initial About page leadership team...');
      await About.create([
        {
          name: 'Dr. Basundhara Roy',
          role: 'Founder & Managing Director',
          qualification: 'PhD in Agriculture & Soil Metagenomics (IIT Kharagpur)',
          bio: 'Pioneered organic microbial soil stimulants in India. Directs research in sustainable crop cultivation.',
          icon: 'bi-flower1',
          image: '',
        },
        {
          name: 'Dr. Elena Rostova',
          role: 'Director of Sustainability & Circular Economy',
          qualification: 'PhD in Bio-Resource Management (Freiburg University)',
          bio: 'Oversees upcycling of agricultural residues and our bio-composting facility in West Bengal.',
          icon: 'bi-recycle',
          image: '',
        },
        {
          name: 'Ajeet Kumar',
          role: 'Head of Global Logistics & Compliance',
          qualification: 'MBA in International Trade (IIFT Delhi)',
          bio: 'Manages international trade corridors, customs compliance, and phytosanitary certificate clearances.',
          icon: 'bi-globe-asia-australia',
          image: '',
        },
      ]);
      console.log('Initial About page leadership team seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding About page data:', error.message);
  }
};

module.exports = seedAbout;
