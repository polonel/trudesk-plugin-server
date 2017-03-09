import React, { PropTypes } from 'react';
import ListItem from 'grommet/components/ListItem';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import UserIcon from 'grommet/components/icons/base/User';
import DesktopIcon from 'grommet/components/icons/base/Desktop';

class PluginListItem extends React.Component {
    render() {
        let thumbnail = <DesktopIcon size="small" />;
        return <ListItem justify="between" onClick={this.props.onClick}
                  pad={{horizontal: 'medium', vertical: 'small', between: 'medium'}}
                  separator={this.props.first ? 'horizontal' : 'bottom' }
                  colorIndex={this.props.colorIndex}>
            <Box pad={{between: 'small'}} direction="row" align="center"
                 responsive={false} className="flex">
                {thumbnail}
                <span>{this.props.item.name} - v{this.props.item.pluginjson.version}</span>
            </Box>
            <span className="secondary">
                {this.props.item.desc}
            </span>
        </ListItem>
    }
}

PluginListItem.propTypes = {
    colorIndex: PropTypes.string,
    first: PropTypes.bool,
    item: PropTypes.object,
    onClick: PropTypes.func
};

export default PluginListItem;