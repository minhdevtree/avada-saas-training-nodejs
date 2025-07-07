import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { BASE_API_URL } from '../../config/link';

export default function useEditApi({
  url,
  fullResp = false,
  successCallback = () => {},
  successMsg = 'Saved successfully',
  errorMsg = 'Failed to save',
}) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);

  /**
   * @param data
   * @returns {Promise<{success: boolean, error}>}
   */
  const handleEdit = async data => {
    try {
      setEditing(true);
      // const resp = await api(url, {body: data, method: 'POST'});
      const resp = await fetch(`${BASE_API_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await resp.json();
      if (result.success) {
        showToast({ message: successMsg });
        successCallback(result);
      }
      if (result.error) {
        showToast({ message: errorMsg, error: true });
      }
      return fullResp ? result : result.success;
    } catch (e) {
      showToast({ message: errorMsg, error: true });
      return fullResp ? { success: false, error: e.message } : false;
    } finally {
      setEditing(false);
    }
  };

  return { editing, handleEdit };
}
