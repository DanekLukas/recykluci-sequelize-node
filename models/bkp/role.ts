import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface roleAttributes {
  id: number;
  name?: string;
}

export type rolePk = "id";
export type roleId = role[rolePk];
export type roleOptionalAttributes = "id" | "name";
export type roleCreationAttributes = Optional<roleAttributes, roleOptionalAttributes>;

export class role extends Model<roleAttributes, roleCreationAttributes> implements roleAttributes {
  id!: number;
  name?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof role {
    return sequelize.define('role', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: true,
      unique: "name"
    }
  }, {
    tableName: 'role',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  }) as typeof role;
  }
}
