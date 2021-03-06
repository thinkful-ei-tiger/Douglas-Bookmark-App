/* eslint-disable no-console */
import store from './store.js';

function getItems(render) {
  return fetch('https://thinkful-list-api.herokuapp.com/douglas/bookmarks')

 
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      store.items = (json);
      render();
    });
}

const createBookmark = (bookmark) => {
  return fetch('https://thinkful-list-api.herokuapp.com/douglas/bookmarks', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(bookmark),
  })
    .then(function (resp) {
      if(!resp.ok){
        return resp.json().then(evt => Promise.reject(evt))
      }
      return resp.json();
    })
    .catch(err => alert('url must start with https:// or http://'));
}; 


const deleteBookmark = (id) => {
  return fetch(`https://thinkful-list-api.herokuapp.com/douglas/bookmarks/${id}`, {
    method: 'DELETE',
   
  })
    .then(function (resp) {
      return resp.json();
    });
};

export default { getItems, createBookmark, deleteBookmark};
