const express = require('express');
const nedb = require('nedb');
const data = new nedb('database.db');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const params = {
  access_key: '0e2c2c4267ab9852ed4d1edd800e802',
  query: '1600 Pennsylvania Ave NW'
}
const app = express();
data.loadDatabase();
app.listen(3000, () => {
    console.log('listening on port: 3000');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});
app.get('/mapapp.html', (req, res) => {
    res.sendFile(__dirname + '/mapApp.html');
});
app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/regUser', (req, res) => {
    data.insert(req.body);
    res.sendFile(__dirname + '/index.html');
});
var name, lat, lng, id;
app.post('/send',  (req, res) => {
    console.log(req.body.stid);
    data.findOne({ stid: req.body.stid }, function(err, doc) {
        if(doc == null){
            console.log("User not found!");
            res.redirect('/register.html');
            // res.redirect("https://www.geeksforgeeks.org/express-js-app-listen-function/");
        }else{
            name = doc.name;
            id = doc.stid;
            lat = doc.lat;
            lng =  doc.lng;
            console.log('Found user:', doc.name);
            var url = '/mapapp.html?name=' + name + '&id=' + id + '&lat=' + lat + '&lng=' + lng;
            res.redirect(url);
        }
    });
});
app.post('/regUser', async (req, res) => {
    var hold = req.body;
   // var address = hold.address;
    // axios.get('http://api.positionstack.com/v1/forward?access_key=30e2c2c4267ab9852ed4d1edd800e802&query=' + address)
    // .then(response => {
        // var lat_ = response.data.data[0].latitude;
        // var lng_ = response.data.data[0].longitude;
        var lat_ = hold.lat;
        var lng_ = hold.lng;
        console.log(lat_, lng_);
        var options = {
            name: req.body.name,
            stid: req.body.stid, 
            lat: lat_,
            lng: lng_
        }
        data.insert(options, function(err, doc){
            if(!err){
                console.log("Inserted user: ", doc.name);
            }
        });
    // }).catch(error => {
    //     console.log(error);
    // });
    res.redirect('/index.html');
});