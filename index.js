const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongodb = require("mongodb");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoClient = mongodb.MongoClient;

const URL = process.env.DB;
const SECRET = process.env.SECRET;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let authenticate = function (req, res, next) {
    //console.log(req.headers.authorization)
    
   if(req.headers.authorization) {
     try {
      let verify = jwt.verify(req.headers.authorization, SECRET);
      if(verify) {
        req.userid = verify._id;
        next();
      } else {
        res.status(401).json({ message: "Unauthorized1" });
      }
     } catch (error) {
      res.json({ message: "🔒Please Login to Continue" });
     }
    } else {
      res.status(401).json({ message: "Unauthorized3" });
    }
  };

  app.post("/register",async function (req, res) {

    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db("flight");

      const user = await db
        .collection("users")
        .findOne({ username: req.body.username });
      if(user){
         res.json({
          message:"Usename already used"
         })
      }else{
        const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hash;
      await db.collection("users").insertOne(req.body);
      await connection.close();
      res.json({
        message: "Successfully Registered",
      });}
    } catch (error) {
      res.status(500).json({
        message: "Error",
      });
    }
  });

app.post("/login",async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("flight");
      const user = await db
        .collection("users")
        .findOne({ username: req.body.username });
  
      if (user) {
        const match = await bcryptjs.compare(req.body.password, user.password);
        if (match) {
          // Token
          // const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "1m" });
          const token = jwt.sign({ _id: user._id }, SECRET);
          res.status(200).json({
            message: "Successfully Logged In",
            token,
          });
        } else {
          res.json({
            message: "Password is incorrect",
          });
        }
      } else {
        res.json({
          message: "User not found Please sign in",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

app.post("/flights",async function (req, res) {
    //console.log(req.body)
    try{
        const connection = await mongoClient.connect(URL);
    const db = connection.db("flight");
    await db.collection("flightsdata").insertOne(req.body);
    await connection.close();
    //console.log(msg)
    res.json({
        message: "Successfully posted",
      });
    }catch(err){
       console.log(err)
    }

})

app.get("/Flightdata",async function (req,res){
    //console.log(req.params.id)
    //console.log(req.headers.receiver)
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("flight");
     let msg= await db.collection("flightsdata").find().toArray();
      await connection.close();
      //console.log(msg)
      res.json(msg)
    
    } catch (error) {
      console.log(error);
    }
})

app.post("/filterdata/:id",async function (req,res){
    // console.log(req.params.id)
    // console.log(req.body.to)
    // console.log(req.body.date)
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db("flight");

        let arr=[...req.body.date]
         //console.log(arr[5]+arr[6])
         let month=(arr[5]+arr[6])*1

          if(month==10){
            console.log(req.body.date)
                var msg= await db.collection("flightsdata").find({From:`${req.params.id}`,To:`${req.body.to}`,date:`${req.body.date}`}).toArray();
                await connection.close();
                
                res.json(msg)
            }else if(month==11){
                var msg= await db.collection("flightsdata").find({From:`${req.params.id}`,To:`${req.body.to}`,date:`${req.body.date}`}).toArray();
                await connection.close();
               
                res.json(msg)
            }else if(month==12){
                var msg= await db.collection("flightsdata").find({From:`${req.params.id}`,To:`${req.body.to}`,date:`${req.body.date}`}).toArray();
                await connection.close();
               
                res.json(msg)
            }else if(month>5){
                var msg= await db.collection("flightsdata").find({From:`${req.params.id}`,To:`${req.body.to}`,date:`${req.body.date}`}).toArray();
                await connection.close();
                
                res.json(msg)
                //console.log(month)
                  }
    //    let msg= await db.collection("flightsdata").find({From:`${req.params.id}`,To:`${req.body.to}`,date:`${req.body.date}`}).toArray();
    //            await connection.close();
    //            console.log(msg)
    //            res.json(msg)
      
      } catch (error) {
        console.log(error);
      }   
})



app.listen(process.env.PORT || 3001);