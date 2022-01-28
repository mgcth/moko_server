import styled from 'styled-components';

const Footer = styled.footer`
  background: #f0f0f0;
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 1em;
`;

function AppFooter() {
    return (
        <Footer className="App-footer">
            Copyright (c) moko - no guarantees
        </Footer>
    );
}

export default AppFooter;
