import { Router } from 'express';
import path from 'path';

import PluginSchema from '../database/pluginSchema';
import Api from '../api';

export default () => {
    let router = Router();

    router.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, '../../../build/index.html')); });
    //This will be sarch but for now return all
    router.get('/api/plugins', Api.getPlugins);
    router.get('/api/plugin/package/:id', Api.getPluginById);
    router.get('/api/plugin/:name', Api.getPluginByName);

    //
    router.post('/api/registry/package/meta', Api.handlePackageMetadata);
    router.put('/api/registry/package/:packageId/:version', Api.handlePackageUpload);

    return router;
}