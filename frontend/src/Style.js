import { Link, renderMatches } from 'react-router-dom';
import styled from 'styled-components';

const Label = styled.label`
  font-weight: bold;
`

const SettingsPane = styled.div`
  background: #f0f0f0;
  margin: 1em 0;
  padding: 1em;
  text-transform: capitalize;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  gap: 1em;
  flex-direction: row;
`

const AddButton = styled.button`
  color: #f0f0f0;
  background: #010b10;
  border: 1px solid #010b10;
  padding: 0.375rem 0.75rem;
  min-width: 120px;

  &:hover {
    color: #010b10;
    background: #fafafa;
    border: 1px solid #fafafa;
  }

  &:focus {
    color: #fafafa;
    background: #010b10;
    box-shadow: none;
  }
`

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin: 0;
  padding: 0;
`


const Li = styled.li`

`

const Section = styled.section`
  margin: 6em 0;
  padding: 0 20px;
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
`

const Image = styled.img`
  /* object-fit: cover;
  width: 100%;
  max-height: 720px; */
`

const Nav = styled.nav`
`


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

export { Label, SettingsPane, Form, AddButton, Ul, Li, Section, CameraLink, Image, Nav, ParentDiv, RemoveLink };