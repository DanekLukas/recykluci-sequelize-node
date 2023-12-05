import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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
