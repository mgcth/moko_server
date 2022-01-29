import React, { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import Select from 'react-select';

const Label = styled.label`
  font-weight: bold;
`

const SettingsPane = styled.div`
  background: #f0f0f0;
  margin: 1em 0;
  padding: 1em;
  text-transform: capitalize;
`;

const Div = styled.div`
 width: 100%;
  display: flex;
  gap: 1em;
  flex-direction: row;
`

const AddButton = styled.button`
  color: #010b10;
  background: #f0f0f0;
  border: 1px solid #f0f0f0;
  padding: 0.375rem 0.75rem;
  min-width: 120px;

  &:hover {
    color: #f0f0f0;
    background: #010b10;
  }

  &:focus {
    color: #fafafa;
    background: #010b10;
    box-shadow: none;
  }
`

function Address({ setLogin }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setLogin(login => ({ ...login, host: e.target.value }))
    };
  });

  return (
    <input
      type="text"
      className="form-control"
      placeholder="Address"
      onChange={handleChange}
    >
    </input>
  )
}

function Username({ setLogin }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setLogin(login => ({ ...login, username: e.target.value }))
    };
  });

  return (
    <input
      type="text"
      className="form-control"
      placeholder="Username"
      onChange={handleChange}
    >
    </input>
  )
}

function Password({ setLogin }) {
  const [handleChange] = useState((e) => {
    return (e) => {
      setLogin(login => ({ ...login, password: e.target.value }))
    };
  });

  return (
    <input
      type="password"
      className="form-control"
      placeholder="Password"
      onChange={handleChange}
    >
    </input>
  )
}

function Submit({ setLogin }) {
  const [addCamera, setAddCamera] = useState()

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addCamera)
    };

    console.log(addCamera)
    //addCamera && fetch(host + host_save_camera, requestOptions)
    // .then(response => response.json())
    // .then(data => setPostId(data.id));
  }, [addCamera]);

  return (
    <div>
      <AddButton className="btn" onClick={() => setAddCamera(setLogin)}>Add server</AddButton>
    </div>
  )
}

function Auth() {
  const [login, setLogin] = useState()
  //fetch(url, { signal: 1 })

  return (
    <SettingsPane>
      <Label>Add server</Label>
      <Div>
        <Address setLogin={setLogin} />
        <Username setLogin={setLogin} />
        <Password setLogin={setLogin} />
        {console.log(login)}
        <Submit />
      </Div>
    </SettingsPane>
  )
}

export { Auth };