

//Initializing Express Router
const Router=require("express").Router();
//Database Models

const PublicationModel=require("../../database/author");


/*  Publication API 1
Route             /publications
Description       get all publications
Access            public (no password entered)
Parameter         none
Methods           GET    
*/
Router.get("/", (req, res) => {

    return res.json({publications: database.publication});
});


/*  Publication API 2
Route             /publications/name
Description       get specific publications
Access            public (no password entered)
Parameter         name
Methods           GET    
*/
Router.get("/name/:name", (req, res) => {
    const getSpecificPublication = database.publication.filter((publication) =>
      publication.name.includes(req.params.name)
    );
  
    if (getSpecificPublication.length === 0) {
      return res.json({
        error: `No Publication found with the name  ${req.params.name}`,
      });
    }
  
    return res.json({ authors: getSpecificPublication });
  });


  /*  Publication API 3
Route             /publications/book
Description       get specific publications based on books
Access            public (no password entered)
Parameter         books
Methods           GET    
*/
Router.get("/book/:books", (req, res) => {
    const getSpecificPublication = database.publication.filter((publication) =>
      publication.books.includes(req.params.books)
    );
  
    if (getSpecificPublication.length === 0) {
      return res.json({
        error: `No Publication found with the name  ${req.params.books}`,
      });
    }
  
    return res.json({ authors: getSpecificPublication });
  });
  
  
  
  









/*  Publication API 4
Route             /publication/add
Description       add new publication
Access            public (no password entered)
Parameter         none
Methods           POST  
*/
Router.post("/add", (req,res) => {
    const {newPublication} = req.body;
    database.publication.push(newPublication);
    return res.json({publications: database.publication});

});

 






 


 
  








/*  Publication API 5
Route             /publications/update/name
Description       update publication name
Access            public (no password entered)
Parameter         name
Methods           PUT   
*/
Router.put("/update/name/:name", (req, res) => {
    database.publications.forEach((publication) => {
        if(publication.name === req.params.name){
            publication.name = req.body.newPublicationName;
            return;
        }
    });
    return res.json({publications: database.publications});

});



/*  Publication API 6
Route             /publication/update/book
Description       update/add new book to a publication
Access            public (no password entered)
Parameter         isbn
Methods           PUT   
*/
Router.put("/update/book/:isbn", (req,res) =>{
    //update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
      });
  
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books, 
        publications: database.publications,
        message: "Successfully updates publication",
      });
  }); 







/*  Publication API 7
Route             /publication/delete/
Description       delete the publication
Access            public (no password entered)
Parameter         name
Methods           DELETE   
*/
Router.delete("/delete/:nme", (req,res) =>{
    const updatedPublicationDatabase = database.publications.filter(
           (publication) => publication.name !== req.params.name
       );
       database.publications = updatedPublicationDatabase; 
       return res.json({publications: database.publications});
 }); 



/*  Publication API 8
Route             /publication/delete/book
Description       delete a book from publications
Access            public (no password entered)
Parameter         isbn, publication Id
Methods           DELETE   
*/
Router.delete("/delete/book/:isbn/:pubId", (req,res) =>{
    //update publication database
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = database.publication.books.filter(
                (book)  => book !== req.params.isbn
                );
                database.publication.books = newBooksList;
                return;
        }
    });
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0;  //no publication available
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publication,
    });
}); 

module.exports=Router;