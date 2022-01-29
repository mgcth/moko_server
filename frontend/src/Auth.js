import React, { useState, useRef, useEffect } from "react";
import Select from 'react-select';
import { Label, SettingsPane, Form, AddButton } from "./Style.js"

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