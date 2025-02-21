const BaseRepository = require('./base.repository');
const Team = require('../data/models/team.model');

class TeamRepository extends BaseRepository {
  constructor() {
    super(Team, 'team');
  }

  async findByManager(managerId) {
    return this.model.find({ managerId }).populate('members', '-password');
  }
}

module.exports = new TeamRepository(); 