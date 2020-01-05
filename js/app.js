$('document').ready(() => {
  /************************************************
    CREATE EMPLOYEE DIVS
  ************************************************/
  $.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us',
    dataType: 'json',
    success: (data) => {

      /* Capitalize first letter and return string */
      const capitalize = text => {
        const words = text.split(' ');
        let string = '';
        $(words).each(function (i) {
          if (/[a-z]/.test(this.charAt(0))) {
            string += this.replace(
              this.charAt(0),
              this.charAt(0).toUpperCase());
          } else string += this;

          if (i !== words.length - 1) string += ' ';
        });

        return string;
      };

      /* Return a given state's postal abbreviation */
      const abbreviate = state => {
        const states = {
          AL: 'Alabama',
          AK: 'Alaska',
          AZ: 'Arizona',
          AR: 'Arkansas',
          CA: 'California',
          CO: 'Colorado',
          CT: 'Connecticut',
          DE: 'Delaware',
          FL: 'Florida',
          GA: 'Georgia',
          GU: 'Guam',
          HI: 'Hawaii',
          ID: 'Idaho',
          IL: 'Illinois',
          IN: 'Indiana',
          IA: 'Iowa',
          KS: 'Kansas',
          KY: 'Kentucky',
          LA: 'Louisiana',
          ME: 'Maine',
          MD: 'Maryland',
          MA: 'Massachusetts',
          MI: 'Michigan',
          MN: 'Minnesota',
          MS: 'Mississippi',
          MO: 'Missouri',
          MT: 'Montana',
          NE: 'Nebraska',
          NV: 'Nevada',
          NH: 'New Hampshire',
          NJ: 'New Jersey',
          NM: 'New Mexico',
          NY: 'New York',
          NC: 'North Carolina',
          ND: 'North Dakota',
          OH: 'Ohio',
          OK: 'Oklahoma',
          OR: 'Oregon',
          PA: 'Pennsylvania',
          RI: 'Rhode Island',
          SC: 'South Carolina',
          SD: 'South Dakota',
          TN: 'Tennessee',
          TX: 'Texas',
          UT: 'Utah',
          VT: 'Vermont',
          VA: 'Virginia',
          WA: 'Washington',
          WV: 'West Virginia',
          WI: 'Wisconsin',
          WY: 'Wyoming',
        };
        for (let abbrev in states) if (state === states[abbrev].toLowerCase()) return abbrev;
      };

      /* Return date of birth in more human-readable form */
      const formatBday = bday => bday.replace(/\d\d(\d\d)-(\d\d)-(\d\d).*/, '$2/$3/$1');

      /* Return an object filled with all essential info on an employee */
      const getEmployeeInfo = employee => {
        const employeeInfo = {
          name: capitalize(`${employee.name.first} ${employee.name.last}`),
          phone: employee.phone.replace(/-/, ' '),
          bday: `Birthday: ${formatBday(String(employee.dob))}`,
          city: `${capitalize(employee.location.city)}, ${abbreviate(employee.location.state)}`,
        };

        console.log(employeeInfo.name, employee.nat);

        let street = capitalize(employee.location.street.name);
        let zip = employee.location.postcode;
        employeeInfo.address = `${street}, ${employeeInfo.city}  ${zip}`;

        return employeeInfo;
      };

      /* Construct and return an employee fieldset */
      function $Employee(employee) {
        const employeeInfo = getEmployeeInfo(employee);

        return $(`
          <fieldset class='employee'>
            <img class='picture' src='${employee.picture.large}'>
            <div class='info'>
              <h3 class='name'>${employeeInfo.name}</h3>
              <p class='username'>${employee.login.username}</p>
              <p class='email'>${employee.email}</p>
              <p class='city'>${employeeInfo.city}</p>
              <p class='phone'>${employeeInfo.phone}</p>
              <p class='address'>${employeeInfo.address}</p>
              <p class='bday'>${employeeInfo.bday}</p>
            </div>
          </fieldset>
        `);
      }

      /* Create and display a fieldset for each employee retrieved */
      $(data.results).each(function () {
        $('.employees').append(new $Employee(this));
      });

      console.log('I\'ve logged nationality for each employee for proof I know how to switch it.');
      console.log('I\'ve chosen to use state names in place of country names. I hope that\'s ok.');
      console.log('All my results are from US, but if they weren\'t I would add a simple');
      console.log('conditional statement along the lines of "if (employee.nat !== \'US\') /* use');
      console.log('nationality instead */;\'');

      /************************************************
        MODAL WINDOW
      ************************************************/

      /* Ensure target is '.employee' div */
      const findEmplDiv = target => {
        if ($(target).hasClass('employee')) return $(target);
        else return $(target).parents('.employee');
      };

      /* Return an object with the information stored in an employee's fieldset */
      const getEmplInfoFromDiv = $employee => {
        return {
          imgSrc: $employee.find('.picture').prop('src'),
          name: $employee.find('.name').text(),
          username: $employee.find('.username').text(),
          email: $employee.find('.email').text(),
          phone: $employee.find('.phone').text(),
          address: $employee.find('.address').text(),
          bday: $employee.find('.bday').text(),
          index: $('.employee').index($employee[0]),
        };
      };

      /* Create a pop-out window with info on a given employee */
      const createModalWindow = $target => {
        const $employee = findEmplDiv($target);
        const emplInfo = getEmplInfoFromDiv($employee);

        const $modalWindow = $(`
          <div class='modal-window'>
            <div class='modal-display'>
              <img src='img/arrow.png' class='modal-arrow left'>
              <span class='modal-close'>X</span>
              <img class='modal-image' src='${emplInfo.imgSrc}'>
              <h3 class='modal-name'>${emplInfo.name}</h3>
              <p class='modal-username'>${emplInfo.username}</p>
              <p class='modal-email'>${emplInfo.email}</p>
              <hr>
              <p class='modal-number'>${emplInfo.phone}</p>
              <p class='modal-address'>${emplInfo.address}</p>
              <p class='modal-birthday'>${emplInfo.bday}</p>
              <p class='modal-index'>${emplInfo.index}</p>
              <img src='img/arrow.png' class='modal-arrow right'>
            </div>
          </div>
        `);

        /* Hide arrows from first & last employees to prevent confusion */
        if (emplInfo.index === 0) $modalWindow.find('.left').hide();
        else if (emplInfo.index === 11) $modalWindow.find('.right').hide();

        /*
          Translate key strokes:
            'esc' -> close window
            L arrow -> load previous
            'enter' or R arrow -> load next
        */
        const modalArrowPress = (e) => {
          if ($('.modal-window').length) {
            if (e.keyCode == 27) modifyModalWindow(e, 'close');
            else if (e.keyCode == 37) modifyModalWindow(e, 'left');
            else if (e.keyCode == 13 || e.keyCode == 39) modifyModalWindow(e, 'right'); }
        };

        /* Remove window, or load previous/next employee */
        const modifyModalWindow = (e, action) => {

          if (action === 'close'
          || $(e.target).hasClass('modal-close')
          || $(e.target).hasClass('modal-window')) $modalWindow.remove();

          else if ($(e.target).hasClass('modal-arrow') || action) {
            const index = Number($('.modal-index').text());
            if (index !== 0
            && (action === 'left' || $(e.target).hasClass('left')))
              createModalWindow($('.employees').children()[index - 1]);
            else if (index !== 11
            && (action === 'right' || $(e.target).hasClass('right')))
              createModalWindow($('.employees').children()[index + 1]);
          }
        };

        /*
          Set key listener for arrows/esc/enter
          set listener for modal window clicks
          remove existing modal windows
          and display the new one
        */
        $(window).off('keyup');
        $(window).on('keyup', e => modalArrowPress(e));
        $modalWindow.click(e => modifyModalWindow(e));
        $('.modal-window').remove();
        $('body').append($modalWindow);
      };

      /* Any click within an employee div will create a modal window for that employee */
      $('.employees').click(e => {
        if (!$(e.target).hasClass('employees')) createModalWindow($(e.target));
      });
    },
  });

  /************************************************
    SEARCH FEATURE
  ************************************************/

  /* Compare search value against employee names; show a div if it matches, otherwise hide it */
  const findName = e => {
    const searchTerm = $(e.target).val().toLowerCase();
    $('.employees').children().each(function () {
      const name = $(this).find('.name').text().toLowerCase();
      if (name.indexOf(searchTerm) !== -1) $(this).show();
      else $(this).hide();
    });
  };

  $('.search').keyup(e => findName(e));
});
