function pluralize (string, num) {
  if (num === 1 || num === '1') { return string; } else { return `${string}s`; }
}

function doQuery (amenitiesList) {
  // console.log(JSON.stringify(amenitiesList))
  amenitiesList = JSON.stringify({ amenities: amenitiesList });
  // console.log(amenitiesList)
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: amenitiesList,
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      // console.log(data)
      $('section.places').empty();
      // const i = '';
      for (const i in data) {
        const place = data[i];
        // console.log(`place is ${place.name}`)
        $('section.places').append(
              `
              <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} ${pluralize('Guest', place.max_guest)}</div>
                      <div class="number_rooms">${place.number_rooms} ${pluralize('Bedroom', place.number_rooms)}</div>
                      <div class="number_bathrooms">${place.number_bathrooms} ${pluralize('Bathroom', place.number_bathrooms)}</div>
              </div>
              <div class="user">
                    </div>
                    <div class="description">
                ${place.description}
                    </div>
            </article>
              `
        );
        // console.log (place.name)
      }
    }
  });
}

$(document).ready(function () {
  const amenities = {};
  $.get('http://0.0.0.0:5001/api/v1/status/', (returnData) => {
    // console.log(returnData);
    if (returnData.status === 'OK') {
      $('#api_status').attr('class', 'available');
    }
  });
  doQuery([]);

  $('input:checkbox').click(function () {
    $(this).each(function () {
      if (this.checked) {
        amenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete amenities[$(this).data('id')];
      }
    });
    if (Object.values(amenities).length > 0) {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    } else {
      $('.amenities h4').html('&nbsp');
    }
  });

  $('.filters > button').click(function () {
    // console.log('clicked it!!')
    const outList = [];
    $('.amenities input:checkbox').each(function () {
      // console.log('here?')
      if (this.checked) {
        // console.log(`data id: ${$(this).attr('data-id')}`)
        outList.push($(this).attr('data-id'));
      } else {
        // console.log(`missed: ${this.checked}`)
      }
    });
    // console.log(outList);
    doQuery(outList);
  });
});
