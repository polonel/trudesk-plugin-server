import React from 'react';
import ListItem from 'grommet/components/ListItem';
import Spinning from 'grommet/components/icons/Spinning';

const BusyListItem = props => (
    <ListItem justify="start" pad="medium">
        <Spinning />
    </ListItem>
);

export default BusyListItem;