import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'

const Nav = styled.nav`
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`

`;


const Section = styled.section`
  margin: 6em 0;
  padding: 0 20px;
`;


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
`;

const Img = styled.img`
  /* object-fit: cover;
  width: 100%;
  max-height: 720px; */
`

// For now, read from server later
const cameraList = ["Camera 1", "Camera 2", "Camera 3"]

function Home() {
  return (
    <Section className="Home">
      <Ul>
        {cameraList.map(camera => {
          return <Li key={camera}><CameraLink to="camera-x">{camera}</CameraLink></Li>
        })}
        <Li>
          <CameraLink to="add-camera">
            +
          </CameraLink>
        </Li>
      </Ul>
    </Section >
  );
}

export default Home;
export { Home, AddCamera, Camera };
