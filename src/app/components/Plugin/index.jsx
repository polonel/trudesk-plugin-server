import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import Responsive from 'grommet/utils/Responsive';
import { headers, buildQuery, processStatus } from 'grommet/utils/Rest';
import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';
import Column from 'grommet/components/Columns';
import Title from 'grommet/components/Title';
import SearchIcon from 'grommet/components/icons/base/Search';
import DesktopIcon from 'grommet/components/icons/base/Desktop';
import LinkBackIcon from 'grommet/components/icons/base/LinkPrevious';
import DownloadIcon from 'grommet/components/icons/base/Download';
import LogoImage from './logo.png'
import {StyledLogo, StyledHR} from './styles';
import config from '../../config';

export default class Plugin extends Component {
    constructor () {
        super();
        this._onResponsive = this._onResponsive.bind(this);
        this._onPluginResponse = this._onPluginResponse.bind(this);
        this.state = {
            plugin: {},
            responsive: false
        };
    }

    componentDidMount() {
        this._responsive = Responsive.start(this._onResponsive);
        this._getPlugin(this.props.id);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.id !== this.props.id) {
            this._getPlugin(nextProps.id);
        }
    }

    componentWillUnmount () {
        this._responsive.stop();
    }

    _onResponsive (responsive) {

    }

    _onPluginResponse (results) {
        let plugin = results.plugin[0];    
        if (plugin.pluginjson && plugin.pluginjson.github)
            this._getPluginReadme(plugin);

        this.setState({plugin: plugin, error: null});
    }

    _getPlugin (id) {
        const params = {
            url: config.baseUrl,
            filter: `${id}`
        };
        const options = { method: 'GET', headers: headers};
        const query = buildQuery(params);
        fetch(`/api/plugin/${id}`, options)
        .then(processStatus)
        .then(response => response.json())
        .then(this._onPluginResponse)
        .catch(error => this.setState({plugin:{}, error: error}));    
    }

    _getPluginReadme (plugin) {
        const uri = plugin.pluginjson.github.replace(/^http(s)?:\/\/(www\.)?github.com/, 'https://raw.githubusercontent.com') + '/master/README.md';
        fetch(uri, {method: 'GET', headers: {Accept: 'text/*'}})
        .then(response => response.text())
        .then((response) => {
            plugin.md = response;
            this.setState({plugin: plugin, error: null});
        })
        .catch(error => this.setState({plugin:{}, error: error}));
    }

    render () {
        const plugin = this.state.plugin;

        let description = plugin.pluginjson ? plugin.pluginjson.description : '';
        let authorName = plugin.pluginjson && plugin.pluginjson.author && plugin.pluginjson.author.name ? plugin.pluginjson.author.name : '';
        let version = plugin.pluginjson ? plugin.pluginjson.version : '';
        let homepage = plugin.pluginjson ? plugin.pluginjson.homepage : '';

        let header = (
            <Header key="mainHeader" size="small" full="horizontal" colorIndex='accent-2'>
                <Button icon={<LinkBackIcon />} onClick={this.props.onClose} />
                <Anchor href="/">
                    <StyledLogo src={LogoImage} />
                </Anchor>
                <Box flex={true} justify="end" direction="row" responsive={false}>
                    <Button icon={<SearchIcon />} onClick={this.props.onClose} />                
                </Box>
            </Header>
        );

        const content = (
            <Article full="vertical" className="minWidth60">
                <Box pad="none" align="start" flex={false} full="horizontal">
                    <Section pad="medium" full="horizontal">
                        <Heading tag="h1" margin="none">
                            {plugin.name}
                        </Heading>
                        <p className="plugin-description">{description}</p>
                        <StyledHR />
                        {plugin.md !== undefined &&
                            <ReactMarkdown source={plugin.md} />
                        }
                    </Section>
                </Box>
            </Article>
        );

        const details = (
            <Box margin="medium" pad={{horizontal: "large"}} alignSelf="start" full={true}>
                <Heading tag="h3">Details</Heading>
                <span className="command"><DownloadIcon size="small" className="commandIcon" /> tdp install {plugin.name}</span>
                <Anchor href="#" label="how? learn more." />
                <Box pad="small"> </Box>
                <If condition={authorName} >
                    <span className="stat-item"><Anchor href="#" label={authorName} /> published <Moment fromNow>{plugin.updated_at}</Moment></span>                    
                </If>              
                <If condition={version} >
                    <span className="stat-item"><strong>{version}</strong> is the latest version.</span>                    
                </If>

                <If condition={homepage}>
                    <span className="stat-item"><Anchor href={homepage} label={homepage} /></span>                                        
                </If>

                <Box pad="small"> </Box>
                <Heading tag="h4">Stats</Heading>
                <span className="stat-item"><strong>{plugin.downloads}</strong> total downloads</span>
            </Box>
        );

        return (
            <Box>
                {header}
                <Box align="start" direction="row">
                    {content}
                    {details}
                </Box>
            </Box>
        )
    }
}

Plugin.propTypes = {
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
};