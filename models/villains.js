const villainsModel = (connection, Sequelize) => connection.define('villains', {
  id: { type: Sequelize.INTEGER, auto_increment: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  movie: { type: Sequelize.STRING },
  slug: { type: Sequelize.STRING }
}, { paranoid: true })

module.exports = villainsModel
