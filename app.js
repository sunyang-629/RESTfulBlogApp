const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const express    = require('express');

app              = express();

mongoose.connect("mongodb://localhost:27017/TWDB", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(3567, function() {
    console.log('server is running');  
})
