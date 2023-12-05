import { initModels } from './models/init-models'
import { Sequelize } from 'sequelize';
import  proces from 'process';
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(proces.env[config.use_env_variable]!, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export const models = initModels(sequelize);
