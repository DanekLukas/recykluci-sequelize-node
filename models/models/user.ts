import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';

export interface userAttributes {
  id: number;
  name?: string;
  password?: string;
  role_id: number;
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  code?: string;
  country?: string;
  email?: string;
  ip?: number;
  phone: string;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "name" | "password" | "role_id" | "first_name" | "last_name" | "street" | "city" | "code" | "country" | "email" | "ip";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  name?: string;
  password?: string;
  role_id!: number;
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  code?: string;
  country?: string;
  email?: string;
  ip?: number;
  phone!: string;

  // user hasMany data via user_id
  data!: data[];
  getData!: Sequelize.HasManyGetAssociationsMixin<data>;
  setData!: Sequelize.HasManySetAssociationsMixin<data, dataId>;
  addDatum!: Sequelize.HasManyAddAssociationMixin<data, dataId>;
  addData!: Sequelize.HasManyAddAssociationsMixin<data, dataId>;
  createDatum!: Sequelize.HasManyCreateAssociationMixin<data>;
  removeDatum!: Sequelize.HasManyRemoveAssociationMixin<data, dataId>;
  removeData!: Sequelize.HasManyRemoveAssociationsMixin<data, dataId>;
  hasDatum!: Sequelize.HasManyHasAssociationMixin<data, dataId>;
  hasData!: Sequelize.HasManyHasAssociationsMixin<data, dataId>;
  countData!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return sequelize.define('user', {
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
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    first_name: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ip: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'user',
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
      {
        name: "fk_role",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  }) as typeof user;
  }
}
