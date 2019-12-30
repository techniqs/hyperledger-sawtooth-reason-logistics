import models, { Op } from '../utils/databaseConfig';

export default class Database {
    constructor() {
    }


    async fetchBlock(blockNum) {
        return await models.Block.findByPk(blockNum);
    }

    async insertBlock(block) {
        console.log('\x1b[36m%s\x1b[0m', "INSERTING BLOCK ---------------", block);
        await models.Block.create({
            block_num: block.block_num,
            block_id: block.block_id,
        })
    };

    insertUser(user) {
        console.log('\x1b[36m%s\x1b[0m', "INSERTING USER ------------------", user);
        models.User.create({
            public_key: user.pubKey,
            username: user.username,
            timestamp: user.timestamp,
            start_block_num: user.start_block_num,
            end_block_num: user.end_block_num,
        }).catch(function (err) {
            console.log("VALIDATION ERROR", err);
        });
    };


    // timestamp not correct!!
    // users will only be updated when deleted
    //needs to be done
    insertWare(user) {

        models.User.create({
            public_key: user[0],
            username: user[1],
            timestamp: 1234,
            start_block_num: user[3],
            end_block_num: user[4],
        })
    };




    async dropFork(blockNum) {
        models.WareLocation.destroy({
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        });

        models.WareLocation.update({
            end_block_num: null,
        }, {
            where: {
                end_block_num: {
                    [Op.gte]: blockNum
                }
            }
        });

        models.WareOwner.destroy({
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        });

        models.WareOwner.update({
            end_block_num: null,
        }, {
            where: {
                end_block_num: {
                    [Op.gte]: blockNum
                }
            }
        });

        models.Ware.destroy({
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        });

        models.Ware.update({
            end_block_num: null,
        }, {
            where: {
                end_block_num: {
                    [Op.gte]: blockNum
                }
            }
        });

        const pubKeys = (await models.User.findAll({
            attributes: ['public_key'],
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        })).map(user => user.dataValues.public_key);


        models.Auth.destroy({
            where: {
                public_key: pubKeys
            },
        });

        models.User.destroy({
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        });

        models.User.update({
            end_block_num: null,
        }, {
            where: {
                end_block_num: {
                    [Op.gte]: blockNum
                }
            }
        });

        models.Block.destroy({
            where: {
                block_num: {
                    [Op.gte]: blockNum
                }
            },
        });

    }

}
