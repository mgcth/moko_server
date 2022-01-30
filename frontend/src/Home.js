import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'
import { useFetchGet, Fetch } from "./Fetch.js"
import { host, host_read_camera, host_delete_camera } from "./Hosts.js"
import { Auth } from "./Auth.js"
import { Label, SettingsPane, Form, AddButton, Ul, Li, Section, CameraLink, Image, Nav, ParentDiv, RemoveLink } from "./Style.js"

function ListCameras(server, data, setRemove) {
  return (
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

              fetch(server + host_delete_camera, deleteOptions)
            }
            }>x</RemoveLink>
            <CameraLink to="camera" state={key}>{key}</CameraLink>
          </ParentDiv>
        </Li>
      )
    })
  )
}

function ListServers(servers, data, setData, setRemove, setError) {
  return (
    Object.keys(servers).length !== 0 && Object.keys(servers).map((server, index) => {

      const header = {
        "Content-type": "application/json",
        "Authorization": "Bearer " + servers[server].token,
      }
      const abortCont = Fetch(server + host_read_camera, "GET", header, setData, setError)

      return (
        <div>
          <Label>{server}</Label>
          <Ul>
            {ListCameras(servers[server], data, setRemove)}
            <Li key="new">
              <CameraLink to="add-camera">
                +
              </CameraLink>
            </Li>
          </Ul>
        </div>
      )
    })
  )
}

function Home() {
  const [servers, setServers] = useState({})
  const [remove, setRemove] = useState(false)
  const [cameraList, setCameraList] = useState()
  const [serverList, setServerList] = useState()
  //const { data, error } = useFetchGet(host + host_read_camera)

  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setServerList(() => ListServers(servers, data, setData, setRemove, setError))
  }, [servers, remove])

  return (
    <Section className="Home">
      <Auth setServers={setServers} />
      {serverList}
    </Section >
  )
}

export default Home;
export { Home, AddCamera, Camera };
