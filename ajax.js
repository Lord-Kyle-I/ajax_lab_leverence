
$('#search')[0].addEventListener('click', function(e) {
    e.preventDefault()
    let url = 'https://itunes.apple.com/search?';
    const searchTerm = $('#term')[0].value
    const output = $('#output')[0]
    output.innerHTML = ''
    let params = {
        term: searchTerm.toLowerCase(),
        entity: $('#entity')[0].value,
        limit: 10,
    };

    if(params.term && params.entity) {
        fetch(url + new URLSearchParams(params).toString())
            .then(response => {
                //https://stackoverflow.com/questions/44222466/js-how-to-handle-a-400-bad-request-error-returned-from-api-url
                if(response.status === 400) {
                    throw new Error('Bad Request')
                }
                console.log('response', response);

                return response.json();
            })
            .then(data => {
                console.log('data', data);
                if(data.results) {
                    data.results.forEach((doc) => {
                        output.innerHTML += `
                    <div class="card mb-3" style="width: 18rem;">
                      <img src="${doc.artworkUrl100}" class="card-img-top" alt="${doc.trackName} artwork">
                      <div class="card-body">
                          <div class="card-header">
                            ${doc.trackName}
                          </div>
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item">${doc.artistName}</li>
                          </ul>
                      </div>
                    </div>`;
                    });
                }
            })
            .catch(error => {
                if(error.message === 'Bad Request') {
                    output.innerHTML = `<div class="alert alert-info" role="alert">
                        No result found for ${searchTerm}!
                    </div>`
                } else {
                    console.error('AJAX ERROR: ', error);
                }
            });
    }

});