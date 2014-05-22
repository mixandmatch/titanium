function query_view(db, name, options) {
    var opts = options || {};
    var view = db.viewNamed(name);
    var query = view ? view.query() : null;
    if (!query) {
        var err = String.format("invalid view name: %s", name);
        Ti.API.warn(err);
        opts.error && opts.error(null, err);
        return null;
    }
    _.isBoolean(opts.prefetch) && (query.prefetch = opts.prefetch);
    _.isFinite(opts.limit) && (query.limit = opts.limit);
    _.isFinite(opts.skip) && (query.skip = opts.skip);
    _.isBoolean(opts.descending) && (query.descending = opts.descending);
    _.isFinite(opts.groupLevel) && (query.groupLevel = opts.groupLevel);
    return query;
}

function InitAdapter(config) {
    if (!config || !config.adapter) {
        Ti.API.error("missing adapter configuration");
        return;
    }
    (!_.isString(config.adapter.dbname) || 1 > config.adapter.dbname.length) && Ti.API.error("Missing required adapter configuration property: dbname");
    db = manager.createDatabaseNamed(config.adapter.dbname);
    _.each(config.adapter.views, function(view) {
        var v = db.viewNamed(view.name);
        v.setMapAndReduce(view.map, view.reduce, view.version || "1");
        Ti.API.info("defined " + view.name);
    });
    return {};
}

function Sync(method, model, options) {
    var opts = options || {};
    switch (method) {
      case "create":
        var props = model.toJSON();
        props.modelname = model.config.adapter.modelname;
        var doc = db.untitledDocument();
        doc.putProperties(props);
        model.id = doc.documentID;
        model.trigger("create");
        break;

      case "read":
        if (opts.parse) {
            var collection = model;
            var view = opts.view || collection.config.adapter.views[0]["name"];
            opts = _.defaults(opts, collection.config.adapter.view_options);
            var query = query_view(db, view, opts);
            if (!query) break;
            var rows = query.rows();
            var len = 0;
            opts.add || (collection.models = []);
            while (row = rows.nextRow()) {
                var m = collection.map_row(collection.model, row);
                if (m) {
                    collection.models.push(m);
                    ++len;
                }
            }
            collection.view = view;
            collection.length = len;
            collection.trigger("fetch");
        } else {
            var obj = db.documentWithID(model.id);
            model.set(obj.properties);
            model.id = obj.documentID;
            model.trigger("fetch");
        }
        break;

      case "update":
        var props = model.toJSON();
        props.modelname = model.config.adapter.modelname;
        var doc = db.documentWithID(model.id);
        doc.putProperties(model.toJSON());
        model.trigger("update");
        break;

      case "delete":
        if (model.id) {
            var doc = db.documentWithID(model.id);
            doc.deleteDocument();
            model.id = null;
            model.trigger("destroy");
        }
    }
}

var _ = require("alloy/underscore"), manager = require("com.couchbase.cbl").databaseManager, db, modelname;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    InitAdapter(config);
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    Model.prototype.idAttribute = "_id";
    Model.prototype.config.Model = Model;
    Model.prototype.attachmentNamed = function(name) {
        var doc = db.documentWithID(this.id);
        if (doc) return doc.currentRevision.attachmentNamed(name);
    };
    Model.prototype.addAttachment = function(name, contentType, content) {
        var doc = db.documentWithID(this.id);
        if (doc) {
            var rev = doc.newRevision();
            rev.addAttachment(name, contentType, content);
            rev.save();
        }
    };
    Model.prototype.removeAttachment = function(name) {
        var doc = db.documentWithID(this.id);
        if (doc) {
            var rev = doc.newRevision();
            rev.removeAttachment(name);
            rev.save();
        }
    };
    Model.prototype.attachmentNames = function() {
        var doc = db.documentWithID(this.id);
        return doc ? doc.currentRevision.attachmentNames : [];
    };
    return Model;
};