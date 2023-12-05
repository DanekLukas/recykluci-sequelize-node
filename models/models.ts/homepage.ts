import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface homepageAttributes {
  id: number;
  data_id?: number;
  sort?: number;
}

export type homepagePk = "id";
export type homepageId = homepage[homepagePk];
export type homepageOptionalAttributes = "id" | "data_id" | "sort";
export type homepageCreationAttributes = Optional<homepageAttributes, homepageOptionalAttributes>;

export class homepage extends Model<homepageAttributes, homepageCreationAttributes> implements homepageAttributes {
  id!: number;
  data_id?: number;
  sort?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof homepage {
    return sequelize.define('homepage', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    data_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    tableName: 'homepage',
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
  }) as typeof homepage;
  }
}
