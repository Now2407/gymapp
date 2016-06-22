var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var auth = require('basic-auth');
var twilio = require('twilio');

//var client = require('./node_modules/twilio/lib')('API_KEY', 'AUTH_TOKEN');
/* ADD DEALS ROUTES & MESSAGES FOR TRAINER, USER, AND GYM ACCOUNT PAGES LATER*/

mongoose.connect('mongodb://localhost/gym');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//var authu = function(req, res, next) {
//        
//        var credentials = auth(req);
//
//        if (!credentials || credentials.name !== 'NAME' || credentials.pass !== 'PASS') {
//    res.statusCode = 401
//    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
//    res.end('Access denied')
//  } else {
//    next();
//  }
//}

//app.use(authu);

app.use(express.static(__dirname + '/public'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var Place = mongoose.model("Place", mongoose.Schema({
        
    claimed: 0, //defualts to 0 for unclaimed and 1 for claimed
    typeofplace: String,
    name: String,
    address: String,
    city: String,
    zipcode: String,
    state: String,
    contract_length: String,
    phone_number: String,
    fulladdress: String,
    cityandstae: String,
    membership: [{
        atype: String,
        arate: String,
        achecked: String,
        adesc: String
    }],
    Facilities: [String],
    Admenities: [String]
    }));



app.get('/place/new', function(req, res){
        
    res.render('../views/addplace.ejs');
});

app.get('/place/new/thankyou', function(req, res){
        res.send('thank you!');
});

app.post('/place/new', function(req, res){

    
        
var block = [];
var block2 = [];
var block3 = [];

        
        if (req.body.memberships === undefined) {
               console.log('membership is blank');
               return;
       }
       if (req.body.memberships === "") {
                console.log('membership is blank');
                return;
       }
       
       
     
       
     for (var i=0; i < req.body.memberships.length; i++) {
     
 
     
   block.push({"atype": req.body["memberships"][i]["type"], "adesc": req.body["memberships"][i]["desc"], "arate": req.body["memberships"][i]["rate"], "achecked": req.body["memberships"][i]["checked"]});
     
     
     }
 
 for (var i=0; i < req.body.Facilities.length; i++) {

     
 
     
   block2.push(req.body["Facilities"][i]["item"]);
     
     
     }
     
     
      for (var i=0; i < req.body.Admenities.length; i++) {
    
 
     
   block3.push(req.body["Admenities"][i]["aitem"]);
     
     
     }
     
     var s = req.body["details"][5]["state"];
     var state = s.toUpperCase();
     
     var thecity = req.body["details"][3]["city"];
     var theaddress = req.body["details"][2]["address"];
     
     
var place = new Place({
        
        membership: block,
        Facilities: block2,
        Admenities: block3,
        typeofplace: req.body["details"][0]["typeofplace"],
        name: req.body["details"][1]["name"],
        address: theaddress,
        city: thecity,
        cityandstae: thecity + ", " + state,
        zipcode: req.body["details"][4]["zipcode"],
        state: state,
        contract_length: req.body["details"][6]["contract_length"],
        phone_number: req.body["details"][7]["phone_number"],
        fulladdress: theaddress + " " + thecity +", " + state + " "+ req.body["details"][4]["zipcode"],
       
        
        
        
});

place.save(function(err, data){
        console.log(data);
        console.log(err);
        
        if (!err) {
         res.send('inserted');

        }

});

        
         //if (
        //    membershipline.type === undefined
        //    || membershipline.type.length > 0 ||
        //    membershipline.desc !== undefined ||
        //    membershipline.desc.length > 0
        //    ) {
        //        
        //        res.send(200, {error: 'invalid membershipline'});
        //        console.error('submitted wrong membership');
        //        return;
        //}  
  
  

});

app.get('/', function(req, res){
        

res.render('../views/home.ejs', {action: "/gyms/search", method:"GET", value:"search"});

        
});
app.get('/gyms', function(req, res){
                
         
res.render('../views/home.ejs', {action: "/gyms/search", method:"GET", value:"search"});

        
});
app.get('/studios', function(req, res){
                
         
res.render('../views/home.ejs', {action: "/studios/search", method:"GET", value:"search"});


        
});
app.get('/clubs', function(req, res){
                
         //shows home page
         
res.render('../views/home.ejs', {action: "/clubs/search", method:"GET", value:"search"});


        
});

app.get('/gyms/search', function(req, res){
                    var city = req.query.city;
    
          
        
       Place.find({cityandstae: city, typeofplace: "gym"}, function(err, somedata){
                
        if (somedata) {
                
              //  console.log(JSON.stringify(somedata));
               res.render('../views/results.ejs', {msg: "results found", data: somedata}); 
        }
        
       });
        
     
});

app.get('/place', function(req, res){
        
        var id = req.query.id;
        
        Place.findOne({_id: id}, function(err, place){
                
                if (place) {
                        res.render('../views/place.ejs', {aplace: place}); 
                }
                
                console.log(place);
        });
        
        
});

app.get('/clubs/search', function(req, res){
        
      
        
                
                res.render('../views/results.ejs', {city: req.query.city});


        
});
app.get('/studios/search', function(req, res){
                
                res.render('../views/results.ejs', {city: req.query.city});


        
});



app.get('/login', function(req, res){
        
        //handles trainer, place, and user login
        
        
        
});


app.get('/signup', function(req, res){
        
        //handles trainer and user signup
        
});

app.get('/place/dashboard', function(req, res){
                
         //shows dashboard for the place

        
});
app.get('/trainers/account', function(req, res){
                
         //shows trainer tabs page

        
});

app.get('/user', function(req, res){
        
        //shows user tabs page
        
});
app.get('/trainers', function(req, res){
                
         //shows trainers near your area

        
});
app.get('/trainer/:id', function(req, res){
                
         //shows trainer prpfile page 

        
});

                

app.get('/advice/topics', function(req, res){
                
         //shows topic links

        
});
app.get('/advice/topics/:id', function(req, res){
                
         //shows a certian topic feed

        
});

app.get('/advice/ask', function(req, res){
                
         //ask a quesiton page

        
});
app.get('/deals', function(req, res){
                
         //shows deals near your location based on term

        
});
app.get('/deals/:id', function(req, res){
                
         //displays deal detail

        
});
app.get('/deal/buy', function(req, res){
                
         //check out flow for a deal

        
});
app.get('/compare', function(req, res){
                
         //landing page explaining compare

        
});
app.get('/compare/search', function(req, res){
                
         //lets you compare 2 places

        
});


var port = process.env.PORT || 8080;

app.listen(port);

