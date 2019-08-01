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


//chaining articles
app.route("/articles")
.get(function(req,res){
    //find in db
    Article.find(function(err,found){
        if(!err){
            res.send(found);
        }
        else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    //save to db
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.sendStatus("Successfully added");
        }
        else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    //delete all
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted the articles");
        }
        else{
            res.send(err);
        }
    });
});


//chaining specific article
app.route("/articles/:articleTitle")
.get(function(req,res){
    //find one specific article
    Article.findOne({title: req.params.articleTitle},function(err,found){
        if(found){
            res.send(found);
        }
        else{
            res.send("Nothing Found");
        }
    });
})
.put(function(req,res){
    Article.update({title: req.params.articleTitle},
        {title: req.body.title,content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated");
            }
            else{
                res.send(err);
            }
        });
})
.patch(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body}, //set only the fields mentioned by the user
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
            else{
                res.send(err);
            }
        }
    );
})


app.listen(3000,function(req,res){
    console.log("Server up on 3000");
});