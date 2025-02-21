const UserEntity = require('../core/entities/user.entity');
const { UserResponseDto } = require('../domain/dtos/user.dto');

class UserMapper {
  static toEntity(model) {
    return new UserEntity(
      model._id.toString(),
      model.email,
      model.password,
      model.role,
      model.createdAt,
      model.updatedAt
    );
  }

  static toDto(entity) {
    return new UserResponseDto(
      entity.id,
      entity.email,
      entity.role,
      entity.createdAt
    );
  }

  static toDomain(dto) {
    return {
      email: dto.email,
      password: dto.password,
      role: dto.role
    };
  }
}

module.exports = UserMapper; 