/**
 * New node file
 */
var express = require('express');
var router = express.Router();
//var mod = require('../modules/apiman.js')

console.log(config.get("DB_HOST"));

//router.get('/list', apiman.list);

for (var modIdx in config.get("MOD_LIST")){
	console.log("modules: " + config.get("MOD_LIST")[0]);
	var mod = require("../modules/" + config.get("MOD_LIST")[0] + ".js");
	//console.log(Object.keys(mod.getHandler).length);
	//console.log(Object.keys(mod.postHandler).length);
	if(Object.keys(mod.getHandler).length >0){
		addGet(mod.getHandler);
	}
	if(Object.keys(mod.postHandler).length >0){
		addPost(mod.postHandler);
	}
}

function addGet(handle){
for (var key in handle){
        console.log("key: " + key);
        if(typeof handle[key] === 'function'){
                console.log("register: " + key);
                router.get(key, handle[key]);
        }
	}
}

function addPost(handle){
for (var key in handle){
        console.log("key: " + key);
        if(typeof handle[key] === 'function'){
                console.log("register: " + key);
                router.post(key, handle[key]);
        }
}
}

module.exports = router;