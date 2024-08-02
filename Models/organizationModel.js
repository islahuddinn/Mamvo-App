const mongoose = require('mongoose')



const organizationSchema = new mongoose.Schema({
    organizationId:{
        type: String
    },
    name:{
        type: String
    },
    slug:{
        type: String
    }

},{timestamps:true})


const Organization = mongoose.model('Organization', organizationSchema)


module.exports = Organization