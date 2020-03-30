const keys = require('../config/keys');
const axios = require('axios')

const getCoords = (address , city, province ) =>{
    return new Promise((resolve, reject) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${keys.googleAPI}&address=${address},+${city},+${province},+Canada`).then((res) => {
            resolve({
                lat:res.data.results[0].geometry.location.lat,
                lng:res.data.results[0].geometry.location.lng
            })
        }).catch(err => {
            reject(err)
        })
    })
}


module.exports = getCoords