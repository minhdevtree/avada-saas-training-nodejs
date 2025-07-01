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
import {
  removeManyTodos,
  removeTodo,
  updateManyTodos,
  updateTodo,
} from '../../actions/todoActions';
import { useToast } from '../../contexts/ToastContext';

export default function TodoList() {
  const { todos, update, remove, loading } = useTodos();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const { showToast } = useToast();

  const handleCompleteTodo = async (id, isCompleted) => {
    setLoadingActions(true);
    updateTodo(id, { isCompleted })
      .then(updatedTodo => {
        update(updatedTodo);
        showToast({ message: 'Todo updated successfully!' });
      })
      .catch(err => {
        showToast({ message: 'Error updating todo', error: true });
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
        showToast({
          message: 'Error removing todo',
          error: true,
        });
        console.error('Error remove todo:', err);
      })
      .finally(() => {
        setLoadingActions(false);
      });
  };

  const handleBulkCompletionUpdate = async isCompleted => {
    setLoadingActions(true);
    const todosToUpdate = todos
      .filter(
        todo =>
          selectedItems.includes(todo.id) && todo.isCompleted !== isCompleted
      )
      .map(todo => ({
        id: todo.id,
        isCompleted,
      }));

    if (todosToUpdate.length === 0) {
      setLoadingActions(false);
      showToast({
        message: 'No todos selected or already in the desired state.',
      });
      return;
    }

    updateManyTodos(todosToUpdate)
      .then(() => {
        todosToUpdate.forEach(data => {
          update(data);
        });
        setSelectedItems([]);
        showToast({
          message: 'Todos updated successfully!',
        });
      })
      .catch(err => {
        showToast({
          message: 'Error updating todos',
          error: true,
        });
        console.error('Error updating todos:', err);
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
      onAction: () => handleBulkCompletionUpdate(true),
    },
    {
      content: 'Incomplete',
      onAction: () => handleBulkCompletionUpdate(false),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: 'Delete',
      onAction: () => {
        setLoadingActions(true);
        if (selectedItems.length === 0) {
          setLoadingActions(false);
          showToast({
            message: 'No todos selected for removal.',
          });
          return;
        }
        removeManyTodos(selectedItems)
          .then(() => {
            setSelectedItems([]);
            selectedItems.forEach(id => remove(id));
            showToast({
              message: 'Todos removed successfully!',
            });
          })
          .catch(err => {
            showToast({
              message: 'Error removing todos',
              error: true,
            });
            console.error('Error removing todos:', err);
          })
          .finally(() => {
            setLoadingActions(false);
          });
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
