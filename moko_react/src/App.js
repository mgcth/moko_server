import { NavLink } from 'react-router-dom';
import styled from 'styled-components'
import AppHeader from './Header';

const AppDiv = styled.div`
  font-family: Helvetica;
`

const Nav = styled.nav`
  padding: 0 1em;
  background: papayawhip;
`

const Ul = styled.ul`
  list-style: none;
  display: flex;
  column-gap: 1em;
  margin: 0;
  padding: 1em;
`

const Li = styled.li`

`

const ALink = styled(NavLink)`
  text-decoration: none;
  color: #000;

  &:hover {
    color: gray;
  }

  &:visited {
    color: #000;
  }
`

const Header = styled.header`
  background: papayawhip;
`

const Section = styled.section`
  background: papayawhip;
  padding: 2em;
`

const Footer = styled.footer`
  text-align: center;
  background: papayawhip;
  padding: 1em;
`

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  margin: 0;
`



function App() {
  return (
    <AppDiv className="App">
      <AppHeader />

      <Section className="App-header">
        <Title>
          moko
        </Title>
      </Section>

      <Footer>Copyright (c) 2022 moko</Footer>

    </AppDiv>
  );
}

export default App;
