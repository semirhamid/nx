const userRepository = require('../repositories/user.repository');
const teamRepository = require('../repositories/team.repository');
const { ApiError } = require('../middlewares/errorHandler');
const { PERMISSIONS } = require('../data/models/user.model');

class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async updateUser(id, data) {
    return userRepository.update(id, data);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }

  async assignRole(userId, role) {
    if (!['user', 'admin', 'manager'].includes(role)) {
      throw new ApiError(400, 'Invalid role');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return userRepository.update(userId, { role });
  }

  async addUserToTeam(userId, teamId, currentUser) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if current user is admin or the team's manager
    if (currentUser.role !== 'admin' && team.managerId.toString() !== currentUser.id) {
      throw new ApiError(403, 'Not authorized to modify this team');
    }

    user.teamId = teamId;
    await user.save();

    // Add user to team members
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    return user;
  }

  async removeUserFromTeam(userId, currentUser) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.teamId) {
      throw new ApiError(400, 'User is not in any team');
    }

    const team = await teamRepository.findById(user.teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if current user is admin or the team's manager
    if (currentUser.role !== 'admin' && team.managerId.toString() !== currentUser.id) {
      throw new ApiError(403, 'Not authorized to modify this team');
    }

    // Remove user from team
    team.members = team.members.filter(memberId => memberId.toString() !== userId);
    await team.save();

    user.teamId = null;
    await user.save();

    return user;
  }

  async addPermissions(userId, permissions) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Validate permissions
    const allPermissions = new Set(Object.values(PERMISSIONS).flat());
    const invalidPermissions = permissions.filter(p => !allPermissions.has(p));
    if (invalidPermissions.length > 0) {
      throw new ApiError(400, `Invalid permissions: ${invalidPermissions.join(', ')}`);
    }

    // Add new permissions without duplicates
    const updatedPermissions = [...new Set([...user.permissions, ...permissions])];
    user.permissions = updatedPermissions;
    await user.save();

    return user;
  }

  async removePermissions(userId, permissions) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Remove specified permissions
    user.permissions = user.permissions.filter(p => !permissions.includes(p));
    await user.save();

    return user;
  }
}

module.exports = new UserService(); 