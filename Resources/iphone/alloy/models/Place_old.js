exports.definition = {
    config: {
        columns: {},
        adapter: {
            type: "acs",
            collection_name: "places"
        },
        settings: {
            object_name: "places",
            object_method: "Places"
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

model = Alloy.M("place_old", exports.definition, []);

collection = Alloy.C("place_old", exports.definition, model);

exports.Model = model;

exports.Collection = collection;