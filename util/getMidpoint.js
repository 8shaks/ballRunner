toRadians = (degrees)=>{
    return  degrees * Math.PI / 180;
}
toDegrees = (radians)=>{
  return radians * (180/Math.PI);
}

const midPoint = (lat1, lng1, lat2, lng2) =>{
    return new Promise((resolve, reject) => {
        try{
            const dLonRad = toRadians(lng2 - lng1)

            //convert to radians
            const lat1Rad = toRadians(lat1);
            const lat2Rad = toRadians(lat2);
            const lng1Rad = toRadians(lng1);
        
            const Bx = Math.cos(lat2Rad) * Math.cos(dLonRad);
            const By = Math.cos(lat2Rad) * Math.sin(dLonRad);
            const lat3 = Math.atan2(Math.sin(lat1Rad) + Math.sin(lat2Rad), Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By));
        
            const lon3 = lng1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);
            resolve( {
                lat: toDegrees(lat3),
                lng: toDegrees(lon3)
            })
        }catch(err){
            reject(err)
        }

    })
}
module.exports = midPoint
