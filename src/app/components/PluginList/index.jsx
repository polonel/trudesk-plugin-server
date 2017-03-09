import React, { Component, PropTypes } from 'react';
import { headers, buildQuery, processStatus } from 'grommet/utils/Rest';
import List from 'grommet/components/List';

import PluginListItem from '../PluginListItem';
import BusyListItem from '../BusyListItem';

import config from '../../config'

export default class PluginList extends Component {
    constructor() {
        super();
        this._onSelect = this._onSelect.bind(this);
        this._search = this._search.bind(this);
        this._onSearchResponse = this._onSearchResponse.bind(this);
        this.state = {
            busy: false,
            results: []
        };
    }

    componentDidMount() {
        this._queueSearch(this.props.searchText);
    }

    componentWillReceiveProps (newProps) {
        if (newProps.scope !== this.props.scope ||
        newProps.searchText !== this.props.searchText) {
            this._queueSearch(newProps.searchText);
        }
    }

    componentWillUnmount () {
        clearTimeout(this._searchTimer);
    }

    _onSearchResponse (response) {
        if (this.props.searchText) {
            let state = {error: null, busy: false};

            state.results = response.plugins;

            this.setState(state);
        }
    }

    _search () {
        const searchText = this.props.searchText;

        const options = { method: 'GET', headers: headers};
        let params = {
            searchText: searchText
        };

        const query = buildQuery(params);

        fetch('/api/plugins' + query, options)
        .then(processStatus) 
        .then(response => response.json())
        .then(response => this._onSearchResponse(response))
        .catch(error => this.setState({results: [], error: error, busy: false}));

        this._searchTimer = setTimeout(function() {
            
        }.bind(this), 200);
    }

    _queueSearch (searchText) {
        clearTimeout(this._searchTimer);
        if (!searchText) {
            this.setState({results: [], busy: false});
        } else {
            this.setState({busy: true});
            this._searchTimer = setTimeout(this._search, 500);
        }
    }

    _onSelect (item) {
        this.props.onSelect(item);
    }

    render () {
        const { searchText } = this.props;
        const { results, busy } = this.state;
        let items, empty, first, error = false;

        if (this.state.error) {
            error = <div>{this.state.error}</div>;
        }

        if (busy) {
            items = <BusyListItem />;
        } else if (searchText && results.length === 0) {
            empty = (<div> 'No Matching Plugins'</div>);
            first = true;
        } else {
            const ListItem = PluginListItem;
            items = results.map(item => (
                <ListItem key={item.name} item={item}
                onClick={this._onSelect.bind(this, item)} />
            ));
        }

        return (
            <div>
                {error}
                <List key="results" emptyIndicator={empty}>
                    {items}
                </List>
            </div>
        );
    }
}

PluginList.propTypes = {
    searchText: PropTypes.string,
    onSelect: PropTypes.func.isRequired
};