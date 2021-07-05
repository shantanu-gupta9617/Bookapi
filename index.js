require("dotenv").config();


//framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index.js");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Microservices Routes
const Books=require("./API/Book");
const Authors=require("./API/Author");
const Publications=require("./API/Publication");

//Initialization
const booky = express();

//configuration
booky.use(express.json());

//console.log


//Establish Database connection
mongoose
.connect(
    process.env.MONGO_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true

    }
)
.then(() => console.log("Connection Established!"));


//Initializing microservices

booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);

  
 //Server Running
booky.listen(3000, () => console.log("Hey the server is running! 😁"));
