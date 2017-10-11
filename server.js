const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const shortid = require('shortid');
const validUrl = require('valid-url');
// const env = process.env.MONGODB_URI;
app.use(express.static('public'))

// Homepage
app.get('/', (req,res)=>{
    req.render('index')
})

app.get('/new/:url(*)', (req,res)=>{
    console.log('Working');
    // Connect to DB
    MongoClient.connect(process.env.MONGODB_URI, (err,db)=>{
        if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
        let collection = db.collection('urls');
        console.log('Connection Established to db.');
        const url = req.params.url;
        if (validUrl.isUri(url)){
            const hash = shortid.generate();
            const newUrl = { url : url, alias: hash };
            collection.insert([newUrl]);
            res.json({
                original_url: url,
                alias_url : 'localhost:3000/' + hash
            })
        } else{
            res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
        }
        collection.insert([insertLink]);
        db.close();
    });
});

app.listen(3000);