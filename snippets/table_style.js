function updateRender() {
    $.get('http://localhost:5002/api/viewers/__REPLACEME__', function (data) {
        console.log(data)
        for (const item in data) {
            console.log(item)
            console.log(item.levelimageurl)
            console.log(item.username)
            $('#flowerpots').append(`<th class="tg-baqh"><img src="${data[item].levelimageurl}"></th>`);
            $('#displaynames').append(`<td class="tg-baqh">${data[item].username}</td>`)
        }
    })
}


$(document).ready(function () {
    updateRender();
    setInterval(updateRender, 300000);
})


// [{"username":"MariachiMayhem","viewing_time":30,"levelimageurl":"http://localhost:5002/images/0"}]
