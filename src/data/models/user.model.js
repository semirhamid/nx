const mongoose = require('mongoose');

const ROLES = ['user', 'admin', 'manager'];
const PERMISSIONS = {
  user: ['read_own_tasks', 'create_tasks', 'update_own_tasks', 'delete_own_tasks'],
  manager: ['read_own_tasks', 'create_tasks', 'update_own_tasks', 'delete_own_tasks', 'read_team_tasks'],
  admin: ['read_all_tasks', 'create_tasks', 'update_all_tasks', 'delete_all_tasks', 'manage_users']
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password by default
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: [...new Set(Object.values(PERMISSIONS).flat())]
  }],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Update permissions when role changes
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    this.permissions = PERMISSIONS[this.role] || [];
  }
  next();
});

// Method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
module.exports.PERMISSIONS = PERMISSIONS; 