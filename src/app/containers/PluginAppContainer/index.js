import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import App from 'grommet/components/App';
import Finder from '../../components/Finder';
import config from '../../config'

import PluginList from '../../components/PluginList';
import Plugin from '../../components/Plugin';

export default class PluginAppContainer extends Component {

  constructor () {
    super();
    this._popState = this._popState.bind(this);
    this._onSearchText = this._onSearchText.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onCloseItem = this._onCloseItem.bind(this);
    this.state = {
      initial: true,
      searchText: '',
      title: 'Trudesk Plugin Repository'
    };
  }

  componentDidMount () {
    const params = this._paramsFromQuery(window.location.search);
    const searchText = params.search || '';
    const id = params.id || null;

    this.setState({
      id: id,
      initial: (! searchText),
      searchText: searchText,
      title: this._title()
    });

    window.onpopstate = this._popState;
    document.title = this.state.title;
  }

  _title (item) {
    let title = 'Plugin Repository';
    if (item) {
      title = `${item.name} - ${title}`;
    }
    return title;
  }

  _paramsFromQuery (query) {
    let params = {};
    query.replace(/(^\?)/,'').split('&').forEach(function (p) {
      const parts = p.split('=');
      params[parts[0]] = decodeURIComponent(parts[1]);
    });
    return params;
  }

  _pushState () {
    let url = window.location.href.split('?')[0];
    if (this.state.searchText) {
      url += `?search=${encodeURIComponent(this.state.searchText)}`;
    }
    if (this.state.id) {
      url += `&id=${encodeURIComponent(this.state.id)}`;
    }
    const state = {
      id: this.state.id,
      searchText: this.state.searchText,
      title: this.state.title
    };
    window.history.pushState(state, this.state.title, url);
    document.title = this.state.title;
  }

  _popState (event) {
    if (event.state) {
      this.setState({
        id: event.state.id,
        searchText: event.state.searchText,
        title: event.state.title
      });
      document.title = event.state.title;
    }
  }

  _onSearchText (text) {
    this.setState({initial: (! text), searchText: text}, this._pushState);
  }

  _onSelect (item) {
    this.setState({
      id: item.name,
      title: this._title(item)
    }, this._pushState);
  }

  _onCloseItem () {
    this.setState({
      id: null,
      title: this._title()
    }, this._pushState);
  }

  render () {
    let contents;

    if (this.state.id) {
      contents = (
        <Plugin id={this.state.id} onSelect={this._onSelect}
        onClose={this._onCloseItem} />
      );
    } else {

      contents = (
        <Finder initial={this.state.initial}
          searchText={this.state.searchText} onSearch={this._onSearchText}>
          <PluginList
          searchText={this.state.searchText}
          onSelect={this._onSelect} />
        </Finder>
      );

    }

    return (
      <App centered={false}>
        {contents}
      </App>
    );
  }

};