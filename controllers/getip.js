const axios = require('axios');
const accessKey = process.env.WHERE_AM_IP_KEY;
// const ip = req.ip; 
module.exports.getCity = 
async (req, res)=> {
    try {

    const clientIP = req.ip.split(":").pop();
    const config = {params: {access_key: accessKey, format:'1'}};
    const result = await axios.get(`http://api.ipstack.com/${clientIP}`, config);
    data = result.data;
    if (data.city == null) data.city = data.country_name || "NA";
    return data.city || "NA";

} 
catch (error) {
    console.log("Something is not good! WhereamIP? \n" + error ); }
}