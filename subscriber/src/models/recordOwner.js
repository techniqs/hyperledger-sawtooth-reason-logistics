export default (sequelize, DataTypes) => {
  const RecordOwner = sequelize.define('recordOwner', {
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
    record_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.record,
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
  RecordOwner.associate = models => {
    RecordOwner.belongsTo(models.Record, { foreignKey: 'id', onDelete: 'CASCADE' });
    RecordOwner.belongsTo(models.Agent, { foreignKey: 'id', onDelete: 'CASCADE' });
  };


  return RecordOwner;
};

