const firebaseAdmin = require('firebase-admin')

const serviceAccount = require('./Firebase.json')


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
})


module.exports = firebaseAdmin