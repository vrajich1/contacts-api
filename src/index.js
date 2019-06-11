const { send, json } = require('micro')
const { router, get, post, put, del } = require('microrouter')

const hello = (req, res) => send(res, 200, `Hello ${req.params.who}`)

const notfound = (req, res) => send(res, 404, 'Not found route')

const Datastore = require('nedb-promise')
const db = new Datastore();

module.exports = router(
  get('/hello/:who', hello),
  post('/', async (req, res) => {
    const js = await json(req)
    const insert = await db.insert(js)
    return insert
  }),
  get('/', async (req, res) => {
    return await db.find({})
  }),
  put('/:id', async (req, res) => {
    console.log(req.params.id)
    const js = await json(req)
    console.log(js)
    return js
  }),
  del('/:id', async (req, res) => {
    const js = await json(req)
    console.log(js)
    return js
  }),
  get('/*', notfound)
)