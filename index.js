const express = require('express');

const path = require('path'); //(POINT 1) path is inbuilt module, we have to require it because we have to set views for the app and we need to set directory
const port = 8000;

const db =require('./config/mongoose');

const Contact =require('./models/contact');
const { error } = require('console');


const app = express();

app.set('view engine', 'ejs');  //(POINT 2) we are telling express that ejs is view or template engine
                                // (POINT 3)  when app is created app has many properties view engine is property and ejs is value

app.set('views',path.join(__dirname,'views')); // we have to join path with views using path.join 

app.use(express.urlencoded({extended:false})); // way to declare parser
app.use(express.static('assets'));

var contactList =[
    {
        name: "Abc",
        number: "123467890"
    },
    {
        name: "xyz",
        number: "5678"
    },
    {
        name: "ghdjd",
        number: "5676464668"
    }
]



app.get('/', function(req,res){   //(POINT 4)  get- whenever there is a serve an i want to fetch some data from database
                                  //(POINT 5) post- whenever i want to send some data and it makes some changes in database and then gives me a response 
                                  //(POINT 6) put- there is something already present , like name, age, is present but gender is missing so it is used to fillin this information
                                  //(POINT 7) patch- eg. like age is 35 in database and I want 33 so here patch will be used
                                  //(POINT 8) delete- when we want to send server an id and delete it  

//   console.log(__dirname);         //(POINT 9) if i write this instead of console.log(req);  and open localhost:port in browser console will give me a path                    
                                    //__dirname is global property
//  res.send('cool it is running');
   
Contact.find({})
.then(contacts => {
  res.render('home', {
    title: "Contact List",
    contact_list: contacts
  });
})
.catch(err => {
  console.log('Error in fetching the contacts from db', err);
  // Handle the error and send an appropriate response
});

});


app.get('/practice', function(req,res){
    return res.render('practice',{
        title:"Let's render practice.ejs"
    });
});
  

app.post('/create-contact', function(req,res){

    // contactList.push(req.body);
     console.log(req.body);
    Contact.create(

         req.body
        
    ).then( function(newContact){
        
        
        return res.redirect('back');
    }).catch( function(err){
        console.log('Error in creating contact', err);
    });

});

app.get('/delete-contact/', function(req,res){
    // console.log(req.query.phone);
    let id = req.query.id;
    // let contactIndex = contactList.findIndex(contact=> contact.phone == phone);

    // if(contactIndex!=-1){
    //     contactList.splice(contactIndex,1);
    // }
     Contact.findByIdAndDelete(id)
     .then(() => {
        return res.redirect('back');
    })
    .catch(err => {
        console.log('Error in deleting an object from the database', err);
        // Handle the error and send an appropriate response
    });
        
    });





app.listen(port, function(err){

    if(err){
        console.log("Error is running int the server", err);
    }
    console.log("yup! My express server is running on the port", port);
});