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
    
})