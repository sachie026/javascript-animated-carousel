var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require("path");

var dir = path.dirname(fs.realpathSync(__filename));

var mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
  woff: "application/font-woff woff",
};

function onNotFoundPath(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.write("404 Not Found\n");
  res.end();
}

function onDefaultPath(res) {
  res.writeHead(200, { "Content-Type": mime.html });
  fs.createReadStream(dir + "/index.html").pipe(res);
  return;
}

function onJsCssPath(res, pathname, m) {
  var filename = dir + pathname;
  var stats = fs.existsSync(filename) && fs.statSync(filename);
  if (stats && stats.isFile()) {
    res.writeHead(200, {
      "Content-Type": m[1] === "js" ? mime.js : mime.css,
    });
    fs.createReadStream(filename).pipe(res);
    return;
  }
}

function onWoffPath(res, pathname, m) {
  var filename = dir + pathname;
  var stats = fs.existsSync(filename) && fs.statSync(filename);
  var ext = path.extname(filename).slice(1);

  const contentType =
    ext === "woff"
      ? {
          "Content-Type": mime.woff,
        }
      : {};
  if (stats && stats.isFile()) {
    res.writeHead(200, {
      ...contentType,
    });
    fs.createReadStream(filename).pipe(res);
    return;
  }
}

function onImagesPath(res, pathname, m) {
  var filename = dir + pathname;
  var ext = path.extname(filename).slice(1);
  const contentType =
    ext === "svg"
      ? {
          "Content-Type": mime.svg,
        }
      : {}; // {} will handle the case for all the image types internally
  var stats = fs.existsSync(filename) && fs.statSync(filename);
  if (stats && stats.isFile()) {
    res.writeHead(200, {
      ...contentType,
    });
    fs.createReadStream(filename).pipe(res);
    return;
  }
}

http
  .createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var m;
    if (pathname == "/") {
      onDefaultPath(res);
    } else if ((m = pathname.match(/^\/(js|css)\//))) {
      onJsCssPath(res, pathname, m);
    } else if ((m = pathname.match(/^\/(images)\//))) {
      onImagesPath(res, pathname, m);
    } else if ((m = pathname.match(/^\/(font)\//))) {
      onWoffPath(res, pathname, m);
    } else {
      onNotFoundPath(res);
    }
  })
  .listen(8000, "localhost");

console.log("server running on port 8000");
