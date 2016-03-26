// Change these to suit your FreeAgent! (except freeagent_token as this is generated before requests are made)
var freeagent_token = '';
var freeagent_url   = 'https://api.sandbox.freeagent.com/v2/';
var client_id       = '3ZmVwTjVPKmdHDmBhpq-uA';
var client_secret   = 'yF4e7ajdL0M5YPv-Eh3eTg';
var refresh_token   = '1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo';
var freeagent_users = {
    '9006066204' : '1263', // Neil
    '9006066244' : '1263', // Danny
    '9006152662' : '1263', // Darren
    '9006138143' : '1263'  // Joey
};

// Refresh access token on page load but don't do anything else until the request has been processed
// If an access token is found then functionality will be added to the page in the "LoadItUp" method
refreshToken();

/**
 * Generate a new access token before carrying out any requests
 *
 * @returns {XMLHttpRequest}
 */
function refreshToken() {
    var xhr = doRequest( 'POST','token_endpoint' );
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
    xhr.open( method, freeagent_url+url, true );
    return xhr;
}

/**
 * Wrapper function to refresh access token and store the new one locally
 * Using this allows knowledge of whether the access token has been retrieved or not before proceeding
 * If access token is returned
 */
function receiveNewToken() {
    var responseObj  = JSON.parse( this.responseText );
    var access_token = responseObj.access_token;

    // If we have an access token start doing stuff
    if ( 'string' === typeof access_token ) {
        loadItUp( access_token );
    } else {
        console.log( 'FreeAgent access token request failed: ' + this.responseText );
    }
};

/**
 * Set freeagent token up globally and set up method to catch request for adding time
 *
 * @param access_token
 */
function loadItUp( access_token ) {
    freeagent_token = access_token;
    catchXhr();
}

/**
 * Hook into the xhr for adding time and create freeagent timeslip
 */
function catchXhr() {
    // Hook into sent request for time added and use the data in freeagent timeslip
    jQuery( document ).ajaxSend( function ( e, xhr, settings ) {
        if ( '/helpdesk/tickets/390/time_sheets' == settings.url ) {
            if ( 'undefined' !== typeof settings.data && settings.data.indexOf( 'time_entry' ) > 5 ) {
                addFreeAgentTimeslip( settings.data );
            }
        }
    } );
    // Hook into complete request for adding a new timeslip so that html elements are loaded before custom fields are added
    jQuery( document ).ajaxComplete( function ( e, xhr, settings ) {
        if ( '/helpdesk/tickets/390/time_sheets/new' == settings.url ) {
            displayFreeAgentProjects();
            displayFreeAgentTasks();
        }
    } );
};

/**
 * Run query to return projects and output html list on time entry form
 */
function displayFreeAgentProjects() {
    var xhr = doRequest( 'GET', 'projects?view=active' );
    xhr.setRequestHeader( 'Authorization', 'Bearer ' + freeagent_token );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.onload = returnProjects;
    xhr.send();
}

/**
 * Run query to return tasks for current project and output html list on time entry form
 */
function displayFreeAgentTasks() {
    var current_project = jQuery( 'select[name="freeagent_project"]' ).val();
    var xhr             = doRequest( 'GET', 'tasks?project='+freeagent_url+'projects/'+current_project );
    xhr.setRequestHeader( 'Authorization', 'Bearer ' + freeagent_token );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.onload = returnTasks;
    xhr.send();
}

/**
 * Insert project list as select box on time entry form
 */
function returnProjects() {
    var projects = JSON.parse( this.responseText );
    var html     = '<dt><label for="freeagent_project">Project</label></dt>';
    html        += '<dd id="freeagent_projects"><select name="freeagent_project" >';
    if ( projects.projects.length > 0 ) {
        jQuery.each( projects.projects, function ( key, project ) {
            html += '<option value="' + getIDFromURL( project.url ) + '">' + project.name + '</option>';
        } );
    } else {
        html += '<option value="">No projects available</option>';
    }
    html += '</select></dd>';
    jQuery( html ).insertAfter( '#add_new_time_entry dl dd:first-of-type' );
    addProjectChangeEvent();
}

