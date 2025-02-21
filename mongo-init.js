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