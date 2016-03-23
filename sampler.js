var freeagent_token = '';
var freeagent_url   = 'https://api.sandbox.freeagent.com/v2/';
// Refresh access token on page load but don't do anything else until the request has been processed
// If an access token is found then functionality will be added to the page in the "LoadItUp" method
refreshToken( '3ZmVwTjVPKmdHDmBhpq-uA', 'yF4e7ajdL0M5YPv-Eh3eTg', '1rZkfkZxrhIlWFHrJ7K_P95LBIXzlYJ0rYORQ5ySo' );

/**
 * Generate a new access token before carrying out any requests
 *
 * @returns {XMLHttpRequest}
 */
function refreshToken( client_id, client_secret, refresh_token) {
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

    // Mock up for local @todo Remove when working on freshdesk
    if ( 'local.wordpress.dev' === window.location.hostname ) {
        data = 'utf8=%E2%9C%93&authenticity_token=WhAhKozM8HkolyO3Qa%2BX6cWHBFQqIMjm0cgHVwg%2FiRQ%3D&time_entry%5Bworkable_id%5D=9005487861&time_entry%5Buser_id%5D=9006138143&time_entry%5Bhhmm%5D=01%3A10&time_entry%5Bbillable%5D=0&time_entry%5Bexecuted_at%5D=23+Mar%2C+2016&time_entry%5Bnote%5D=njhgfgjhkb%2Cn';
        displayFreeAgentProjects();
        displayFreeAgentTasks();
        addFreeAgentTimeslip( data );
    } else {

        // @todo add dropdown for freeagent projects
        // @todo add dropdown for hour types - developer/senior
        jQuery( document ).ajaxSend( function ( e, xhr, settings ) {
            if ( '/helpdesk/tickets/390/time_sheets' == settings.url ) {
                if ( 'undefined' !== typeof settings.data && settings.data.indexOf( 'time_entry' ) > 5 ) {
                    addFreeAgentTimeslip( settings.data );
                }
            }
            if ( '/helpdesk/tickets/390/time_sheets/new' == settings.url ) {
                displayFreeAgentProjects();
                displayFreeAgentTasks();
            }
        } );
    }
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
    projects = JSON.parse( this.responseText );
    var html = '<dt><label for="freeagent_project">Project</label></dt>';
    html    += '<dd id="freeagent_projects"><select name="freeagent_project" >';
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
        console.log( 'changed!' );
        refreshTasks( select.val() );
    });
}

/**
 * Insert task list as select box on time entry form
 */
function returnTasks() {
    tasks = JSON.parse( this.responseText );
    var html = '<dt class="freeagent_tasks"><label for="freeagent_task">Task</label></dt>';
    html    += '<dd id="freeagent_tasks" class="freeagent_tasks"><select name="freeagent_task" >';
    if ( tasks.tasks.length > 0 ) {
        jQuery.each( tasks.tasks, function ( key, task ) {
            html += '<option value="' + getIDFromURL( task.url ) + '">' + task.name + '</option>';
        } );
    } else {
        html += '<option value="">No tasks available for current project</option>';
    }
    html += '</select></dd>';
    jQuery( html ).insertAfter( '#add_new_time_entry dl dd#freeagent_projects' );
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
 * Create timeslip in freeagent
 *
 * @param data
 */
function addFreeAgentTimeslip( data ) {
    // @todo parse data
    // @todo create object for freeagent timeslip
    // @todo process request to make/edit timeslip
    console.log( freeagent_token, data );
}


































