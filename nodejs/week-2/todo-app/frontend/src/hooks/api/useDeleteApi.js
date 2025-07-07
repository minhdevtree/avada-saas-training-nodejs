import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { BASE_API_URL } from '../../config/link';

export default function useDeleteApi({
  url,
  fullResp = false,
  successCallback = () => {},
  successMsg = 'Deleted successfully',
  errorMsg = 'Failed to delete',
}) {
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  /**
   * @param data
   * @returns {Promise<{success: boolean, error}>}
   */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      // const resp = await api(url, {body: data, method: 'POST'});
      const resp = await fetch(`${BASE_API_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setDeleting(false);
    }
  };

  return { deleting, handleDelete };
}
