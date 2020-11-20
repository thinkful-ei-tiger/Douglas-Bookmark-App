/* eslint-disable no-console */
import store from "./store.js";
import $ from "jquery";
import api from "./api.js";
import '../styles/index.css';

const startPage = () => {
  return `    <section class='start-page'>
    <h1>Bookmarks</h1>
    <section class = 'bookmarkForm'>
        <button id='addBookmark' type='button'>Add Bookmark</button>
        <select name="minimumRating" id="minimumRating" >
            <option value='null'>Filter Ratings</option>
            <option class='minimum' value='1'>1*</option>
            <option class='minimum' value='2'>2*</option>
            <option class='minimum' value='3'>3*</option>
            <option class='minimum' value='4'>4*</option>
            <option class='minimum' value='5'>5*</option>
          </select>
    </section>
    ${generateBookmark(store)}
    </section>`;
};

/*const generateBookmark = (store) => {
  api.getItems().push(store.items);
};*/
const generateBookmark = (store) => {
  if(store.filtered === false){return store.items
    .map((item, i) => {
      if (item.expanded) {
        return `<section class='bookmark' data-item-id='${item.id}'> <p>${item.title}</p><p>Rating: ${item.rating}</p><p>${item.desc}</p><a href='${item.url}'>Visit Site: ${item.url}</a><button  class='less'>See Less</button><button class='delete'>Delete</button></section>`;
      } else {
        return `<section class='bookmark' data-item-id='${item.id}'><p>${item.title}</p><p>Rating: ${item.rating}</p><button  class='expand'>See More</button><button  class='delete'>Delete</button></section>`;
      }
    })
    .join("");
}else{
  return store.filteredItems.map((item, i) => {
    if (item.expanded) {
      return `<section class='bookmark' data-item-id='${item.id}'> <p>${item.title}</p><p>Rating: ${item.rating}</p><p>${item.desc}</p><a href='${item.url}'>Visit Site: ${item.url}</a><button  class='less'>See Less</button><button class='delete'>Delete</button></section>`;
    } else {
      return `<section class='bookmark' data-item-id='${item.id}'><p>${item.title}</p><p>Rating: ${item.rating}</p><button  class='expand'>See More</button><button  class='delete'>Delete</button></section>`;
    }
  })
  .join("");
}
};

const newBookmarkTemp = () => {
  return `<h1>Bookmarks</h1>
     <div>
        <form>
           <label for='url'>New Bookmark</label>
           <br>
           <input type='url' name='url' id ='url' placeholder='url goes here' required>
        </form>
        
        <div>
            <form>
                <section class='bookmarkName'>
                    <input type='text' id='bookmarkName' placeholder='Add a name' required>
                </section>
                <h5>Rating</h5>
                <ul class='rating'>
                    <input class='star' name='rating' id='1' type='radio' value='1'>
                    <input class='star' name='rating' id='2' type='radio' value='2'>
                    <input class='star' name='rating' id='3' type='radio' value='3'>
                    <input class='star' name='rating' id='4' type='radio' value='4'>
                    <input class='star' name='rating' id='5' type='radio' value='5'>
                </ul>
                    <input type='text' id='bookmarkDescription' placeholder='Add a description' required>
            </form>
        </div>
        <button type='submit' id='submit'>Submit</button>
        <button type='button' id='cancle'>Cancle</button>
    </div>`;
};

function getItemIdFromElement(item) {
  return $(item).closest("section").data("item-id");
}

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
  $("main").on("click", "#submit", function () {
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
        store.items.push(bookmark);
        render();
      });
  });
};

const handleCancle = () => {
  $("main").on("click", "#cancle", function () {
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

const toggleFiltered = () =>{
  if(store.filtered === false){
    store.filtered = true;
  } else if(store.filtered === true){
    store.filtered = false;
  }
  render();
};

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
    $("main").html(startPage());
    $('#minimumRating').val(store.minimum);
  } else {
    $("main").html(newBookmarkTemp());
  }
}

//
const main = () => {
 // window.toggleExpanded = toggleExpanded;
  api.getItems(render);
  handleSeeMore();
  handleSeeLess();
  handleDelete();
  handleCancle();
  handleSubmit();
  handleAddBookmark();
  handleFilter();
  render();
};

$(main);
