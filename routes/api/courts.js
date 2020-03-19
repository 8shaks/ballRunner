const axios = require("axios")
const express = require("express");
const router = express.Router();
var async = require('async');
const keys = require("../../config/keys");
const IndoorCourt = require("../../models/IndoorCourt");
const util = require('util')

const dataChecker = (results,count) => {
    if(results.types.includes("university") || results.types.includes("health") || results.name.includes("Teacher") || results.name.includes("Piano") || results.name.includes("Music")|| results.name.includes("Academy") || results.name.includes("Preschool") || results.name.includes("Private School")|| results.name.includes("Tutoring") || count >=3 ){
        return false
    }else{
        return true
    }
}
const toRadians = (degrees) =>{
    var pi = Math.PI;
    return degrees * (pi/180);
}
const distanceFinder = (lat,lat2,lng,lng2) =>{

        const R = 6371e3; // metres
        let latRad1 = toRadians(lat);
        let latRad2 = toRadians(lat2);
        let latRadDiff = toRadians((lat2-lat))
        let lngRadDiff = toRadians((lng2-lng))
    
        let a = Math.sin(latRadDiff/2) * Math.sin(latRadDiff/2) +
                Math.cos(latRad1) * Math.cos(latRad2) *
                Math.sin(lngRadDiff/2) * Math.sin(lngRadDiff/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R* c
}

function mergeSort (unsortedArray) {
    if (unsortedArray.length <= 1) {
        return unsortedArray;
      }
    const midpoint = Math.floor(unsortedArray.length / 2);
    const left = unsortedArray.slice(0, midpoint);
    const right = unsortedArray.slice(midpoint);
    return merge(
      mergeSort(left), mergeSort(right)
    );
  }
function merge (left, right) {
    let finalArray = []
    let leftIndex = 0
    let rightIndex = 0;
  
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].distance < right[rightIndex].distance) {
        finalArray.push(left[leftIndex]);
        leftIndex++; 
      } else {
        finalArray.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return finalArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
  }
async function courtsFinder (type,lat,lng,locations) {
    let count = 0
  
    await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${keys.googleAPI}&location=${lat+","+lng}&rankby=distance&type=${type}`).then((res)=>{
        for(let i =0; i<res.data.results.length;i++){
            if(dataChecker(res.data.results[i],count)){
                count++
                const distance = distanceFinder(lat,res.data.results[i].geometry.location.lat,lng,res.data.results[i].geometry.location.lng) 
                const data = {location:res.data.results[i].geometry.location, name:res.data.results[i].name, place_id:res.data.results[i].place_id,distance:distance,vicinity:res.data.results[i].vicinity}
                locations.push(data)
            }
        }
    })
 
    return true
}
async function gatherCourts(loc,locations){
    let results =  await Promise.all([
         courtsFinder("school",loc.lat,loc.lng,locations),
         courtsFinder("secondary_school",loc.lat,loc.lng,locations),
         courtsFinder("primary_school",loc.lat,loc.lng,locations) 
     ])
    return results
}
function indoorCourtDistance(loc,courts,locations){
    for(let i = 0; i< courts.length; i++ ){
        let myFirstPromise = new Promise((resolve, reject) => {
            resolve(distanceFinder(loc.lat,courts[i].location.lat,loc.lng,courts[i].location.lng))
            }) 
        myFirstPromise.then((distance)=>{
            locations.push({
                location:courts[i].location,
                desc:courts[i].desc,
                name:courts[i].name,
                website:courts[i].website,
                place_id:courts[i].place_id,
                day:courts[i].day,
                distance:distance
            })
        })
    }
    return courts;
}


router.post("/", async (req, res) => {
    
    let locations= []
    const streetAddress = req.body.streetAddress.replace(/ /g,"+")
    const province = req.body.province.replace(/ /g,"+")
    try{
    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${keys.googleAPI}&address=${streetAddress},+${req.body.city},+${province},+${req.body.country}`).then((res) => {
        req.body.lat = res.data.results[0].geometry.location.lat
        req.body.lng = res.data.results[0].geometry.location.lng
    })
    
    await gatherCourts(req.body,locations)
    const uniqueLocations = [...new Map(locations.map(item => [item['name'], item])).values()]
    current_date = new Date()
    cday = 1
    let courts = await IndoorCourt.find({day:cday})
    await indoorCourtDistance(req.body,courts,uniqueLocations)
    let sortedLocations = mergeSort(uniqueLocations)
    
    // uniqueLocations.slice(0,-3)
    res.json({locations:sortedLocations}) 
    }
   catch(error){
    console.log(error)
    return res.status(500).json({error:'There was an error'})
   }
 

})


module.exports = router;