/* eslint-disable no-console */
import store from "./store.js";
import $ from "jquery";
import api from "./api.js";
import '../styles/index.css';
import template from './template'


function getItemIdFromElement(item) {
  return $(item).closest("section").data("item-id");
}

/*function validateForm(){
  let url = $("#url").val();
  if(!url.startsWith('https://') || !url.startsWith('http://')){
    alert('url must follow format: https://www.YOURWEBSITE.com');
    throw new Error('url must start with https://');
}
}*/

//these functions execute functions after the coresponding button is clicked
const handleAddBookmark = () => {
  $("main").on("click", "#addBookmark", function (evt) {
    evt.preventDefault();
    store.started = true;
    console.log(store.started);
    render();
  });
};

const handleSubmit = () => {
  $("main").on("submit", "#bookmarkForm", function (evt) {
    evt.preventDefault();
    try{
      //validateForm();
    let title = $("#bookmarkName").val();
    let url = $("#url").val();
    let desc = $("#bookmarkDescription").val();
    let rating = $('input[name="rating"]:checked').val();
    let expanded = false;
    toggleStarted();
    api
      .createBookmark({
        title,
        url,
        desc,
        rating,
        expanded,
      })
      .then(function (bookmark) {
        console.log(bookmark);
        bookmark.expanded = false;
        store.items.push(bookmark);
        render();
      });
    }
    catch(err){
      console.log(err.message);
    }
  });
};

const handleCancel = () => {
  $("main").on("click", "#cancel", function () {
    toggleStarted();
  });
};

const handleDelete = () => {
  $("main").on("click", ".delete", function (evt) {
    const id = getItemIdFromElement(evt.currentTarget);
    api.deleteBookmark(id).then((resp) => {
      store.items = store.items.filter((item) => item.id != id);
      render();
    });
  });
};

const handleSeeMore = () =>{
  $('main').on('click', '.expand', function(evt){
    const id = getItemIdFromElement(evt.currentTarget);
    toggleExpanded(id);
  })
}

const handleSeeLess = () =>{
 $('main').on('click', '.less', function(evt){
  const id = getItemIdFromElement(evt.currentTarget);
  toggleExpanded(id);
 })
}

const handleFilter = ()=>{
 $('main').on('change', '#minimumRating', function(evt){
  const minimum = $('#minimumRating').val();
  store.minimum = minimum;
  console.log(minimum);
  if(minimum === 'null'){
    store.filtered = false;
  } else{
    store.filtered = true;
    store.filteredItems = store.items.filter((item) => item.rating >= minimum);
  }
   render();
   //toggleFiltered();
 })
}

/*store.items = store.items.filter((arr) =>{
  if(store.items.rating >= minimum){
    return store.items;
  }
})*/


//these funcitons toggle the boolean values for expanded and started
const toggleExpanded = (id) =>{
  const bookmark = store.items.find((item) =>{
    return item.id === id;
  })
  bookmark.expanded = !bookmark.expanded;
  render();
} 

/*const toggleFiltered = () =>{
  if(store.filtered === false){
    store.filtered = true;
  } else if(store.filtered === true){
    store.filtered = false;
  }
  render();
};*/

const toggleStarted = () => {
  if (store.started === false) {
    store.started = true;
  } else if (store.started === true) {
    store.started = false;
  }
  render();
};
//this function dynamicly renders content to the DOM
function render() {
  if (!store.started) {
    if(store.filtered === false){
      $("main").html(template.startPage());
      const html = template.generateBookmarkStrings(store.items);
      $('#bookmarkResults').html(html);
    } else{
      $("main").html(template.startPage());
      $('#minimumRating').val(store.minimum);
      const filter = store.items.filter(bookmark => {
        return bookmark.rating >= store.minimum;
        
      })
      const html = template.generateBookmarkStrings(filter);
      $('#bookmarkResults').html(html);
    }
  } else {
    $("main").html(template.newBookmarkTemp());
  }
}

//
const main = () => {
 // window.toggleExpanded = toggleExpanded;
  api.getItems(render);
  handleSeeMore();
  handleSeeLess();
  handleDelete();
  handleCancel();
  handleSubmit();
  handleAddBookmark();
  handleFilter();
  render();
};

$(main);
