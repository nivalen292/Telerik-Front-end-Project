import { get as getRequest } from './requester';

const getTemplate = (name) => {
    const url = 'http://localhost:3000/templates/' + name;
    return getRequest(url)
        .then((template) => {
            return Promise.resolve(template);
        })
};

export { getTemplate }