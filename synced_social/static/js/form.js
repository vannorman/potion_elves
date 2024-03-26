
$(document).ready(function(){
    $('#submit').on('click',function(event){
         event.preventDefault();
         updateProgressBar($('#emails').val())
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
                finished = true;
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
    const items = inputString.split('@@');

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
var finished = false;
function updateProgressBar(listString) {
    const items = listString.split(',');
    const progressBar = document.getElementById('progressBar');
    const currentItemDisplay = document.getElementById('currentItem');
    let currentIndex = 0;

    const update = () => {
        // Check if the finished condition is met or all items are processed
        if (currentIndex < items.length && !finished) {
            // Update current item display
            currentItemDisplay.textContent = `Processing: ${items[currentIndex]}`;

            // Update the progress bar
            const progress = (currentIndex + 1) / items.length * 100;
            progressBar.style.width = `${progress}%`;

            // Move to the next item with a random delay
            currentIndex++;
            setTimeout(update, Math.random() * 3000); // Random delay between 0 and 2000 milliseconds
        } else {
            // Complete the progress bar if finished condition is detected or all items are done
            progressBar.style.width = '100%';
            currentItemDisplay.textContent = 'Processing completed';
        }
    };

    // Start the update process
    update();
}


