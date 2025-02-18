'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Review', 'replies', 'replyList');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Review', 'replyList', 'replies');
  }
};
