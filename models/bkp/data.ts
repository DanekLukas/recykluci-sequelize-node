import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { basket, basketId } from './basket';
import type { category, categoryId } from './category';
import type { homepage, homepageId } from './homepage';
import type { image, imageId } from './image';
import type { sells_item, sells_itemId } from './sells_item';
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
  // data hasMany basket via data_id
  baskets!: basket[];
  getBaskets!: Sequelize.HasManyGetAssociationsMixin<basket>;
  setBaskets!: Sequelize.HasManySetAssociationsMixin<basket, basketId>;
  addBasket!: Sequelize.HasManyAddAssociationMixin<basket, basketId>;
  addBaskets!: Sequelize.HasManyAddAssociationsMixin<basket, basketId>;
  createBasket!: Sequelize.HasManyCreateAssociationMixin<basket>;
  removeBasket!: Sequelize.HasManyRemoveAssociationMixin<basket, basketId>;
  removeBaskets!: Sequelize.HasManyRemoveAssociationsMixin<basket, basketId>;
  hasBasket!: Sequelize.HasManyHasAssociationMixin<basket, basketId>;
  hasBaskets!: Sequelize.HasManyHasAssociationsMixin<basket, basketId>;
  countBaskets!: Sequelize.HasManyCountAssociationsMixin;
  // data hasMany homepage via data_id
  homepages!: homepage[];
  getHomepages!: Sequelize.HasManyGetAssociationsMixin<homepage>;
  setHomepages!: Sequelize.HasManySetAssociationsMixin<homepage, homepageId>;
  addHomepage!: Sequelize.HasManyAddAssociationMixin<homepage, homepageId>;
  addHomepages!: Sequelize.HasManyAddAssociationsMixin<homepage, homepageId>;
  createHomepage!: Sequelize.HasManyCreateAssociationMixin<homepage>;
  removeHomepage!: Sequelize.HasManyRemoveAssociationMixin<homepage, homepageId>;
  removeHomepages!: Sequelize.HasManyRemoveAssociationsMixin<homepage, homepageId>;
  hasHomepage!: Sequelize.HasManyHasAssociationMixin<homepage, homepageId>;
  hasHomepages!: Sequelize.HasManyHasAssociationsMixin<homepage, homepageId>;
  countHomepages!: Sequelize.HasManyCountAssociationsMixin;
  // data hasMany sells_item via data_id
  sells_items!: sells_item[];
  getSells_items!: Sequelize.HasManyGetAssociationsMixin<sells_item>;
  setSells_items!: Sequelize.HasManySetAssociationsMixin<sells_item, sells_itemId>;
  addSells_item!: Sequelize.HasManyAddAssociationMixin<sells_item, sells_itemId>;
  addSells_items!: Sequelize.HasManyAddAssociationsMixin<sells_item, sells_itemId>;
  createSells_item!: Sequelize.HasManyCreateAssociationMixin<sells_item>;
  removeSells_item!: Sequelize.HasManyRemoveAssociationMixin<sells_item, sells_itemId>;
  removeSells_items!: Sequelize.HasManyRemoveAssociationsMixin<sells_item, sells_itemId>;
  hasSells_item!: Sequelize.HasManyHasAssociationMixin<sells_item, sells_itemId>;
  hasSells_items!: Sequelize.HasManyHasAssociationsMixin<sells_item, sells_itemId>;
  countSells_items!: Sequelize.HasManyCountAssociationsMixin;
  // data belongsTo image via id
  id_image!: image;
  getId_image!: Sequelize.BelongsToGetAssociationMixin<image>;
  setId_image!: Sequelize.BelongsToSetAssociationMixin<image, imageId>;
  createId_image!: Sequelize.BelongsToCreateAssociationMixin<image>;
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
      primaryKey: true,
      references: {
        model: 'image',
        key: 'data_id'
      }
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
