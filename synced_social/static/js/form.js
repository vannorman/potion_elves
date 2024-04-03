
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
    htmlTable += '<tr><th>Email</th><th>Facebook</th><th>Twitter</th><th>YouTube</th><th>LinkedIn</th><th>Instagram</th></tr>';
    
    // Loop through the items and add each one as a row in the table
    items.forEach(item => {
        // each item is a csv of socials.
        // for Facebook, Linkedin, Instagram, Twitter, Youtube, Other.
        item = item.trim();
        socials = item.split(',');

        socials = removeLongerStringsWhenContained(socials); // prune duplicates.
        orderedSocials = [];
        orderedSocials[0] = socials[0]; // save email as first element.

        console.log(socials)
        for(let i=0;i<socials.length;i++){
            socials[i] = socials[i].trim(); // trim whtie
            socials[i] = socials[i].toLowerCase(); // lowercase
            socials[i] = socials[i].split('?')[0]; // trim ? and anything after
            socials[i] = socials[i].replace(/\/$/, ''); // trim final '/'
            console.log("socials i:"+socials[i]);
        }
        const findIndexOfSubstring = (arr, substring) => arr.findIndex(element => element.includes(substring));
        const facebookIndex = findIndexOfSubstring(socials,'facebook');
        const twittterIndex = findIndexOfSubstring(socials,'twitter');
        const youtubeIndex = findIndexOfSubstring(socials,'youtube');
        const linkedinIndex = findIndexOfSubstring(socials,'linkedin');
        const instagramIndex = findIndexOfSubstring(socials,'instagram');

       
        // now that indexes are found, replace instagram and twitter socials with handle only. Leave the rest as links.
        for(let i=0;i<socials.length;i++){
            if (socials[i].includes('twitter') || socials[i].includes('instagram'))
                socials[i] = "@" + socials[i].substring(socials[i].lastIndexOf('/') + 1);
        }

        
        orderedSocials[1] = facebookIndex == -1 ? "" : socials[facebookIndex];
        orderedSocials[2] = twittterIndex == -1 ? "" : socials[twittterIndex];
        orderedSocials[3] = youtubeIndex == -1 ? "" : socials[youtubeIndex];
        orderedSocials[4] = linkedinIndex == -1 ? "" : socials[linkedinIndex];
        orderedSocials[5] = instagramIndex == -1 ? "" : socials[instagramIndex];

        // finally if there are any elements in "socials" that don't contain instagram, twitter etc, then put it as last element.


        row = "<tr>";
        for(let i=0;i<orderedSocials.length;i++){
            row += "<td>"+orderedSocials[i]+"</td>";
        }
        row += "</tr>" 
 
        // Each item is placed in a table row
        htmlTable += row;
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

function removeLongerStringsWhenContained(arr) {
  // sometimes there are duplicates and sometimes /about/ is on the dupilcate. 
  // here we Prune duplicates and prune the longest of the 2 matching duplicates.
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].includes(arr[j])) {
        arr.splice(i, 1);
        i--; // Adjust index after removal
        break; // Break to avoid accessing removed element
      } else if (arr[j].includes(arr[i])) {
        arr.splice(j, 1);
        j--; // Adjust index after removal
      }
    }
  }
  return arr;
}

