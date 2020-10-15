const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


//database connection work


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfsyz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  const reviewCollection =  client.db(`${process.env.DB_NAME}`).collection("reviews");
  const addServiceCollection = client.db(`${process.env.DB_NAME}`).collection("addService");
  const addMakeAdminCollection = client.db(`${process.env.DB_NAME}`).collection("addEmail");

  //customer Order send to database from OrderInformation
  app.post("/customerOrder", (req, res)=>{
      const customerOrder = req.body;
      orderCollection.insertOne(customerOrder)
      .then(result =>{
          res.send(result.insertedCount > 0)

        
      })
  })
//customer Order loaded to ServiceList
  app.get("/getCustomerOrder", (req, res) =>{
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  //All customer order loaded in Admin ServiceList
  app.get("/getAllCustomerOrder", (req, res) =>{
    orderCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  //customer review send to database from ReviewInformation
  app.post("/customerReview", (req, res)=>{
    const customerReview = req.body;
    reviewCollection.insertOne(customerReview)
    .then(result =>{
        res.send(result.insertedCount > 0)
   
    })
})
//load customer review to (home-->ClientsReview) 
app.get("/getCustomerReview", (req, res) =>{
    reviewCollection.find({ })
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

//send addService data from AdminAddService
app.post("/addService", (req, res)=>{
  const addService = req.body;
  addServiceCollection.insertOne(addService)
  .then(result =>{
      res.send(result.insertedCount > 0)
 
  })
})
//get addService data from mongo send to (Home-->Services)
app.get("/getAddService", (req, res) =>{
  addServiceCollection.find({})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})
//send MakeAdmin email to database
app.post("/addEmail", (req, res)=>{
  const addEmail = req.body;
  addMakeAdminCollection.insertOne(addEmail)
  .then(result =>{
      res.send(result.insertedCount > 0)
 
  })
})
//get Make Admin Email and send to Private Route
app.get("/getAddEmail", (req, res) =>{
  addMakeAdminCollection.find({email: req.query.email})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})
  
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(process.env.PORT || 5000);