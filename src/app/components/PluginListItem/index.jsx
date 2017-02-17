import React, { PropTypes } from 'react';
import ListItem from 'grommet/components/ListItem';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import UserIcon from 'grommet/components/icons/base/User';
import DesktopIcon from 'grommet/components/icons/base/Desktop';

const PluginListItem = (props) => {
    const { item, first } = props;
    let thumbnail = <DesktopIcon size="small" />;

    return (
        <ListItem justify="between" onClick={props.onClick}
        pad={{horizontal: 'medium', vertical: 'small', between: 'medium'}}
        separator={first ? 'horizontal' : 'bottom' }
        colorIndex={props.colorIndex}>
            <Box pad={{between: 'small'}} direction="row" align="center"
            responsive={false} className="flex">
                {thumbnail}
                <span>{item.name} - v{item.pluginjson.version}</span>
            </Box>
            <span className="secondary">
                {item.desc}
            </span>
        </ListItem>
    );
};

PluginListItem.PropTypes = {
    colorIndex: PropTypes.string,
    first: PropTypes.bool,
    item: PropTypes.object,
    onClick: PropTypes.func
};

export default PluginListItem;