import { get as getRequest } from './requester';
import { post as postRequest } from './requester';
import { getTemplate as getTemplate } from './get-template';

$(document).ready(() => {
    const app = Sammy('main', (router) => {
        router.get('#/', (data) => {
            let rawTemplate;
            getTemplate('posts')
                .then((template) => {
                    rawTemplate = template;
                    return getRequest('http://localhost:3000/posts');
                })
                .then((posts) => {
                    const compiledTemplate = Handlebars.compile(rawTemplate);
                    $('main').html(compiledTemplate({
                        posts: posts
                    }));
                });
        });

        router.get('#/posts', (data) => {
            const page = +data.params.page;
            if (!page) {
                data.redirect('#/posts?page=1');
            }
            else {

            }
        });

        router.get('#/posts/:id', (data) => {
            const id = +data.params.id;
            let rawTemplate;
            getTemplate('selected-post')
                .then((template) => {
                    rawTemplate = template;
                    return getRequest('http://localhost:3000/posts/' + id);
                })
                .then((post) => {
                    const compiledTemplate = Handlebars.compile(rawTemplate);
                    $('main').html(compiledTemplate({
                        post: post
                    }));
                });
        });


        router.notFound = () => {

        }
    });
    app.run('#/');
});
