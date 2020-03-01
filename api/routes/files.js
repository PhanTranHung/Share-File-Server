const express = require('express');
const route = express.Router();
const path = require("path")
const fs = require("fs")
 
const directoryPath = path.join('/media/odinson/White_Space')


async function convertToHTML(pathToForder, res){
    let html = "";

    let files = fs.readdirSync(path.join(directoryPath, pathToForder));

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