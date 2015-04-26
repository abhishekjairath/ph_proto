var async = require('async'),
	request = require('request'),
	mongoose = require('mongoose'),
  posts = [],
  DBurl = 'mongodb://localhost:27017/delhispeaks',
  MongoClient = require('mongodb').MongoClient,
  db = MongoClient.connect(DBurl, function(err, db));

var test = function(){
  var url = 'https://graph.facebook.com/v2.3/booksnclicks?access_token=CAANNPEe9ue0BAOa6JHmk0lDfVZArzNZBpSk8IwfrxHu5WAb9AWqrPPaTPDIF6tEv4hKIrTZADjZCn9rZAEfD5KazOmZBCPYnz1UFOOkWtDMcux5zWnZA2mMJcwmSWqRZBrRoONefzhLDpO4nN9w5gyvfXbFAFASOW0aZAmvZARGHFX8RVIObsweFTfdWLZBlapmxZCWgZCn8yyemgRLpNk6S6tLJN&fields=tagged&format=json&method=get&pretty=0'
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200){
        //console.log(JSON.parse(body).tagged.data[0]);

        var postData = JSON.parse(body); 
        postData.tagged.data.forEach(function(post){
          saveToDB(post);
        });
  		} 
    	console.log(error);
    	return null;
	});
};

test();

