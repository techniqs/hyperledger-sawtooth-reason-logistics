import models, { sequelize } from '../utils/databaseConfig';

export default class Database {
    constructor() {
    }


    async fetchBlock(block_num) {
        return await models.Block.findByPk(block_num);
    }

    async dropFork(block_num) {
        // look at their drop fork method :)
    }

}
