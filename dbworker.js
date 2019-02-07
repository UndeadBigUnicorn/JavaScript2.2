const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productScheme = new Schema({name: String, amount:{type: Number, default: 1}, bought:{type: Boolean, default: false}}, {versionKey: false});
const Product = mongoose.model("Product", productScheme);
const CONNECTION_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/productsdb";

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true }, (err)=> {
    if(err) return console.log(err);
    // mongoose.connection.db.dropDatabase();
});

module.exports.saveToDb = (_name, callback)=>{
    let product = new Product({name: _name});   
    product.save((err,doc)=> {
        if(err) return console.log(err);
        callback(doc);
        });
};

module.exports.getAllFromDb = (callback)=>{
    Product.find((err,doc)=> {
        if(err)  return console.log(err);
        callback(doc);
   });
};

module.exports.deleteFromDb = (_id, callback)=>{
    Product.deleteOne({ _id: _id }, (err)=> {
        if (err) return console.log(err);
        callback();
      });
}

module.exports.updateNameDb = (_id, newName, callback)=>{
    Product.updateOne({_id:_id}, {name: newName}, (err, result)=>{
        if (err) return console.log(err);
        callback();
    });
}

module.exports.updateAmountDb = (_id, newAmount, callback)=>{
    Product.updateOne({_id:_id}, {amount: newAmount}, (err, result)=>{
        if (err) return console.log(err);
        callback();
    });
}

module.exports.updateStatusDb = (_id, newStatus, callback)=>{
    Product.updateOne({_id:_id}, {bought: newStatus}, (err, result)=>{
        if (err) return console.log(err);
        callback();
    });
}