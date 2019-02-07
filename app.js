const express= require('express');
const app = express();
const jsonParser = express.json();
const path = require("path");
const db =  require('./dbworker.js');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))

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
   db.getAllFromDb((data)=>{
        res.send(data);
    });

});

app.post('/addProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _name = req.body.name;
   // нужно спросить про промисы как сделать, что бы оно подождало ответа от бд
    db.saveToDb(_name, (data)=>{
        res.send(data);
    });
    
});

app.put('/updateName', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _id = req.body.id;
    let newName = req.body.name;
    db.updateNameDb(_id, newName, ()=>{
        res.send("Success");
    });
});

app.put('/updateAmount', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _id = req.body.id;
    let newAmount = req.body.amount;
    db.updateAmountDb(_id, newAmount, ()=>{
        res.send("Success");
    });
})

app.put('/updateStatus', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _id = req.body.id;
    let newStatus = req.body.status;
    db.updateStatusDb(_id, newStatus, ()=>{
        res.send("Success");
    });
})

app.delete('/deleteProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let _id = req.body.id;
    db.deleteFromDb(_id, ()=>{
        res.send("Success");
    });
    
});

app.listen(PORT, ()=>{
    console.log("Server is running");
});