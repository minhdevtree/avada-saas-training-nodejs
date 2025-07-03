// TODO: update this later

import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

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
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (resp.success) {
        showToast({ message: successMsg });
        successCallback(resp);
      }
      if (resp.error) {
        showToast({ message: errorMsg, type: 'error' });
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      showToast({ message: errorMsg, type: 'error' });
      return fullResp ? { success: false, error: e.message } : false;
    } finally {
      setCreating(false);
    }
  };

  return { creating, handleCreate };
}
