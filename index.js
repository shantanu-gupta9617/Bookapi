require("dotenv").config();
const express=require("express");
const mongoose = require('mongoose');

const booky=express();

//configuration

booky.use(express.json())

//Establish Database Connection
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true}
)
.then(()=>console.log("Connection estblished!!!!!"));

//Database
const database=require("./database/database");

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
booky.get("/author/:isbn",(req,res)=>{
    const getSpecificBook=database.author.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificBook.length===0)
    {
        return res.json({error: `No book found for the author of ${req.params.isbn}`});
    }

    return res.json({book:getSpecificBook});


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

booky.post("/book/add",(req,res)=>{
    const { newBook }=req.body;

    database.books.push(newBook);

    return res.json({books:database.books});

})

//HTTP client -> helper who helps to make http request

booky.post("/author/add",(req,res)=>{

    const { newAuthor }=req.body;

    database.author.push(newAuthor);

    return res.json({authors:database.author});

})
booky.post("/publication/add",(req,res)=>{
    const {newPublication}=req.body;

    database.publication.push(newPublication);

    return res.json({publications:database.publication});
})

booky.put("/booky/update/title/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            book.title=req.body.newBookTitle;
            return;
        }
    });
    return res.json({books:database.books});

})

booky.put("/book/update/author/:isbn/:authorId",(req,res)=>{
    //update book database

    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            return book.author.push(parseInt(req.params.authorId));
        }
    })

    //update author database
    database.author.forEach((author)=>{
        if(author.id===parseInt(req.params.authorId)) return author.books.push(req.params.isbn);
       
    })
    return res.json({books:database.books,author:database.author})

})

booky.put("/book/update/author/:authorId",(req,res)=>{

    database.author.forEach((author)=>{
        if(author.id===parseInt(req.params.authorId))
        {
            author.name=req.body.newAuthorName;
            return;
        }
        return res.json({author:database.author});
    })
})

booky.put("/book/update/publication/:id",(req,res)=>{
    database.publication.forEach((publications)=>{
        if(publications.id===parseInt(req.params.id))
        {
          publications.name=req.body.newPublicationName;
        }
        return res.json({publication:database.publication});
        
    })
})

booky.route("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    database.publication.forEach((publication)=>{
        if(publication.id===req.body.pubId)
        {
           return publication.books.push(req.params.isbn);
        }

    });
    //update the book database
    database.books.forEach((book)=>{

        if(book.ISBN===req.params.isbn)
        {
            book.publication=req.body.pubId;
            return;
        }
    });
    return res.json({books:database.books,publications:database.publication,message:"Successfilly updated publication"});
});

booky.delete("/book/delete/:isbn",(req,res)=>{
    //replace the whole database
    const updatedBookDatabase=database.books.filter((book)=>book.ISBN!== req.params.isbn);

    database.books=updatedBookDatabase;

    return res.json({books:database.hooks});
});

booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
    //update the book database

    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            const  newAuthorList=book.authors.filter((author)=>author!==parseInt(req.params.authorId));
            book.authors=newAuthorList;
            return;
        }
    });
    //update the authors database
    database.author.forEach((author)=>{
    if(author.id===parseInt(req.params.authorId))
    {
      const newBooksList=author.books.filter((book)=>book !=req.params.isbn);
      author.books=newBooksList;
      return;
    }
    });
    return res.json({book:database.books,author:database.authors,message:"Author was deleted"})

});

// booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
//     database.publication.forEach((publication)=>{
//         if(publication.id===parseInt(req.params.pubId))
//         {
//             const newBookList=
//         }
//     })
// })




booky.listen(3000,()=>console.log("Hey server is running"));