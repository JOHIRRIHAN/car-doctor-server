const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.KEY_NAME}:${process.env.SECRET_KEY}@cluster0.zldvxhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB");

    const serviceCollection = client.db("car-doctors").collection("services");
    const bookingCollection = client.db("car-doctors").collection("bookings");

    app.get("/services", async (req, res) => {
      try {
        const result = await serviceCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send("Failed to fetch services.");
      }
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const option = {
          projection: { title: 1, price: 1, service_id: 1, img: 1 },
        };
        const result = await serviceCollection.findOne(query, option);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Service not found.");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).send("Failed to fetch service.");
      }
    });

    app.get("/bookings", async (req, res) => {
      try {
        const result = await bookingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Failed to fetch bookings.");
      }
    });

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await bookingCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Booking not found.");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).send("Failed to fetch booking.");
      }
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      try {
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send("Failed to create booking.");
      }
    });

    app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 1) {
                res.json({ message: "Booking deleted successfully." });
            } else {
                res.status(404).json({ error: "Booking not found." });
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            res.status(500).json({ error: "Failed to delete booking." });
        }
    });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
