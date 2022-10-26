const express = require("express");
const app = express();
const port = 3000;
const request = require('request');

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/homesubmit", (req, res) => {
    res.render("login");
  });
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signinsubmit", (req, res) => {
  const name = req.query.username;
  const password = req.query.password;
  console.log(name);
  console.log(password);
  db.collection("users")
    .where("name", "==", name)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      
      console.log(docs.size);
      if (docs.size > 0) {
        res.render("movie");
        
      } else {
      res.render("login");
      }
    });
});

app.get("/signupsubmit", (req, res) => {
  const name = req.query.username;
  const email = req.query.email;
  const password = req.query.password;

  //Adding new data to collection
  db.collection("users")
    .add({
      name: name,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("login");
    });
});

app.get("/movie", (req, res) => {
    res.render("movie");
  });

  app.get("/moviesubmit", (req, res) => {
    const movie = req.query.muvname;
    request('http://www.omdbapi.com/?t='+movie+'&apikey=4e730b5c', function (error, response, body) {
      //console.log(JSON.parse(body));
      if(JSON.parse(body).Response=="True"){
        const title = JSON.parse(body).Title;
        const releaseDate = JSON.parse(body).Released;
        const actors = JSON.parse(body).Actors;
        //const rating = JSON.parse(body).Ratings[0].Value;
        const poster = JSON.parse(body).Poster;
        //console.log(poster);
        res.render("result", {title:title, releaseDate:releaseDate, actors:actors, poster:poster});
      }
      else{   
        res.render("movie");
      }
    });
    
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});