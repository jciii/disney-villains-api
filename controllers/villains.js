const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.villains.findAll({ attributes: ['name', 'movie', 'slug'] })

    return response.send(villains)
  } catch (error) { return response.status(500).send('Unreachable Villain') }
}

const getVillainsBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const matchingSlug = await models.villains.findOne({ where: { slug }, attributes: ['name', 'movie', 'slug'] })

    return matchingSlug
      ? response.send(matchingSlug)
      : response.sendStatus(404)
  } catch (error) { return response.status(500).send('Unreachable Villain') }
}

const saveNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.status(400).send('Missing Field: name, movie, slug')
    }
    const newVillain = await models.villains.create({ name, movie, slug })

    return response.status(201).send(newVillain)
  } catch (error) { return response.status(500).send('Unreachable Villain') }
}

module.exports = { getAllVillains, getVillainsBySlug, saveNewVillain }
