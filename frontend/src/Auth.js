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
      onChange={handleChange}>
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
      onChange={handleChange}>
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
      onChange={handleChange}>
    </input>
  )
}

function AddServer({ login, setServers }) {
  const [loginState, setLoginState] = useState(false)

  useEffect(() => {
    const host = loginState.host ? loginState.host : null
    const username = loginState.username ? loginState.username : null
    const password = loginState.password ? loginState.password : null

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    };

    host && fetch(host + "/auth", requestOptions)
      .then(response => response.json())
      .then(data => {
        const requestVerify = {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + data["access_token"],
          }
        };

        // console.log(requestVerify)
        fetch(host + "/auth/verify", requestVerify)

        setServers(servers => ({ ...servers, [host]: { host: host, token: data["access_token"] } }))
      });
  }, [loginState]);

  return (
    <AddButton className="btn" onClick={() => setLoginState(login)}>Add server</AddButton>
  )
}

function Auth({ setServers }) {
  const [login, setLogin] = useState()

  return (
    <SettingsPane>
      <Label>Add server</Label>
      <Form onSubmit={e => e.preventDefault()}>
        <Address setLogin={setLogin} />
        <Username setLogin={setLogin} />
        <Password setLogin={setLogin} />
        <AddServer login={login} setServers={setServers} />
      </Form>
    </SettingsPane>
  )
}

export { Auth };