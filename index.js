const express=require("express");


const booky=express();

//Database
const database=require("./database");

//get book
booky.get("/",(req,res)=>{
    return res.json({books: database.books})
})

booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=> book.ISBN===req.params.isbn);

    if(getSpecificBook.length===0)
    {
        return res.json({error: `No book found for the isbn of ${req.params.isbn}`});
    }

    return res.json({book:getSpecificBook});
})

booky.get("/c/:category",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>book.category.includes(req.params.category));
    if(getSpecificBook.length===0)
    {
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book:getSpecificBook});


})

booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
})

booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificBook=database.author.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificBook.length===0)
    {
        return res.json({error: `No book found for the category of ${req.params.isbn}`});
    }

    return res.json({book:getSpecificBook});


})

booky.get("/publications",(req,res)=>{
    return res.json({publications:database.publication});
})


booky.listen(3000,()=>console.log("Hey server is running"));