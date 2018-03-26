$.ajax({
  url: 'https://randomuser.me/api/?results=12',
  dataType: 'json',
  success: function(data) {
    // Constructor function for creating employee divs
    function $Employee (employee, gridPosition) {
      let firstName = employee.name.first;
      firstName = firstName.replace(firstName[0], firstName[0].toUpperCase());
      let lastName = employee.name.last;
      lastName = lastName.replace(lastName[0], lastName[0].toUpperCase());
      const fullName = `${firstName} ${lastName}`;
      let city = employee.location.city;
      city = city.replace(city[0], city[0].toUpperCase());

      return $(`
        <fieldset class="employee ${gridPosition}">
        <img class="picture" src="${employee.picture.large}">
        <div class="info">
          <h3 class="name">${fullName}</h3>
          <p class="email">${employee.email}</p>
          <p class="city">${city}</p>
        </div>
        </fieldset>
      `);
    }

    // Create a fieldset for each employee retrieved
    const $employees = $('.employees');
    let row = 0;
    let column = 0;
    $(data.results).each(function (i) {
      const gridPosition = (() => {
        if (i % 3 === 0) {
          row++;
          column = 1; }
        else column++;
        return `row${row} column${column}`;
      })();
      $employees.append(new $Employee(this, gridPosition)) });
  }
});

$('document').ready(() => {
  function findName (e) {
    const searchTerm = $(e.target).val().toLowerCase();
    $('.employees').children().each(function () {
      const name = $(this).find('.name').text().toLowerCase();
      if (name.indexOf(searchTerm) !== -1) $(this).show();
      else $(this).hide();
    });
  }

  $('.search').keyup(e => findName(e));
});
