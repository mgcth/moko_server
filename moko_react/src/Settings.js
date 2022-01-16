import { NavLink } from 'react-router-dom';
import styled from 'styled-components'
import AppHeader from './Header';

const AppDiv = styled.div`
  font-family: Helvetica;
`
const Section = styled.section`
  background: papayawhip;
  padding: 2em;
`

function Settings() {
    return (
        <AppDiv className="App">
            <AppHeader />
            <Section>
                Settings
            </Section>
        </AppDiv>
    );
}

export default Settings;
