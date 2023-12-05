import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataCreationAttributes, dataId } from './data';

export interface imageAttributes {
  id: number;
  data_id: number;
  name?: string;
  mime?: string;
  width?: number;
  height?: number;
}

export type imagePk = "id";
export type imageId = image[imagePk];
export type imageOptionalAttributes = "id" | "name" | "mime" | "width" | "height";
export type imageCreationAttributes = Optional<imageAttributes, imageOptionalAttributes>;

export class image extends Model<imageAttributes, imageCreationAttributes> implements imageAttributes {
  id!: number;
  data_id!: number;
  name?: string;
  mime?: string;
  width?: number;
  height?: number;

  // image hasOne data via id
  datum!: data;
  getDatum!: Sequelize.HasOneGetAssociationMixin<data>;
  setDatum!: Sequelize.HasOneSetAssociationMixin<data, dataId>;
  createDatum!: Sequelize.HasOneCreateAssociationMixin<data>;

  static initModel(sequelize: Sequelize.Sequelize): typeof image {
    return sequelize.define('image', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    data_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    mime: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    width: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    },
    height: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    },
    imageName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.id}_${this.width}_${this.height}_${this.name?.substring(0, this.name?.lastIndexOf('.'))}.${this.mime?.split('/').pop()}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    }
  }, {
    tableName: 'image',
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
        name: "fk_idata",
        using: "BTREE",
        fields: [
          { name: "data_id" },
        ]
      },
    ]
  }) as typeof image;
  }
}
