const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const express    = require('express');

app              = express();

mongoose.connect("mongodb://localhost:27017/TWDB", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
    res.redirect("/blogs")
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log('ERROR!');
        }
        res.render("index",{blogs})        
    })
});

app.get("/blogs/new", (req, res) => {
    res.render("new")
})

app.post("/blogs", (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new")
        }
        res.redirect("/blogs");
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs")
        }
        res.render("show", { blog: foundBlog })
    })
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs")
        }
        res.render("edit", { blog: foundBlog });
    }) 
})

app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect("/blogs")
        }
        res.redirect("/blogs/" + req.params.id)
    })
})

app.listen(3567, function() {
    console.log('server is running');  
})
