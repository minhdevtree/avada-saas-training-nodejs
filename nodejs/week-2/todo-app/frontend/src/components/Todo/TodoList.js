import { useState } from 'react';
import {
  Card,
  ResourceItem,
  ResourceList,
  BlockStack,
  EmptyState,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { useTodos } from '../../providers/TodoProvider';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, updateTodo, removeTodo, loading } = useTodos();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCompleteTodo = async (id, isCompleted) => {
    await updateTodo(id, { isCompleted });
  };

  const handleRemoveTodo = async id => {
    await removeTodo(id);
  };

  const resourceName = {
    singular: 'todo',
    plural: 'todos',
  };

  const bulkActions = [
    {
      content: 'Complete',
      onAction: async () => {
        const promises = todos
          .filter(todo => selectedItems.includes(todo.id) && !todo.isCompleted)
          .map(async todo => await handleCompleteTodo(todo.id, true));
        await Promise.all(promises);
        setSelectedItems([]);
      },
    },
    {
      content: 'Incomplete',
      onAction: async () => {
        const promises = todos
          .filter(todo => selectedItems.includes(todo.id) && todo.isCompleted)
          .map(todo => handleCompleteTodo(todo.id, false));
        await Promise.all(promises);
        setSelectedItems([]);
      },
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: 'Delete',
      onAction: () => {
        const promises = todos
          .filter(todo => selectedItems.includes(todo.id))
          .map(async todo => await handleRemoveTodo(todo.id));
        Promise.all(promises);
        setSelectedItems([]);
      },
    },
  ];

  const emptyStateMarkup = !todos.length ? (
    <EmptyState
      heading="No todos found"
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <p>
        You have no todos yet. Start by creating one to keep track of your
        tasks.
      </p>
    </EmptyState>
  ) : undefined;

  return (
    <BlockStack gap="400">
      <Card padding="0">
        <ResourceList
          emptyState={emptyStateMarkup}
          resourceName={resourceName}
          items={todos || []}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          bulkActions={bulkActions}
          loading={loading}
        />
      </Card>
    </BlockStack>
  );

  function renderItem(item) {
    return (
      <ResourceItem id={item.id}>
        <TodoItem
          todo={item}
          completeTodo={handleCompleteTodo}
          removeTodo={handleRemoveTodo}
        />
      </ResourceItem>
    );
  }
}
