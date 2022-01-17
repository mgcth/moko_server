import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

const Footer = styled.footer`
  background: papayawhip;
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 1em;
`

function AppFooter() {
    return (
        <Footer className="App-footer">
            Copyright (c) moko - no guarantees
        </Footer>
    );
}

export default AppFooter;
