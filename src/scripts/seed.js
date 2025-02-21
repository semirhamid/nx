require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../data/models/user.model');
const logger = require('../config/logger');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@semir.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('1234567890@Se', 10);
    await User.create({
      email: 'admin@semir.com',
      password: hashedPassword,
      role: 'admin',
      permissions: [
        'read_all_tasks',
        'create_tasks',
        'update_all_tasks',
        'delete_all_tasks',
        'manage_users'
      ]
    });

    logger.info('Admin user created successfully');
  } catch (error) {
    logger.error('Error seeding admin user:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin; 