var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var HttpStatus = require('http-status-codes');

const config = require('../config/config.json');
let port = config.apiPort || 8080;
let hibpApiUrl = config.hibp.url;

var api = express();

api.get("/api/:version/breach/:email", function (req, res) {
    var url = `${config.hibp.url}/${config.hibp.accounts}/${req.params.email}?truncateResponse=true`;
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'hibpclient' }
    }, function (error, response, body) {
        if (response.statusCode != 200){
            var hipbError = {
                "error": `API call Error: ${response.statusMessage}`,
                "response": response.toJSON()
            };
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({"error": `API call error`, "source": "https://haveibeenpwned.com/"});
            log.error(hipbError);
        } else if (error)
            res.status(HttpStatus.BAD_REQUEST).send({ "error": error });
        else
            res.status(HttpStatus.OK).send({ breaches: body, source: "https://haveibeenpwned.com" });
    });
});

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.listen(port, () => console.log(`API listening on port ${port}`));