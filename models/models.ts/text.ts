import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface textAttributes {
  id: number;
  name: string;
  text?: string;
}

export type textPk = "id";
export type textId = text[textPk];
export type textOptionalAttributes = "id" | "text";
export type textCreationAttributes = Optional<textAttributes, textOptionalAttributes>;

export class text extends Model<textAttributes, textCreationAttributes> implements textAttributes {
  id!: number;
  name!: string;
  text?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof text {
    return sequelize.define('text', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(20000),
      allowNull: true
    }
  }, {
    tableName: 'text',
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
    ]
  }) as typeof text;
  }
}
