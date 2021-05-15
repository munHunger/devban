const http = require("http");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    let req = http.request(
      {
        hostname: "localhost",
        method,
        port: 3000,
        path,
        headers: {
          "Content-Type": "application/json",
        },
        agent: false, // Create a new agent just for this one request
      },
      (res) => {
        var str = "";

        //another chunk of data has been received, so append it to `str`
        res.on("data", function (chunk) {
          str += chunk;
        });

        //the whole response has been received, so we just print it out here
        res.on("end", function () {
          resolve(str);
        });
      }
    );

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function updateStatus(id, newStatus) {
  console.log({
    action: "updateStatus",
    id,
    newStatus,
  });
  request("PUT", "/item.json", {
    action: "updateStatus",
    id,
    newStatus,
  });
}

function newItem(title) {
  request("POST", "/item.json", {
    title,
    status: "to-do",
  });
}

let command = process.argv[2];
switch (command) {
  case "get":
    return request("GET", "/index.json")
      .then((data) => JSON.parse(data))
      .then((data) => console.log(JSON.stringify(data, null, 2)));
  case "new":
    return newItem(process.argv[3]);
  case "update":
    return updateStatus(parseInt(process.argv[3]), process.argv[4]);
}
