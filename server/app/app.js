const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const init = (data) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.header('Access-Control-Allow-Headers', 'appid, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });

    app.get('/posts', (request, response) => {
        const page = +request.query.page;
        return data.getPosts(page)
            .then((posts) => {
                return response.json(posts);
            })
    });

    app.get('/posts/:id', (request, response) => {
        const id = +request.params.id;
        return data.getPostById(id)
            .then((post) => {
                return response.json(post);
            })
    });

    app.get('/templates/:name', (request, response) => {
        const name = request.params.name;
        const template = fs.readFileSync(path.join(__dirname, '../../templates/') + name + '.handlebars', 'utf-8');
        return response.json(template);
    });

    return Promise.resolve(app);
};

module.exports = { init };