var express = require('express');
var cors = require('cors');

var app = express();

app.get('/:url(*)', (req,res)=>{
    console.log('Working');
    var url = req.params.url
    res.json({
        message: "Hola",
        url : url
    })
})

app.listen(3000);