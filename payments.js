const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const { mongoClient } = require('./mongo');
const cors= require('cors');

const app = express();
const port = process.env.PORT
mongoClient();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", value="*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST,PATCH,GET,DELETE");
  next();
});

app.use(function (req, res, next) {

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors({ origin : '*'}));


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/////


app.post('/api/payments', async (req,res) => {
  try{
   // const notification= await axios.post("https://notification-service.vercel.app/api/notification",{
     //   email,
      //  text: "Payment Successful"
      //})
    const email= req.body.email
    const text= req.body.text
    const price= req.body.amount
    const amount= price*100
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: 'tok_mastercard',
      description: 'match ticket',
    });
    return res.status(200).json({
      success: true,
      message: 'Payment Successful',
      id: charge.id,
    });
  } catch(error) {
  console.log("Error ", error)
    return res.status(200).json({
      success: false,
      message: 'Payment Failed',
      errors:error.message
    })
  }
});


app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});