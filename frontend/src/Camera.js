import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import Select from 'react-select';


const host = "http://moko:5000"
const host_ws = "ws://moko:5000"
const host_stream = "/stream"
const host_camera_config = "/camera-config"
const host_read_cameras = "/read-cameras"
const host_save_cameras = "/save-camera"


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
  return fetch(host + host_camera_config)
    .then((response) => response.json())
    .then((data) => console.log(data))
}


function CameraStream() {
  const wsRef = useRef(null);
  const [img, setImg] = useState();

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(host_ws + host_stream);
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
  margin: 1em 0;
  padding: 1em;
  text-transform: capitalize;
`;

const Label = styled.label`
  font-weight: bold;
`

function CameraModules() {
  const [error, setError] = useState(null)
  const [module, setModule] = useState([])

  useEffect(() => {
    fetch(host + host_camera_config)
      .then(res => res.json())
      .then(
        (result) => {
          setModule(result.module);
        },
        (err) => {
          console.error(err);
          setError(err);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <Label>Module</Label>
        {console.log(module)}
        <Select options={module.map(item => (
          { label: item, value: item }
        ))
        } />
      </div>
    )
  }
}

function CameraModes() {
  const [error, setError] = useState(null)
  const [modes, setModes] = useState([])

  useEffect(() => {
    fetch(host + host_camera_config)
      .then(res => res.json())
      .then(
        (result) => {
          setModes(result.modes);
        },
        (err) => {
          console.error(err);
          setError(err);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <Label>Modes</Label>
        {console.log(modes)}
        <Select options={
          modes.map(item => (
            {
              value: item,
              label: item[0][0] + "x" + item[0][1] + ", FPS: " + item[1][0] + ":" + item[1][1] + ", FoV: " + item[4]
            }
          ))
        } />
      </div>
    )
  }
}

function CameraSave() {
  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { camera: 'test' }
      )
    };
    fetch(host + host_save_cameras, requestOptions)
    // .then(response => response.json())
    // .then(data => setPostId(data.id));
  }, []);

  return (
    1
  )
}

function CameraSettings() {
  return (
    <React.Fragment>
      <CameraSettingsPane>
        <Label>Camera settings</Label>
        <CameraModules />
        <CameraModes />
      </CameraSettingsPane>
    </React.Fragment>
  )
}

function AddCamera() {
  return (
    <Section>
      <CameraSettings />
      <CameraSave />
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

export { AddCamera, Camera };