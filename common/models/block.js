export default (sequelize, DataTypes) => {
  const Block = sequelize.define('block', {
    block_num: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      primaryKey:true,
      validate: {
        notEmpty: true,
      },
    },
    block_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });


  return Block;
};