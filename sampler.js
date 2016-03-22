var client_id     = 'cTOEEiCBd_zGrjFO5CffNA';
var client_secret = 'qsnnrYFACtazYVsy_3DraQ';
var refresh_token = '1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo';

// Use refresh token to generate a valid token before request
function refreshToken() {
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://api.sandbox.freeagent.com/v2/token_endpoint', true );
    xhr.setRequestHeader( 'Authorization', 'Basic ' + client_id + ':' + client_secret );
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.send( 'client_secret=yF4e7ajdL0M5YPv-Eh3eTg&grant_type=refresh_token&refresh_token=1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo&client_id=3ZmVwTjVPKmdHDmBhpq-uA' );
    return xhr.responseText;
}
var token = refreshToken();
console.log(token);
