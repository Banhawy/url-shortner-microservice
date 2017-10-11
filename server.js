const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const shortid = require('shortid');
const validUrl = require('valid-url');
app.use(express.static('public'))

// Homepage
app.get('/', (req,res)=>{
    req.render('index')
})

app.get('/new/:url(*)', (req,res)=>{
    console.log('Working');
    // Get host address
    const host = req.get('host') + '/';
    // Connect to DB
    MongoClient.connect(process.env.MONGODB_URI, (err,db)=>{
        if (err) console.log('Unable to connect to the mongoDB server. Error: ', err);
        let collection = db.collection('urls');
        console.log('Connection Established to db.');
        const url = req.params.url;
        // Check if string is valid URL
        if (validUrl.isUri(url)){
            // Check if URL exists in database
            collection.findOne({ url: url }, { alias: 1, _id: 0 }, (err, doc)=>{
                if (doc != null) {
                    res.json({
                        url: url,
                        alias_url: doc.alias
                    })
                    db.close();
                } else {
                    const hash = shortid.generate();
                    const newUrl = { url : url, alias: hash };
                    collection.insert([newUrl]);
                    res.json({
                        original_url: url,
                        alias_url : host + hash
                    })
                    db.close();
                }
            })
        } else{
            res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
            db.close();
        }
        
    });
});

app.get('/:alias(*)', (req,res)=>{
    console.log('Recieved connection');
    const {alias} = req.params
    MongoClient.connect(process.env.MONGODB_URI, (err, db)=>{
        if (err) console.log('Unable to connect to the mongoDB server. Error: ', err);
        const collection = db.collection('urls');
        console.log('Connection Established to db.');
        collection.findOne({ alias: alias }, {url : 1, _id: 0}, (err, docs)=>{
            if (docs != null){
                res.redirect(docs.url)
                db.close();
            } else {
                res.json({ error: "No URL associated with this alias was found." });
                db.close();
            }
        })
    })
})

app.listen(process.env.PORT || 3000);