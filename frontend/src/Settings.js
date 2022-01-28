import styled from 'styled-components';

const Section = styled.section`
  margin: 6em 0;
  padding: 0 20px;
`;

const Ul = styled.ul`
  list-style: none;
  column-gap: 1em;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
`;

const Title = styled.h1`
  color: #010b10;
  padding: 0;
`;

const Div = styled.div`
`;

function Settings() {
  return (
    <Section>
      <Ul>
        <Li>
          <Title>Authentication</Title>
          <Div>Auth settings and info.</Div>
        </Li>
        <Li>
          <Title>Preferences</Title>
          <Div>Some general preferences.</Div>
        </Li>
      </Ul>
    </Section>
  );
}

export default Settings;
