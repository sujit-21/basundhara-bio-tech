const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

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
