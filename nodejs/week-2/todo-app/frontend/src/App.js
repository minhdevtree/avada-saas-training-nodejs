import MainContent from './components/Todo/MainContent';
import { TodoProvider } from './contexts/TodoContext';
import TopBarMenu from './components/Topbar/Topbar';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <TodoProvider>
        <TopBarMenu />
        <MainContent />
      </TodoProvider>
    </ToastProvider>
  );
}

export default App;
