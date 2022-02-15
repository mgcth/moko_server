import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import Select from 'react-select';
import { useFetchGet, Fetch } from "./Fetch.js"
import {
  host,
  host_ws,
  host_stream,
  host_camera_config,
  host_get_camera_backend,
  host_set_camera_backend,
  host_read_cameras,
  host_save_camera
} from "./Hosts.js"
import { Label, SettingsPane, Form, AddButton, Ul, Li, Section, CameraLink, Image } from "./Style.js"


function CameraStream({ cameraName, server }) {
  const wsRef = useRef(null);
  const [image, setImage] = useState();

  useEffect(() => {
    if (!wsRef.current) {
      console.log(host_ws + host_stream + "?access_token=" + server.token)
      wsRef.current = new WebSocket(host_ws + host_stream + "?access_token=" + server.token);
      wsRef.current.onopen = () => {
        wsRef.current.send(cameraName);
      }
    }

    if (wsRef.current) {
      wsRef.current.onmessage = function (event) {
        const data = event.data;
        try {
          setImage(data);
        } catch (err) {
          setImage(null)
          console.log(err);
        }
      }
    }

    return () => {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  return (
    <Image className="image-fluid" src={image} alt="stream" />
  )
}

function CameraName({ setCameraState }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, name: e.target.value }))
    }
  })

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

function CameraBackend({ setCameraState, server, setBackend }) {
  const headers = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + server.token,
  }
  const { data, error } = useFetchGet(server.host + host_get_camera_backend, "GET", headers)

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, backend: e.value }))

      const postOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + server.token,
        },
        body: JSON.stringify(e.value)
      };

      fetch(server.host + host_set_camera_backend, postOptions)
      .then(res => res.json())
      .then(res => setBackend(res))
    }
  })

  return (
    <div>
      <Label>Backend</Label>
      <Select options={data.map(item => (
        { label: item, value: item }
      ))
      } onChange={handleChange} />
    </div>
  )
}

function CameraModel({ setCameraState, setModel, server, backend }) {
  const [data, setData] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    const postMessage = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + server.token,
      },
    };

    Fetch(server.host + host_camera_config, postMessage, setData, setError)
  }, [backend])

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, model: e.value }))
      setModel(e.value)
    }
  })

  return (
    <div>
      <Label>Model</Label>
      <Select options={backend && "model" in data && data.model.map(item => (
        { label: item, value: item }
      ))
      } onChange={handleChange} />
    </div>
  )
}

function CameraModes({ setCameraState, setMode, model, server, backend }) {
  const [data, setData] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    const postMessage = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + server.token,
      },
    };

    Fetch(server.host + host_camera_config, postMessage, setData, setError)
  }, [backend])

  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, mode: e.value }))
      setMode(e.value)
    }
  })

  return (
    <div>
      <Label>Modes</Label>
      <Select options={model && "modes" in data &&
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

function CameraFPS({ mode, setCameraState }) {
  const [minFPS, setMinFPS] = useState(1)
  const [maxFPS, setMaxFPS] = useState(2)

  useEffect(() => {
    if (mode) {
      setMinFPS(mode[2][0])
      setMaxFPS(mode[2][1])
    }
  }, [mode])

  const [handleChange] = useState((e) => {
    let default_value = 1
    return (e) => {
      const value = parseFloat(e.target.value, 10)
      if (minFPS <= value <= maxFPS) {
        default_value = value
      }
      setCameraState(cameraState => ({ ...cameraState, fps: default_value }))
    }
  })

  return (
    <div>
      <Label>Frames per second</Label>
      <input
        type="number"
        className="form-control"
        placeholder={`Dynamic value set by camera mode (${minFPS}, ${maxFPS})`}
        min={minFPS}
        max={maxFPS}
        step={0.1}
        onChange={handleChange}
      >
      </input>
    </div>
  )
}

function CameraQuality({ setCameraState }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      let value = 10
      if (1 <= e.target.value <= 100) {
        value = e.target.value
      }
      setCameraState(cameraState => ({ ...cameraState, quality: parseInt(value, 10) }))
    }
  })

  return (
    <div>
      <Label>Quality</Label>
      <input
        type="number"
        className="form-control"
        placeholder="Stream JPEG quality, default 10, value between 1-100"
        min={1}
        max={100}
        step={1}
        onChange={handleChange}
      >
      </input>
    </div>
  )
}

function CameraRotation({ setCameraState }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, rotation: e.value }))
    }
  })

  return (
    <div>
      <Label>Rotation</Label>
      <Select options={
        [{ label: 0, value: 0 }, { label: 90, value: 90 }, { label: 180, value: 180 }, { label: 270, value: 270 }]
      } onChange={handleChange} />
    </div>
  )
}

function CameraSaveFolder({ setCameraState }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setCameraState(cameraState => ({ ...cameraState, save_folder: e.target.value }))
    }
  })

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

function CameraSave({ cameraState, server }) {
  const [addCamera, setAddCamera] = useState()

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + server.token,
      },
      body: JSON.stringify(addCamera)
    };

    addCamera && fetch(server.host + host_save_camera, requestOptions)
    // .then(response => response.json())
    // .then(data => setPostId(data.id));
  }, [addCamera])

  return (
    <AddButton className="btn" onClick={() => setAddCamera(cameraState)}>Add camera</AddButton>
  )
}

function CameraSettings({ setCameraState, server }) {
  const [backend, setBackend] = useState()
  const [model, setModel] = useState()
  const [mode, setMode] = useState()

  return (
    <SettingsPane>
      <Label>Camera settings</Label>
      <CameraName setCameraState={setCameraState} />
      <CameraBackend setCameraState={setCameraState} server={server} setBackend={setBackend} />
      <CameraModel setCameraState={setCameraState} setModel={setModel} server={server} backend={backend} />
      <CameraModes setCameraState={setCameraState} setMode={setMode} model={model} server={server} backend={backend} />
      <CameraFPS setCameraState={setCameraState} mode={mode} />
      <CameraQuality setCameraState={setCameraState} />
      <CameraRotation setCameraState={setCameraState} />
      <CameraSaveFolder setCameraState={setCameraState} />
    </SettingsPane>
  )
}

function AddCamera(props) {
  const [cameraState, setCameraState] = useState([])
  const server = useLocation().state
  console.log(cameraState)

  return (
    <Section>
      <CameraSettings setCameraState={setCameraState} server={server} />
      <CameraSave cameraState={cameraState} server={server} />
    </Section>
  )
}

function Camera(props) {
  const state = useLocation().state
  const cameraName = state[0]
  const server = state[1]

  return (
    < Section className="camera-stream" >
      <CameraStream cameraName={cameraName} server={server} />
    </Section >
  )
}

export { AddCamera, Camera };