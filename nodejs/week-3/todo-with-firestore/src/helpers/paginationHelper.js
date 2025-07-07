//https://firebase.google.com/docs/firestore/query-data/query-cursors

/**
 * Helper for paginating Firestore collections.
 * @param {FirebaseFirestore.CollectionReference} collection - Firestore collection reference.
 * @param {Object} options
 * @param {number} [options.limit=10] - Number of documents to fetch.
 * @param {'asc'|'desc'} [options.sort='desc'] - Sort order by createdAt.
 * @param {any} [options.lastTimestamp=null] - Last timestamp for pagination.
 * @returns {Promise<{items: any[], pagination: {hasNext: boolean, lastTimestamp: Date|null}}>}
 */
async function paginateCollection(
  collection,
  { limit = 10, sort = 'desc', lastTimestamp = null, keyName } = {}
) {
  let query = collection.orderBy('createdAt', sort);

  if (lastTimestamp) {
    query = query.startAfter(lastTimestamp);
  }

  query = query.limit(limit);

  const snapshot = await query.get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  let hasNext = false;
  if (items.length > 0) {
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextQuery = collection
      .orderBy('createdAt', sort)
      .startAfter(lastDoc.get('createdAt'))
      .limit(1);
    const nextSnap = await nextQuery.get();
    hasNext = !nextSnap.empty;
  }

  const lastTimestampParseToDate =
    items.length > 0 ? items[items.length - 1].createdAt.toDate() : null;

  return {
    [keyName]: items,
    pagination: {
      hasNext,
      lastTimestamp: lastTimestampParseToDate,
    },
  };
}

module.exports = { paginateCollection };
