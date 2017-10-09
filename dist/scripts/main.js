(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var updateQueryStringParameter=function(e,t,r){var a=new RegExp("([?&])"+t+"=.*?(&|$)","i"),n=-1!==e.indexOf("?")?"&":"?";return e.match(a)?e.replace(a,"$1"+t+"="+r+"$2"):e+n+t+"="+r},getPage=function(){var e=window.location.href;return(e=e.split("page=")).shift(),(e=e.join("")).split("&"),+e[0]},nextPage=function(){var e=getPage()+1;updateQueryStringParameter(window.location.href,"page",e)},prevPage=function(){var e=getPage(),t=e-1;e>1&&updateQueryStringParameter(window.location.href,"page",t)};exports.nextPage=nextPage,exports.prevPage=prevPage,exports.getPage=getPage;
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.setProperUrl=exports.postComment=void 0;var _requester=require("./requester"),setProperUrl=function(e){var t=$(e.target).parent().parent().parent();t.parent().hasClass("subcomments")&&(t=t.parent().parent());var r=$(".comment").index(t);r<0&&(r=-2),window.sessionStorage.setItem("commentIndex",r)},postComment=function(e){var t=+window.location.href.split("posts/")[1].split("/")[0],r={author:$("#form-nickname").val(),imageUrl:$("#form-avatarUrl").val(),content:$("#form-message").val()};(0,_requester.post)("https://news-project.herokuapp.com/posts/"+t+"/comments/"+window.sessionStorage.getItem("commentIndex"),r).then(function(){return getTemplate("selected-post").then(function(e){return rawTemplate=e,getRequest("https://news-project.herokuapp.com/posts/"+t)}).then(function(e){var t=Handlebars.compile(rawTemplate);$("main").html(t({post:e}))})})};exports.postComment=postComment,exports.setProperUrl=setProperUrl;
},{"./requester":6}],3:[function(require,module,exports){
"use strict";var _requester=require("./requester"),_getTemplate=require("./get-template"),_changePage=require("./change-page"),_comments=require("./comments"),_recentPosts=require("./recent-posts");$(document).ready(function(){window.sessionStorage.setItem("commentIndex",-2),$(document).on("click",".prev-page-link",function(){(0,_changePage.prevPage)()}),$(document).on("click",".next-page-link",function(){(0,_changePage.nextPage)()}),$(document).on("click",".reply-button",function(e){(0,_comments.setProperUrl)(e)}),$(document).on("click",".submit-button",function(e){(0,_comments.postComment)(e)}),$(document).on("click",".aside-title",function(e){var t=$(e.target),o=t.parent(),n=t.parent().parent(),s=n.children("li").index(o);t.hasClass("selected-aside-post")||(n.find(".selected-aside-post").removeClass("selected-aside-post"),t.addClass("selected-aside-post"),n.next().children().addClass("hidden"),n.next().children().eq(s).removeClass("hidden"))}),$(document).on("click","#random-post-button",function(e){return(0,_requester.get)("https://news-project.herokuapp.com/posts/length").then(function(e){window.location.href="https://news-project.herokuapp.com/#/posts/"+Math.floor(Math.random()*(e-1)+1)})}),(0,_requester.get)("https://news-project.herokuapp.com/categories").then(function(e){var t={};return t.categories=e,Promise.resolve(t)}).then(function(e){return(0,_getTemplate.getTemplate)("nav").then(function(t){var o={};return o.template=t,o.categories=e.categories,Promise.resolve(o)})}).then(function(e){var t=Handlebars.compile(e.template);$("nav").html(t({categories:e.categories}))})}),Handlebars.registerHelper("ifThird",function(e,t){return 2===e?t.fn(this):t.inverse(this)}),$(document).ready(function(){Sammy("main",function(e){e.get("#/",function(e){var t=+e.params.page;if(t){var o=void 0;(0,_getTemplate.getTemplate)("posts").then(function(e){return o=e,(0,_requester.get)("https://news-project.herokuapp.com/posts?page="+t)}).then(function(e){for(var t=Handlebars.compile(o),n=[],s=1,r=e.maxPage;s<=r;s++)n.push(s);var a=(0,_recentPosts.getLatest)(e.posts);(0,_getTemplate.getTemplate)("footer").then(function(e){var t=Handlebars.compile(e);$("footer").html(t({latestPosts:a,latestPost:a[0]}))});var c=(0,_changePage.getPage)()<e.maxPage,i=(0,_changePage.getPage)()>1;n=n.slice(0,5),$("main").html(t({posts:e.posts,pages:n,canNext:c,canPrev:i}))})}else e.redirect("#/?page=1")}),e.get("#/posts/:id",function(e){var t=+e.params.id,o=void 0,n=void 0;(0,_requester.get)("https://news-project.herokuapp.com/posts").then(function(e){return n=(0,_recentPosts.getLatest)(e.posts),Promise.resolve(n)}).then(function(e){return(0,_getTemplate.getTemplate)("footer")}).then(function(e){var t=Handlebars.compile(e);return $("footer").html(t({latestPosts:n,latestPost:n[0]})),Promise.resolve()}).then(function(){(0,_getTemplate.getTemplate)("selected-post").then(function(e){return o=e,(0,_requester.get)("https://news-project.herokuapp.com/posts/"+t)}).then(function(e){var t=n.slice(0,4),s=Handlebars.compile(o),r=n[Math.floor(Math.random()*(n.length-1)+0)];$("main").html(s({asidePosts:t,latestPosts:n,latestPost:n[0],post:e,randomPost:r}))})})}),e.get("#/categories/:category",function(e){var t=+e.params.page,o=e.params.category,n=void 0,s=void 0;t?(0,_requester.get)("https://news-project.herokuapp.com/posts").then(function(e){return s=(0,_recentPosts.getLatest)(e.posts),Promise.resolve(s)}).then(function(e){return(0,_getTemplate.getTemplate)("footer")}).then(function(e){var t=Handlebars.compile(e);return $("footer").html(t({latestPosts:s,latestPost:s[0]})),Promise.resolve()}).then(function(){(0,_getTemplate.getTemplate)("category").then(function(e){return n=e,(0,_requester.get)("https://news-project.herokuapp.com/categories/"+o)}).then(function(e){for(var t=[],r=1,a=e.maxPage;r<=a;r++)t.push(r);t=t.slice(0,5);var c=s.slice(0,4),i=Handlebars.compile(n),p=s[Math.floor(Math.random()*(s.length-1)+0)];$("main").html(i({asidePosts:c,latestPosts:s,latestPost:s[0],categoryPosts:e.posts,randomPost:p,pages:t,category:o}))})}):e.redirect("#/categories/"+o+"?page=1")}),e.notFound=function(){}}).run("#/")});
},{"./change-page":1,"./comments":2,"./get-template":4,"./recent-posts":5,"./requester":6}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getTemplate=void 0;var _requester=require("./requester"),getTemplate=function(e){var t="https://news-project.herokuapp.com/templates/"+e;return(0,_requester.get)(t).then(function(e){return Promise.resolve(e)})};exports.getTemplate=getTemplate;
},{"./requester":6}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var getMonthNumber=function(e){switch(e){case"Jan":return 1;case"Feb":return 2;case"Mar":return 3;case"Apr":return 4;case"May":return 5;case"Jun":return 6;case"Jul":return 7;case"Aug":return 8;case"Sep":return 9;case"Oct":return 10;case"Nov":return 11;case"Dec":return 12}},getLatest=function(e){return e.sort(function(e,t){return+e.date.year==+t.date.year?getMonthNumber(e.date.month)===getMonthNumber(t.date.month)?+e.date.day+ +t.date.day:getMonthNumber(e.date.month)+getMonthNumber(t.date.month):+e.date.year+ +t.date.year}),e=e.slice(0,7)};exports.getLatest=getLatest;
},{}],6:[function(require,module,exports){
"use strict";function request(e,t,r,n){return new Promise(function(o,s){return $.ajax({url:e,method:t,data:r,headers:n,contentType:"application/json",success:o,error:s})})}function get(e){return request(e,"GET","",arguments.length>1&&void 0!==arguments[1]?arguments[1]:{})}function post(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return request(e,"POST",JSON.stringify(t),r)}function put(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return request(e,"PUT",JSON.stringify(t),r)}function del(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return request(e,"DELETE",JSON.stringify(t),r)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.get=get,exports.post=post,exports.put=put,exports.del=del;
},{}]},{},[3])