Simple SVG captcha
==============

Methods:
* **setText** - update text inside captcha
* **setFontFile** - update font file
* **toXML** - get XML string (SVG)

Express example usage:
```javascript
var express = require('express');
var router = express.Router();
var Captcha = require('./captcha/');

var captcha = new Captcha();
captcha.setFontFile('../fonts/opensans-b.ttf');

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  var text = req.query.text || 'hello';
  
  captcha.setText(text);
  res.send(captcha.toXML()).end();
});
```

Express multiple font-files usage:

```javascript
var express = require('express');
var router = express.Router();
var Captcha = require('./.captcha');

var englishCaptcha = new Captcha();
englishCaptcha.setFontFile('../fonts/opensans-b.ttf');

var chineseCaptcha = new Captcha();
chineseCaptcha.setFontFile('../fonts/chinese.ttf');

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  var text = req.query.text || 'hello';
  var captcha = (text.match(/[\u3400-\u9FBF]/)) ? chineseCaptcha : englishCaptcha;

  captcha.setText(text);
  res.send(captcha.toXML());
});
```

Todo:
* Private methods
* Resize xml
* Position of characters
* toXML isolation

**NB: note, that it's 5 minute solution, not really production-ready (maybe). Use it on your own risk.**