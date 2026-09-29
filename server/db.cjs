const mongoose = require('mongoose')

const globalState = globalThis.__hostelDazeeMongo || (globalThis.__hostelDazeeMongo = {
  conn: null,
  promise: null,
  models: null,
})

const collectionNames = {
  users: 'users',
  properties: 'properties',
  rooms: 'rooms',
  beds: 'beds',
  bookings: 'bookings',
  payments: 'payments',
  reviews: 'reviews',
  wishlist: 'wishlist',
}

function schemaFor() {
  return new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
  }, {
    strict: false,
    minimize: false,
    versionKey: false,
  })
}

function modelFor(name) {
  if (globalState.models && globalState.models[name]) return globalState.models[name]
  const schema = schemaFor()
  const modelName = 'HostelDazee_' + name
  const model = mongoose.models[modelName] || mongoose.model(modelName, schema, collectionNames[name])
  globalState.models = Object.assign({}, globalState.models || {}, { [name]: model })
  return model
}

async function connectMongo() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required')
  if (globalState.conn && globalState.conn.readyState === 1) return globalState.conn
  if (!globalState.promise) {
    globalState.promise = mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    }).then((instance) => {
      globalState.conn = instance.connection
      return globalState.conn
    }).catch((error) => {
      globalState.promise = null
      globalState.conn = null
      throw error
    })
  }
  return globalState.promise
}

async function getModels() {
  await connectMongo()
  return {
    users: modelFor('users'),
    properties: modelFor('properties'),
    rooms: modelFor('rooms'),
    beds: modelFor('beds'),
    bookings: modelFor('bookings'),
    payments: modelFor('payments'),
    reviews: modelFor('reviews'),
    wishlist: modelFor('wishlist'),
  }
}

async function syncStateFromMongo() {
  const models = await getModels()
  const entries = await Promise.all(Object.entries(models).map(async ([name, Model]) => {
    const docs = await Model.find({}).lean()
    return [name, docs.map(({ _id, ...doc }) => doc)]
  }))
  return Object.fromEntries(entries)
}

module.exports = { connectMongo, getModels, syncStateFromMongo }
