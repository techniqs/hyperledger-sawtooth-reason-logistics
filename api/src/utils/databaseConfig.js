import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
    },
);

const models = {
    Block: sequelize.import('../models/block'),
    User: sequelize.import('../models/user'),
    Auth: sequelize.import('../models/auth'),
    Ware: sequelize.import('../models/ware'),
    WareLocation: sequelize.import('../models/wareLocation'),
    WareOwner: sequelize.import('../models/wareOwner'),
};

// const models = {
//     // Auth: sequelize.import('../../../common/models/auth'),
//     // Block: sequelize.import('../../../common/models/block'),
//     // User: sequelize.import('../../../common/models/user'),
//     // Ware: sequelize.import('../../../common/models/ware'),
//     // WareLocation: sequelize.import('../../../common/models/wareLocation'),
//     // WareOwner: sequelize.import('../../../common/models/wareOwner'),
// };

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});


export { sequelize, Op };
export default models;