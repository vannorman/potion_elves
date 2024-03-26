
$(document).ready(function(){
    $('#submit').on('click',function(event){
         event.preventDefault();
         $.ajax({
            type: 'POST',
            url: "/submit",
            headers: {
                "X-CSRFToken" : csrf,
                "Content-Type": "application/json"
            },
            data : JSON.stringify({ 
                domain : $('#domain').val(),
                }).replaceAll("',","',\n"),
            dataType : 'json',
            contentType : 'application/json',
            success: function (e) {
                $('#result').text(e.data)
            },
            error: function (e) {
                alert('no');
            },
        });
    });
});
