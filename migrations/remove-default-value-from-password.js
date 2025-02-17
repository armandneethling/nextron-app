module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null,
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default_password',
      });
    },
  };
  