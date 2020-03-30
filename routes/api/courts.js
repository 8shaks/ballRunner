const axios = require("axios")
const express = require("express");
const router = express.Router();
var async = require('async');
const keys = require("../../config/keys");
const courtsFinder = require('../../util/courtsFinder')
const getCoords = require('../../util/getCoords')

router.post("/", async (req, res) => {
    let locations= []
    const apple = req.body.streetAddress.replace(/ /g,"+")
    const province = req.body.province.replace(/ /g,"+")
    getCoords(apple, req.body.city, province).then((locData) => {
       async function logger(){
           let results =  await Promise.all([
                courtsFinder("school",locData.lat,locData.lng,locations),
                courtsFinder("secondary_school",locData.lat,locData.lng,locations),
                courtsFinder("primary_school",locData.lat,locData.lng,locations) 
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