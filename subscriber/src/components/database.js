import models from '../utils/databaseConfig';

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

    insertAgent(agent) {
        console.log('\x1b[36m%s\x1b[0m', "INSERTING AGENT ------------------", agent);        
        models.Agent.create({
            public_key: agent.pubKey,
            username: agent.username,
            timestamp: agent.timestamp,
            start_block_num: agent.start_block_num,
            end_block_num: agent.end_block_num,
        }).catch(function(err){
            console.log("VALIDATION ERROR", err);
        });
    };


    // timestamp not correct!!
    // agents will only be updated when deleted
    //needs to be done
    insertWare(agent) {

        models.Agent.create({
            public_key: agent[0],
            username: agent[1],
            timestamp: 1234,
            start_block_num: agent[3],
            end_block_num: agent[4],
        })
    };




    // drop from everytable with that block num
    // not sure why only agents and wares get updated but rest stays..
    dropFork(blockNum) {

        models.Agent.destroy({
            where: {
                start_block_num: {
                    $gte: blockNum
                }
            },
        });

        models.WareLocation.destroy({
            where: {
                start_block_num: {
                    $gte: blockNum
                }
            },
        });

        models.WareOwner.destroy({
            where: {
                start_block_num: {
                    $gte: blockNum
                }
            },
        });

        models.Ware.destroy({
            where: {
                start_block_num: {
                    $gte: blockNum
                }
            },
        });

        models.Block.destroy({
            where: {
                block_num: {
                    $gte: blockNum
                }
            },
        });

    }

}
