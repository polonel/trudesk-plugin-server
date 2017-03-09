import React from 'react';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Search from 'grommet/components/Search';
import LogoImage from './logo.png';
import { StyledMenu, StyledLogo, LogoPlaceholder } from './styles';

const Navbar = () => (
    <div>
      <Header justify="between">
        <Title>
          {typeof window !== 'undefined' ?
            <StyledLogo src={LogoImage} alt="logo" />
          :
            <LogoPlaceholder />
          }
        </Title>
        <StyledMenu inline direction="row" align="center" responsive={false}>
          <Anchor href="/" align="start">
            Home
          </Anchor>
          {/*<Search dropAlign={{ right: 'right' }} />*/}
        </StyledMenu>
      </Header>
    </div>
);

export default Navbar;