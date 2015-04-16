/**
 * API Manager Module
 */
var DataBase = new require('../utils/DataBase.js');
var dbase = new DataBase();

/*
 *  Method List(head, get, post)
 */
var headHander = {}
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
	var sendData={};
	if (req.method == 'POST') {
		console.log(req.session.apiId);
		db.open(function() {
			db.collection('api', function(err, collection){
				apiOid = dbase.ObjectID(req.session.apiId);
				collection.findOne({"_id": apiOid}, function(err, doc){
					if(doc != null){
						console.log(doc);
						sendData = doc;
						sendData["apiName"]=req.body.apiName;
						sendData["apiOwner"]=req.body.apiOwner;
						sendData["apiCallee"]=req.body.apiCallee;
						sendData["apiUrl"]=req.body.apiUrl;
						sendData["apiDocUrl"]=req.body.apiDocUrl;
						sendData["apiEndPoint"]=req.body.apiEndPoint;
						sendData["apiProto"]=req.body.apiProto;
						sendData["apiLocation"]=req.body.apiLocation;
						sendData["dataSource"]=req.body.dataSource;
						sendData["apiDesc"]=req.body.apiDesc;
						if (typeof req.body.apiActivated !==  'undefined' && req.body.apiActivated == "true"){
							sendData["apiActivated"] = true;
						}else{
							sendData["apiActivated"] = false;
						}
						sendData["apiVer"]=[];
						for(var verIdx in req.body.verNo){
							if(req.body.verNo[verIdx]!= ""){
								sendData["apiVer"][verIdx]={
										"no":req.body.verNo[verIdx],
										"apiUDate":req.body.verApiUDate[verIdx],
										"verCtrlType":req.body.verCtrlType[verIdx],
										"srcUrl":req.body.verSrcUrl[verIdx]
								};
							}
						}
					//}else{
						res.send({"Receive" : sendData});
					}
				});
			});
		});
	}else if(req.query.apiId){
		db.open(function() {
			console.log(req.session.apiId);
			req.session.apiId = req.query.apiId;
			console.log(req.session.apiId);
			db.collection('api', function(err, collection){
				apiOid = dbase.ObjectID(req.query.apiId);
				//var cursor = collection.find({"_id": apiOid});
				
				//cursor.each(function(err, doc){
				collection.findOne({"_id": apiOid}, function(err, doc){
					if(doc != null){
						console.log(doc);
						sendData = doc;
					//}else{
						res.render('edit', {
						pagename:"API Editor",
						api:sendData,
						apiIdHex:req.query.apiId
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
postHandler["edit"] = edit;


function register(req, res, next){
	//console.log("use api");
	var sendData = {};
	db.open(function() {
		db.collection('api', function(err, collection){
			var cursor = collection.insert(req.body, function(err,data){
				if (data) {
	                console.log('Successfully Insert');
	                sendData["state"] = "0";
	            } else {
	                console.log('Failed to Insert');
	                sendData["state"] = "1";
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