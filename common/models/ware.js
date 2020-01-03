export default (sequelize, DataTypes) => {
  const Ware = sequelize.define('ware', {
    ean: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true,
        hasCorrectLength: function (value) {
          if (!(value.length >= 8 && value.length <= 13)) {
            throw new Error("ean has to be between 8 and 13 numbers!");
          }
        }
      },
    },
    name: {
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

