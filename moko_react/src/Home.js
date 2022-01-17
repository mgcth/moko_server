import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Link } from 'react-router-dom';
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


const Section = styled.section`
  margin: 6em 0 0;
  padding: 0 0 0 20px;
`


const CameraLink = styled(Link)`
  font-size: 3em;
  text-align: center;
  color: palevioletred;
  background: papayawhip;
  margin: 0;
  padding: 1em;
  display: block;
  text-decoration: none;

  &:visited {
    color: palevioletred;
  }

  &:hover {
    color: #000;
  }
`

function AddCamera() {
  return (
    <Section>
      Hi there
    </Section>
  );
}

function Camera() {
  return (
    <Section>
      Hi there camera x
    </Section>
  );
}


function Home() {
  return (
    <React.Fragment>
      <Section className="Home">
        <Ul>
          <Li>
            <CameraLink to="camera-x">
              Camera 1
            </CameraLink>
          </Li>
          <Li>
            <CameraLink to="add-camera">
              +
            </CameraLink>
          </Li>
        </Ul>
      </Section>
    </React.Fragment>
  );
}

export default Home;
export { Home, AddCamera, Camera }
