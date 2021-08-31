'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {
    requestPosts();
    document.getElementById('home-btn').addEventListener('click', home);
  }

  function home() {
    // will add seperate views in the future
  }

  /**
   * Requests all posts from the database
   */
  function requestPosts() {
    fetch('/petgram/posts')
      .then(statusCheck)
      .then(resp => resp.json())
      .then(loadPosts)
      .catch(handleError);
  }

  /**
   * Loads in all posts from the database into the UI
   *
   * @param {JSON} resp the JSON object returned by the server containing information
   * about all posts that have been made on PetGram
   */
  function loadPosts(resp) {
    let allPosts = resp.posts;
    for (let i = 0; i < allPosts.length; i++) {
      let currentPostData = allPosts[i];
      let post = document.createElement('article');
      post.classList.add('post');
      post.setAttribute('id', currentPostData.id);
      post = addPostProfile(post, currentPostData);
      post = addPostImage(post, currentPostData);
      post = addPostMetaData(post, currentPostData);
      document.getElementById('posts').appendChild(post);
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
    // ADD EVENT LISTENER FOR HEART
    metaData.appendChild(heartIcon);
    let numLikes = document.createElement('p');
    numLikes.textContent = currentPostData.likes;
    metaData.appendChild(numLikes);
    footer.appendChild(metaData);
    post.appendChild(footer);
    return post;
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