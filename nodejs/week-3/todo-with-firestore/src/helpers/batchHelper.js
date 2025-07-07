const db = require('../database/firebase');

//https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
/**
 * Helper function to process batched Firestore operations (delete/update).
 * @param {Array} items - Array of items to process.
 * @param {number} batchSize - Maximum batch size.
 * @param {function(batch: WriteBatch, item: any): void} batchCallback - Callback to define the Firestore batch operation.
 * @returns {Promise<Object>} Object with success and failed arrays.
 */
async function batchProcess(items, batchSize, batchCallback) {
  const batches = Math.ceil(items.length / batchSize);
  const results = { success: [], failed: [] };

  for (let i = 0; i < batches; i++) {
    const batch = db.batch();
    const start = i * batchSize;
    const end = start + batchSize;
    const batchItems = items.slice(start, end);

    try {
      for (const item of batchItems) {
        batchCallback(batch, item);
      }

      await batch.commit();
      results.success.push(...batchItems);
    } catch (error) {
      console.log('>>> batch helper fail: ', error);
      results.failed.push(...batchItems);
    }
  }

  if (results.success.length === 0 && results.failed.length > 0) {
    console.warn('Batch process failed completely.');
    // throw new Error('Batch process failed completely.');
  }

  if (results.failed.length > 0) {
    console.warn(
      `${results.success.length} succeeded, ${results.failed.length} failed.`
    );
  }

  return results;
}

module.exports = {
  batchProcess,
};
