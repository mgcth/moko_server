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
  const [serverList, setServerList] = useState()
  const { data, error } = useFetchGet(host + host_read_camera)

  useEffect(() => {
    setServerList(() => {
      return (
        Object.keys(servers).length !== 0 && Object.keys(servers).map((server, server_index) => {
          return (
            <React.Fragment>
              <Label>{server}</Label>
              <Ul>

                <Li>
                  <CameraLink to="add-camera">
                    +
                  </CameraLink>
                </Li>
              </Ul>
            </React.Fragment>
          )
        })
      )
    })
  }, [servers])

  return (
    <Section className="Home">
      <Auth setServers={setServers} />
      {serverList}
    </Section >
  )
}

export default Home;
export { Home, AddCamera, Camera };
