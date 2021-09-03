'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {
    requestPosts();
    document.getElementById('home-btn').addEventListener('click', homeView);
    document.getElementById('search-btn').addEventListener('click', searchView);
    document.getElementById('search-input').addEventListener('input', barBehavior);
  }

  /**
   * Changes the view to the home view
   */
  function homeView() {
    document.getElementById('posts').classList.remove('hidden');
    document.getElementById('search').classList.add('hidden');
    document.getElementById('search-results').innerHTML = '';
  }

  /**
   * Changes the view to the search view
   */
  function searchView() {
    document.getElementById('posts').classList.add('hidden');
    document.getElementById('search').classList.remove('hidden');
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-input').value = '';
  }

  /**
   * When the user types into the search bar, if the user types something substantial
   * (something that is not just whitespace), then enables the search button for the
   * user to search something
   */
   function barBehavior() {
    document.getElementById('search-results').innerHTML = '';
    let input = document.getElementById('search-input').value.trim();
    if (input !== '') {
      document.getElementById('find').disabled = false;
      document.getElementById('find').addEventListener('click', search);
    } else {
      document.getElementById('find').disabled = true;
      document.getElementById('find').removeEventListener('click', search);
    }
  }

  /**
   * Sends request to database for queries that match the search query
   */
  function search() {
    let query = document.getElementById('search-input').value.trim();
    let category = document.getElementById('search-type').value;
    fetch('/petgram/posts?search=' + query + '&type=' + category)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(searchResults)
      .catch(handleError);
  }

  function searchResults(resp) {
    document.getElementById('search-results').innerHTML = '';
    if (resp.posts.length === 0) {
      let noResults = document.createElement('No Results Found');
      document.getElementById('search-results').appendChild(noResults);
    } else {
      loadPosts(resp, 'search-results');
    }
  }

  /**
   * Requests all posts from the database
   */
  function requestPosts() {
    fetch('/petgram/posts')
      .then(statusCheck)
      .then(resp => resp.json())
      .then(function(resp) {
        loadPosts(resp, 'posts')
      })
      .catch(handleError);
  }

  /**
   * Loads in all posts from the database into the UI
   *
   * @param {JSON} resp the JSON object returned by the server containing information
   * about all posts that have been made on PetGram
   */
  function loadPosts(resp, location) {
    let allPosts = resp.posts;
    for (let i = 0; i < allPosts.length; i++) {
      let currentPostData = allPosts[i];
      let post = document.createElement('article');
      post.classList.add('post');
      post.setAttribute('id', currentPostData.id);
      post = addPostProfile(post, currentPostData);
      post = addPostImage(post, currentPostData);
      post = addPostMetaData(post, currentPostData);
      document.getElementById(location).appendChild(post);
    }
  }

  /**
   * Adds the profile information to a post
   *
   * @param {DOMElement} post the post that the profile information is being added to
   * @param {JSON} currentPostData the data from the server used to add the profile information
   * @returns {DOMElement} the post that the profile information was added to
   */
  function addPostProfile(post, currentPostData) {
    let profile = document.createElement('div');
    profile.classList.add('profile');
    let profilePicture = document.createElement('img');
    profilePicture.src = 'profile-pictures/' + currentPostData.username + '.jpg';
    profilePicture.alt = 'profile picture';
    profile.appendChild(profilePicture);
    let profileName = document.createElement('p');
    profileName.textContent = currentPostData.username;
    profile.appendChild(profileName);
    post.appendChild(profile);
    return post;
  }

  /**
   * Adds the main image to a post
   *
   * @param {DOMElement} post the post that the main image is being added to
   * @param {JSON} currentPostData the data from the server used to add the main image
   * @returns {DOMElement} the post that the main image was added to
   */
  function addPostImage(post, currentPostData) {
    let mainPicture = document.createElement('img');
    mainPicture.classList.add('main-pic')
    mainPicture.src = 'main-pictures/' + currentPostData.main;
    mainPicture.alt = 'main picture';
    post.appendChild(mainPicture);
    return post;
  }

  /**
   * Adds the metadata to a post
   *
   * @param {DOMElement} post the post that the metadata is being added to
   * @param {JSON} currentPostData the data from the server used to add the metadata
   * @returns {DOMElement} the post that the metadata was added to
   */
  function addPostMetaData(post, currentPostData) {
    let footer = document.createElement('div');
    footer.classList.add('footer');
    let cap = document.createElement('p');
    cap.textContent = currentPostData.caption;
    footer.appendChild(cap);
    let metaData = document.createElement('div');
    metaData.classList.add('metadata');
    let heartIcon = document.createElement('img');
    heartIcon.src = 'misc-pictures/heart.jpg';
    heartIcon.alt = 'heart icon';
    heartIcon.addEventListener('click', likePost);
    metaData.appendChild(heartIcon);
    let numLikes = document.createElement('p');
    numLikes.textContent = currentPostData.likes + ' likes';
    metaData.appendChild(numLikes);
    footer.appendChild(metaData);
    post.appendChild(footer);
    return post;
  }

  function likePost() {
    let id = this.parentElement.parentElement.parentElement.getAttribute('id');
    let params = new FormData();
    params.append('id', id);
    fetch('/petgram/likes', {method: 'POST', body: params})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(function(resp) {
        updateLikes(resp, id);
      })
      .catch(handleError);
  }

  function updateLikes(resp, id) {
    let allPosts = document.querySelectorAll('article.post');
    let postToUpdate;
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].getAttribute('id') === id) {
        postToUpdate = allPosts[i];
        i = allPosts.length;
      }
    }
    let postMetaData = postToUpdate.lastElementChild;
    let likes = postMetaData.lastElementChild;
    let update = likes.lastElementChild;
    update.textContent = resp + ' likes';
  }

  /**
   * Checks whether the response object returned by the server is valid or not
   *
   * @param {Response} response the response returned by the server that is being
   * checked if it's okay or not
   * @returns {Response} indicates whether the server's response was valid or not
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  function handleError() {

  }
})();