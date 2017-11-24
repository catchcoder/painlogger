var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('painlogger.sqlite3');

  var posts = [];
  var fslevel = [];
    var fslevelyday = [];
 var percent =0;
    var pbmax = 9;
    listfortoday = [];


    db.serialize(function() {

        db.each("SELECT * FROM log where logdate = date() order by logactivity asc;", function (err, row) {
            listfortoday.push({whenlogged: row.logactivity, painlogged: row.logpainlevel});         // posts.push({floglevel: row[1].loglevel})
           // console.log(row);
        });
    });

    db.serialize(function() {

        db.each("SELECT sum(logpainlevel) FROM log where logdate = date('now', '-1 day');", function (err, row) {
           // listfortoday.push({whenlogged: row.logtype, saltlogged: row.loglevel});         // posts.push({floglevel: row[1].loglevel})
            console.log(row);
            fslevelyday =  JSON.stringify(row);         // posts.push({floglevel: row[1].loglevel})

            // console.log(JSON.stringify(row));
            //fslevel.replace('(','');
            var resi = fslevelyday.split(":");
            fslevelyday = parseFloat(resi[1].replace("}","")).toFixed(2);
            if (isNaN(fslevelyday)){fslevelyday=0}
            console.log("psy  " + fslevelyday)
            // percent =  ((100 / 6 ) * fslevel)
            // if (fslevel=> 2){
            //     pbmax = parseFloat(fslevel) + parseFloat(2);
            // }
        });
    });

    //var dbb = new sqlite3.Database('recordsalt.sqlite3');
    db.serialize(function() {
        db.each("SELECT sum(logpainlevel) FROM log where logdate= date();", function(err, row)
        {  //res.json (row);
           // console.log(JSON.stringify(row));
            fslevel =  JSON.stringify(row);         // posts.push({floglevel: row[1].loglevel})

            // console.log(JSON.stringify(row));
            //fslevel.replace('(','');
            var resi = fslevel.split(":");
           fslevel = parseFloat(resi[1].replace("}","")).toFixed(2);
            if (isNaN(fslevel)){fslevel=0}
            console.log("ps " + fslevel)
            percent =  ((100 / 6 ) * fslevel)
            if (fslevel=>2)
            {
                pbmax = parseFloat(fslevel) + parseFloat(2);
            }
           // ;console.log("ps " + percent )

            //console.log(areas)


        }),

  db.serialize(function() {
    db.each("SELECT * FROM item order by activity asc;", function(err, row)
        { posts.push({activity: row.activity, painlevel: row.painlevel});         // posts.push({floglevel: row[1].loglevel})
          // console.log(row);


        }, function(callback) {
        res.render('index', {title: 'Pain Logger', menuitem: posts, fslevel: fslevel, percent: percent, pbmax: pbmax, listfortoday: listfortoday, saltyesterday: fslevelyday});
    });
    });
  //}); // db.serialise

  db.close();

});
});

router.get('/displayAdding', function(req,res,next){
    var logactivity = 2;
    res.render('displayAdding', { title: 'Pain Logger', logactivity: logactivity });
});

router.post('/logpain', function(req,res,next){
   //var ip = req.query.ip;
    //var mac = .query.mac;
    var logpainlevel = 0;
    var logactivity = "error";
    logpainlevel = req.query.painlevel;
    logactivity = req.query.activity;
    console.log("hh");
    if (logpainlevel != "") {
        console.log("II");
        console.log("Logging");
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('painlogger.sqlite3');
        db.serialize(function () {
           //   console.log ("INSERT INTO test values (date(),0.1,'Snack');")

            db.run("INSERT INTO log (id,logdate,logpainlevel,logactivity) values ( null,date()," + logpainlevel + ",'" + logactivity + "');");


        });

        console.log("Logged");
        db.close();
        console.log("db closed");
        res.render('displayAdding', { title: 'Pain Logger', logactivity: logactivity });
        console.log("Logged");

    }else {
        console.log("Nothin to Log to DB /logpan" );
            res.render('displayAdding', { title: 'Pain Logger - recording data'});
    }

    //res.render('index', { title: 'Data Logged',
    //    data: post.ip });

});


module.exports = router;
