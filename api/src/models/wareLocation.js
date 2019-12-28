export default (sequelize, DataTypes) => {
  const WareLocation = sequelize.define('wareLocation', {
    ware_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.ware,
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
  WareLocation.associate = models => {
    WareLocation.belongsTo(models.Ware, { foreignKey: 'id', onDelete: 'CASCADE' });
  };


  return WareLocation;
};

