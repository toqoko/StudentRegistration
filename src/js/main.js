function toggleFields(parentId) {
  const selectedValue = document.getElementById(parentId).querySelector('select').value;

  document.getElementById(parentId).querySelectorAll('div[class="fullName"], div[class="job"], div[class="position"], div[class="phoneNumber"]')
    .forEach(field => {
      if (selectedValue === 'deceased') {
        field.style.display = "none";
        field.value = '';
      } else if ( selectedValue === 'father' 
          || selectedValue === 'stepfather' 
          || selectedValue === 'mother' 
          || selectedValue === 'stepmother' 
          || selectedValue === 'divorced'
        ) {
        field.style.display = "block";
      }
    });
    
  document.getElementById(parentId).querySelectorAll('div[class="job"], div[class="position"], div[class="phoneNumber"]')
    .forEach(field => {
      if (selectedValue === 'divorced') {
        field.style.display = "none";
        field.value = '';
      } else if ( selectedValue === 'father' 
          || selectedValue === 'stepfather' 
          || selectedValue === 'mother' 
          || selectedValue === 'stepmother' 
          || selectedValue === 'divorced'
        ) {
        field.style.display = "block";
      }
    });
}
