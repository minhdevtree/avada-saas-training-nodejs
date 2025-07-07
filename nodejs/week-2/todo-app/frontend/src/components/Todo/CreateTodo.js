import { Button, Modal, Spinner, TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useTodos } from '../../contexts/TodoContext';
import useCreateApi from '../../hooks/api/useCreateApi';

export default function CreateTodo() {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const { add } = useTodos();

  const { creating, handleCreate } = useCreateApi({
    url: '/todos',
    successMsg: 'Todo created successfully!',
    errorMsg: 'Failed to create todo',
    successCallback: resp => {
      console.log(resp.data);
      add(resp.data);
      setTitle('');
      handleChange();
    },
  });

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

    handleCreate({ text: title.trim() });
  };

  const activator = (
    <Button variant="primary" onClick={handleChange} disabled={creating}>
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
        disabled: creating,
        loading: creating && (
          <Spinner accessibilityLabel="Loading..." size="small" />
        ),
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
