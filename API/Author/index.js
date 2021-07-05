
//Initializing Express Router
const Router=require("express").Router();
//Database Models

const AuthorModel=require("../../database/author");


/*  Author API 1
Route             /authors
Description       get all authors
Access            public (no password entered)
Parameter         none
Methods           GET    
*/
Router.get("/", async (req, res) => {
    const getAllAuthors=await AuthorModel.find()

    return res.json({authors: getAllAuthors});
});


/*  Author API 2
Route             /author/name
Description       get specific authors
Access            public (no password entered)
Parameter         id
Methods           GET    
*/
Router.get("/name/:name", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) =>
      author.name.includes(req.params.name)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No author found for the id ${req.params.id}`,
        });
    }
    return res.json({authors: getSpecificAuthor});
});


/*  Author API 3
Route             /author/book
Description       get authors based on books
Access            public (no password entered)
Parameter         isbn
Methods           GET    
*/
Router.get("/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*  Author API 4
Route             /author/add
Description       add new author
Access            public (no password entered)
Parameter         none
Methods           POST 
*/
Router.post("/add", (req,res) => {
    const {newAuthor} = req.body;
    database.author.push(newAuthor);
    return res.json({authors: database.author});

});

/*  Author API 5
Route             /author/update/name
Description       update author name
Access            public (no password entered)
Parameter         id
Methods           PUT 
*/
Router.put("/update/name/:name", (req, res) => {
    database.authors.forEach((author) => {
        if(author.name === req.params.name) {
            author.name = req.body.newAuthorName;
            return;
        }
    });
    return res.json({authors: database.authors});
});  


/*  Author API 6
Route             /author/delete/
Description       delete an author 
Access            public (no password entered)
Parameter         name
Methods           DELETE
*/
Router.delete("/delete/:name", (req,res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.name !== req.params.name
    );
    database.authors = updatedAuthorDatabase; 
    return res.json({authors: database.authors});
});

module.exports=Router;