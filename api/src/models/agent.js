const agent = (sequelize, DataTypes) => {
    const Agent = sequelize.define('agent', {
      pubKey: {
        type: DataTypes.STRING,
        primaryKey:true,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    });

  
    return Agent;
  };
  
  export default agent;
  