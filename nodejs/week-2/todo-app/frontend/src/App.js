import MainContent from './components/Todo/MainContent';
import { TodoProvider } from './providers/TodoProvider';
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
