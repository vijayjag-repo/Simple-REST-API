const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res){
    Article.find(function(err,found){
        if(!err){
            res.send(found);
        }
        else{
            res.send(err);
        }
    });
});


app.listen(3000,function(req,res){
    console.log("Server up on 3000");
});