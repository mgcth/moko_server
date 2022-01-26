import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'
import { useFetchGet } from "./useFetchGet.js"

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
  color: #010b10;
  background: #f0f0f0;
  margin: 0;
  padding: 1em;
  display: block;
  text-decoration: none;

  &:visited {
    color: #010b10;
  }

  &:hover {
    color: #fafafa;
    background: #010b10;
  }

  &:focus {
    color: #fafafa;
    background: #010b10;
  }
`;

const Img = styled.img`
  /* object-fit: cover;
  width: 100%;
  max-height: 720px; */
`

const host = "http://moko:5000"
const host_read_cameras = "/read-cameras"

function Home() {
  const { data, error } = useFetchGet(host + host_read_cameras)

  return (
    <Section className="Home">
      <Ul>
        {Object.keys(data).length !== 0 && Object.keys(data).map((key, index) => {
          return <Li key={key}><CameraLink to="camera-x" state={key}>{key}</CameraLink></Li>
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
