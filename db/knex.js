const environment = 'development';
const config = require('../knexfile');
const environmentConfig = config[environment];//#endr
const knex = require('knex');
const connection = knex(environmentConfig);

module.exports = connection;