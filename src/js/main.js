document.addEventListener("DOMContentLoaded", function() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(function(input) {
      input.addEventListener("input", function() {
          let value = this.value.replace(/\D/g, '');
          if (value.length > 0) {
              value = value.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
              this.value = !value[2] ? value[1] : value[1] + ' ' + value[2] + (value[3] ? '-' + value[3] : '');
          }
      });
  });
});

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
