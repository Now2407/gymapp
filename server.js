var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var auth = require('basic-auth');
var twilio = require('twilio');
var AWS = require('aws-sdk');
var multer = require('multer');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cons = require('consolidate');
var ejs = require('ejs');

// view engine setup
app.engine('html', cons.ejs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/gym');

mongoose.set('debug', true)


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
    Admenities: [String],
     location: {type: [Number], index: "2d"},
     
    
    }));


app.get('/place/new', function(req, res){
        
    res.render('../views/addplace.ejs');
});

app.get('/place/new/thankyou', function(req, res){
        res.send('thank you!');
});





app.post('/search/update', function(req, res){
        
        
        
});




app.post('/place/new', function(req, res){
        
        var lat;
        var lng;      
        var block = [];
        var block2 = [];
        var block3 = [];
        var cords = [];

        
        for (var i=0; i < req.body.memberships.length; i++) {
            
         block.push({"atype": req.body["memberships"][i]["type"], "adesc": req.body["memberships"][i]["desc"], "arate": req.body["memberships"][i]["rate"], "achecked": req.body["memberships"][i]["checked"]});
            
        }
        
        for (var i=0; i < req.body.Facilities.length; i++) {
        
         block2.push(req.body["Facilities"][i]["item"]);
            
         }
            
        for (var i=0; i < req.body.Admenities.length; i++) {
           
        block3.push(req.body["Admenities"][i]["aitem"]);
            
            }
            

        var state = req.body["details"][5]["state"];
        var thecity = req.body["details"][3]["city"];
        var theaddress = req.body["details"][2]["address"];
        var thezipcode = req.body["details"][4]["zipcode"];
        var thetypeofplace = req.body["details"][0]["typeofplace"]
        var thecontract = req.body["details"][6]["contract_length"];
        var thephonenumber =  req.body["details"][7]["phone_number"];
        var thename = req.body["details"][1]["name"];
 
var place = new Place({
        
        membership: block,
        Facilities: block2,
        Admenities: block3,
        typeofplace: thetypeofplace ,
        name: thename,
        address: theaddress,
        city: thecity,
        cityandstae: thecity.toUpperCase() + ", " + state.toUpperCase(),
        zipcode: thezipcode,
        state: state.toUpperCase(),
        contract_length: thecontract,
        phone_number: thephonenumber,
        fulladdress: theaddress + " " + thecity +", " + state + " "+ thezipcode,
        
});



if (req.body.memberships === undefined) {
    console.log('membership is blank');
    return;
}
if (req.body.memberships === "") {
    console.log('membership is blank');
    return;
}


        rp('https://maps.googleapis.com/maps/api/geocode/json?address='+req.body["details"][2]["address"]+req.body["details"][3]["city"]+req.body["details"][5]["state"]).then(function(data){
           
          
        var dat = JSON.parse(data);
           
        if (dat.status === "ZERO_RESULTS") {
                                       
            console.log("not found");
            
            return;
            
       }
       
       
        cords[1] = dat.results[0]["geometry"]["location"]["lat"];
        cords[0] = dat.results[0]["geometry"]["location"]["lng"];
        
        
        
        place.location = cords;      
          
 
        place.save(function(err, data){
                console.log(data);
                console.log(err);
                
                if (!err) {
                 res.send('inserted');
        
                }
                
        });
        
    }).catch(function(err){
        
        
        
        });
          
      
});
     
     
      
app.post('/mapmove', function(req, res){
        
        //var newbounds = req.query.newbouds;
        
       // if(newbounds){
       
       // get southwest, northwest, eastwest, and southwest vars
       
       //do a $box query on new bounds
       
       //pull back results and rerender new data
       
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
         
res.render('../views/home.ejs', {action: "/clubs/search", method:"GET", value:"search"});
     
});

app.get('/gyms/search', function(req, res){
      
       var loc = req.query.location;
    rp('https://maps.googleapis.com/maps/api/geocode/json?address='+loc).then(function(somedata){
        
        
               var dat = JSON.parse(somedata);
               
               
              var northlat = dat.results[0]["geometry"]["bounds"]["northeast"]["lat"];
              var northlng = dat.results[0]["geometry"]["bounds"]["northeast"]["lng"];
              var southlat = dat.results[0]["geometry"]["bounds"]["southwest"]["lat"];
              var southlng = dat.results[0]["geometry"]["bounds"]["southwest"]["lng"];

              
         
              
                
                Place.find({"location": {"$geoWithin": {"$box": [[northlng, northlat],[southlng, southlat]]} }, typeofplace: "gym"},function(err, data){
                 
      
        
         res.render('../views/results.ejs', {data: data, northlng: northlng, northlat: northlat, southlng: southlng, southlat: southlat});
         
         
        
    }).catch(function(error){
    });
   
   
   });
        
     
});

app.get('/place', function(req, res){
        
        var id = req.query.id;
        
        Place.findOne({_id: id}, function(err, place){
                
                if (place) {
                        res.render('../views/place.ejs', {aplace: place}); 
                }
             
        });
        
        
});

app.get('/clubs/search', function(req, res){
        
            
 
                      var loc = req.query.location;
    rp('https://maps.googleapis.com/maps/api/geocode/json?address='+loc).then(function(somedata){
        
        
               var dat = JSON.parse(somedata);
               
               
              var northlat = dat.results[0]["geometry"]["bounds"]["northeast"]["lat"];
              var northlng = dat.results[0]["geometry"]["bounds"]["northeast"]["lng"];
              var southlat = dat.results[0]["geometry"]["bounds"]["southwest"]["lat"];
              var southlng = dat.results[0]["geometry"]["bounds"]["southwest"]["lng"];

              
             
             
              
              
                
                Place.find({"location": {"$geoWithin": {"$box": [[northlng, northlat],[southlng, southlat]]} }, typeofplace: "club"},function(err, data){
                 
      
        
        
         res.render('../views/results.ejs', {data: data, northlng: northlng, northlat: northlat, southlng: southlng, southlat: southlat});
         
         
        
    }).catch(function(error){
    });
   
   
   }); 


        
});
app.get('/studios/search', function(req, res){
                
       var loc = req.query.location;
    rp('https://maps.googleapis.com/maps/api/geocode/json?address='+loc).then(function(somedata){
        
        
               var dat = JSON.parse(somedata);
               
               
              var northlat = dat.results[0]["geometry"]["bounds"]["northeast"]["lat"];
              var northlng = dat.results[0]["geometry"]["bounds"]["northeast"]["lng"];
              var southlat = dat.results[0]["geometry"]["bounds"]["southwest"]["lat"];
              var southlng = dat.results[0]["geometry"]["bounds"]["southwest"]["lng"];

              
            
            
              
                
                Place.find({"location": {"$geoWithin": {"$box": [[northlng, northlat],[southlng, southlat]]} }, typeofplace: "studio"},function(err, data){
                 
    
        
         res.render('../views/results.ejs', {data: data, northlng: northlng, northlat: northlat, southlng: southlng, southlat: southlat});
         
         
        
    }).catch(function(error){
    });
   
   
   });
});



app.get('/login', function(req, res){
        
        //handles trainer, place, and user login
        
        
        
});


app.get('/signup', function(req, res){
        
        //handles trainer and user signup
        
});






var port = process.env.PORT || 8080;

app.listen(port);

