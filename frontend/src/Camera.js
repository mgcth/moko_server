import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import Select from 'react-select';
import { useFetchGet } from "./useFetchGet.js"


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

const CameraSettingsPane = styled.div`
  background: papayawhip;
  margin: 1em 0;
  padding: 1em;
  text-transform: capitalize;
`;

const Label = styled.label`
  font-weight: bold;
`





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
    <Img className="img-fluid" src={img} alt="stream" />
  );
}

function CameraName({ setCameraState }) {
  const { data, error } = useFetchGet(host + host_camera_config)

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, name: e.target.value }))
    };
  });

  return (
    <div>
      <Label>Name</Label>
      <input
        type="text"
        className="form-control"
        placeholder="Type unique camera name..."
        onChange={handleChange}
      >
      </input>
    </div>
  )
}

function CameraModules({ setCameraState }) {
  const { data, error } = useFetchGet(host + host_camera_config)

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, module: e.value }))
    };
  });

  return (
    <div>
      <Label>Module</Label>
      <Select options={"module" in data && data.module.map(item => (
        { label: item, value: item }
      ))
      } onChange={handleChange} />
    </div>
  )
}

function CameraModes({ setCameraState }) {
  const { data, error } = useFetchGet(host + host_camera_config)

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, mode: e.value }))
    };
  });

  return (
    <div>
      <Label>Modes</Label>
      <Select options={"modes" in data &&
        data.modes.map(item => (
          {
            value: item,
            label: item[1][0] + "x" + item[1][1] + ", FoV: " + item[5]
          }
        ))
      } onChange={handleChange} />
    </div>
  )
}

function CameraSaveFolder({ setCameraState }) {
  const { data, error } = useFetchGet(host + host_camera_config)

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, save_folder: e.target.value }))
    };
  });

  return (
    <div>
      <Label>Save folder</Label>
      <input
        type="text"
        className="form-control"
        placeholder="Type save folder path (absolute)..."
        onChange={handleChange}
      >
      </input>
    </div>
  )
}

function CameraSave({ cameraState }) {
  const [addCamera, setAddCamera] = useState()

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        addCamera
      )
    };
    fetch(host + host_save_cameras, requestOptions)
    // .then(response => response.json())
    // .then(data => setPostId(data.id));
  }, [addCamera]);

  return (
    <button className="btn btn-dark" onClick={() => setAddCamera(cameraState)}>Add camera</button>
  )
}

function CameraSettings({ setCameraState }) {
  return (
    <React.Fragment>
      <CameraSettingsPane>
        <Label>Camera settings</Label>
        <CameraName setCameraState={setCameraState} />
        <CameraModules setCameraState={setCameraState} />
        <CameraModes setCameraState={setCameraState} />
        <CameraSaveFolder setCameraState={setCameraState} />
      </CameraSettingsPane>
    </React.Fragment>
  )
}

function AddCamera() {
  const [cameraState, setCameraState] = useState([])

  return (
    <Section>
      <CameraSettings setCameraState={setCameraState} />
      <CameraSave cameraState={cameraState} />
      {console.log(cameraState)}
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