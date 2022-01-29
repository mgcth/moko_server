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

const Form = styled.form`
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
      autoComplete="username"
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
      autoComplete="current-password"
      placeholder="Password"
      onChange={handleChange}
    >
    </input>
  )
}

function Submit({ login, setLogin, setServer }) {
  const [addCamera, setAddCamera] = useState()
  const host = login ? login.host : null

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: login ? login.username : null, password: login ? login.password : null })
    };

    console.log(host)
    addCamera && fetch(host, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
  }, [login]);

  return (
    <div>
      <AddButton className="btn" onClick={() => setAddCamera(setLogin)}>Add server</AddButton>
    </div>
  )
}

function Auth({ setServer }) {
  const [login, setLogin] = useState()
  //fetch(url, { signal: 1 })

  return (
    <SettingsPane>
      <Label>Add server</Label>
      <Form>
        <Address setLogin={setLogin} />
        <Username setLogin={setLogin} />
        <Password setLogin={setLogin} />
        {console.log(login)}
        <Submit login={login} setLogin={setLogin} setServer={setServer} />
      </Form>
    </SettingsPane>
  )
}

export { Auth };