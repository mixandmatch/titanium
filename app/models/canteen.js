exports.definition = {
	config: {
	    "URL": require("alloy").CFG.restapi + "canteen" ,
		adapter: {
			type: "restapi" ,
			 "idAttribute": "id",
			collection_name: "canteens" ,
			"DEBUG": 1, 
		},
		headers: {
		    "_session_id": function() {
		        return Ti.App.Properties.getString("acs.sessionId");
		    }
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
