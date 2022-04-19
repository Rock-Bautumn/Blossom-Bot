$(document).ready(function () {
    $.get('http://localhost:5002/api/viewers/MajorLoaf', function (data) {
        console.log(JSON.stringify(data));
    })
    $('#flowerpots').append(`<th class="tg-baqh"><img src="../images/level_1_flower_in_pot.png"></th>`);
    $('#displaynames').append(`<td class="tg-baqh">Test Name</td>`)
})
