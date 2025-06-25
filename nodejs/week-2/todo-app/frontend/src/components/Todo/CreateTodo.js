import { Button, Modal, TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useTodos } from '../../providers/TodoProvider';

export default function CreateTodo() {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const { addTodo } = useTodos();

  const handleChange = useCallback(() => {
    setActive(!active);
    setTitle('');
    setError(null);
  }, [active]);

  const handleChangeTitle = useCallback(newValue => {
    setTitle(newValue);
    if (newValue.trim() !== '') {
      setError(null);
    }
  }, []);

  const handleAddTodo = async () => {
    if (title.trim() === '') {
      setError('Title is required.');
      return;
    }

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (title.trim().length > 100) {
      setError('Title must be at most 100 characters.');
      return;
    }

    await addTodo(title.trim());
    setTitle('');
    setError(null);
    setActive(false);
  };

  const activator = (
    <Button variant="primary" onClick={handleChange}>
      Create
    </Button>
  );

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Create todo"
      primaryAction={{
        content: 'Add',
        onAction: handleAddTodo,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <TextField
          label="Title"
          value={title}
          onChange={handleChangeTitle}
          autoComplete="off"
          autoFocus
          error={error}
        />
      </Modal.Section>
    </Modal>
  );
}
