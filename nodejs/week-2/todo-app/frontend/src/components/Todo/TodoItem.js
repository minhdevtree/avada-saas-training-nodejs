import { Badge, Button, Text } from '@shopify/polaris';
import useEditApi from '../../hooks/api/useEditApi';
import { useTodos } from '../../contexts/TodoContext';
import useDeleteApi from '../../hooks/api/useDeleteApi';

export default function TodoItem({ todo }) {
  const { update, remove } = useTodos();
  const { editing, handleEdit } = useEditApi({
    url: `/todos/${todo.id}`,
    successMsg: 'Todo updated successfully!',
    errorMsg: 'Failed to update todo',
    fullResp: true,
    successCallback: resp => {
      update(resp.data);
    },
  });

  const { deleting, handleDelete } = useDeleteApi({
    url: `/todos/${todo.id}`,
    successMsg: 'Todo deleted successfully!',
    errorMsg: 'Failed to delete todo',
    fullResp: true,
    successCallback: resp => {
      remove(todo.id);
    },
  });

  const handleRemoveTodo = async () => {
    await handleDelete();
  };

  const handleCompleteTodo = async isCompleted => {
    await handleEdit({ isCompleted });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <h3 style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}>
        <Text fontWeight="bold" as="span">
          {todo.text}
        </Text>
      </h3>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div>
          {todo.isCompleted ? (
            <Badge tone="success">Complete</Badge>
          ) : (
            <Badge tone="attention">Incomplete</Badge>
          )}
        </div>
        <div>
          <Button
            onClick={() => handleCompleteTodo(!todo.isCompleted)}
            disabled={editing}
            loading={editing}
          >
            {todo.isCompleted ? 'Undo' : 'Complete'}
          </Button>
        </div>
        <div>
          <Button
            tone="critical"
            onClick={handleRemoveTodo}
            disabled={deleting}
            loading={deleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
