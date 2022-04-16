function pluralize (string, num) {
  if (num === 1 || num === '1') { return string; } else { return `${string}s`; }
}

$(document).ready(function () {
  const amenities = {};
  $.get('http://0.0.0.0:5001/api/v1/status/', (returnData) => {
    // console.log(returnData);
    if (returnData.status === 'OK') {
      $('#api_status').attr('class', 'available');
    }
  });
  console.log('before');
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
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
        console.log(place.name);
      }
    }
  });
  // let sendingData = {};
  // sendingData.name = "Raj";
  // sendingData.age  = 32;
  // sendingData.married = false;
  // sendingData = JSON.stringify(sendingData);

  // post(URL,data,function(data,status,xhr),dataType)
  // $.post('http://0.0.0.0:5001/api/v1/places_search/', sendingData, function(recvdData) {
  //   console.log(recvdData);
  // });
  console.log('okay');

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
});
