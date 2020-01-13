import models, { Op } from '../utils/databaseConfig';

export default class Database {
    constructor() {
    }


    async fetchBlock(blockNum) {
        return await models.Block.findByPk(blockNum);
    }

    async createBlock(block) {
        await models.Block.create({
            block_num: block.block_num,
            block_id: block.block_id,
        })
    };

    createUser(user) {
        models.User.create({
            pubKey: user.pubKey,
            username: user.username,
            timestamp: user.timestamp,
            start_block_num: user.start_block_num,
            end_block_num: user.end_block_num,
        })
    };

    createWare(ware, start_block_num, end_block_num) {
        models.Ware.create({
            ean: ware.identifier[0].ean,
            timestamp: parseInt(ware.identifier[0].timestamp),
            start_block_num,
            end_block_num,
        });
        models.WareAttribute.create({
            ware_ean: ware.identifier[0].ean,
            name: ware.attributes[0].name,
            uvp: parseFloat(ware.attributes[0].uvp),
            timestamp: parseInt(ware.attributes[0].timestamp),
            start_block_num,
            end_block_num,
        });
        models.WareOwner.create({
            ware_ean: ware.identifier[0].ean,
            user_pubKey: ware.owners[0].pubKey,
            timestamp: parseInt(ware.owners[0].timestamp),
            start_block_num,
            end_block_num,
        });
        models.WareLocation.create({
            ware_ean: ware.identifier[0].ean,
            timestamp: parseInt(ware.locations[0].timestamp),
            latitude: parseFloat(ware.locations[0].latitude),
            longitude: parseFloat(ware.locations[0].longitude),
            start_block_num,
            end_block_num,
        });
    };

    async updateWare(ware, start_block_num, end_block_num) {
        const owner = ware.owners[ware.owners.length - 1];
        const attribute = ware.attributes[ware.attributes.length - 1];
        const location = ware.locations[ware.locations.length - 1];

        await models.WareLocation.update({
            end_block_num: start_block_num,
        }, {
            where: {
                timestamp: {
                    [Op.lt]: parseInt(location.timestamp)
                },
                end_block_num: {
                    [Op.eq]: null
                }
            }
        });

        models.WareLocation.findOrCreate({
            defaults: {
                ware_ean: ware.identifier[0].ean,
                timestamp: parseInt(location.timestamp),
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                start_block_num,
                end_block_num,
            },
            where: {
                end_block_num: {
                    [Op.eq]: null
                }
            }
        })

        await models.WareOwner.update({
            end_block_num: start_block_num,
        }, {
            where: {
                timestamp: {
                    [Op.lt]: parseInt(owner.timestamp)
                },
                end_block_num: {
                    [Op.eq]: null
                }
            }
        });
        models.WareOwner.findOrCreate({
            defaults: {
                user_pubKey: owner.pubKey,
                ware_ean: ware.identifier[0].ean,
                timestamp: parseInt(owner.timestamp),
                start_block_num,
                end_block_num,
            },
            where: {
                end_block_num: {
                    [Op.eq]: null
                }
               
            }
        })
        await models.WareAttribute.update({
            end_block_num: start_block_num,
        }, {
            where: {
                timestamp: {
                    [Op.lt]: parseInt(attribute.timestamp)
                },
                end_block_num: {
                    [Op.eq]: null
                }
            }
        });
        models.WareAttribute.findOrCreate({
            defaults: {
                ware_ean: ware.identifier[0].ean,
                name: attribute.name,
                uvp: parseFloat(attribute.uvp),
                timestamp: parseInt(attribute.timestamp),
                start_block_num,
                end_block_num,
            },
            where: {
                end_block_num: {
                    [Op.eq]: null
                }
              
            }
        })
    }

    async wareInDb(ean) {
        const ware = (await models.Ware.findOne({
            where:
            {
                ean
            }
        }));
        return ware !== null;
    }

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
            attributes: ['pubKey'],
            where: {
                start_block_num: {
                    [Op.gte]: blockNum
                }
            },
        })).map(user => user.dataValues.pubKey);


        models.Auth.destroy({
            where: {
                pubKey: pubKeys
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
