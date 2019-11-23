const axios = require("axios")
const express = require("express");
const router = express.Router();



let lat,lng
let locations =  []


const dataChecker = (results,count) => {
    if(results.types.includes("university") || results.types.includes("health") || results.name.includes("Teacher")|| results.name.includes("Music")|| results.name.includes("Academy") || results.name.includes("Preschool") || results.name.includes("Private School")|| results.name.includes("Tutoring") || count >=5 ){
        return false
    }else{
        return true
    }
}



const courtsFinder = (type) => {
    let count = 0
    axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&location=${lat+","+lng}&rankby=distance&type=${type}`).then((res)=>{
        console.log(`${type} _!`)
        // console.log(res.data.results[0])   

        for(let i =0; i<res.data.results.length;i++){
            if(dataChecker(res.data.results[i],count)){
                count++
                locations.push(res.data.results[i])
            }
       
        }
        // axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&input=community+centre&inputtype=textquery&fields=formatted_address,name").then((com)=>{
        //     console.log(com.data)
        //     })
    }).then(()=>{


    })
    return true
}

router.post("/", (req, res) => {
    return res.json({sucess:req.body.yo})
//     axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&address=28+Lor+Sari,+Singapore").then((plow) => {
//         lat = plow.data.results[0].geometry.location.lat
//         lng = plow.data.results[0].geometry.location.lng
// // keyword=community+centre
//     }).then(() => {
    
//         courtsFinder("school")

//         courtsFinder("secondary_school")

//         courtsFinder("primary_school")
//         setTimeout(function(){locations.forEach((loc)=>{console.log(loc.name+'\n\n')}) }, 5000);
//         return true
//     })
})


module.exports = router;