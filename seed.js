const dynamoose = require("dynamoose")
const uuid = require("uuid")

dynamoose.aws.ddb.local("http://localhost:8000");

const Model = dynamoose.model("Model", new dynamoose.Schema({
  PK: {type: String, hashKey: true},
  SK: {type: String, rangeKey: true},
  props: { type: Object, required: false, schema: {} }
}, {saveUnknown: true}))

new dynamoose.Table('Table', [Model], {create: true, update: true,waitForActive: true, initialize: true})

async function seed(propCount) {
  console.log(`seeding 1000 objects with ${propCount} props`)
  const objs = []

  for (let i = 0; i <= 1000; i += 1) {
    const obj = {
      PK: String(propCount),
      SK: uuid.v4(),
      props: {}
    }

    for (let j = 0; j <= propCount; j+= 1) {
      const prop = uuid.v4()
      obj.props[prop] = {}
    }

    objs.push(obj)
  }
  
  const BATCH_PUT_CHUNK_SIZE = 25
  const chunks = []

  for (let i = 0; i <= objs.length; i += BATCH_PUT_CHUNK_SIZE) {
    chunks.push(objs.slice(i, i + BATCH_PUT_CHUNK_SIZE))
  }

  for (const chunk of chunks) {
    await Model.batchPut(chunk)
  }
  
  console.log(`seeding done for objects with ${propCount} props`)
}

seed(5).then(() => seed(250)).then(() => seed(500))
