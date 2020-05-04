/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const models = require('../../models')
const sinonChai = require('sinon-chai')
const {
  afterEach, before, beforeEach, describe, it
} = require('mocha')
const { villainsList, singleVillain, addedVillain } = require('./mocks/villains')
const { getAllVillains, getVillainsBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let sandbox
  let stubbedFindOne
  let stubbedFindAll
  let stubbedCreate
  let stubbedSend
  let response
  let stubbedStatus
  let stubbedStatusSend
  let stubbedSendStatus
  let attributes

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.villains, 'findOne')
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedCreate = sandbox.stub(models.villains, 'create')

    attributes = ['name', 'movie', 'slug']

    stubbedSend = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedSendStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the whole list', async () => {
      stubbedFindAll.returns(villainsList)

      await getAllVillains({}, response)
      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
    it('throws a 500 status when it has trouble fetching all villains', async () => {
      stubbedFindAll.throws('Error')
      await getAllVillains({}, response)
      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unreachable Villain')
    })
  })

  describe('getVillainsBySlug', () => {
    it('retrieves a villain connected to the provided slug from the database and calls response.send() with it', async () => {
      stubbedFindOne.returns(singleVillain)
      const request = { params: { slug: 'hades' } }

      await getVillainsBySlug(request, response)


      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'hades' }, attributes })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })
    it('returns a 404 when no villain is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'not-found' } }

      await getVillainsBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' }, attributes })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
    it('returns 500 with an error message when the DataBase call throws and error', async () => {
      stubbedFindOne.throws('Error')
      const request = { params: { slug: 'throw-error' } }

      await getVillainsBySlug(request, response)
      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'throw-error' }, attributes })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unreachable Villain')
    })
  })

  describe('saveNewVillain', () => {
    it('takes a new villain details and saves them as a new villain, returning the saved records with a status of 201', async () => {
      stubbedCreate.returns(addedVillain)
      const request = { body: addedVillain }

      await saveNewVillain(request, response)

      expect(stubbedStatusSend).to.have.been.calledWith(addedVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedCreate).to.have.been.calledWith(addedVillain)
    })
    it('returns a 400 status when not all required fields are provided (NAME not provided)', async () => {
      const { movie, slug } = addedVillain
      const request = { body: { movie, slug } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusSend).to.have.been.calledWith('Missing Field: name, movie, slug')
    })
    it('returns a 500 status when an error occurs saving the new villain', async () => {
      const request = { body: addedVillain }

      stubbedCreate.throws('ERROR!')

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(addedVillain)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unreachable Villain')
    })
  })
})
