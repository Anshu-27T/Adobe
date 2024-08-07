document.addEventListener('DOMContentLoaded', () => {
    const itemContainer = document.getElementById('item-container');
    const paginationControls = document.getElementById('pagination-controls');
    const sortButton = document.getElementById('sort-by-price');
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const itemElementres = document.createElement('no-result');
    const itemsPerPage = 10;
    let currentPage = 1;
    let items = [];
    let filteredItems = [];
     const searchInput = document.getElementById('searchBar')
     let shownores = false

    function displayItems(page) {
        itemContainer.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
        itemElementres.classList.add('item');

        for (let i = startIndex; i < endIndex; i++) {
            const item = filteredItems[i];
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h2>${item.title}</h2>
                <h2>$${item.price}</h2>`;
            itemContainer.appendChild(itemElement);
        }
        if(endIndex < 1){
            console.log("ues")
            itemElementres.innerHTML = `
            <h2>No item found</h2>   `       
            itemContainer.appendChild(itemElementres)
        }
        updatePaginationControls(page);
    }

    function updatePaginationControls(page) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
            
            if (i === page) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', () => displayItems(i));
            paginationControls.appendChild(pageButton);
        }
    }

    function filterItems() {
        const selectedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            const searchQuery = searchInput.value.toLowerCase();
        filteredItems = items.filter(item => {   const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const matchesSearch = item.title.toLowerCase().includes(searchQuery);
             return matchesCategory && matchesSearch;
    });
    displayItems(currentPage);
    }

  function sortItemsByPrice() {
    filteredItems.sort((a, b) => a.price - b.price);
    displayItems(currentPage);
}
searchInput.addEventListener('input', filterItems);
    sortButton.addEventListener('click', sortItemsByPrice);
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', filterItems));

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            items = data;
            filteredItems = items; // Initially no filter
            displayItems(currentPage);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            itemContainer.innerHTML = '<p>Failed to load items.</p>';
        });
});


function updateResultCount() {
    resultCountElement.textContent = `Showing ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`;
}