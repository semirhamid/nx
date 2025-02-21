db = db.getSiblingDB('api');

db.createUser({
  user: 'api_user',
  pwd: 'api_password',
  roles: [
    {
      role: 'readWrite',
      db: 'api'
    }
  ]
});

// Create some initial collections
db.createCollection('users');
db.createCollection('tasks');

// Create default admin user
const bcrypt = require('bcryptjs');
const adminPassword = '$2a$10$rQHH3UKLdUqb8xmJ9LbPAOd7HGHfX0PtPYPwDhcN3YL3hWqFUUEeC'; // Hashed version of '1234567890@Se'

db.users.insertOne({
  email: 'admin@semir.com',
  password: adminPassword,
  role: 'admin',
  permissions: [
    'read_all_tasks',
    'create_tasks',
    'update_all_tasks',
    'delete_all_tasks',
    'manage_users'
  ],
  createdAt: new Date(),
  updatedAt: new Date()
}); 