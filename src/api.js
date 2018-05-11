// TODO Consider using a lighter dependency, or no dependency, as jQuery is currently only being used for AJAX.
import $ from "jquery";

const endpoint = 'https://homeexercise.volumental.com/sizingsample';

export function fetchSizes(auth, page = null) {
    const options = {
        method: 'GET',
        url: endpoint,
        headers: {
            "Authorization": "Basic " + btoa(auth.username + ":" + auth.password)
        }
    };

    if (page) {
        options.data = {page};
    }

    const req = $.ajax(options);

    req.fail(response => {
        if (response.status === 401) {
            window.alert('Wrong credentials. Please try again.');
            return;
        }

        if (response.status === 503) {
            window.alert('Could not retrieve sizes from server. Please try again later.')
        }
    });

    return req;
}

// Handles pagination, cycling back to the first page when next-page is not included in the response.
export const nextSizes = (() => {
    let nextPage = null;

    // Returns a function closing over nextPage.
    return auth => {
        const req = fetchSizes(auth, nextPage);

        req.done(response => {
            nextPage = response['next-page'];
        });

        return req;
    }
})();
