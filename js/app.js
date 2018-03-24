$('document').ready(() => {
  $.ajax({
    url: 'https://randomuser.me/api/?inc=name,location,email,picture&results=12',
    dataType: 'json',
    success: function(data) {
      // Constructor function for creating employee divs
      function $Employee (employee) {
        return $(`
          <fieldset class="employee">
          <img class="picture" src="${employee.picture.large}">
          <h3 class="name">${employee.name.first} ${employee.name.last}</h3>
          <p class="email">${employee.email}</p>
          <p class="city">${employee.location.city}</p>
          </fieldset>
        `);
      }

      // Create a fieldset for each employee retrieved
      const $employees = $('.employees');
      $(data.results).each(function () {
        $employees.append(new $Employee(this)) });
    }
  });
});
