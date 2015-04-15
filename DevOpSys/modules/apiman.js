/**
 * API Manager Module
 */
var DataBase = new require('../utils/DataBase.js');
var dbase = new DataBase();
//var swig  = require('swig');
//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
//var db;
//var coll;
//var express = require('express');
//var router = express.Router();
var getHandler = {};
var postHandler = {};

/*console.log(config.get("DB_HOST"));
console.log(config.get("DB_PORT"));
console.log(config.get("DB_NAME"));
var mongodb = require('mongodb');
var mongodbServer = new mongodb.Server(config.get("DB_HOST"),
		config.get("DB_PORT"),
		{ auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db(config.get("DB_NAME"), mongodbServer);
*/
var db = dbase.getDb();

function list(req, res, next) {
var sendData = {};
	console.log("use api");
	db.open(function() {
		db.collection('api', function(err, collection){
			var cursor = collection.find({});
			cursor.each(function(err, doc){
				if(doc != null){
					console.log(doc);
					sendData[doc.apiName]= doc;
				} else{
					db.close();
					console.log(sendData);
					res.send(sendData);
				}
			});
		})
	});
}
getHandler["list"]=list;

function listView(req, res, next) {
	var sendData = {};
	//console.log("use api");
	db.open(function() {
		db.collection('api', function(err, collection){
			var cursor = collection.find({});
			cursor.each(function(err, doc){
				if(doc != null){
					console.log(doc['_id'].toString());
					sendData[doc['_id'].toString()]= doc;
				} else{
					db.close();
					console.log(sendData);
					res.render('apilist',{
						 pagename: "API List",
						 apiList: sendData
					});
				}
			});
		})
	});
}
getHandler["listview"]=listView;


function edit(req, res, next){
	if (req.method == 'POST') {
		console.log("API Edit Post: " + req.body);
		res.send("Receive: " + req.body);
	}else if(req.query.apiId){
		var sendData
		db.open(function() {
			db.collection('api', function(err, collection){
				o_id = dbase.ObjectID(req.query.apiId);
				var cursor = collection.find({"_id": o_id});
				cursor.each(function(err, doc){
					if(doc != null){
						console.log(doc);
						sendData = doc;
					}else{
						res.render('edit', {
						pagename:"API Editor",
						api:sendData
						});
					}
				});
				
			});
		});
	}else{
		res.send("nothing!!");
	}
}
getHandler["edit"] = edit;


function register(req, res, next){
	//console.log("use api");
	var sendData = {};
	db.open(function() {
		db.collection('api', function(err, collection){
			var cursor = collection.insert(req.body, function(err,data){
				if (data) {
	                console.log('Successfully Insert');
	                sendData["state"] = "success";
	            } else {
	                console.log('Failed to Insert');
	                sendData["state"] = "fail";
	            }
				db.close();
				sendData["date"] = new Date();
				res.send(sendData);
			});
		});
	});
}
postHandler["register"] = register;



exports.getHandler = getHandler;
exports.postHandler = postHandler;
//exports.list = list;
//module.exports = router;