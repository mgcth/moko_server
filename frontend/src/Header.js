import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  background: #f0f0f0;
  position: fixed;
  top: 20px;
  left: 20px;
  background: #f0f0f0;
  text-transform: capitalize;
  z-index: 1;
`;

const Nav = styled.nav`

`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`

`;

const ALink = styled(NavLink)`
  text-decoration: none;
  color: #010b10;

  padding: 1em;
  display: block;

  &:hover {
    color: #fafafa;
    background: #010b10;
  }

  &:visited {
    color: #010b10;
  }

  &.active {
    color: #fafafa;
    background: #010b10;
  }
`;

const ADiv = styled.div`
  text-decoration: none;
  color: #000;
  padding: 1em;
  display: block;
`;

function AppHeader() {
  return (
    <Header className="App-header">
      <Nav>
        <Ul>
          <Li>
            <ALink
              to=""
              className={({ isActive }) =>
                isActive ? "" : undefined
              }>
              moko
            </ALink>
          </Li>
          <Li>
            <ALink
              to="settings"
              className={({ isActive }) =>
                isActive ? "" : undefined
              }>
              settings
            </ALink>
          </Li>
        </Ul>
      </Nav>
    </Header >
  );
}

export default AppHeader;
