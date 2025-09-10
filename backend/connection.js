const mongoose = require("mongoose")

function connection(url){
    mongoose.connect(url)
    .then(()=>{
    console.log("mongoose connected")
    }).catch((err)=>{
    console.log("Error: ", err)
    })
}

module.exports = { connection }