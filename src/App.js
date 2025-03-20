import './App.css';
import Game from './components/Game';
import styled from 'styled-components';

function App() {
  return (
    <ScreenGm>
        <Game/>
    </ScreenGm>
  );
}

const ScreenGm = styled.div`
  width:100%;
`;

export default App;
