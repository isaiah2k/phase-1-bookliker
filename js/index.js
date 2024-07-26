document.addEventListener("DOMContentLoaded", function() {
  const baseUrl = 'http://localhost:3000/books'
  const userId = 11
  const username = "ZAY"
  const listPanel = document.getElementById('list')
  const showPanel = document.getElementById('show-panel')

  // Step 1: List Books
  function fetchBooks() {
    fetch(baseUrl)
      .then(response => response.json())
      .then(books => {
        renderBookList(books)
      })
  }

  function renderBookList(books) {
    listPanel.innerHTML = ''
    books.forEach(book => {
      const li = document.createElement('li')
      li.textContent = book.title
      li.addEventListener('click', () => showBookDetails(book))
      listPanel.appendChild(li)
    })
  }

  // Step 2: Shows book description and users who have liked it
  function showBookDetails(book) {
    showPanel.innerHTML = `
      <img src="${book.img_url}" />
      <h2>${book.title}</h2>
      <p>${book.description}</p>
      <ul id="user-list"></ul>
      <button id="like-button">${book.users.some(user => user.id === userId) ? 'UNLIKE' : 'LIKE'}</button>
    `
    renderUserList(book.users)
    document.getElementById('like-button').addEventListener('click', () => toggleLikeBook(book))
  }

  function renderUserList(users) {
    const userList = document.getElementById('user-list')
    userList.innerHTML = ''
    users.forEach(user => {
      const li = document.createElement('li')
      li.textContent = user.username
      userList.appendChild(li)
    })
  }

  // Step 3: Like/unlike a Book
  function toggleLikeBook(book) {
    const isLiked = book.users.some(user => user.id === userId)
    const updatedUsers = isLiked 
      ? book.users.filter(user => user.id !== userId) 
      : [...book.users, { id: userId, username: username }]
    
    fetch(`${baseUrl}/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users: updatedUsers }),
    })
    .then(response => response.json())
    .then(updatedBook => {
      showBookDetails(updatedBook)
    })
  }

  fetchBooks()
})