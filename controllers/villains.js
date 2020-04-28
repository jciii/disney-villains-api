const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll({ attributes: ['name', 'movie', 'slug'] })

  return response.send(villains)
}
const getVillainsBySlug = async (request, response) => {
  const { slug } = request.params

  const matchingSlug = await models.villains.findOne({ where: { slug }, attributes: ['name', 'movie', 'slug'] })

  return matchingSlug
    ? response.send(matchingSlug)
    : response.sendStatus(404)
}
const saveNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response(400).send('Missing Field: name, movie, slug')
  }
  const newVillain = await models.villains.create({ name, movie, slug })

  return response(201).send(newVillain)
}

module.exports = { getAllVillains, getVillainsBySlug, saveNewVillain }
