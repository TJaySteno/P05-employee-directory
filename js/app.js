$('document').ready(() => {
  $.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us',
    dataType: 'json',
    success: function(data) {
      // Constructor function for creating employee divs
      function $Employee (employee) {
        function capitalize (text) {
          const words = text.split(' ');
          let string = '';
          words.forEach(function (word, i) {
            if (/[a-z]/.test(word.charAt(0))) string += word.replace(word.charAt(0), word.charAt(0).toUpperCase());
            else string += word;
            if (i !== words.length-1) string += ' ';
          });
          return string;
        }

        function abbreviate (state) {
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


        let fullName = capitalize(`${employee.name.first} ${employee.name.last}`);

        let phone = employee.phone.replace(/-/, ' ');

        let street = capitalize(employee.location.street);
        let city = capitalize(employee.location.city);
        let state = abbreviate(employee.location.state);
        let zip = employee.location.postcode;
        const address = `${street}, ${city}, ${state}  ${zip}`;

        const formatBday = bday => bday.replace(/\d\d(\d\d)-(\d\d)-(\d\d).*/, '$2/$3/$1');
        let bday = `Birthday: ${formatBday(employee.dob)}`;

        return $(`
          <fieldset class="employee">
            <img class="picture" src="${employee.picture.large}">
            <div class="info">
              <h3 class="name">${fullName}</h3>
              <p class="email">${employee.email}</p>
              <p class="city">${city}, ${state}</p>
              <p class="phone">${phone}</p>
              <p class="street">${address}</p>
              <p class="bday">${bday}</p>
            </div>
          </fieldset>
        `);
      }

      // Create a fieldset for each employee retrieved
      $(data.results).each(function () {
        $('.employees').append(new $Employee(this)) });

      const modalWindow = e => {
        const $employee = (() => {
          if ($(e.target).hasClass('employee')) return $(e.target);
          else return $(e.target).parents('.employee');
        })();

        const empl = {
          imgSrc: $employee.find('.picture').prop('src'),
          name: $employee.find('.name').text(),
          email: $employee.find('.email').text(),
          city: $employee.find('.city').text(),
          phone: $employee.find('.phone').text(),
          street: $employee.find('.street').text(),
          bday: $employee.find('.bday').text()
        }

        const $modalWindow = $(`
          <div class="modal-window">
            <span class="modal-close">X</span>
            <img class="modal-image" src="${empl.imgSrc}">
            <h3 class="modal-name">${empl.name}</h3>
            <p class="modal-email">${empl.email}</p>
            <p class="modal-city">${empl.city}</p>
            <hr>
            <p class="modal-number">${empl.phone}</p>
            <p class="modal-address">${empl.street}</p>
            <p class="modal-birthday">${empl.bday}</p>
          </div>
        `);

        $modalWindow.find('.modal-close').click(e => $('.modal-window').remove());

        $('.modal-window').remove();
        $('body').append($modalWindow);
      }

      $('.employees').click(e => { if (!$(e.target).hasClass('employees')) modalWindow(e) });
    }
  });

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
