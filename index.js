const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x13qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World from express delivery server");
});

async function run() {
  try {
    await client.connect();

    const database = client.db("expressDelivery");
    const servicesCollection = database.collection("services");
    const officeBookingCollection = database.collection("officeBookings");

    //send all services GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //send single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //send user booking
    app.get("/officeBookings", async (req, res) => {
      const email = req.query.email;
      const query = { senderEmail: email };
      const cursor = officeBookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //send user booking on tracking
    app.get("/officeBookings/tracking", async (req, res) => {
      const tracking = req.query.tracking;
      const query = { tracking: tracking };
      const cursor = officeBookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //delete a booking
    app.delete("/officeBookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await officeBookingCollection.deleteOne(query);
      res.send(result);
    });

    //receiving data
    app.post("/officeBookings", async (req, res) => {
      const officeBookings = req.body;
      const result = await officeBookingCollection.insertOne(officeBookings);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to port ", port);
});
