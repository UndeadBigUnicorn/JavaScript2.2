const mongoose = require("mongoose");
const productScheme = new Schema({name: String, amount: Number}, {versionKey: false});
const Product = mongoose.model("Product", productScheme);

mongoose.connect("mongodb://localhost:27017/productsdb", { useNewUrlParser: true }, (err)=> {
    if(err) return console.log(err);
});

module.exports.saveToDb = (_name,_amount)=> {
    let product = new Product({name: _name, amount: _amount});   
    product.save((err,doc)=> {
        if(err) return console.log(err);
        console.log(doc);
        return doc;
        });
};

module.exports.getAllFromDb = ()=> {
    Product.find((err,doc)=> {
        if(err)  return console.log(err);
        console.log(doc);
        return doc;
   });
};

module.exports.deleteFromDb = (_id)=> {
    Product.deleteOne({ _id: _id }, (err)=> {
        if (err) return console.log(err);

      });
}