export default (sequelize, DataTypes) => {
  const WareOwner = sequelize.define('wareOwner', {
    user_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.user,
        // key: 'id',
      },
    },
    ware_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.ware,
        // key: 'id',
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
      unique: false,
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
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
  });

  // this doesnt work 
  WareOwner.associate = models => {
    WareOwner.belongsTo(models.Ware, { foreignKey: 'id', onDelete: 'CASCADE' });
    WareOwner.belongsTo(models.User, { foreignKey: 'id', onDelete: 'CASCADE' });
  };


  return WareOwner;
};

