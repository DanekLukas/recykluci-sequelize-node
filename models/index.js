"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
var init_models_1 = require("./models/init-models");
var sequelize_1 = require("sequelize");
var process_1 = require("process");
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize;
if (config.use_env_variable) {
    sequelize = new sequelize_1.Sequelize(process_1.default.env[config.use_env_variable], config);
}
else {
    sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
}
exports.models = (0, init_models_1.initModels)(sequelize);
