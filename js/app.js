$('document').ready(() => {
  /************************************************
    CREATE EMPLOYEE DIVS
  ************************************************/
  $.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us',
    dataType: 'json',
    success: (data) => {

      // Return a string with first letters of all words capitalized
      const capitalize = text => {
        const words = text.split(' ');
        let string = '';
        $(words).each(function (i) {
          if (/[a-z]/.test(this.charAt(0))) string += this.replace(this.charAt(0), this.charAt(0).toUpperCase());
          else string += this;

          if (i !== words.length-1) string += ' ';
        });
        return string;
      }

      // Return a given state's postal abbreviation
      const abbreviate = state => {
        const states = {
          AL: "Alabama",
          AK: "Alaska",
          AZ: "Arizona",
          AR: "Arkansas",
          CA: "California",
          CO: "Colorado",
          CT: "Connecticut",
          DE: "Delaware",
          FL: "Florida",
          GA: "Georgia",
          GU: "Guam",
          HI: "Hawaii",
          ID: "Idaho",
          IL: "Illinois",
          IN: "Indiana",
          IA: "Iowa",
          KS: "Kansas",
          KY: "Kentucky",
          LA: "Louisiana",
          ME: "Maine",
          MD: "Maryland",
          MA: "Massachusetts",
          MI: "Michigan",
          MN: "Minnesota",
          MS: "Mississippi",
          MO: "Missouri",
          MT: "Montana",
          NE: "Nebraska",
          NV: "Nevada",
          NH: "New Hampshire",
          NJ: "New Jersey",
          NM: "New Mexico",
          NY: "New York",
          NC: "North Carolina",
          ND: "North Dakota",
          OH: "Ohio",
          OK: "Oklahoma",
          OR: "Oregon",
          PA: "Pennsylvania",
          RI: "Rhode Island",
          SC: "South Carolina",
          SD: "South Dakota",
          TN: "Tennessee",
          TX: "Texas",
          UT: "Utah",
          VT: "Vermont",
          VA: "Virginia",
          WA: "Washington",
          WV: "West Virginia",
          WI: "Wisconsin",
          WY: "Wyoming"
        }
        for (let abbrev in states) if (state === states[abbrev].toLowerCase()) return abbrev;
      }

      // Return date of birth in more readable form
      const formatBday = bday => bday.replace(/\d\d(\d\d)-(\d\d)-(\d\d).*/, '$2/$3/$1');

      // Return an object filled with all essential info on an employee
      const getEmployeeInfo = employee => {
        const employeeInfo = {
          name: capitalize(`${employee.name.first} ${employee.name.last}`),
          phone: employee.phone.replace(/-/, ' '),
          bday: `Birthday: ${formatBday(employee.dob)}`,
          city: `${capitalize(employee.location.city)}, ${abbreviate(employee.location.state)}`
        }

        let street = capitalize(employee.location.street);
        let zip = employee.location.postcode;
        employeeInfo.address = `${street}, ${employeeInfo.city}  ${zip}`;

        return employeeInfo;
      }

      // Construct and return an employee fieldset
      function $Employee (employee) {
        const employeeInfo = getEmployeeInfo(employee);

        return $(`
          <fieldset class="employee">
            <img class="picture" src="${employee.picture.large}">
            <div class="info">
              <h3 class="name">${employeeInfo.name}</h3>
              <p class="username">${employee.login.username}</p>
              <p class="email">${employee.email}</p>
              <p class="city">${employeeInfo.city}</p>
              <p class="phone">${employeeInfo.phone}</p>
              <p class="address">${employeeInfo.address}</p>
              <p class="bday">${employeeInfo.bday}</p>
            </div>
          </fieldset>
        `);
      }

      // Create and display a fieldset for each employee retrieved
      $(data.results).each(function () {
        $('.employees').append(new $Employee(this)) });



      /************************************************
        MODAL WINDOW
      ************************************************/

      // Redirect clicks on children of '.employee' div
      const findEmplDiv = target => {
        if ($(target).hasClass('employee')) return $(target);
        else return $(target).parents('.employee');
      };

      // Return an object filled with information stored in an employee's fieldset
      const getEmplInfoFromDiv = $employee => {
        return {
          imgSrc: $employee.find('.picture').prop('src'),
          name: $employee.find('.name').text(),
          username: $employee.find('.username').text(),
          email: $employee.find('.email').text(),
          phone: $employee.find('.phone').text(),
          address: $employee.find('.address').text(),
          bday: $employee.find('.bday').text()
        }
      }

      // Create a pop-out window with info on a given employee
      const createModalWindow = e => {
        const $employee = findEmplDiv(e.target);
        const emplInfo = getEmplInfoFromDiv($employee);

        const $modalWindow = $(`
          <div class="modal-window">
            <span class="modal-close">X</span>
            <img class="modal-image" src="${emplInfo.imgSrc}">
            <h3 class="modal-name">${emplInfo.name}</h3>
            <p class="modal-username">${emplInfo.username}</p>
            <p class="modal-email">${emplInfo.email}</p>
            <hr>
            <p class="modal-number">${emplInfo.phone}</p>
            <p class="modal-address">${emplInfo.address}</p>
            <p class="modal-birthday">${emplInfo.bday}</p>
          </div>
        `);

        // Add a listener for removal, remove any existing windows, and display the new one
        $modalWindow.find('.modal-close').click(e => $('.modal-window').remove());
        $('.modal-window').remove();
        $('body').append($modalWindow);
      }

      // Any click within an employee div will create a window for that employee
      $('.employees').click(e => { if (!$(e.target).hasClass('employees')) createModalWindow(e) });
    }
  });



  /************************************************
    SEARCH FEATURE
  ************************************************/

  // Compare search value against names; show a div if it matches, otherwise hide it
  const findName = e => {
    const searchTerm = $(e.target).val().toLowerCase();
    $('.employees').children().each(function () {
      const name = $(this).find('.name').text().toLowerCase();
      if (name.indexOf(searchTerm) !== -1) $(this).show();
      else $(this).hide();
    });
  }

  $('.search').keyup(e => findName(e));
});
