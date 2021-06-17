const express = require('express')
const maps = express.Router()
const axios = require('axios')

const API_KEY = process.env.API_KEY;

maps.get("/:userLocation", (req, res) => { 
    axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&keyword=restaurant&key=${API_KEY}&fields=name,geometry&input=${req.params.userLocation}`)
        .then(resAxios => res.status(200).json(resAxios.data))
        .catch(error => console.log(error))
})



module.exports = maps

// Originally tried to structure using below resources with below code. However, my curl request was successful but my fetch request was not. Someone w experience suggested using the axios library. I referenced https://github.com/axios/axios (sections about installation and requiring, response schema, and handling errors) to structure as it is now.
// referenced https://nodejs.dev/learn/making-http-requests-with-nodejs and https://www.tabnine.com/code/javascript/functions/https/request to structure post request (resources provided by someone w experience)
// const data = JSON.stringify({
    
// })

// const options = {
//     hostname: "maps.googleapis.com",
//     port: 443, // default port for https for security reasons https://sectigostore.com/blog/port-443-everything-you-need-to-know-about-https-443/
//     path: "/maps/api/place/findplacefromtext/json?inputtype=textquery&keyword=restaurant&key=AIzaSyCwksum9i8ufeThaXMWHAjrzEexx8j2qJc&fields=name,geometry&input=", // including the parameter fields determines the information sent back to you by google
//     method: "GET",
// }

// const optionsCopy = {...options, path: options.path + req.params.userLocation}
    // https.request(optionsCopy, httpRes /* different var name bc different response */ => { // creates request for data
    //     let data = "" // declares empty string to fill with data received
    //     console.log(`StatusCode: ${httpRes.statusCode}`)
    //     httpRes.on("data", d => { // defines the response whenever a piece of data is received 
    //         data += d // every time data is received, add it to the data string
    //     })
    //     httpRes.on("end", end => { // when all the data is received
    //         data = JSON.parse(data) // parse the string and turn it into an object
    //         res.status(200).json(data) 
    //     })
    //     }).on("error", error => {
    //         res.status(400).json({error: error.message})
    // })