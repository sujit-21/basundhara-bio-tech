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

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    // Remove old admin@basundharabiotech.com if present
    await User.deleteOne({ email: 'admin@basundharabiotech.com' });

    // Ensure basundharabiotech@gmail.com is the single official Admin
    let admin = await User.findOne({ email: 'basundharabiotech@gmail.com' });
    if (admin) {
      admin.password = 'basundharabiotech@2026';
      admin.role = 'admin';
      await admin.save();
    } else {
      admin = new User({
        name: 'Basundhara Admin',
        email: 'basundharabiotech@gmail.com',
        password: 'basundharabiotech@2026',
        role: 'admin'
      });
      await admin.save();
    }
    console.log('Sole Admin user (basundharabiotech@gmail.com) synchronized successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
