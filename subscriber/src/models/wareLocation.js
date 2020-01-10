export default (sequelize, DataTypes) => {
  const WareLocation = sequelize.define('wareLocation', {
    ware_ean: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.ware,
        key: 'ean',
      },
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    //range from -180 - +180    
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: -180,
        max: 180
      },
    },
    //range from -90 - +90
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: -90,
        max: 90
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
  // WareLocation.associate = models => {
  //   WareLocation.belongsTo(models.Ware, { foreignKey: 'id', onDelete: 'CASCADE' });
  // };


  return WareLocation;
};

