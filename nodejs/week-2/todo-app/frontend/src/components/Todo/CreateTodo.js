import { Button, Modal, Spinner, TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { addTodo } from '../../actions/todoActions';
import { useToast } from '../../contexts/ToastContext';

export default function CreateTodo() {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { add } = useTodos();
  const { showToast } = useToast();

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
    setLoading(true);
    addTodo(title.trim())
      .then(newTodo => {
        add(newTodo);
        setActive(false);
        showToast({ message: 'Todo created successfully!' });
      })
      .catch(err => {
        showToast({
          message: 'Failed to create todo',
          error: true,
        });
        console.error('Error creating todo:', err);
      })
      .finally(() => {
        setTitle('');
        setLoading(false);
      });
  };

  const activator = (
    <Button variant="primary" onClick={handleChange} disabled={loading}>
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
        disabled: loading,
        loading: loading && (
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
