//Initializing Express Router
const Router=require("express").Router();
//Database Models

const BookModel=require("../../database/book");

/*  Books API 1
Route             /
Description       get all books
Access            public (no password entered)
Parameter         none
Methods           GET    
*/
Router.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json({books: getAllBooks});
});
/* WAY 1
 Router.get("/", (req,res) => {
     return res.json({books: database.books});
 });
 */

 
/*  Books API 2
Route             /is
Description       get specific books
Access            public (no password entered)
Parameter         isbn
Methods           GET    
*/
Router.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})


    if(!getSpecificBook){
        return res.json({
            error: `No book found for the isbn of ${req.params.isbn}`,
        });
    }
    return res.json({book: getSpecificBook});
});
/*WAY 1
Router.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    ); 
});*/

/*  Books API 3
Route             /c
Description       get books based on category
Access            public (no password entered)
Parameter         category
Methods           GET    
*/
Router.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getSpecificBook.length === 0){
        return res.json({
            error: `No book found for the given category of ${req.params.category}`,

        });
    }
    return res.json({book: getSpecificBook});
});

/*  Books API 4
Route             /lang
Description       get list of books based on languages
Access            public (no password entered)
Parameter         language
Methods           GET    
*/
Router.get("/lang/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book found in the language ${req.params.language}`,
        });
    }
    return res.json({book: getSpecificBook});
});

 /*  Books API 5
Route             /book/add
Description       add new book
Access            public (no password entered)
Parameter         none
Methods           POST 
*/
Router.post("/add", (req,res) => {
    console.log(req.body);
    const {newBook} = req.body;
    database.books.push(newBook);
    return res.json({books: database.books});
});

/*  Books API 6
Route             /book/update/title
Description       update  book title
Access            public (no password entered)
Parameter         isbn
Methods           PUT  
*/
Router.put("/update/title/:isbn", async (req, res) => {

    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn,
    },
    {
        title:req.body.BookTitle,
    },
    {
        new:true,
    }
);
return res.json({books: updateBook}); 
}); 

/*   WAY 1
Router.put("/book/update/title/:isbn", (req,res) => {
      /Two approaches - forEach or Map
     /using forEach
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    }); 
    return res.json({books: database.books}); 
});  */



/*  Books API 7
Route             /book/update/author
Description       update/add new author
Access            public (no password entered)
Parameter         isbn authorId
Methods           PUT  
*/
Router.put("/book/update/author/:isbn", async (req,res) => {
    //update book database 
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $push:{
                authors:req.body.newAuthor,
            }
        },
        {
            new:true
        }
    );

    const updatedAuthor=database.booky.findOneAndUpdate({
        id:req.body.newAuthor
    },
    {
        $push:{
            books:req.params.isbn,
        }
    },
    {
       new:true
    })
});





       //we check with isbn and push 
       

  /*  WAY 1
    booky.put("/book/update/author/:isbn/:authorId",(req,res) => {
     database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
           return book.author.push(parseInt(req.params.authorId));
        }
    }); 
      /update author database
      /we check with authorId and push isbn
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
           return author.books.push(req.params.isbn);
        }
    });
    return res.json({
        books: database.books,
        author: database.author,
    }); 
}); */


// Books API 8
// Route             /book/delete
// Description       delete a book
// Access            public (no password entered)
// Parameter         isbn
// Methods           DELETE  

Router.delete("/delete/:isbn", async (req,res) => {

    const updatedBookDatabase = await BookModel.findOneAndDelete({
        ISBN: req.params.isbn,
    });
    //const updatedBookDatabase = database.books.filter(
    //   (book) => book.ISBN !== req.params.isbn
    //    );

        database.books = updatedBookDatabase; 
        return res.json({books: database.books});
}); 

 /*  WAY 1
 Router.delete("/book/delete/:isbn", (req,res) =>{
    const updatedBookDatabase = database.books.filter(
           (book) => book.ISBN !== req.params.isbn
       );
       database.books = updatedBookDatabase; 
       return res.json({books: database.books});
 }); */


 /*  Books API 9
Route             /book/delete/author
Description       delete an author from a book
Access            public (no password entered)
Parameter         isbn
Methods           DELETE  
*/
Router.delete("/delete/author/:isbn/:authorId", async (req,res) =>{
    const updatedBook = await BookModel.findOneAndUpdate({
        
            ISBN: req.params.isbn,
      },
       {
           $pull: {
              authors: parseInt(req.params.authorId),
            },
       },
       {
         new:true
       },
       )

       const updatedAuthor=await AuthorModel.findOneAndUpdate({
           id:parseInt(req.params.authorId),
       },
       {
           $pull:{
               books:req.params.isbn,
           },
       },
       {
           new:true
       })
       return res.json({
        book: updatedBook,
        author: updatedAuthor,
        message: "Author was deleted!",
    });

    });
  
  /*  WAY 1 
    /update the book database
   Router.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });
    /update the author database
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)){
            const newBooksList = author.books.filter(
                (book) => book.ISBN !== req.params.isbn
            );
            author.books = newBooksList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.authors,
        message: "Author was deleted!",
    });
}); */
module.exports=Router;