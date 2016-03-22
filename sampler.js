var client_id     = 'cTOEEiCBd_zGrjFO5CffNA';
var client_secret = 'qsnnrYFACtazYVsy_3DraQ';
var refresh_token = '1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo';
var access_token  = '';

// Refresh access token on page load but don't do anything else until the request has been processed
refreshToken();

/**
 * Generate a new access token before carrying out any requests
 *
 * @returns {XMLHttpRequest}
 */
function refreshToken() {
    var token_url = 'https://api.sandbox.freeagent.com/v2/token_endpoint';
    var xhr       = createCORSRequest( 'POST', token_url );
    xhr.setRequestHeader( 'Authorization', 'Basic ' + client_id + ':' + client_secret );
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.onload = receiveNewToken;
    xhr.send( 'client_secret=yF4e7ajdL0M5YPv-Eh3eTg&grant_type=refresh_token&refresh_token=1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo&client_id=3ZmVwTjVPKmdHDmBhpq-uA' );
    return xhr;
}

/**
 * Add required functionality
 *
 * @param access_token
 */
function loadItUp( access_token ) {
    console.log( access_token );
}

/**
 * Open request (POST, PUT, DELETE)
 *
 * @param    method     POST, PUT, DELETE
 * @param    url        request url
 * @returns {XMLHttpRequest}
 */
function createCORSRequest( method, url ) {
    var xhr = new XMLHttpRequest();

    if ( 'withCredentials' in xhr ) {
        xhr.open( method, url, true );
    } else if ( typeof XDomainRequest != 'undefined' ) {
        xhr = new XDomainRequest();
        xhr.open( method, url );
    } else {
        // CORS not supported - throw error?
        xhr = null;
    }
    return xhr;
}

/**
 * Wrapper function to refresh access token and store the new one locally and load up functionality for freshdesk page
 */
function receiveNewToken() {
    responseObj  = JSON.parse( this.responseText );
    access_token = responseObj.access_token;

    if ( '' !== access_token ) {
        loadItUp( access_token );
    } else {
        // No valid access token returned so maybe a message? Or just do naff all
    }
};