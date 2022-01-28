import React, { useState, useRef, useEffect } from "react";
import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, AddCamera } from './Camera.js'
import { useFetchGet } from "./useFetchGet.js"

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


const ParentDiv = styled.div`
  position: relative;
`
const RemoveLink = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  text-decoration: none;
  padding: 0.15em 0.5em;
  color: #010b10;
  background: #f0f0f0;
  border: none;

  &:visited {
    color: #010b10;
  }

  &:hover {
    color: #fafafa;
    background: #010b10;
  }
`

const CameraLink = styled(Link)`
  font-size: 3em;
  text-align: center;
  color: #010b10;
  background: #f0f0f0;
  margin: 0;
  padding: 1em;
  display: block;
  text-decoration: none;

  &:visited {
    color: #010b10;
  }

  &:hover {
    color: #fafafa;
    background: #010b10;
  }

  &:focus {
    color: #fafafa;
    background: #010b10;
  }
`;

const Img = styled.img`
  /* object-fit: cover;
  width: 100%;
  max-height: 720px; */
`

const host = "http://moko:5000"
const host_read_camera = "/read-camera"
const host_delete_camera = "/delete-camera"

function Home() {
  const [remove, setRemove] = useState(false)
  const [cameraList, setCameraList] = useState()
  const { data, error } = useFetchGet(host + host_read_camera)

  useEffect(() => {
    setCameraList(() => {
      return (
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
      )
    }
    )
  }, [remove, data])

  return (
    <Section className="Home">
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
