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
    
    // Find existing admin or create a new one
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
        adminUser.email = 'basundharabiotech@gmail.com';
        adminUser.password = 'basundharabiotech@2026';
        await adminUser.save();
        console.log('Admin user updated successfully');
    } else {
        adminUser = new User({
            name: 'Admin',
            email: 'basundharabiotech@gmail.com',
            password: 'basundharabiotech@2026',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user created successfully');
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
