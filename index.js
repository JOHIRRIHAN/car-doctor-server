const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
console.log(process.env.KEY_NAME)

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.KEY_NAME}:${process.env.SECRET_KEY}@cluster0.zldvxhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! car");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!zzz')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})