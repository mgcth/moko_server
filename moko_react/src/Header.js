import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

const Header = styled.header`
  background: papayawhip;
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

let activeStyle = {
  background: "#000",
  color: "#000"
};

function AppHeader() {
  return (
    <Header className="App-header">
      <Nav>
        <Ul>
          <Li><ALink
            to=""
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >moko</ALink></Li>
          <Li><ALink
            to="video"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >video</ALink></Li>
          <Li><ALink
            to="settings"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >settings</ALink></Li>
        </Ul>
      </Nav>
    </Header >
  );
}

export default AppHeader;
