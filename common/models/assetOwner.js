export default (sequelize, DataTypes) => {
  const AssetOwner = sequelize.define('assetOwner', {
    agent_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.agent,
        key: 'id',
      },
    },
    asset_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.asset,
        key: 'id',
      },
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    start_block_num: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.block,
        key: 'block_num',
      },
    },
    end_block_num: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.block,
        key: 'block_num',
      },
    },
  });

  // this doesnt work 
  AssetOwner.associate = models => {
    AssetOwner.belongsTo(models.Asset, { foreignKey: 'id', onDelete: 'CASCADE' });
    AssetOwner.belongsTo(models.Agent, { foreignKey: 'id', onDelete: 'CASCADE' });
  };


  return AssetOwner;
};

