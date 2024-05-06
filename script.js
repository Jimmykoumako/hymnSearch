async function loadJSONFile(filename) {
   try {
      const response = await fetch(filename);
      if (!response.ok) {
         throw new Error(`JSON loading error! Status: ${response.status}`);
      }
      return await response.json();
   } catch (error) {
      console.error('Error loading JSON file:', error);
   }
}

let hymns;
loadJSONFile('hymnsTitle.json').then(data => {
   console.log(data);
   hymns = data;
   data.forEach(hymn => {
      console.log(`${hymn.title} - Number: ${hymn.number}`);
   });
});

function searchHymn() {
   const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
   const searchResults = document.getElementById('searchResults');
   searchResults.innerHTML = '';
   if (searchTerm === '') {
      searchResults.innerHTML = 'Please enter a search term.';
      return;
   }

   const filteredHymns = hymns.filter(hymn =>
       hymn.title.toLowerCase().includes(searchTerm) || hymn.number.toLowerCase().includes(searchTerm)
   );

   if (filteredHymns.length === 0) {
      searchResults.innerHTML = 'No hymns found.';
   } else {
      filteredHymns.forEach(hymn => {
         const hymnElement = document.createElement('div');
         let number = hymn.number;
         if (number.length < 3){
            number = number===2 ? ' ' + number : '  '+ number;
            console.log("Lenght check :"+ number+ 'i')
         }
         hymnElement.className = 'hymnTitle';
         hymnElement.innerHTML = `<strong>#${ number}</strong> - ${hymn.title}<br>`;
         searchResults.appendChild(hymnElement);
      });
   }
}
