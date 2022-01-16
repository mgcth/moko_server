import { NavLink } from 'react-router-dom';
import styled from 'styled-components'
import AppHeader from './Header';

const AppDiv = styled.div`
  font-family: Helvetica;
`

function Video() {
    return (
        <AppDiv className="App">
            <AppHeader />
            <div></div>
        </AppDiv>
    );
}

export default Video;
