var path = require('path');
var fs = require('fs');
var opentype = require('opentype.js');
var svgpath = require('svgpath');

var Captcha = function (text, options) {
    if (!options && typeof text === 'object') {
        options = text;
        text = '';
    }
    if(!options){
        options = {};
    }
    this.width = options.width || 250;
    this.height = options.height || 100;
    this.noise = !!options.noise || true;
    this.fontSize = options.fontSize || 72;
    this.fontScale = 1;
    this.text = text;
    this.font = null;
};

Captcha.prototype.greyColor = function (min, max) {
    min = min || 8;
    max = max || 15;
    var int = this.randomInt(min, max).toString(16) + '';

    return '#' + int + int + int;
};

Captcha.prototype.randomInt = function (min, max) {
    return Math.round(min + (Math.random() * (max - min)));
};

Captcha.prototype.setFontFile = function (fontpath) {
    var aFontPath = path.normalize(path.join(__dirname, fontpath));
    if (!fs.existsSync(aFontPath)) {
        throw "Couldn't find font file: " + aFontPath;
    }
    this.font = opentype.loadSync(aFontPath);
    this.fontScale = 1 / this.font.unitsPerEm * this.fontSize;
    this.fontAscender = this.font.ascender;
    this.fontDescender = this.font.descender;
};

Captcha.prototype.setText = function (text) {
    this.text = text;
};

Captcha.prototype.transformText = function () {
    var i = -1;
    var text = [];
    while (++i < this.text.length) {
        var char = this.text[i];
        var path = this.transformChar(char, i, this.text.length);
        text.push(path);
    }

    return text.join('');
};

Captcha.prototype.transformChar = function (char, i, len) {
     // get char path
        var glyph = this.font.stringToGlyphs(char);
        var width = glyph.advanceWidth ? glyph.advanceWidth * this.fontScale : 0;
        var left = 0 - (width / 2);

        var height = (this.fontAscender + this.fontDescender) * this.fontScale;
        var baseline = (height / 2);
        var path = this.font.getPath(char, left, baseline, this.fontSize, {kerning: true});

        var charPath = path.toPathData();

     // transform
        var number = this.randomInt(1,4);

        var p = svgpath(charPath);

        if(number > 1) p.rotate(this.randomInt(-20, 20));
        if(number > 2) p.skewX(this.randomInt(-10, 20));
        if(number > 3) p.skewY(this.randomInt(-10, 20));
        charPath = p.toString();

    // style it
        var spacing = (this.width - 2) / (len + 1);

        var spacePos = spacing * (i + 1);
        var transform = this.randomInt(spacePos - 2, spacePos + 4);
        var color = this.greyColor(0, 4);

    return '<path fill="' + color + '" d="' + charPath + '" transform="translate(' + transform + ')"/>';

};

Captcha.prototype.toXML = function () {
    if (!this.font) {
        throw "You must set font file first";
    }
    var textData = this.transformText();

    var xml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+[this.width/10,-(this.height/2),this.width,this.height].join(' ')+'" width="' + this.width + '" height="' + this.height + '">' + textData + '</svg>';

    return xml;
};


module.exports = Captcha;