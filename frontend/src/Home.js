import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'
import { useFetchGet } from "./useFetchGet.js"
import { host, host_read_camera, host_delete_camera } from "./Hosts.js"
import { Auth } from "./Auth.js"
import { Label, SettingsPane, Form, AddButton, Ul, Li, Section, CameraLink, Image, Nav, ParentDiv, RemoveLink } from "./Style.js"

function Home() {
  const [servers, setServers] = useState({})
  const [remove, setRemove] = useState(false)
  const [cameraList, setCameraList] = useState()
  const { data, error } = useFetchGet(host + host_read_camera)

  useEffect(() => {
    setCameraList(() => {
      return (
        Object.keys(servers).length !== 0 && Object.keys(data).map((server, server_index) => {
          <div>{server}</div>
          Object.keys(data).length !== 0 && Object.keys(data).map((key, index) => {
            return (
              <Li key={key}>
                <ParentDiv>
                  <RemoveLink onClick={() => {
                    setRemove(key)
                    delete data[key]

                    const deleteOptions = {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(key)
                    };

                    fetch(host + host_delete_camera, deleteOptions)
                  }
                  }>x</RemoveLink>
                  <CameraLink to="camera" state={key}>{key}</CameraLink>
                </ParentDiv>
              </Li>
            )
          })
        })
      )
    }
    )
  }, [servers, remove, data])

  return (
    <Section className="Home">
      <Auth setServers={setServers} />
      {console.log(servers)}
      <Ul>
        {cameraList}
        <Li>
          <CameraLink to="add-camera">
            +
          </CameraLink>
        </Li>
      </Ul>
    </Section >
  )
}

export default Home;
export { Home, AddCamera, Camera };
