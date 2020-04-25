const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { getAllVillains, getVillainsBySlug, saveNewVillain } = require('./controllers/villains')

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainsBySlug)

app.post('/villains', bodyParser.json(), saveNewVillain)

app.listen(1337, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 1337...')
})

