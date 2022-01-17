import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

const AppDiv = styled.div`
  font-family: Helvetica;
`
const Section = styled.section`
  background: papayawhip;
  padding: 1em;
`

const Ul = styled.ul`
  list-style: none;
  column-gap: 1em;
  margin: 0;
  padding: 1em;
`

const Li = styled.li`

`

const Title = styled.h1`
  background: papayawhip;
  padding: 0.5em;
`

function Settings() {
    return (
        <Section>
            <Ul>
                <Li>Settings 1</Li>
                <Li>Settings 1</Li>
            </Ul>
        </Section>
    );
}

export default Settings;
