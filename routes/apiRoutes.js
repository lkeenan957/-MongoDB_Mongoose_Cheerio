const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const request = require('request');

var db = require("./../models/articles.js")

db.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/scrape', (req, res) => {
  request('https://www.nytimes.com/section/todayspaper', function (error, response, html) {
  if (!error && response.statusCode == 200) {
  	var $ = cheerio.load(html);
  	var results = [];
  	$("div.story-items").children("h2").children("a").each(function(i, element) {
  		

  		var title = $(element).text();
  		

    	var link = $(element).attr("href");

    	var summary = $(element).parent().parent("div.story-items").children("p.summary").text()

    	// var image = $(element).parent().parent("div.story-items").children(".thumbnail").children("a").children("img").attr("src")

    	results.push({
      		title: title,
      		summary: summary,
      		link: link
      	
    	});
  	})
    res.send(results)
  }
});
});


router.get("/save", (req, res, next) => {
	db.find({}).sort({_id: -1}).exec(function(err, data){
		var newData = {
			saved: data
		}
		if (err) {
      		console.log(err);
    	}
    	else {
      		res.render('save', newData)
    	}
	})
	
})

router.post('/save', (req, res, next) => {			

	db.create({
		title: req.body.saveThisHeader,
		link: req.body.saveThisLink, 
		summary: req.body.saveThisSummary,
		notes: []
	}, function(err, data){

		if (err) {
      		console.log("This is the error: " + err);
      		res.json({"Error": "Error"});
    	}
    	else {
    		// console.log(data)
      		res.json(data);
    	}
	})
	
})

router.get("/save/notes/:id", function(req, res){
	
	db.find({_id: req.params.id}, function(err, data){

		if (err) {
	      	console.log(err);
    	}
    	else {
      		res.json(data);
    	}


	})


})

router.post("/save/note", function(req, res){
	db.update({_id: req.body.id },
    { $push: { notes: [req.body.note] } 
}, function(err, data) {
			if (err) {
	      		console.log(err);
	    	}
	    	else {
	      		res.json(data);
	    	}
	})
})


router.delete('/save/:id', (req, res) => {
	// console.log(req.params.id)
	db.findByIdAndRemove({_id: req.params.id}, function(err, data){

		if (err) {
      		console.log(err);
    	}
    	else {
      		res.json(data)
    	}
	})
})

module.exports = router;