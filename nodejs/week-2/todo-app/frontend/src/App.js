import MainContent from './components/Todo/MainContent';
import { TodoProvider } from './contexts/TodoContext';
import TopBarMenu from './components/Topbar/Topbar';

function App() {
  return (
    <TodoProvider>
      <TopBarMenu />
      <MainContent />
    </TodoProvider>
  );
}

export default App;
