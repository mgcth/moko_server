import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

const Nav = styled.nav`
`

const Ul = styled.ul`
  list-style: none;
  display: flex;
  gap: 0.5em;
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
  margin: 6em 0 0;
  padding: 0 0 0 20px;
`

const AddCamera = styled.li`
  font-size: 3em;
  text-align: center;
  color: palevioletred;
  background: papayawhip;
  margin: 0;
  padding: 1em;
`

function Home() {
  return (
    <Section className="Home">
      <Ul>
        <AddCamera>Camera 1</AddCamera>
        <AddCamera>+</AddCamera>
      </Ul>

    </Section >
  );
}

export default Home;
