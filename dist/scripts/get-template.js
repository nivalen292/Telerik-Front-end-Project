"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getTemplate=void 0;var _requester=require("./requester"),getTemplate=function(e){var t="https://news-project.herokuapp.com/templates/"+e;return(0,_requester.get)(t).then(function(e){return Promise.resolve(e)})};exports.getTemplate=getTemplate;