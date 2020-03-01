const express = require('express');
const route = express.Router();
const path = require("path");
const fs = require("fs");
const config = require('../../config.json');


async function convertToHTML(pathToForder, res){
    let html = "";

    let files = fs.readdirSync(path.join(config.shared_folder, pathToForder));

    files.forEach(function(file) {
        let path1 = path.join('/files', pathToForder, file);
        let a = `<a href="${path1}">${file}</a></br>`;
        html += a;
    });
    res.send(html);
}




route.use('/', (req, res) => {
    
    convertToHTML(req.path, res);
});

module.exports = route;
