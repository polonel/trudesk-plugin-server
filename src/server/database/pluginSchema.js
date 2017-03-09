import async from 'async';
import mongoose from 'mongoose';
import winston from 'winston';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const COLLECTION = 'plugins';

let pluginSchema = mongoose.Schema({
    name: { type: 'String', required: true, unique: true, trim: true },
    pluginjson: { type: Object, required: true },

    downloads: { type: Number, required: true, default: 0},
    url: {type: 'String', unique: true },

    created_at: { type: Date },
    updated_at: { type: Date }
});

pluginSchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if ( !this.created_at)
        this.created_at = now;

    return next();  
});

pluginSchema.statics.getAllPlugins = function(callback) {
    return this.find({}).exec(callback);
};

pluginSchema.statics.searchPlugins = function(searchText, callback) {
    return this.find({name: new RegExp(searchText, "i")}).exec(callback);
};

pluginSchema.statics.getPluginById = function(id, callback) {
    return this.findOne({_id: id}).exec(callback);
};

pluginSchema.statics.getPluginByName = function(name, callback) {
    return this.find({name: name}).exec(callback);
};

pluginSchema.statics.increaseDownloads = function(id, callback) {
    this.findOneAndUpdate({_id: id}, {$inc: {downloads: 1}}, {new: true}, function(err, doc) {
        if (err) return callback(err);

        return callback(null, doc.downloads);
    });
};

export default mongoose.model(COLLECTION, pluginSchema);