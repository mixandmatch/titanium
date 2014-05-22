exports.definition = {
	config: {
	    "URL": require("alloy").CFG.restapi + "event" ,
		adapter: {
			type: "restapi" ,
			 "idAttribute": "id",
			collection_name: "places" ,
			"debug": 1
		}
	} ,
	extendModel: function (Model) {

		_.extend(Model.prototype , {
		});
		return Model;
	} ,
	extendCollection: function (Collection) {
		_.extend(Collection.prototype , {
		});
		return Collection;
	}

};
