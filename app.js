import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public")); // for serving CSS/images
app.use(bodyParser.urlencoded({extended: true}));  

const blogPosts = [];
app.get("/", (req, res) => {
  		res.render("home.ejs", { posts: blogPosts } );
});

//{ posts: blogPosts } => this is an object, we are sending data to home.ejs with this code
// -> blogPosts is the JavaScript variable in your server that stores all blog post data.
// -> posts is the name of the variable inside EJS that you’ll use to access that data.

app.get("/compose", (req,res) => {

    
    res.render("compose.ejs");


})

app.post("/compose", (req,res) => {
    const newPost = {
        id: uuidv4(),
        title: req.body.blogTitle,
        body: req.body.blogBody,
    };

    blogPosts.push(newPost);
    res.redirect("/");
})


app.get("/edit/:postId", (req, res) => {
    //The :postId is a placeholder for any dynamic value in the URL.
    
    const requestedId = req.params.postId;
    const selectedPost = blogPosts.find(blog => blog.id === requestedId);

    if(selectedPost){

        res.render("edit.ejs", { post: selectedPost });
    }

    else{
        res.status(404).send("Post not found");
    }
})

app.post("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    const updatedTitle = req.body.blogTitle;
    const updatedBody = req.body.blogBody;

    const postIndex = blogPosts.findIndex(blog => blog.id === postId);
    if(postIndex !== -1 ){
        blogPosts[postIndex].title = updatedTitle;
        blogPosts[postIndex].body = updatedBody;
        res.redirect("/");
    
    }
    else{
        res.status(404).send("Post not found");
    }
})


app.get("/post/:postId", (req, res) => {

    const requestedId = req.params.postId;
    const selectedPost = blogPosts.find(blog => blog.id === requestedId);

    if(selectedPost){

        res.render("post.ejs", { post: selectedPost });
    }
    else{
        res.status(404).send("Post not Found");
    }
    
})

app.post("/delete/:postId", (req,res) => {
    const requestedId = req.params.postId;

    //Remove the post from posts array
    const index = blogPosts.findIndex(post => post.id === requestedId);
    if(index !== -1) {
        blogPosts.splice(index, 1);
    }

    res.redirect("/");
})


app.listen(port, () => {
    console.log("Server is running on port " + port);
})
