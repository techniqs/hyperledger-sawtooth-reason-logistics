export default (sequelize, DataTypes) => {
  const Auth = sequelize.define('auth', {
    public_key: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey:true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: sequelize.models.user,
        key: 'public_key',
      },
    },
    // private key encrypted with hashed password
    encrypted_private_key: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Auth.associate = models => {
    Auth.belongsTo(models.User, { foreignKey: 'public_key', onDelete: 'CASCADE' });
  };


  return Auth;
};

