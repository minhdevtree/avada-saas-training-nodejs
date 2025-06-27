import { useState } from 'react';
import {
  Card,
  ResourceItem,
  ResourceList,
  BlockStack,
  EmptyState,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { useTodos } from '../../contexts/TodoContext';
import TodoItem from './TodoItem';
import { removeTodo, updateTodo } from '../../actions/todoActions';

export default function TodoList() {
  const { todos, update, remove, loading } = useTodos();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);

  const handleCompleteTodo = async (id, isCompleted) => {
    setLoadingActions(true);
    updateTodo(id, { isCompleted })
      .then(updatedTodo => {
        update(updatedTodo);
      })
      .catch(err => {
        console.error('Error updating todo:', err);
      })
      .finally(() => {
        setLoadingActions(false);
      });
  };

  const handleRemoveTodo = async id => {
    setLoadingActions(true);
    removeTodo(id)
      .then(() => {
        remove(id);
      })
      .catch(err => {
        console.error('Error remove todo:', err);
      })
      .finally(() => {
        setLoadingActions(false);
      });
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
          loading={loading || loadingActions}
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
