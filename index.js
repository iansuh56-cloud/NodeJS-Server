const express = require('express');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');

const app = express(); // instance an object of the express module
const port = 3000;



// THIS IS MY CODE NOW

// Set the directory paths for HTML and Markdown files
const htmlDir = path.join(__dirname, '/pages/'); // file locations
const markdownDir = path.join(__dirname, 'collections/docs/');
let mdFiles = fs.readdirSync(markdownDir);
// Middleware to serve HTML files from 'html' directory
app.use('/html', express.static(htmlDir));

fs.readdir(htmlDir, (err, files) => {
    files.forEach(file => {
        if ((file != "index.html") && (file.split(".")[1] == "html")){
            
            const informalName = file.split(".")[0];
            app.get(`/${informalName}`, (req, res) => {
                res.sendFile(path.join(__dirname, `/pages/${file}`));
            });
            console.log(`loaded ${file} at /${informalName}`);
        }
    });
});

// Middleware to serve converted Markdown files from 'markdown' directory
app.get('/collections/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(markdownDir, `${filename}.md`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Markdown file not found');
        }

        // Convert Markdown content to HTML
        const htmlContent = '<link href="/style.css" rel="stylesheet" type="text/css"> ' + `<title>${filename}</title> <div style="float: left;" id="sidebar">
            <a href = "/collections">Back</a>
        </div > <div id='markdownContent'>` + marked(data) + "</div>";
        res.send(htmlContent);
    });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/style.css'));
});


// send collections.html
app.get('/collections', (req, res) => {
    
    //read files path from collections/docs
    CollectionsHtml = `
    <!DOCTYPE html>
    <head>
    <link href="style.css" rel="stylesheet" type="text/css">
    <title>Collections - My Website</title>
    </head>
    <body>
        <div id="container">
            <div id="header">
                <h1>Collections</h1>
                <p style="font-size 4px; text-decoration: none; font-weight: 400 !important;">subtext</p>
            </div>
            <div id="sidebar">
                <a href="/">Home</a>
                <a href="/music">music</a>
            </div>
            <div id="collections">`;
    for(let i = 0; i < mdFiles.length; i++) {
        let file = mdFiles[i];
        let name = file.split(".")[0];
        CollectionsHtml += `<a class="article" href="/collections/${name}">${name}</a>\n`;
       // console.log(CollectionsHtml);
    }
    CollectionsHtml.concat(`</div >
        </div >
    </body >
        <script type="text/javascript src=""></script>
    `);


    res.send(CollectionsHtml);
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
