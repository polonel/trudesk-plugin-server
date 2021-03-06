import _ from 'underscore';
import Async from 'async';
import Fs from 'fs';
import path from 'path';
import Busboy from 'busboy';

import PluginSchema from '../database/pluginSchema';

let api = {};

api.handlePackageMetadata = (req, res) => {
    const postData = req.body;
    let description = 'No Description Set.';
    if (!_.isUndefined(postData.description))
        description = postData.description;

    Async.waterfall([
        (done) => {
            PluginSchema.findOne({name: postData.name.toLowerCase()}, (err, plugin) => {
                return done(err, plugin);
            })
        },
        (plugin, done) => {
            if (plugin === undefined || plugin === null) {
                plugin = new PluginSchema({
                    name: postData.name.toLowerCase()
                });
            }

            plugin.pluginjson = postData.pluginJSON;

            plugin.save(done);
        }
    ], (err, savedPlugin) => {
        if (err) return res.status(400).json({success: false, error: err.message});

        return res.status(201).json({success: true, plugin: savedPlugin});
    });
};

api.handlePackageUpload = (req, res) => {
    let busboy = new Busboy({
        headers: req.headers,
        limits: {
            files: 1
        }
    });

    let object = {}, error;

    if (_.isUndefined(req.params.packageId)) {
        return res.status(400).json({error: 'Invalid Package ID'});
    }

    object.packageid = req.params.packageId;
    object.version = req.params.version;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype.indexOf('application/x-tar') === -1) {
            error = {
                status: 400,
                message: 'Invalid File type sent.'
            };

            return file.resume();
        }

        const savePath = path.join(__dirname, '../../../', 'plugins');
        if (!Fs.existsSync(savePath)) Fs.mkdirSync(savePath);

        object.filePath = path.join(savePath, object.packageid + '-' + path.basename(filename) + '@' + object.version + path.extname(filename));
        object.filename = object.packageid + '-' + path.basename(filename) + '@' + object.version + path.extname(filename);
        object.mimetype = mimetype;

        file.pipe(Fs.createWriteStream(object.filePath));
    });

    busboy.on('finish', () => {
        if (error) return res.status(error.status).json({success: false, error: error.message});

        if (_.isUndefined(object.packageid) ||
            _.isUndefined(object.filePath) ||
            _.isUndefined(object.filename)) {
                return res.status(400).json({success: false, error: 'Invalid POST Data'});
            }

        if (!Fs.existsSync(object.filePath)) return res.status(400).json({success: false, error: 'Server was unable to process your request!'});

        //Update meta with Filename
        PluginSchema.findOneAndUpdate({_id: object.packageid}, {url: object.filename}, function(err, updatedPlugin) {
            if (err) return res.status(400).json({success: false, updatedPlugin: updatedPlugin, error: 'File Saved. but unable to update file metadata.'});

            return res.status(200).json({success: true});
        });
    });

    req.pipe(busboy);
};

api.getPlugins = (req, res) => {
    const searchText = req.query.searchText;

    PluginSchema.searchPlugins(searchText, (err, plugins) => {
        if (err) return res.status(400).json({success: false, error: err.message});

        return res.json({success: true, plugins: plugins});
    })
};

api.getPluginById = (req, res) => {
    PluginSchema.getPluginById(req.params.id, (err, plugin) => {
        if (err) return res.status(400).json({success: false, error: err.message});

        return res.json({success: true, plugin: plugin});
    });
};

api.increaseDownloads = (req, res) => {
    PluginSchema.increaseDownloads(req.params.id, (err, downloads) => {
        if (err) return res.status(400).json({success: false, error: err.message});

        return res.json({success: true, downloads: downloads});
    });
};

api.getPluginByName = (req, res) => {
    const pluginName = req.params.name;

    if (_.isUndefined(pluginName)) return res.status(400).json({success: false, error: 'Invalid Plugin!'});

    PluginSchema.getPluginByName(pluginName, (err, plugin) => {
        if (err) return res.status(400).json({success: false, error: err.message});

        return res.json({success: true, plugin: plugin});
    });
};

module.exports = api;