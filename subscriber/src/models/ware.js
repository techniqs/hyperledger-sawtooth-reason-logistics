export default (sequelize, DataTypes) => {
  const Ware = sequelize.define('ware', {
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
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

  return Ware;
};

