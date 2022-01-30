import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'
import { useFetchGet, Fetch, FetchSimple } from "./Fetch.js"
import { host, host_read_camera, host_delete_camera } from "./Hosts.js"
import { Auth } from "./Auth.js"
import { Label, SettingsPane, Form, AddButton, Ul, Li, Section, CameraLink, Image, Nav, ParentDiv, RemoveLink } from "./Style.js"

function ListCameras(data, server, setRemove) {
  return (
    <div>
      <Label>{server.host}</Label>
      <Ul>
        {
          Object.keys(data).length !== 0 && Object.keys(data).map((key, data_index) => {
            return (
              <Li key={key}>
                <ParentDiv>
                  <RemoveLink onClick={() => {
                    setRemove(key)
                    delete data[key]

                    const deleteOptions = {
                      method: 'POST',
                      headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + server.token,
                      },
                      body: JSON.stringify(key)
                    };

                    fetch(server.host + host_delete_camera, deleteOptions)
                  }
                  }>x</RemoveLink>
                  <CameraLink to="camera" state={[key, server]}>{key}</CameraLink>
                </ParentDiv>
              </Li>
            )
          })
        }
        <Li key="new">
          <CameraLink to="add-camera" state={server}>+</CameraLink>
        </Li>
      </Ul>
    </div>
  )
}

function ListServers(servers) {
  const cameras = []
  const serv = []
  Object.keys(servers).length !== 0 && Object.keys(servers).map((server, index) => {
    const header = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + servers[server].token,
    }
    cameras.push(FetchSimple(server + host_read_camera, "GET", header))
    serv.push(server)
  })

  return { cameras, serv }
}

function Home({ servers, setServers }) {
  //const [servers, setServers] = useState({})
  const [remove, setRemove] = useState(false)
  const [cameraList, setCameraList] = useState()
  const [error, setError] = useState(null)

  useEffect(() => {
    const { cameras, serv } = ListServers(servers)
    serv.map((server, index) => {
      cameras[index].then(value => {
        setCameraList(() => ListCameras(value, servers[server], setRemove))
      })
    })
  }, [servers, remove])

  return (
    <Section className="Home">
      <Auth setServers={setServers} />
      {cameraList}
    </Section >
  )
}

export default Home;
export { Home, AddCamera, Camera };
