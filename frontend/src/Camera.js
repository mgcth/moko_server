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

const CameraSettingsPane = styled.div`
  background: papayawhip;
  margin: 1em 0;
  padding: 1em;
  text-transform: capitalize;
`;

const Label = styled.label`
  font-weight: bold;
`

const useFetchGet = (url) => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const abortCont = new AbortController();

    fetch(url, { signal: abortCont.signal })
      .then(res => {
        if (!res.ok) {
          throw Error("Could not fetch data.")
        }
        return res.json()
      })
      .then(res => {
        setData(res);
        setError(null);
      })
      .catch(err => {
        if (err.name === "AbortError") {
          console.log("Aborted fetch.")
        } else {
          console.error(err);
          setError(err.message);
        }
      }
      )

    return () => abortCont.abort;
  }, [url])

  return { data, error }
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
    <button onClick={() => setAddCamera(cameraState)}>Add camera</button>
  )
}

function CameraSettings({ setCameraState }) {
  return (
    <React.Fragment>
      <CameraSettingsPane>
        <Label>Camera settings</Label>
        <CameraModules setCameraState={setCameraState} />
        <CameraModes setCameraState={setCameraState} />
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