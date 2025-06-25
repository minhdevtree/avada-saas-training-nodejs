import { Badge, Button, Text } from '@shopify/polaris';

export default function TodoItem({ todo, completeTodo, removeTodo }) {
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
          <Button onClick={() => completeTodo(todo.id, !todo.isCompleted)}>
            {todo.isCompleted ? 'Undo' : 'Complete'}
          </Button>
        </div>
        <div>
          <Button tone="critical" onClick={() => removeTodo(todo.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
