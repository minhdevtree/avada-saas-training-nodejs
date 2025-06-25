import { Page } from '@shopify/polaris';
import TodoList from './TodoList';
import CreateTodo from './CreateTodo';

export default function MainContent() {
  return (
    <Page title="Todoes" primaryAction={<CreateTodo />}>
      <TodoList />
    </Page>
  );
}