/**
 * Add event to change task list dependant on project chosen
 */
function addProjectChangeEvent() {
    var select = jQuery( 'select[name="freeagent_project"]' );
    select.on( 'change', function() {
        refreshTasks( select.val() );
    });
}

/**
 * Insert task list as select box on time entry form
 */
function returnTasks() {
    var tasks = JSON.parse( this.responseText );
    var error = false;
    var html  = '<dt class="freeagent_tasks"><label for="freeagent_task">Task</label></dt>';
    html     += '<dd id="freeagent_tasks" class="freeagent_tasks"><select name="freeagent_task" >';
    if ( tasks.tasks.length > 0 ) {
        jQuery.each( tasks.tasks, function ( key, task ) {
            html += '<option value="' + getIDFromURL( task.url ) + '">' + task.name + '</option>';
        } );
    } else {
        html += '<option value="">No tasks available for this project</option>';
        error = true;
    }
    html += '</select></dd>';
    jQuery( html ).insertAfter( '#add_new_time_entry dl dd#freeagent_projects' );

    if ( error ) {
        var select = jQuery( 'select[name="freeagent_task"]' );
        select.css( 'color', 'red' );
        select.css( 'border', '1px solid red' );
    }
}

/**
 * Remove task list and replace once new query has been run for chosen project
 */
function refreshTasks() {
    jQuery( '.freeagent_tasks' ).remove();
    displayFreeAgentTasks();
}

/**
 * Return item ID from given URL
 *
 * @param url
 * @returns {*|T}
 */
function getIDFromURL( url ) {
    var parts = url.split( '/' );
    return parts.pop();
}

/**
 * Setup timeslip object
 *
 * @param data
 */
function addFreeAgentTimeslip( data ) {
    var dataObj  = parseQueryString( data );
    var timeslip = {
        'user'     : freeagent_users.user_id,
        'project'  : jQuery( 'select[name="freeagent_project"]' ).val(),
        'task'     : jQuery( 'select[name="freeagent_task"]' ).val(),
        'dated_on' : getFreeAgentDate( dataObj['time_entry[executed_at]'] ),
        'hours'    : dataObj['time_entry[hhmm]'],
        'comment'  : dataObj['time_entry[note]']
    };
    var request = { timeslip : timeslip };
    sendTimeslip( request );
}

/**
 * Create timeslip in freeagent
 *
 * @param timeslip
 */
function sendTimeslip( timeslip ) {
    var xhr = doRequest( 'POST', 'timeslips' );
    xhr.setRequestHeader( 'Authorization', 'Bearer ' + freeagent_token );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.onload = handleTimeslipResponse;
    xhr.send( JSON.stringify( timeslip ) );
}

/**
 * Alert user if timeslip was not created in freeagent
 */
function handleTimeslipResponse() {
    if ( this.status !== 200 || this.status !== 201 ) {
        var response = JSON.parse( this.responseText );
        alert( "Timeslip not created in freeagent: " + response.errors[0].message );
    }
}

/**
 * Parse a query string into a nice neat object
 *
 * @param query
 * @returns {{}}
 */
function parseQueryString( query ) {
    var query_string = {};
    var vars         = query.split( '&' );

    for ( var i = 0; i < vars.length; i++ ) {
        var pair = vars[i].split( '=' );
        pair[0]  = decodeURIComponent( pair[0] );
        pair[1]  = decodeURIComponent( pair[1] );
        // If first entry with this name
        if ( typeof query_string[pair[0]] === 'undefined' ) {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if ( typeof query_string[pair[0]] === 'string' ) {
            query_string[pair[0]] = [ query_string[pair[0]], pair[1] ];
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push( pair[1] );
        }
    }
    return query_string;
};

/**
 * Convert the given date into a date freeagent understands
 *
 * @param date
 * @returns {string}
 */
function getFreeAgentDate( date ) {
    date = date.replace( /\+/g, ' ' );
    date = date.replace( ',', '' );
    date = new Date( date );
    return date.getFullYear() + '-0' + ( date.getMonth()+1 ) + '-' + date.getDate();
}


































