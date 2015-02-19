exports.definition = {
	config: {
		"URL": require("alloy").CFG.restapi + "office" ,
		adapter: {
			type: "restapi" ,
			"idAttribute": "id" ,
			collection_name: "offices" ,
			"DEBUG": 1,
		} ,
		headers: {
			"_session_id": function () {
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

			// fetch: function (options) {
// 			    
				// this.trigger('fetch' , this , options);
// 				
				// console.log("office.fetch options = " + JSON.stringify(options));
// 				
				// var result = Backbone.Collection.prototype.fetch.call(this , options);
// 				
				// console.log("office.fetch result = " + JSON.stringify(result));
// 				
				// return result;
			// }

		});
		return Collection;
	}

};
