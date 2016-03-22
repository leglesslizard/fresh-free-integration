// Refresh access token on page load but don't do anything else until the request has been processed
// If an access token is found then functionality will be added to the page in the "LoadItUp" method
refreshToken( '3ZmVwTjVPKmdHDmBhpq-uA', 'yF4e7ajdL0M5YPv-Eh3eTg', '1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo' );

/**
 * Generate a new access token before carrying out any requests
 *
 * @returns {XMLHttpRequest}
 */
function refreshToken( client_id, client_secret, refresh_token) {
    var xhr = doRequest( 'POST','https://api.sandbox.freeagent.com/v2/token_endpoint' );
    xhr.setRequestHeader( 'Authorization', 'Basic ' + client_id + ':' + client_secret );
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.onload = receiveNewToken;
    xhr.send( 'client_secret='+client_secret+'&grant_type=refresh_token&refresh_token='+refresh_token+'&client_id='+client_id );
    return xhr;
}

/**
 * Wrapper method for HTTP requests
 *
 * @param method POST, PUT, DELETE etc
 * @param url
 */
function doRequest( method, url ) {
    var xhr = new XMLHttpRequest();
    xhr.open( method, url, true );
    return xhr;
}

/**
 * Wrapper function to refresh access token and store the new one locally
 * Using this allows knowledge of whether the access token has been retrieved or not before proceeding
 * If access token is returned
 */
function receiveNewToken() {
    responseObj  = JSON.parse( this.responseText );
    access_token = responseObj.access_token;

    // If we have an access token start doing stuff
    if ( 'string' === typeof access_token ) {
        loadItUp( access_token );
    } else {
        console.log( 'FreeAgent access token request failed: ' + this.responseText );
    }
};

/**
 * Add required functionality
 *
 * @param access_token
 */
function loadItUp( access_token ) {
    console.log( access_token );
}


































