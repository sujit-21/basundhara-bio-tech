const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const dns = require('dns');

// Configure custom DNS servers to bypass local ISP blocks on SRV records, but only locally
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('Could not set DNS servers', err);
  }
}

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    // Ensure admin@basundharabiotech.com exists
    let admin1 = await User.findOne({ email: 'admin@basundharabiotech.com' });
    if (admin1) {
      admin1.password = 'admin12345';
      admin1.role = 'admin';
      await admin1.save();
    } else {
      admin1 = new User({
        name: 'Admin',
        email: 'admin@basundharabiotech.com',
        password: 'admin12345',
        role: 'admin'
      });
      await admin1.save();
    }

    // Ensure basundharabiotech@gmail.com exists
    let admin2 = await User.findOne({ email: 'basundharabiotech@gmail.com' });
    if (admin2) {
      admin2.password = 'basundharabiotech@2026';
      admin2.role = 'admin';
      await admin2.save();
    } else {
      admin2 = new User({
        name: 'Basundhara Admin',
        email: 'basundharabiotech@gmail.com',
        password: 'basundharabiotech@2026',
        role: 'admin'
      });
      await admin2.save();
    }
    console.log('Admin users synchronized successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
