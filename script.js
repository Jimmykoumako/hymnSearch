const hymns = [
    { number: 1, title: "Amazing Grace", lyrics: "Amazing grace! How sweet the sound..." },
    { number: 23, title: "Blessed Assurance", lyrics: "Blessed assurance, Jesus is mine..." },
];

function searchHymn() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (searchTerm === '') {
        searchResults.innerHTML = 'Please enter a search term.';
        return;
    }

    const filteredHymns = hymns.filter(hymn =>
        hymn.title.toLowerCase().includes(searchTerm) || hymn.number.toString() === searchTerm
    );

    if (filteredHymns.length === 0) {
        searchResults.innerHTML = 'No hymns found.';
    } else {
        filteredHymns.forEach(hymn => {
            const hymnElement = document.createElement('div');
            hymnElement.innerHTML = `<strong>#${hymn.number}</strong> - ${hymn.title}<br>${hymn.lyrics}`;
            searchResults.appendChild(hymnElement);
        });
    }
}
