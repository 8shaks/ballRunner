const axios = require("axios")
let lat,lng
let locations =  []

const courtsFinder = (type) => {
    let count = 0
    axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&location=${lat+","+lng}&rankby=distance&type=${type}`).then((res)=>{
        console.log(`${type} _!`)
        // console.log(res.data.results[0])   


        for(let i =0; i<res.data.results.length;i++){
            if(res.data.results[i].types.includes("university") || res.data.results[i].types.includes("health") || res.data.results[i].name.includes("Teacher")|| res.data.results[i].name.includes("Music")|| res.data.results[i].name.includes("Academy") || res.data.results[i].name.includes("Preschool") || res.data.results[i].name.includes("Private School")|| res.data.results[i].name.includes("Tutoring") || count >=5 ){
            }else{
                count++
                locations.push(res.data.results[i])
            }
       
        }
 

        // axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&input=community+centre&inputtype=textquery&fields=formatted_address,name").then((com)=>{
        //     console.log(com.data)
        //     })
    }).then(()=>{

        // locations.forEach((loc) => {
        //     // if(loc.name === "Arivakam Tamil Cultural Academy" ){
        //     //     console.log(loc)
        //     // + loc.types+"\n\n"
        //     // }
        //     console.log(loc.vicinity + " \n" + loc.name +" \n\n")
        //     if(loc.name === "Qing Piano Teacher" ){
        //         console.log(loc)
        //     }
        // })
    })
    return true
}
axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAs23RKXHdq6zt3qKjyvN8btWK6Fr1cxVw&address=28+Lor+Sari,+Singapore").then((plow) => {
    lat = plow.data.results[0].geometry.location.lat
    lng = plow.data.results[0].geometry.location.lng
// keyword=community+centre
}).then(() => {
   
   courtsFinder("school")

    courtsFinder("secondary_school")

    courtsFinder("primary_school")
    setTimeout(function(){locations.forEach((loc)=>{console.log(loc.name+'\n\n')}) }, 5000);
    return true
})
