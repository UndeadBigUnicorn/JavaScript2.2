const express= require('express');
const app = express();
const jsonParser = express.json();
const path = require("path");
//const db =  require('./dbworker.js');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productScheme = new Schema({name: String, amount:{type: Number, default: 1}}, {versionKey: false});
const Product = mongoose.model("Product", productScheme);
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect("mongodb://localhost:27017/productsdb", { useNewUrlParser: true }, (err)=> {
    if(err) return console.log(err);
    //mongoose.connection.db.dropDatabase();
});

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req,res)=>{
   
    res.sendFile(path.join(__dirname, "/public", "index.html"));
   
});

app.get('/allProducts', (req,res)=>{
    // нужно спросить про промисы как сделать, что бы оно подождало ответа от бд
    Product.find((err,doc)=> {
        if(err)  return console.log(err);
        return res.send(doc);
   });
    // let products = db.getAllFromDb();
    // res.send(products);
});

app.post('/addProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _name = req.body.name;
    let product = new Product({name: _name});   
    product.save((err,doc)=> {
        if(err) return console.log(err);
        return res.send(doc);
        });
   // нужно спросить про промисы как сделать, что бы оно подождало ответа от бд
    //let result = db.saveToDb(name);
    // console.log(result);
    // console.log('2')
    // res.send(result);
})

app.delete('/deleteProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _id = req.body.id;
    Product.deleteOne({ _id: _id }, (err)=> {
        if (err) return console.log(err);
        res.send("Success");
      });
    // db.deleteFromDb(id);
    // res.send("Success");
})

app.listen(port, ()=>{
    console.log("Server is running");
});