const { send, json } = require('micro') // brought in send and json functionality from micro
const { router, get, post, put, del } = require('microrouter') // brought in functionality (router, get, post, put, del) from microrouter
const Path = require('path') // this changed the backslash for the pathway
const hello = (req, res) => send(res, 200, `Hello ${req.params.who}`)


const notfound = (req, res) => send(res, 404, 'Not found route')

const Datastore = require('nedb-promise') //installed nedb-promise as the database
const db = new Datastore({
  filename: __dirname + Path.sep + 'contacts.db', // the dirname part helps keep the database from stopping. 
  autoload: true
}); // this creates the new database. This is from the documentation for npm nedb-promise


module.exports = router(
  get('/hello/:who', hello),
  get('/', async (req, res) => {
    return await db.find({})
  }),
  post('/', async (req, res) => {
    const js = await json(req) // this is what parces out the body (information) of the request
    const insert = await db.insert(js) //this is what inserts the request (info) into the db (database)
    return insert
  }),
  put('/:id', async (req, res) => {
    console.log(req.params.id)
    const js = await json(req)
    await db.update({ _id: req.params.id }, { ...js })
    console.log(js)
    return await db.findOne({ _id: req.params.id })
  }),
  del('/:id', async (req, res) => {
    const js = await json(req)
    console.log(js)
    return await db.findOne({ _id: req.params.id })
  }),
  get('/:id', async (req, res) => {
    return await db.findOne({ _id: req.params.id })
  }),
  get('/*', notfound)
)