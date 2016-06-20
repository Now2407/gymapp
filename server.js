var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var auth = require('basic-auth');
var http = require('http');

var twilio = require('twilio');
var client = require('./node_modules/twilio/lib')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
/* ADD DEALS ROUTES & MESSAGES FOR TRAINER, USER, AND GYM ACCOUNT PAGES LATER*/

mongoose.connect(process.env.databaseCon);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
   
   res.send('home');
        
});

var authu = function(req, res, next) {
        
        var credentials = auth(req);

        if (!credentials || credentials.name !== process.env.Username || credentials.pass !== process.env.Password) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    next();
  }
}

app.use(authu);

app.use(express.static(__dirname + '/public'));

app.get('/xml', function(req, res){
        
        

  
  res.render('../fire', {req: req, res: res});
  
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var Place = mongoose.model("Place", mongoose.Schema({
        
    claimed: 0, //defualts to 0 for unclaimed and 1 for claimed
    atypeofplace: String,
    aname: String,
    aaddress: String,
    acity: String,
    azipcode: String,
    astate: String,
    acontract_length: String,
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

app.post('/self', function(req, res){
        
        
        
     client.makeCall({
        
        to: req.body.number,
        from: '+16504683750',
        url: 'https://6e04649a.ngrok.io/xml'
        
        }, function(err, data){
                
                console.log(err);
                console.log(data);
        });
        
       
        
                
        
});

app.post('/cofirm', function(req, res){
        
     
});

app.get('/self', function(req, res){
        
        res.render('../views/test.ejs');
        
        
});

app.get('/self/verify', function(req, res){
        
        res.render('../views/res.ejs');
        
        
        
});
app.post('/verifed', function(req, res){
        

// Your application credentials

});
app.get('/verify', function(req, res){




        
        
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
       atypeofplace: req.body["details"][0]["typeofplace"],
         aname: req.body["details"][1]["name"],
        aaddress: theaddress,
        acity: thecity,
        cityandstae: thecity + ", " + state,
        azipcode: req.body["details"][4]["zipcode"],
        astate: state,
        acontract_length: req.body["details"][6]["contract_length"],
        phone_number: req.body["details"][7]["phone_number"],
        fulladdress: theaddress + " " + thecity +", " + state + " "+ req.body["details"][4]["zipcode"],
       
        
        
        
});

place.save(function(err, data){
        console.log(data);
        console.log(err);

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


app.post('/place/claim', function(req, res){
    
});
app.post('/place/claim', function(req, res){
    
});
app.get('/find', function(req, res){
        

        
        
        Place.find({cityandstae: req.query.city}, function(err, dat){
                
                // get all memberships console.log(dat[0]["membership"]);
                console.log(dat[0]["membership"][0]["atype"]);
        });
        
});

app.get('/', function(req, res){
    
    //res.render('./views/search.ejs', {action: "/gyms", activeclass: "1", name: "city"});
    
});
app.get('/gyms', function(req, res){
    
   // res.render('./views/search.ejs', {action: "/gyms", activeclass: "1", name: "city"});
    
});
app.get('/studios', function(req, res){
    
   // res.render('./views/search.ejs', {action: "/studios", activeclass: "1", name: "city"});
    
});
app.get('/clubs', function(req, res){
    
  //  res.render('./views/search.ejs', {action: "/clubs", activeclass: "1", name: "city"});
    
});

app.get('/club/search', function(req, res){
    
     var place = req.query.place;
    
    res.render('./views/club.ejs', {place: place});
    
});
app.get('/studio/search', function(req, res){
    
    var place = req.query.place;
    
    res.render('./views/studio.ejs', {place: place});
    
});
app.get('/gym/search', function(req, res){
    
     var place = req.query.place;
     
     
    
    res.render('./views/gym.ejs', {place: place});
    
});







http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

