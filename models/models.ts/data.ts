import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { category, categoryId } from './category';
import type { user, userId } from './user';

export interface dataAttributes {
  id: number;
  category_id: number;
  user_id: number;
  created: Date;
  name?: string;
  safename: string;
  text?: string;
  price?: number;
  delivery: number;
  size_id?: number;
}

export type dataPk = "id";
export type dataId = data[dataPk];
export type dataOptionalAttributes = "id" | "created" | "name" | "safename" | "text" | "price" | "delivery" | "size_id";
export type dataCreationAttributes = Optional<dataAttributes, dataOptionalAttributes>;

export class data extends Model<dataAttributes, dataCreationAttributes> implements dataAttributes {
  id!: number;
  category_id!: number;
  user_id!: number;
  created!: Date;
  name?: string;
  safename!: string;
  text?: string;
  price?: number;
  delivery!: number;
  size_id?: number;

  // data belongsTo category via category_id
  category!: category;
  getCategory!: Sequelize.BelongsToGetAssociationMixin<category>;
  setCategory!: Sequelize.BelongsToSetAssociationMixin<category, categoryId>;
  createCategory!: Sequelize.BelongsToCreateAssociationMixin<category>;
  // data belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof data {
    return sequelize.define('data', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    safename: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    text: {
      type: DataTypes.STRING(10000),
      allowNull: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    delivery: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 99
    },
    size_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 2
    }
  }, {
    tableName: 'data',
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
        name: "fk_category",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "fk_users",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  }) as typeof data;
  }
}
