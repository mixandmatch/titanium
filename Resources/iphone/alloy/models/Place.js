exports.definition = {
    config: {
        URL: require("alloy").CFG.restapi + "event",
        adapter: {
            type: "restapi",
            idAttribute: "id",
            collection_name: "places",
            debug: 1
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("place", exports.definition, []);

collection = Alloy.C("place", exports.definition, model);

exports.Model = model;

exports.Collection = collection;