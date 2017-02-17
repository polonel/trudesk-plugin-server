import React, { Component, PropTypes } from 'react';
import Header from 'grommet/components/Header';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Footer from 'grommet/components/Footer';
import Search from 'grommet/components/Search';
import Section from 'grommet/components/Section';
import Label from 'grommet/components/Label';
import Box from 'grommet/components/Box';
import GrommetLogo from 'grommet/components/icons/Grommet';
import FavoriteLogo from 'grommet/components/icons/base/Favorite';
import LogoImage from './logo.png';

import {StyledLogo} from './styles'

export default class Finder extends Component {

  constructor () {
    super();
    this._onSearchDOMChange = this._onSearchDOMChange.bind(this);
  }

  componentDidMount () {
    this.refs.search.focus();
  }

  componentDidUpdate () {
    this.refs.search.focus();
  }

  _onSearchDOMChange (event) {
    this.props.onSearch(event.target.value);
  }

  render () {
    let footer;
    let colorIndex = 'accent-1';

    if (this.props.initial) {
      colorIndex = "accent-1-a";
      footer = (
        <Footer float={true} colorIndex="grey-3-a"
          pad={{vertical: "small", horizontal: "medium", between: "medium"}}
          wrap={true} direction="row" justify="between" align="center">
          <Box pad={{vertical: "small"}}>
            
          </Box>
          <Box direction="row" align="center" responsive={false}
            pad={{ between: 'small' }}>
            <Label size="small" margin="none">Made with</Label>
            <FavoriteLogo />
            <Label size="small" margin="none">by the</Label>
            <Anchor href="http://trudesk.io" target="_blank">
              Trudesk Team</Anchor>
          </Box>
        </Footer>
      );
    }

    return (
      <Section full={true} pad="none" colorIndex={(!this.props.initial ? 'light-1' : 'accent-2')}>
        <Header key="mainHeader" size="small" full="horizontal" colorIndex='accent-2'>
            <StyledLogo src={LogoImage} />
        </Header>
        <Header key="header" size="large"
          pad={{ horizontal: "medium", between: "small" }}
          colorIndex={colorIndex} splash={this.props.initial}
          responsive={false} justify="between">
          <Search ref="search" inline={true} responsive={false} fill={true}
            size="medium" placeHolder="Search"
            defaultValue={this.props.searchText}
            onDOMChange={this._onSearchDOMChange} />
        </Header>
        {this.props.children}
        {footer}
      </Section>
    );
  }

};

Finder.propTypes = {
  initial: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired
};