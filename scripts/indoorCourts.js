// This file grabs the courts and their respective data and places them in the db
// Quick way to get indoor courts into the database instead of putting it in there manually

const AIRTABLE_API_KEY = require("../config/keys").airtable_key

const db = require("../config/keys").mongoURI;
const mongoose = require("mongoose");
const IndoorCourt = require("../models/IndoorCourt");

const courtGrabber = async () =>{
    // airtable Config
    var Airtable = require('airtable');
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: AIRTABLE_API_KEY
    });
    var base = Airtable.base('app3pCInCukrTfKBv');


    base('indoorCourts').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            const newCourt = new IndoorCourt({
                name: record.get('name'),
                desc: record.get('desc'),
                location: {lat:record.get('lat'), lng:record.get('lng')},
                website:record.get('website'),
                place_id:record.get('place_id'),
                day:record.get('day'),
                vicinity:record.get('vicinity')
              })
              let promise = Promise.resolve(newCourt)
              promise.then((courtObject)=>{
                courtObject.save().then((court)=>{
                    console.log(court)  
                }).catch((err)=>{
                    console.log(newCourt)
                    console.log(err)
                })
              })

        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}
// database config
mongoose
  .connect(db, { useNewUrlParser: true ,useUnifiedTopology: true})
  .then(() => {
    //   get courts in airtable and put in db
    console.log("MongoDB connected");

    courtGrabber()
  })
  .catch(err => console.log(err));