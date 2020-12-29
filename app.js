const card = document.querySelector('.card');
let filters = [];
let jsonArray = [];
document.querySelector('#clear-list').addEventListener('click', removeAllFilters);

// XMLHTTP request to read the objects in JSON file
var xht = new XMLHttpRequest();
xht.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    jsonArray = JSON.parse(xht.responseText);

    filterCards(jsonArray);

  }
};
xht.open("GET", "data.json", true);
xht.send();

// Adding fiter buttons to the top block and removing the filtered cards
function addFilter(e) {
  let buttonId = e.target.innerText;
  if (!filters.includes(buttonId)) {
    filters.push(buttonId);
    updateFilterList(filters);
  }
  let addSearchBar = document.querySelector('.search-block');
  addSearchBar.classList.add("visible");

}

//When click filter button => filter cards and remove all, which don't have the filter


// Adding fiter buttons to the top block and removing the filtered cards
function updateFilterList() {
  document.querySelector('.wrapper').innerHTML = '';
  for (let i = 0; i < filters.length; i++) {
    let filterBlock = `<div class="click-off">
    <p class="filterName">${filters[i]}</p>
    <div class="clearFilterButton"></div>
  </div>`
    document.querySelector('.wrapper').innerHTML += filterBlock;
  }

  let removeButtons = document.querySelectorAll('.clearFilterButton');
  for (i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener('click', removeFilter);
  }
  filterCards(jsonArray);
}

function removeFilter(e) {
  let buttonId = e.target.parentElement.querySelector('.filterName').innerText;
  filters.splice(filters.indexOf(buttonId), 1);
  updateFilterList(filters);

}

function removeAllFilters() {
  filters = [];
  updateFilterList();
  let removeSearchBar = document.querySelector('.search-block');
  removeSearchBar.classList.remove("visible");

}


function addButtonListeners(filterButtons) {
  for (i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', addFilter);
  }
}

function filterCards(jsonArray) {
  let filteredArray = jsonArray;
  // if there are filters to use as criteria...
  if (filters.length > 0) {
    // Only add cards to array which are returned from this callback function
    filteredArray = jsonArray.filter(function (item) {
      // Put all filter tags in a single array for easy comparison
      let itemFilters = [];
      itemFilters.push(item.role);
      itemFilters.push(item.level);
      itemFilters.push(...item.languages);
      itemFilters.push(...item.tools);

      // Check if every filter can be found in each card's filter tags...
      if (filters.every(filter => itemFilters.includes(filter))) {
        itemFilters = undefined; // Release temporary array of filters (no longer necessary)
        return item; // Return matching card so it gets added to 'filteredArray'
      }
    });
  }

  // At this point, filteredArray only contains cards which match all filters.
  displayCard(filteredArray); // Pass the filtered array to 'displayCard', so each card can be added to the DOM
}


function displayCard(filteredArray) {
  document.querySelector('.cards').innerHTML = '';
  for (let i = 0; i < filteredArray.length; i++) {
    let newCard = `<div class="card">
        <img class="logo" src="${filteredArray[i].logo}" alt=""/>
        <div class="flex-1">
          <div class="company">
            <p class="first primary">${filteredArray[i].company}</p>
            ${addHighlightFilters(filteredArray[i].new, filteredArray[i].featured)}
          </div>
          <h4 class="second">${filteredArray[i].position}</h4>
          <div class="published">
            <p class="third">${filteredArray[i].postedAt}</p>
            <p class="third">${filteredArray[i].contract}</p>
            <p class="third">${filteredArray[i].location}</p>
          </div>
        </div>
        <div class="grid-1">          
          <button class="primary filter" >${filteredArray[i].level}</button>
          <button class="primary filter" >${filteredArray[i].role}</button>        
          ${processSubArray(filteredArray[i].tools)}
          ${processSubArray(filteredArray[i].languages)}
       </div>
      </div>`
    document.querySelector('.cards').innerHTML += newCard;
    addButtonListeners(document.querySelectorAll('button.filter'));
  }

}

let processSubArray = function (subArray) {
  let output = '';
  for (i = 0; i < subArray.length; i++) {
    output += `<button class="primary filter" >${subArray[i]}</button>`;
  }
  return output;
}

let addHighlightFilters = function (newHighlight, featuredHighlight) {
  let output = '';
  if (newHighlight == true) {
    output += `<p class="first btn">New!</p>`
  }
  if (featuredHighlight == true) {
    output += `<p class="first btn-dark">Featured</p>`
  }
  return output;
}






