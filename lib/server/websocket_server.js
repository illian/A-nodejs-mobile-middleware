var everyone = require('./rest_server').everyone;
var MongoDB = require('./../../models/mongoDB');
var mongoose = require('mongoose');
var mongoClient = MongoDB.clients;

/*client: 'jqm/titanium etc'
*/

var dbCache = [];
mongoose.connect('mongodb://127.0.0.1/shopdatabase');
mongoClient.find({}, function(err, docs){
	for(var clients = 0; clients < docs.length; clients++) {
		dbCache[docs[clients].name] = docs[clients];
	}
});
mongoose.disconnect();


everyone.now.loadMainCategories = function(client, service, callback) {
	var mainCat,
		categories;
	
	if(client === 'jqm') {

		if(service === 'intershop') {
			var returnData = [];	
			mainCat = dirtydb.mainCategories.get('MainCategories');
			for(var domain in mainCat) {
				mainCat[domain].subcategories = dirtydb.subCategories.get(mainCat[domain].domainName);
			}
			var intershop = dbCache['intershop'];
			
			for (var main=0; main < intershop.items.length; main++) {
				var subs = [];
				for (var sub=0; sub < intershop.items[main].items.length; sub++) {
					subs.push({name: intershop.items[main].items[sub].name, id: intershop.items[main].items[sub]._id});;
				}	
				returnData.push({name: intershop.items[main].name, subcategories: subs});
			}
			
			callback(null, returnData);
		}
		else if(service === 'elegance') {
			mainCat = dirtydb.mainCategories.get(service);
			var list = [];
			var returnData = [];
			
			for (var category in mainCat) {
				var subs = [];
				for(var subcategories in mainCat[category].sub_groups) {
					subs.push({displayName: mainCat[category].sub_groups[subcategories].name});
				}
				list.push({displayName : mainCat[category].name,
						   subcategories: subs});
			}
			var elegance = dbCache['elegance'];
			
			for (var main=0; main < elegance.items.length; main++) {
				var subs = [];
				for (var sub=0; sub < elegance.items[main].items.length; sub++) {
					subs.push({name: elegance.items[main].items[sub].name, id: elegance.items[main].items[sub]._id});;
				}	
				returnData.push({name: elegance.items[main].name, subcategories: subs});
			}
			callback(null, returnData);
		}
		
	} else {
		//different clients
	}
	
	
}

everyone.now.distributeTeaser = function(message) {
	everyone.now.receieveTeaserData(message);
}

module.exsports = everyone;