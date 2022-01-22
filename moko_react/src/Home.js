import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import Select from 'react-select'

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

const fetchData = () => {
  return fetch("https://moko:5000/cameras")
    .then((response) => response.json())
    .then((data) => console.log(data))
}


function CameraStream() {
  const wsRef = useRef(null);
  const [img, setImg] = useState();

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket("ws://192.168.1.105:5000/stream");
    }

    if (wsRef.current) {
      wsRef.current.onmessage = function (event) {
        const data = event.data;
        try {
          setImg(data);
        } catch (err) {
          setImg(null)
          console.log(err);
        }
      };
    }

    return () => {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  return (
    <Img src={img} alt="stream" />
  );
}

const CameraSettingsPane = styled.div`
  background: papayawhip;
  margin: 6em 0 ;
  padding: 1em;
  text-transform: capitalize;
`;

const Label = styled.label`
  font-weight: bold;
`

const options = [
  { value: '720', label: '1280 x 720' },
  { value: '1080', label: '1920 x 1080' }
]

const MyComponent = () => (
  <CameraSettingsPane>
    <div>

      <Label>Resolution</Label>
      <Select options={options} />

    </div>
    <div>

      <Label>Resolution</Label>
      <Select options={options} />

    </div>
  </CameraSettingsPane>
)

function CameraSettings() {
  return (
    <MyComponent />
  )
}

function AddCamera() {
  return (
    <Section>
      <CameraSettings />
      <CS />
    </Section>
  );
}

function Camera() {
  return (
    <Section className="camera-stream">
      <CameraStream />
    </Section>
  );
}

// For now, read from server later
const cameraList = ["Camera 1", "Camera 2", "Camera 3"]

function CS() {
  const [error, setError] = useState(null)
  const [module, setModule] = useState([])
  const [modes, setModes] = useState([])

  useEffect(() => {
    fetch('http://192.168.1.105:5000/cameras')
      .then(res => res.json())
      .then(
        (result) => {
          setModule(result.module);
          setModes(result.modes);
        },
        (err) => {
          console.error(err);
          setError(err);
        }
      )
  }, [])

  if (modes == []) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>

        <Label>Module</Label>
        {console.log(module)}
        <Select options={module} />

        <Label>Modes</Label>
        <Select options={
          modes.map(item => (
            {
              value: item,
              label: item + "bla"
            }
          ))
        } />

      </div>


    )
  }
}

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
