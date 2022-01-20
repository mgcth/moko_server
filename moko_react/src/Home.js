import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

const CameraSettingsPane = styled.div`
  background: papayawhip;
  position: fixed;
  top: 6em;
  right: 20px;
  margin: 0 0 20px 20px;
  padding: 1em;
  text-transform: capitalize;
`;

const Img = styled.img`
  object-fit: cover;
  width: 100%;
  max-height: 400px;
`

const fetchData = () => {
  return fetch("https://moko:5000/cameras")
    .then((response) => response.json())
    .then((data) => console.log(data))
}


function CameraSettings() {
  const wsRef = useRef();
  const [img, setImg] = useState();

  if (!wsRef.current) {
    wsRef.current = new WebSocket("ws://192.168.1.105:5000/stream");
  }

  if (wsRef.current) {
    wsRef.current.onmessage = function (event) {
      const data = event.data;
      try {
        setImg(data);
      } catch (err) {
        console.log(err);
      }
    };
  }




  return (
    <CameraSettingsPane>
      <Ul>
        <Li>
          <Img src={img} alt="stream" />
        </Li>
      </Ul>
    </CameraSettingsPane>
  );
}


function AddCamera() {
  return (
    <Section>
      <CameraSettings />
    </Section>
  );
}

function Camera() {
  return (
    <Section>
      <CameraSettings />
    </Section>
  );
}

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
