const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
dbName='FSD';
const dbUrl = `mongodb+srv://Rajesh:Backend@rajesh.azutt.mongodb.net/${dbName}`;

module.exports ={dbUrl,mongodb,MongoClient,dbName};