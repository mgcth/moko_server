import { NavLink } from 'react-router-dom';
import styled from 'styled-components'
import AppHeader from './Header';

const AppDiv = styled.div`
  font-family: Helvetica;
`

const Header = styled.header`
  background: papayawhip;
`

const Nav = styled.nav`
`

const Ul = styled.ul`
  list-style: none;
  display: flex;
  column-gap: 0;
  margin: 0;
  padding: 0;
`

const Li = styled.li`

`

const ALink = styled(NavLink)`
  text-decoration: none;
  color: #000;
  padding: 0 1em;

  &:hover {
    color: gray;
  }

  &:visited {
    color: #000;
  }
`

const Section = styled.section`
  padding: 2em;
`

const Footer = styled.footer`
  text-align: center;

  padding: 1em;
`

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  margin: 0;
`



function Home() {
  return (

    <AppDiv className="Home">

      <Section className="App-header">
        <Title>
          moko
        </Title>
        <Title>
          moko
        </Title>
        <Title>
          moko
        </Title>
        <Title>
          moko
        </Title>
        <Title>
          moko
        </Title>
        <Title>
          moko
        </Title>
      </Section>

      <Footer>Copyright (c) 2022 moko</Footer>

    </AppDiv>
  );
}

export default Home;
