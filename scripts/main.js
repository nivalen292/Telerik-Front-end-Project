import { get as getRequest } from './requester';
import { post as postRequest } from './requester';
import { getTemplate as getTemplate } from './get-template';
import { nextPage as nextPage, prevPage as prevPage, getPage as getPage } from './change-page';
import { postComment as postComment, setProperUrl as setProperUrl } from './comments';
import { getLatest } from './recent-posts';


$(document).ready(() => {

    window.sessionStorage.setItem('commentIndex', -2);

    $(document).on('click', '.prev-page-link', () => {
        prevPage();
    });

    $(document).on('click', '.next-page-link', () => {
        nextPage();
    });

    $(document).on('click', '.reply-button', (ev) => {
        setProperUrl(ev);
    });

    $(document).on('click', '.submit-button', (ev) => {
        postComment(ev);
    });

    $(document).on('click', '.aside-title', (ev) => {
        const $this = $(ev.target);
        const $li = $this.parent();
        const $ul = $this.parent().parent();
        const index = $ul.children('li').index($li);

        if (!$this.hasClass('selected-aside-post')) {
            $ul.children('.selected-aside-post').removeClass('selected-aside-post');
        }
    });

});

Handlebars.registerHelper('ifThird', function (index, options) {
    if (index === 2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

$(document).ready(() => {
    const app = Sammy('main', (router) => {

        // Home page
        router.get('#/', (data) => {
            const page = +data.params.page;
            if (!page) {
                data.redirect('#/?page=1');
            }
            else {
                let rawTemplate;
                getTemplate('posts')
                    .then((template) => {
                        rawTemplate = template;
                        return getRequest('http://localhost:3000/posts?page=' + page);
                    })
                    .then((dataObj) => {
                        const compiledTemplate = Handlebars.compile(rawTemplate);
                        let pages = [];
                        for (let i = 1, len = dataObj.maxPage; i <= len; i++) {
                            pages.push(i);
                        }
                        const latestPosts = getLatest(dataObj.posts);
                        getTemplate('footer')
                            .then((footerTemplate) => {
                                const compiledTemplate = Handlebars.compile(footerTemplate);
                                $('footer').html(compiledTemplate({
                                    latestPosts: latestPosts,
                                    latestPost: latestPosts[0]
                                }));
                            });
                        const canNext = getPage() < dataObj.maxPage;
                        const canPrev = getPage() > 1;
                        pages = pages.slice(0, 5);
                        $('main').html(compiledTemplate({
                            posts: dataObj.posts,
                            pages: pages,
                            canNext: canNext,
                            canPrev: canPrev
                        }));
                    });
            }
        });

        // Categories
        router.get('#/posts', (data) => {
            const page = +data.params.page;
            if (!page) {
                data.redirect('#/posts?page=1');
            }
            else {

            }
        });

        // Selected post
        router.get('#/posts/:id', (data) => {
            const id = +data.params.id;
            let rawTemplate;
            let latestPosts;
            getRequest('http://localhost:3000/posts')
                .then((postsObj) => {
                    latestPosts = getLatest(postsObj.posts);
                    return Promise.resolve(latestPosts);
                })
                .then((latestPosts) => {
                    return getTemplate('footer')
                })
                .then((footerTemplate) => {
                    const compiledTemplate = Handlebars.compile(footerTemplate);
                    $('footer').html(compiledTemplate({
                        latestPosts: latestPosts,
                        latestPost: latestPosts[0]
                    }));
                });
            getTemplate('selected-post')
                .then((template) => {
                    rawTemplate = template;
                    return getRequest('http://localhost:3000/posts/' + id);
                })
                .then((post) => {
                    const asidePosts = latestPosts.slice(0, 4);
                    const compiledTemplate = Handlebars.compile(rawTemplate);
                    const randomPost = latestPosts[Math.floor((Math.random() * (latestPosts.length - 1)) + 0)]
                    $('main').html(compiledTemplate({
                        asidePosts: asidePosts,
                        latestPosts: latestPosts,
                        latestPost: latestPosts[0],
                        post: post,
                        randomPost: randomPost
                    }));
                });
        });

        // 404
        router.notFound = () => {

        }
    });
    app.run('#/');
});
