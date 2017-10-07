import { get as getRequest } from './requester';

const getTemplate = (name) => {
    const url = 'https://news-project.herokuapp.com/templates/' + name;
    return getRequest(url)
        .then((template) => {
            return Promise.resolve(template);
        })
};

export { getTemplate }