const axios = require('axios')
const keys = require('../config/keys')

const dataChecker = (results,count) => {
    if(results.types.includes("university") || results.types.includes("health") || results.name.includes("Teacher")|| results.name.includes("Music")|| results.name.includes("Academy") || results.name.includes("Preschool") || results.name.includes("Private School")|| results.name.includes("Tutoring") || count >=5 ){
        return false
    }else{
        return true
    }
}
async function courtsFinder (type,lat,lng,locations) {
    let count = 0
    return new Promise((resolve, reject) => {
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${keys.googleAPI}&location=${lat+","+lng}&rankby=distance&type=${type}`).then((res)=>{
            for(let i = 0; i<res.data.results.length;i++){
                if(dataChecker(res.data.results[i],count)){
                    count++
                    locations.push(res.data.results[i])
                }
                
            }
            resolve()
        }).catch((err) => reject(err))
    })
    

}



// const test = async () =>{
//     let locations = []
//     await courtsFinder("school", 43.853060, -79.227233, locations)
//     console.log(locations[0])
//     console.log('bruv')
// }
// test()
module.exports = courtsFinder