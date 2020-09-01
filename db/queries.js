const knex = require('./knex');
module.exports = {
    product: {
        getAll: function () {
            return knex('product_table');
        },
        getOne: function (id) {
            return knex('product_table').where('id', id).first();
        },
        create: function (product) {
            return knex('product_table').insert(product).returning('*');
        },
        update: function (prodId, product) {
            return knex('product_table').where({ id: prodId }).update(product);
        }
    }
}
