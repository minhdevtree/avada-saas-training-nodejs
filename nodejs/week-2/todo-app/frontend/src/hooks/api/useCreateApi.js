import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { BASE_API_URL } from '../../config/link';

export default function useCreateApi({
  url,
  fullResp = false,
  successCallback = () => {},
  successMsg = 'Saved successfully',
  errorMsg = 'Failed to save',
}) {
  const { showToast } = useToast();
  const [creating, setCreating] = useState(false);

  /**
   * @param data
   * @returns {Promise<{success: boolean, error}>}
   */
  const handleCreate = async data => {
    try {
      setCreating(true);
      // const resp = await api(url, {body: data, method: 'POST'});
      const resp = await fetch(`${BASE_API_URL}${url}`, {
        method: 'POST',
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
      setCreating(false);
    }
  };

  return { creating, handleCreate };
}
