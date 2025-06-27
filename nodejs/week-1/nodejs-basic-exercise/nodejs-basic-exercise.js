const _ = require('lodash');

//1. Use this Fake JSON API: https://jsonplaceholder.typicode.com/
const JSON_PLACEHOLDER_API = 'https://jsonplaceholder.typicode.com';

(async () => {
  //2. Get data from all users from API above. You will get a list of 10 users.
  async function getUsers() {
    const response = await fetch(`${JSON_PLACEHOLDER_API}/users`);
    if (!response.ok) {
      return [];
      // throw new Error('Failed to fetch users');
    }
    return await response.json();
  }

  const users = await getUsers();
  console.log('2. Users:', users);

  //3. Get all the posts and comments from the API. Map the data with the users array
  async function getPosts() {
    const response = await fetch(`${JSON_PLACEHOLDER_API}/posts`);
    if (!response.ok) {
      return [];
      // throw new Error('Failed to fetch posts');
    }
    return await response.json();
  }

  async function getComments() {
    const response = await fetch(`${JSON_PLACEHOLDER_API}/comments`);
    if (!response.ok) {
      return [];
      // throw new Error('Failed to fetch comments');
    }
    return await response.json();
  }

  async function getUsersWithPostsAndComments() {
    const [users, posts, comments] = await Promise.all([
      getUsers(),
      getPosts(),
      getComments(),
    ]);

    return users.map(user => {
      const userPosts = posts
        .filter(post => post.userId === user.id)
        .map(post => _.pick(post, ['id', 'title', 'body']));

      const userComments = comments
        .filter(comment => userPosts.some(post => post.id === comment.postId))
        .map(comment => _.pick(comment, ['id', 'postId', 'name', 'body']));

      return _.pick(
        {
          ...user,
          posts: userPosts,
          comments: userComments,
        },
        ['id', 'name', 'username', 'email', 'posts', 'comments']
      );
    });
  }

  const usersWithPostsAndComments = await getUsersWithPostsAndComments();
  console.log('3. Users with posts and comments:', usersWithPostsAndComments);

  //4. Filter only users with more than 3 comments.
  async function getUsersWithMoreThan3Comments() {
    const users = await getUsersWithPostsAndComments();
    return users.filter(user => user.comments.length > 3);
  }

  const usersWithMoreThan3Comments = await getUsersWithMoreThan3Comments();
  console.log(
    '4. Users with more than 3 comments:',
    usersWithMoreThan3Comments
  );

  //5. Reformat the data with the count of comments and posts
  async function getUsersWithPostAndCommentCounts() {
    const users = await getUsersWithPostsAndComments();
    return users.map(user =>
      _.pick(
        {
          ...user,
          postsCount: user.posts.length,
          commentsCount: user.comments.length,
        },
        ['id', 'name', 'username', 'email', 'postsCount', 'commentsCount']
      )
    );
  }

  const usersWithPostAndCommentCounts =
    await getUsersWithPostAndCommentCounts();
  console.log(
    '5. Users with post and comment counts:',
    usersWithPostAndCommentCounts
  );

  //6. Who is the user with the most comments/posts?
  async function getUserWithMostComments() {
    const users = await getUsersWithPostAndCommentCounts();
    return users.reduce((maxUser, user) => {
      if (user.commentsCount > maxUser.commentsCount) {
        return user;
      }
      return maxUser;
    }, users[0]);
  }

  async function getUserWithMostPosts() {
    const users = await getUsersWithPostAndCommentCounts();
    return users.reduce((maxUser, user) => {
      if (user.postsCount > maxUser.postsCount) {
        return user;
      }
      return maxUser;
    }, users[0]);
  }

  const userWithMostComments = await getUserWithMostComments();
  const userWithMostPosts = await getUserWithMostPosts();

  console.log('6. User with the most posts:', userWithMostPosts);
  console.log('User with the most comments:', userWithMostComments);

  //7. Sort the list of users by the postsCount value descending?
  async function getUsersSortedByPostsCount(order = 'desc') {
    const users = await getUsersWithPostAndCommentCounts();
    // sort new array to avoid mutating the original users array
    const sorted = [...users].sort((a, b) => {
      if (order === 'asc') {
        return a.postsCount - b.postsCount;
      }
      return b.postsCount - a.postsCount;
    });
    return sorted;
  }

  const usersSortedByPostsCount = await getUsersSortedByPostsCount('desc');
  console.log(
    '7. Users sorted by posts count descending:',
    usersSortedByPostsCount
  );

  //8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request.
  async function getPostById(postId) {
    const response = await fetch(`${JSON_PLACEHOLDER_API}/posts/${postId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with ID ${postId}`);
    }
    return await response.json();
  }

  async function getCommentsByPostId(postId) {
    const response = await fetch(
      `${JSON_PLACEHOLDER_API}/comments?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ID ${postId}`);
    }
    return await response.json();
  }

  async function getPostAndComments(postId) {
    const [post, comments] = await Promise.all([
      getPostById(postId),
      getCommentsByPostId(postId),
    ]);

    return {
      ...post,
      comments: comments.map(comment =>
        _.pick(comment, ['postId', 'id', 'name', 'email', 'body'])
      ),
    };
  }

  const post = await getPostAndComments(1);
  console.log('8. Post with ID 1:', post);
})();
