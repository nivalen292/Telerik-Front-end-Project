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
            $ul.find('.selected-aside-post').removeClass('selected-aside-post');
            $this.addClass('selected-aside-post');
            $ul.next().children().addClass('hidden');
            $ul.next().children().eq(index).removeClass('hidden');
        }
    });

    $(document).on('click', '#random-post-button', (ev) => {
        return getRequest('https://news-project.herokuapp.com/posts/length')
            .then((len) => {
                window.location.href = 'https://news-project.herokuapp.com/#/posts/' + Math.floor((Math.random() * (len - 1)) + 1);
            })
    });

    getRequest('https://news-project.herokuapp.com/categories')
        .then((categories) => {
            let data = {};
            data.categories = categories;
            return Promise.resolve(data);
        })
        .then((data) => {
            return getTemplate('nav')
                .then((template) => {
                    let obj = {};
                    obj.template = template;
                    obj.categories = data.categories;
                    return Promise.resolve(obj);
                });
        })
        .then((obj) => {
            const compiledTemplate = Handlebars.compile(obj.template);
            $('nav').html(compiledTemplate({
                categories: obj.categories
            }));
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
                        return getRequest('https://news-project.herokuapp.com/posts?page=' + page);
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

        // Selected post
        router.get('#/posts/:id', (data) => {
            const id = +data.params.id;
            let rawTemplate;
            let latestPosts;
            getRequest('https://news-project.herokuapp.com/posts')
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
                    return Promise.resolve();
                })
                .then(() => {
                    getTemplate('selected-post')
                        .then((template) => {
                            rawTemplate = template;
                            return getRequest('https://news-project.herokuapp.com/posts/' + id);
                        })
                        .then((post) => {
                            const asidePosts = latestPosts.slice(0, 4);
                            const compiledTemplate = Handlebars.compile(rawTemplate);
                            const randomPost = latestPosts[Math.floor((Math.random() * (latestPosts.length - 1)) + 0)];
                            $('main').html(compiledTemplate({
                                asidePosts: asidePosts,
                                latestPosts: latestPosts,
                                latestPost: latestPosts[0],
                                post: post,
                                randomPost: randomPost
                            }));
                        });
                });
        });

        // Categories
        router.get('#/categories/:category', (data) => {
            const page = +data.params.page;
            const category = data.params.category;
            let rawTemplate;
            let latestPosts;
            if (!page) {
                data.redirect('#/categories/' + category + '?page=1');
            }
            else {
                getRequest('https://news-project.herokuapp.com/posts')
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
                        return Promise.resolve();
                    })
                    .then(() => {
                        getTemplate('category')
                            .then((template) => {
                                rawTemplate = template;
                                return getRequest('https://news-project.herokuapp.com/categories/' + category);
                            })
                            .then((categoryPostsObj) => {
                                let pages = [];
                                for (let i = 1, len = categoryPostsObj.maxPage; i <= len; i++) {
                                    pages.push(i);
                                }
                                pages = pages.slice(0, 5);

                                const asidePosts = latestPosts.slice(0, 4);
                                const compiledTemplate = Handlebars.compile(rawTemplate);
                                const randomPost = latestPosts[Math.floor((Math.random() * (latestPosts.length - 1)) + 0)];
                                $('main').html(compiledTemplate({
                                    asidePosts: asidePosts,
                                    latestPosts: latestPosts,
                                    latestPost: latestPosts[0],
                                    categoryPosts: categoryPostsObj.posts,
                                    randomPost: randomPost,
                                    pages: pages,
                                    category: category
                                }));
                            });
                    });
            }
        });


        // 404
        router.notFound = () => {

        }
    });
    app.run('#/');
});
