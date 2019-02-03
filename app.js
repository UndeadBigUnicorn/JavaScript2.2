const app = require('express')();
const jsonParser = express.json();
const path = require("path");
const db =  require('./dbworker.js');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res)=>{
   
    res.sendFile(path.join(__dirname, "/public", "index.html"));
   
});

app.get('/allProducts', (req,res)=>{
    let products = db.getAllFromDb();
    console.log(products)
    res.send(products);
});

app.post('/addProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let name = req.body.name;
    let result = db.saveToDb(name);
    console.log(result);
    res.send(result);
})

app.delete('/deleteProduct', jsonParser, (req,res)=>{
    if(!req.body) return res.sendStatus(400);

    let id = req.body.id;
    db.deleteFromDb(id);
    res.send("Success");
})

app.listen(port, ()=>{
    console.log("Server is running");
});