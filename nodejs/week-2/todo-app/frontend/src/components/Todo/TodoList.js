import { useState } from 'react';
import {
  Card,
  ResourceItem,
  ResourceList,
  EmptyState,
  InlineStack,
  Button,
} from '@shopify/polaris';
import {
  ClipboardCheckIcon,
  DeleteIcon,
  EditIcon,
} from '@shopify/polaris-icons';
import { useTodos } from '../../contexts/TodoContext';
import TodoItem from './TodoItem';
import { useToast } from '../../contexts/ToastContext';
import useEditApi from '../../hooks/api/useEditApi';
import useCreateApi from '../../hooks/api/useCreateApi';

export default function TodoList() {
  const {
    todos,
    update,
    remove,
    loading,
    hasNext,
    loadMore,
    setLoadMore,
    setSort,
    sort,
  } = useTodos();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const { showToast } = useToast();

  const { handleEdit: handleUpdateMany } = useEditApi({
    url: '/todos/updateMany',
    successMsg: 'Todos updated successfully!',
    errorMsg: 'Failed to update todos',
    successCallback: resp => {
      resp.data.success.forEach(data => {
        update(data);
      });
      setSelectedItems([]);
    },
  });

  // Note: should use create api instead of delete api because it need to have body data
  const { handleCreate: handleRemoveMany } = useCreateApi({
    url: '/todos/removeMany',
    successMsg: 'Todos removed successfully!',
    errorMsg: 'Failed to remove todos',
    successCallback: resp => {
      resp.data.success.forEach(id => {
        remove(id);
      });
      setSelectedItems([]);
    },
  });

  const handleBulkRemove = async () => {
    setLoadingActions(true);
    if (selectedItems.length === 0) {
      setLoadingActions(false);
      showToast({
        message: 'No todos selected for removal.',
      });
      return;
    }

    await handleRemoveMany({ ids: selectedItems });

    setLoadingActions(false);
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

    await handleUpdateMany(todosToUpdate);

    setLoadingActions(false);
  };

  const resourceName = {
    singular: 'todo',
    plural: 'todos',
  };

  const bulkActions = [
    {
      icon: ClipboardCheckIcon,
      content: 'Complete',
      onAction: () => handleBulkCompletionUpdate(true),
    },
    {
      icon: EditIcon,
      content: 'Incomplete',
      onAction: () => handleBulkCompletionUpdate(false),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: 'Delete',
      onAction: () => handleBulkRemove(),
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
    <div style={{ marginBottom: '20px' }}>
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
          sortOptions={[
            { label: 'Newest ', value: 'desc' },
            { label: 'Oldest ', value: 'asc' },
          ]}
          onSortChange={selected => {
            setSort(selected);
          }}
          sortValue={sort}
        />
        {hasNext && (
          <div style={{ paddingBottom: '10px' }}>
            <InlineStack gap="400" align="center">
              <Button
                onClick={() => setLoadMore(true)}
                disabled={loading || loadMore}
                loading={loadMore}
              >
                Load more
              </Button>
            </InlineStack>
          </div>
        )}
      </Card>
    </div>
  );

  function renderItem(item) {
    return (
      <ResourceItem id={item.id}>
        <TodoItem todo={item} />
      </ResourceItem>
    );
  }
}
