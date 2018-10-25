// add support for Confluence's native Task List feature
// native example:
// https://info.red-gate.com/display/IPS/DRAFT%3A+Implementation+checklist+-+V1
// Scroll Viewport example:
// https://info.red-gate.com/rg/useful-information/company-information/pricing-packaging-information/pricing-and-packagingdocumentation/draft-implementation-checklist-v1

const toggleTaskState = (task, tasklistId) => {
    const endpointBase = 'https://info.red-gate.com/rest/inlinetasks/1/task/';
    const taskId = task.getAttribute('data-inline-task-id');
    const taskEndpoint = `${endpointBase}${tasklistId}/${taskId}/`;

    // determine if we are setting checked or unchecked status
    const status = task.classList.contains('checked') ? 'UNCHECKED' : 'CHECKED';

    // toggle CSS class
    task.classList.toggle('checked');

    // POST request body
    const body = `{ 'status' : '${status}', 'trigger' : 'VIEW_PAGE' }`; 

    fetch(taskEndpoint, {
        'credentials': 'include',
        'headers': {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'pragma': 'no-cache',
            'x-requested-with': 'XMLHttpRequest'
        },
        'referrer': window.location.href,
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': body,
        'method': 'POST',
        'mode': 'cors'
    });
};

const init = () => {
    const tasks = document.querySelectorAll('[data-inline-task-id]');
    
    if (tasks.length) {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const tasklistId = task.parentElement.getAttribute('data-inline-tasks-content-id');
    
            task.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                toggleTaskState(this, tasklistId);
            });
        }
    }
};

export default {
    init
};