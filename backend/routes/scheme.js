var express = require('express');
var router = express.Router();
const Scheme = require('../models/Scheme');
/* GET users listing. */


router.post('/', function(req, res){
    console.log(req.body);
    const scheme = new Scheme(req.body);
    scheme.save(function(err){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send("Scheme added successfully");
        }
    });
});


router.get('/', function(req, res){
    Scheme.find({}, { __v: 0 }, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send({results: data});
        }
    });
});
module.exports = router;
