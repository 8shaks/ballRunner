const axios = require("axios")
const express = require("express");
const router = express.Router();
var async = require('async');


const dataChecker = (results,count) => {
    if(results.types.includes("university") || results.types.includes("health") || results.name.includes("Teacher")|| results.name.includes("Music")|| results.name.includes("Academy") || results.name.includes("Preschool") || results.name.includes("Private School")|| results.name.includes("Tutoring") || count >=5 ){
        return false
    }else{
        return true
    }
}
async function courtsFinder (type,lat,lng,locations) {
    let count = 0
  
    await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&location=${lat+","+lng}&rankby=distance&type=${type}`).then((res)=>{
        for(let i =0; i<res.data.results.length;i++){
            if(dataChecker(res.data.results[i],count)){
                count++
                locations.push(res.data.results[i])
            }
        }
    })
 
    return true
}

router.post("/", (req, res) => {
    
    let locations= []
    const apple = req.body.streetAddress.replace(/ /g,"+")
    const province = req.body.province.replace(/ /g,"+")
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&address=${apple},+${req.body.city},+${province},+${req.body.country}`).then((plow) => {
        req.body.lat = plow.data.results[0].geometry.location.lat
        req.body.lng = plow.data.results[0].geometry.location.lng
 
// keyword=community+centre
    }).then(() => {
       async function logger(){
           let results =  await Promise.all([
                courtsFinder("school",req.body.lat,req.body.lng,locations),
                courtsFinder("secondary_school",req.body.lat,req.body.lng,locations),
                courtsFinder("primary_school",req.body.lat,req.body.lng,locations) 
            ])
           return results
       }
        logger().then((s)=>{
            return res.json({locations:locations}) 
       })
    }).catch((err)=>{
        console.log(err)
    })

})


module.exports = router;