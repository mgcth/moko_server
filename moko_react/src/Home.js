import React from "react";
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

  background: papayawhip;
  text-transform: capitalize;
`;

function CameraSettings() {
  return (
    <CameraSettingsPane>
      <Ul>
        <Li>
          Testing
          Testing
          CameraSettingsPane
          CameraSettingsPane
          CameraSettingsPane
          CameraSettingsPane
          CameraSettingsPane
        </Li>
      </Ul>
    </CameraSettingsPane>
  );
}


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
