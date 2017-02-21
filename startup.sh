#!/bin/bash

if [ ! -d /usr/src/trudesk-plugin-server/build/server/plugins ]; then
    echo "Creating Plugins Directory..."
    mkdir /usr/src/trudesk-plugin-server/build/server/plugins
fi

node /usr/src/trudesk-plugin-server/build/server/index.js