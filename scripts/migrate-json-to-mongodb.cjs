const fs = require('fs')
const path = require('path')
const { connectMongo, getModels } = require('../server/db.cjs')

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required')
  const file = path.resolve(__dirname, '../server/data.json')
  const state = JSON.parse(fs.readFileSync(file, 'utf8'))
  const models = await getModels()
  const names = ['users', 'properties', 'rooms', 'beds', 'bookings', 'payments', 'reviews', 'wishlist']

  await connectMongo()
  for (const name of names) {
    const Model = models[name]
    const items = Array.isArray(state[name]) ? state[name] : []
    if (!items.length) continue
    await Model.bulkWrite(items.map((item) => ({
      updateOne: { filter: { id: item.id }, update: { $set: item }, upsert: true }
    })), { ordered: false })
    console.log(name + ': ' + items.length + ' records migrated')
  }
  console.log('MongoDB migration completed successfully.')
}

main().catch((error) => {
  console.error('MongoDB migration failed:', error.message)
  process.exitCode = 1
})
