import Sequelize from 'sequelize';

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
    User: sequelize.import('../models/user'),
    Message: sequelize.import('../models/message'),
    Auth: sequelize.import('../models/auth'),
    Block: sequelize.import('../models/block'),
    Agent: sequelize.import('../models/agent'),
    Asset: sequelize.import('../models/asset'),
    AssetLocation: sequelize.import('../models/assetLocation'),
    AssetOwner: sequelize.import('../models/assetOwner'),
};

// const models = {
//     // User: sequelize.import('../../../common/models/user'),
//     // Message: sequelize.import('../../../common/models/message'),
//     // Auth: sequelize.import('../../../common/models/auth'),
//     // Block: sequelize.import('../../../common/models/block'),
//     // Agent: sequelize.import('../../../common/models/agent'),
//     // Record: sequelize.import('../../../common/models/record'),
//     // RecordLocation: sequelize.import('../../../common/models/recordLocation'),
//     // RecordOwner: sequelize.import('../../../common/models/recordOwner'),
// };

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});


export { sequelize };
export default models;