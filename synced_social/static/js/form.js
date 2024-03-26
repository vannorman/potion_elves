
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
                emails : $('#emails').val(),
                }).replaceAll("',","',\n"),
            dataType : 'json',
            contentType : 'application/json',
            success: function (e) {
                $('#result').html(stringToTable(e.links))
            },
            error: function (e) {
                $('#result').text("FAIL")
            },
        });
    });
});

function stringToTable(inputString) {
    // Split the input string by ";" to get an array of strings
    const items = inputString.split(';');

    // Start creating the HTML table
    let htmlTable = '<table border="1">'; // You can remove border="1" or style it as needed

    // Loop through the items and add each one as a row in the table
    items.forEach(item => {
        // Each item is placed in a table row
        htmlTable += `<tr><td>${item.trim()}</td></tr>`; // trim() is used to remove any leading or trailing white space
    });

    // Close the table HTML
    htmlTable += '</table>';

    // Return the HTML table string
    return htmlTable;
}
