const updateQueryStringParameter = (uri, key, value) => {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

const getPage = () => {
    let url = window.location.href;
    url = url.split('page=');
    url.shift();
    url = url.join('');
    url.split('&');
    const page = url[0];
    return +page;
}


const nextPage = () => {
    let newPage = getPage() + 1;
    updateQueryStringParameter(window.location.href, 'page', newPage);
};

const prevPage = () => {
    let newPage = getPage() - 1;
    if (page > 1) {
        updateQueryStringParameter(window.location.href, 'page', newPage);
    }
};

export { nextPage, prevPage, getPage };