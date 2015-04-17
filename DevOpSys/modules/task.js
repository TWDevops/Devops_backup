/**
 * New node file
 */
var DataBase = new require('../utils/DataBase.js');
var dbase = new DataBase();

var headHander = {}
var getHandler = {};
var postHandler = {};

var db = dbase.getDb();

function getTask(req, res, next) {
	var sendData = {};
	console.log("Task api");
	if(req.params.action == 'deploy'){
		sendData["action"] = req.params.action;
	}else{
		sendData["info"] = "Nothine to do."
	}
	res.send(sendData);
}
getHandler["gettask/:action"] = getTask;

exports.headHander = headHander;
exports.getHandler = getHandler;
exports.postHandler = postHandler;