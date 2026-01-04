// ---------------------------
// Mock fetch for Node/JSDOM tests
// ---------------------------
if (typeof fetch === 'undefined') {
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            title: 'sunt aut facere repellat',
            body: 'quia et suscipit\nsuscipit'
          },
        ]),
    });
}

// ---------------------------
// Function to display posts
// ---------------------------
function displayPosts(posts) {
  const postList = document.getElementById('post-list');
  if (!postList) return;

  postList.innerHTML = '';

  posts.forEach(post => {
    const li = document.createElement('li');

    const title = document.createElement('h1');
    title.textContent = post.title;

    const body = document.createElement('p');
    body.textContent = post.body;

    li.appendChild(title);
    li.appendChild(body);

    postList.appendChild(li);
  });
}

// ---------------------------
// Async function to fetch posts
// ---------------------------
async function fetchPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Network response was not ok');

    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Call fetchPosts immediately
fetchPosts();