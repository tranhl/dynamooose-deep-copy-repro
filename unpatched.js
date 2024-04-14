const dynamoose = require("dynamoose")

dynamoose.aws.ddb.local("http://localhost:8000");

const Model = dynamoose.model("Model", new dynamoose.Schema({
  PK: {type: String, hashKey: true},
  SK: {type: String, rangeKey: true},
  props: { type: Object, required: false, schema: {} }
}, {saveUnknown: true}))

const Table = new dynamoose.Table('Table', [Model], {create: true, update: true,waitForActive: true, initialize: false})

async function main() {
  await Table.initialize()

  const start = performance.now()
  await Model.query({ PK: process.argv[2] }).exec()
  const end = performance.now()
  console.log(`done in ${end - start}ms`)
}

main()