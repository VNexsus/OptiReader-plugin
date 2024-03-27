/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}

// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }
  return parts.join('');
}

/***/ }),

/***/ "./node_modules/bmp-js/index.js":
/*!**************************************!*\
  !*** ./node_modules/bmp-js/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author shaozilee
 *
 * support 1bit 4bit 8bit 24bit decode
 * encode with 24bit
 * 
 */

var encode = __webpack_require__(/*! ./lib/encoder */ "./node_modules/bmp-js/lib/encoder.js"),
  decode = __webpack_require__(/*! ./lib/decoder */ "./node_modules/bmp-js/lib/decoder.js");
module.exports = {
  encode: encode,
  decode: decode
};

/***/ }),

/***/ "./node_modules/bmp-js/lib/decoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/decoder.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */

function BmpDecoder(buffer, is_with_alpha) {
  this.pos = 0;
  this.buffer = buffer;
  this.is_with_alpha = !!is_with_alpha;
  this.bottom_up = true;
  this.flag = this.buffer.toString("utf-8", 0, this.pos += 2);
  if (this.flag != "BM") throw new Error("Invalid BMP File");
  this.parseHeader();
  this.parseRGBA();
}
BmpDecoder.prototype.parseHeader = function () {
  this.fileSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.reserved = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.offset = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.headerSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.width = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.height = this.buffer.readInt32LE(this.pos);
  this.pos += 4;
  this.planes = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.bitPP = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.compress = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.rawSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.hr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.vr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.colors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.importantColors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  if (this.bitPP === 16 && this.is_with_alpha) {
    this.bitPP = 15;
  }
  if (this.bitPP < 15) {
    var len = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(len);
    for (var i = 0; i < len; i++) {
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var quad = this.buffer.readUInt8(this.pos++);
      this.palette[i] = {
        red: red,
        green: green,
        blue: blue,
        quad: quad
      };
    }
  }
  if (this.height < 0) {
    this.height *= -1;
    this.bottom_up = false;
  }
};
BmpDecoder.prototype.parseRGBA = function () {
  var bitn = "bit" + this.bitPP;
  var len = this.width * this.height * 4;
  this.data = new Buffer(len);
  this[bitn]();
};
BmpDecoder.prototype.bit1 = function () {
  var xlen = Math.ceil(this.width / 8);
  var mode = xlen % 4;
  var y = this.height >= 0 ? this.height - 1 : -this.height;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < xlen; x++) {
      var b = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x * 8 * 4;
      for (var i = 0; i < 8; i++) {
        if (x * 8 + i < this.width) {
          var rgb = this.palette[b >> 7 - i & 0x1];
          this.data[location + i * 4] = 0;
          this.data[location + i * 4 + 1] = rgb.blue;
          this.data[location + i * 4 + 2] = rgb.green;
          this.data[location + i * 4 + 3] = rgb.red;
        } else {
          break;
        }
      }
    }
    if (mode != 0) {
      this.pos += 4 - mode;
    }
  }
};
BmpDecoder.prototype.bit4 = function () {
  //RLE-4
  if (this.compress == 2) {
    var setPixelData = function setPixelData(rgbIndex) {
      var rgb = this.palette[rgbIndex];
      this.data[location] = 0;
      this.data[location + 1] = rgb.blue;
      this.data[location + 2] = rgb.green;
      this.data[location + 3] = rgb.red;
      location += 4;
    };
    this.data.fill(0xff);
    var location = 0;
    var lines = this.bottom_up ? this.height - 1 : 0;
    var low_nibble = false; //for all count of pixel

    while (location < this.data.length) {
      var a = this.buffer.readUInt8(this.pos++);
      var b = this.buffer.readUInt8(this.pos++);
      //absolute mode
      if (a == 0) {
        if (b == 0) {
          //line end
          if (this.bottom_up) {
            lines--;
          } else {
            lines++;
          }
          location = lines * this.width * 4;
          low_nibble = false;
          continue;
        } else if (b == 1) {
          //image end
          break;
        } else if (b == 2) {
          //offset x,y
          var x = this.buffer.readUInt8(this.pos++);
          var y = this.buffer.readUInt8(this.pos++);
          if (this.bottom_up) {
            lines -= y;
          } else {
            lines += y;
          }
          location += y * this.width * 4 + x * 4;
        } else {
          var c = this.buffer.readUInt8(this.pos++);
          for (var i = 0; i < b; i++) {
            if (low_nibble) {
              setPixelData.call(this, c & 0x0f);
            } else {
              setPixelData.call(this, (c & 0xf0) >> 4);
            }
            if (i & 1 && i + 1 < b) {
              c = this.buffer.readUInt8(this.pos++);
            }
            low_nibble = !low_nibble;
          }
          if ((b + 1 >> 1 & 1) == 1) {
            this.pos++;
          }
        }
      } else {
        //encoded mode
        for (var i = 0; i < a; i++) {
          if (low_nibble) {
            setPixelData.call(this, b & 0x0f);
          } else {
            setPixelData.call(this, (b & 0xf0) >> 4);
          }
          low_nibble = !low_nibble;
        }
      }
    }
  } else {
    var xlen = Math.ceil(this.width / 2);
    var mode = xlen % 4;
    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;
      for (var x = 0; x < xlen; x++) {
        var b = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 2 * 4;
        var before = b >> 4;
        var after = b & 0x0F;
        var rgb = this.palette[before];
        this.data[location] = 0;
        this.data[location + 1] = rgb.blue;
        this.data[location + 2] = rgb.green;
        this.data[location + 3] = rgb.red;
        if (x * 2 + 1 >= this.width) break;
        rgb = this.palette[after];
        this.data[location + 4] = 0;
        this.data[location + 4 + 1] = rgb.blue;
        this.data[location + 4 + 2] = rgb.green;
        this.data[location + 4 + 3] = rgb.red;
      }
      if (mode != 0) {
        this.pos += 4 - mode;
      }
    }
  }
};
BmpDecoder.prototype.bit8 = function () {
  //RLE-8
  if (this.compress == 1) {
    var setPixelData = function setPixelData(rgbIndex) {
      var rgb = this.palette[rgbIndex];
      this.data[location] = 0;
      this.data[location + 1] = rgb.blue;
      this.data[location + 2] = rgb.green;
      this.data[location + 3] = rgb.red;
      location += 4;
    };
    this.data.fill(0xff);
    var location = 0;
    var lines = this.bottom_up ? this.height - 1 : 0;
    while (location < this.data.length) {
      var a = this.buffer.readUInt8(this.pos++);
      var b = this.buffer.readUInt8(this.pos++);
      //absolute mode
      if (a == 0) {
        if (b == 0) {
          //line end
          if (this.bottom_up) {
            lines--;
          } else {
            lines++;
          }
          location = lines * this.width * 4;
          continue;
        } else if (b == 1) {
          //image end
          break;
        } else if (b == 2) {
          //offset x,y
          var x = this.buffer.readUInt8(this.pos++);
          var y = this.buffer.readUInt8(this.pos++);
          if (this.bottom_up) {
            lines -= y;
          } else {
            lines += y;
          }
          location += y * this.width * 4 + x * 4;
        } else {
          for (var i = 0; i < b; i++) {
            var c = this.buffer.readUInt8(this.pos++);
            setPixelData.call(this, c);
          }
          if (b & 1 == 1) {
            this.pos++;
          }
        }
      } else {
        //encoded mode
        for (var i = 0; i < a; i++) {
          setPixelData.call(this, b);
        }
      }
    }
  } else {
    var mode = this.width % 4;
    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;
      for (var x = 0; x < this.width; x++) {
        var b = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;
        if (b < this.palette.length) {
          var rgb = this.palette[b];
          this.data[location] = 0;
          this.data[location + 1] = rgb.blue;
          this.data[location + 2] = rgb.green;
          this.data[location + 3] = rgb.red;
        } else {
          this.data[location] = 0;
          this.data[location + 1] = 0xFF;
          this.data[location + 2] = 0xFF;
          this.data[location + 3] = 0xFF;
        }
      }
      if (mode != 0) {
        this.pos += 4 - mode;
      }
    }
  }
};
BmpDecoder.prototype.bit15 = function () {
  var dif_w = this.width % 3;
  var _11111 = parseInt("11111", 2),
    _1_5 = _11111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var B = this.buffer.readUInt16LE(this.pos);
      this.pos += 2;
      var blue = (B & _1_5) / _1_5 * 255 | 0;
      var green = (B >> 5 & _1_5) / _1_5 * 255 | 0;
      var red = (B >> 10 & _1_5) / _1_5 * 255 | 0;
      var alpha = B >> 15 ? 0xFF : 0x00;
      var location = line * this.width * 4 + x * 4;
      this.data[location] = alpha;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};
BmpDecoder.prototype.bit16 = function () {
  var dif_w = this.width % 2 * 2;
  //default xrgb555
  this.maskRed = 0x7C00;
  this.maskGreen = 0x3E0;
  this.maskBlue = 0x1F;
  this.mask0 = 0;
  if (this.compress == 3) {
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
  }
  var ns = [0, 0, 0];
  for (var i = 0; i < 16; i++) {
    if (this.maskRed >> i & 0x01) ns[0]++;
    if (this.maskGreen >> i & 0x01) ns[1]++;
    if (this.maskBlue >> i & 0x01) ns[2]++;
  }
  ns[1] += ns[0];
  ns[2] += ns[1];
  ns[0] = 8 - ns[0];
  ns[1] -= 8;
  ns[2] -= 8;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var B = this.buffer.readUInt16LE(this.pos);
      this.pos += 2;
      var blue = (B & this.maskBlue) << ns[0];
      var green = (B & this.maskGreen) >> ns[1];
      var red = (B & this.maskRed) >> ns[2];
      var location = line * this.width * 4 + x * 4;
      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};
BmpDecoder.prototype.bit24 = function () {
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      //Little Endian rgb
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += this.width % 4;
  }
};

/**
 * add 32bit decode func
 * @author soubok
 */
BmpDecoder.prototype.bit32 = function () {
  //BI_BITFIELDS
  if (this.compress == 3) {
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;
      for (var x = 0; x < this.width; x++) {
        //Little Endian rgba
        var alpha = this.buffer.readUInt8(this.pos++);
        var blue = this.buffer.readUInt8(this.pos++);
        var green = this.buffer.readUInt8(this.pos++);
        var red = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;
        this.data[location] = alpha;
        this.data[location + 1] = blue;
        this.data[location + 2] = green;
        this.data[location + 3] = red;
      }
    }
  } else {
    for (var y = this.height - 1; y >= 0; y--) {
      var line = this.bottom_up ? y : this.height - 1 - y;
      for (var x = 0; x < this.width; x++) {
        //Little Endian argb
        var blue = this.buffer.readUInt8(this.pos++);
        var green = this.buffer.readUInt8(this.pos++);
        var red = this.buffer.readUInt8(this.pos++);
        var alpha = this.buffer.readUInt8(this.pos++);
        var location = line * this.width * 4 + x * 4;
        this.data[location] = alpha;
        this.data[location + 1] = blue;
        this.data[location + 2] = green;
        this.data[location + 3] = red;
      }
    }
  }
};
BmpDecoder.prototype.getData = function () {
  return this.data;
};
module.exports = function (bmpData) {
  var decoder = new BmpDecoder(bmpData);
  return decoder;
};

/***/ }),

/***/ "./node_modules/bmp-js/lib/encoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/encoder.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/**
 * @author shaozilee
 *
 * BMP format encoder,encode 24bit BMP
 * Not support quality compression
 *
 */

function BmpEncoder(imgData) {
  this.buffer = imgData.data;
  this.width = imgData.width;
  this.height = imgData.height;
  this.extraBytes = this.width % 4;
  this.rgbSize = this.height * (3 * this.width + this.extraBytes);
  this.headerInfoSize = 40;
  this.data = [];
  /******************header***********************/
  this.flag = "BM";
  this.reserved = 0;
  this.offset = 54;
  this.fileSize = this.rgbSize + this.offset;
  this.planes = 1;
  this.bitPP = 24;
  this.compress = 0;
  this.hr = 0;
  this.vr = 0;
  this.colors = 0;
  this.importantColors = 0;
}
BmpEncoder.prototype.encode = function () {
  var tempBuffer = new Buffer(this.offset + this.rgbSize);
  this.pos = 0;
  tempBuffer.write(this.flag, this.pos, 2);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.fileSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.reserved, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.offset, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.headerInfoSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.width, this.pos);
  this.pos += 4;
  tempBuffer.writeInt32LE(-this.height, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt16LE(this.planes, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt16LE(this.bitPP, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.compress, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.rgbSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.hr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.vr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.colors, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.importantColors, this.pos);
  this.pos += 4;
  var i = 0;
  var rowBytes = 3 * this.width + this.extraBytes;
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var p = this.pos + y * rowBytes + x * 3;
      i++; //a
      tempBuffer[p] = this.buffer[i++]; //b
      tempBuffer[p + 1] = this.buffer[i++]; //g
      tempBuffer[p + 2] = this.buffer[i++]; //r
    }

    if (this.extraBytes > 0) {
      var fillOffset = this.pos + y * rowBytes + this.width * 3;
      tempBuffer.fill(0, fillOffset, fillOffset + this.extraBytes);
    }
  }
  return tempBuffer;
};
module.exports = function (imgData, quality) {
  if (typeof quality === 'undefined') quality = 100;
  var encoder = new BmpEncoder(imgData);
  var data = encoder.encode();
  return {
    data: data,
    width: imgData.width,
    height: imgData.height
  };
};

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js");
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");
var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
: null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
  console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}
function typedArraySupport() {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1);
    var proto = {
      foo: function foo() {
        return 42;
      }
    };
    Object.setPrototypeOf(proto, Uint8Array.prototype);
    Object.setPrototypeOf(arr, proto);
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}
Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.buffer;
  }
});
Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.byteOffset;
  }
});
function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"');
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError('The "string" argument must be of type string. Received type number');
    }
    return allocUnsafe(arg);
  }
  return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192; // not used by this implementation

function from(value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset);
  }
  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value);
  }
  if (value == null) {
    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
  }
  if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('The "value" argument must not be of type number. Received type number');
  }
  var valueOf = value.valueOf && value.valueOf();
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length);
  }
  var b = fromObject(value);
  if (b) return b;
  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
  }
  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number');
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"');
  }
}
function alloc(size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
  }
  return createBuffer(size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size);
};
function fromString(string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }
  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }
  var length = byteLength(string, encoding) | 0;
  var buf = createBuffer(length);
  var actual = buf.write(string, encoding);
  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }
  return buf;
}
function fromArrayLike(array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(length);
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf;
}
function fromArrayView(arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView);
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
  }
  return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds');
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds');
  }
  var buf;
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}
function fromObject(obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(len);
    if (buf.length === 0) {
      return buf;
    }
    obj.copy(buf, 0, 0, len);
    return buf;
  }
  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0);
    }
    return fromArrayLike(obj);
  }
  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data);
  }
}
function checked(length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }
  return length | 0;
}
function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
  return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.compare = function compare(a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
  }
  if (a === b) return 0;
  var x = a.length;
  var y = b.length;
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};
Buffer.concat = function concat(list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list.length === 0) {
    return Buffer.alloc(0);
  }
  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }
  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
        buf.copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(buffer, buf, pos);
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    } else {
      buf.copy(buffer, pos);
    }
    pos += buf.length;
  }
  return buffer;
};
function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + _typeof(string));
  }
  var len = string.length;
  var mustMatch = arguments.length > 2 && arguments[2] === true;
  if (!mustMatch && len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
        }

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }
  if (end === undefined || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return '';
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return '';
  }
  if (!encoding) encoding = 'utf8';
  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);
      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);
      case 'ascii':
        return asciiSlice(this, start, end);
      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);
      case 'base64':
        return base64Slice(this, start, end);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};
Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};
Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};
Buffer.prototype.toString = function toString() {
  var length = this.length;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
  if (this.length > max) str += ' ... ';
  return '<Buffer ' + str + '>';
};
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength);
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + _typeof(target));
  }
  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);
  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }
  return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  var i;
  for (i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }
  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }
  if (!encoding) encoding = 'utf8';
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);
      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);
      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length);
      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};
Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte = void 0,
        thirdByte = void 0,
        fourthByte = void 0,
        tempCodePoint = void 0;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]];
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start) end = start;
  var newBuf = this.subarray(start, end);
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype);
  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }
  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }
  return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var lo = first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24);
  var hi = this[++offset] + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + last * Math.pow(2, 24);
  return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var hi = first * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  var lo = this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last;
  return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var val = this[offset + 4] + this[offset + 5] * Math.pow(2, 8) + this[offset + 6] * Math.pow(2, 16) + (last << 24); // Overflow

  return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24));
});
Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var val = (first << 24) +
  // Overflow
  this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last);
});
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }
  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }
  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = value & 0xff;
  return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = value >>> 24;
  this[offset + 2] = value >>> 16;
  this[offset + 1] = value >>> 8;
  this[offset] = value & 0xff;
  return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};
function wrtBigUInt64LE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset;
}
function wrtBigUInt64BE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset + 7] = lo;
  lo = lo >> 8;
  buf[offset + 6] = lo;
  lo = lo >> 8;
  buf[offset + 5] = lo;
  lo = lo >> 8;
  buf[offset + 4] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset + 3] = hi;
  hi = hi >> 8;
  buf[offset + 2] = hi;
  hi = hi >> 8;
  buf[offset + 1] = hi;
  hi = hi >> 8;
  buf[offset] = hi;
  return offset + 8;
}
Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }
  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }
  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  this[offset + 2] = value >>> 16;
  this[offset + 3] = value >>> 24;
  return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};
Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  var len = end - start;
  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
  }
  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } else if (typeof val === 'boolean') {
    val = Number(val);
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
    var len = bytes.length;
    if (len === 0) {
      throw new TypeError('The value "' + val + '" is invalid for argument "value"');
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
};

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
var errors = {};
function E(sym, getMessage, Base) {
  errors[sym] = /*#__PURE__*/function (_Base) {
    _inherits(NodeError, _Base);
    var _super = _createSuper(NodeError);
    function NodeError() {
      var _this;
      _classCallCheck(this, NodeError);
      _this = _super.call(this);
      Object.defineProperty(_assertThisInitialized(_this), 'message', {
        value: getMessage.apply(_assertThisInitialized(_this), arguments),
        writable: true,
        configurable: true
      });

      // Add the error code to the name to include it in the stack trace.
      _this.name = "".concat(_this.name, " [").concat(sym, "]");
      // Access the stack to generate the error message including the error code
      // from the name.
      _this.stack; // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete _this.name;
      return _this;
    }
    _createClass(NodeError, [{
      key: "code",
      get: function get() {
        return sym;
      },
      set: function set(value) {
        Object.defineProperty(this, 'code', {
          configurable: true,
          enumerable: true,
          value: value,
          writable: true
        });
      }
    }, {
      key: "toString",
      value: function toString() {
        return "".concat(this.name, " [").concat(sym, "]: ").concat(this.message);
      }
    }]);
    return NodeError;
  }(Base);
}
E('ERR_BUFFER_OUT_OF_BOUNDS', function (name) {
  if (name) {
    return "".concat(name, " is outside of buffer bounds");
  }
  return 'Attempt to access memory outside buffer bounds';
}, RangeError);
E('ERR_INVALID_ARG_TYPE', function (name, actual) {
  return "The \"".concat(name, "\" argument must be of type number. Received type ").concat(_typeof(actual));
}, TypeError);
E('ERR_OUT_OF_RANGE', function (str, range, input) {
  var msg = "The value of \"".concat(str, "\" is out of range.");
  var received = input;
  if (Number.isInteger(input) && Math.abs(input) > Math.pow(2, 32)) {
    received = addNumericalSeparator(String(input));
  } else if (typeof input === 'bigint') {
    received = String(input);
    if (input > Math.pow(BigInt(2), BigInt(32)) || input < -Math.pow(BigInt(2), BigInt(32))) {
      received = addNumericalSeparator(received);
    }
    received += 'n';
  }
  msg += " It must be ".concat(range, ". Received ").concat(received);
  return msg;
}, RangeError);
function addNumericalSeparator(val) {
  var res = '';
  var i = val.length;
  var start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = "_".concat(val.slice(i - 3, i)).concat(res);
  }
  return "".concat(val.slice(0, i)).concat(res);
}

// CHECK FUNCTIONS
// ===============

function checkBounds(buf, offset, byteLength) {
  validateNumber(offset, 'offset');
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1));
  }
}
function checkIntBI(value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    var n = typeof min === 'bigint' ? 'n' : '';
    var range;
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = ">= 0".concat(n, " and < 2").concat(n, " ** ").concat((byteLength + 1) * 8).concat(n);
      } else {
        range = ">= -(2".concat(n, " ** ").concat((byteLength + 1) * 8 - 1).concat(n, ") and < 2 ** ") + "".concat((byteLength + 1) * 8 - 1).concat(n);
      }
    } else {
      range = ">= ".concat(min).concat(n, " and <= ").concat(max).concat(n);
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value);
  }
  checkBounds(buf, offset, byteLength);
}
function validateNumber(value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
  }
}
function boundsError(value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type);
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
  }
  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
  }
  throw new errors.ERR_OUT_OF_RANGE(type || 'offset', ">= ".concat(type ? 1 : 0, " and <= ").concat(length), value);
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0];
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;
        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }
    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  var i;
  for (i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
  return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
  // For IE11 support
  return obj !== obj; // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = function () {
  var alphabet = '0123456789abcdef';
  var table = new Array(256);
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16;
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }
  return table;
}();

// Return not function with Error if BigInt not supported
function defineBigIntMethod(fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
}
function BufferBigIntNotDefined() {
  throw new Error('BigInt not supported');
}

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
  buffer[offset + i - d] |= s * 128;
};

/***/ }),

/***/ "./node_modules/is-electron/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-electron/index.js ***!
  \*******************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
// https://github.com/electron/electron/issues/2288
function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  }

  // Main process
  if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && !!process.versions.electron) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to false
  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }
  return false;
}
module.exports = isElectron;

/***/ }),

/***/ "./node_modules/is-url/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-url/index.js ***!
  \**************************************/
/***/ ((module) => {

/**
 * Expose `isUrl`.
 */

module.exports = isUrl;

/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */

var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isUrl(string) {
  if (typeof string !== 'string') {
    return false;
  }
  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }
  return false;
}

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) {
    obj[key] = desc.value;
  };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    });
    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: true
  });
  defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: true
  });
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };
  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }
        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }
    var previousPromise;
    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", {
      value: enqueue
    });
  }
  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };
  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }
      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }
      context.method = method;
      context.arg = arg;
      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }
          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }
        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;
          if (record.arg === ContinueSentinel) {
            continue;
          }
          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);
        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }
    var info = record.arg;
    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }
    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    if (1 in locs) {
      entry.catchLoc = locs[1];
    }
    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }
    this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }
  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }
  exports.keys = function (val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }
      if (typeof iterable.next === "function") {
        return iterable;
      }
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }
            next.value = undefined;
            next.done = true;
            return next;
          };
        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return {
      next: doneResult
    };
  }
  exports.values = values;
  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }
  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);
      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }
      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }
        return !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;
        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }
      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;
      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }
      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }
      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };
      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }
      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;
}(
// If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? 0 : _typeof(module)) === "object" ? module.exports : {});
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/wasm-feature-detect/dist/esm/index.js":
/*!************************************************************!*\
  !*** ./node_modules/wasm-feature-detect/dist/esm/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigInt": () => (/* binding */ bigInt),
/* harmony export */   "bulkMemory": () => (/* binding */ bulkMemory),
/* harmony export */   "exceptions": () => (/* binding */ exceptions),
/* harmony export */   "multiValue": () => (/* binding */ multiValue),
/* harmony export */   "mutableGlobals": () => (/* binding */ mutableGlobals),
/* harmony export */   "referenceTypes": () => (/* binding */ referenceTypes),
/* harmony export */   "saturatedFloatToInt": () => (/* binding */ saturatedFloatToInt),
/* harmony export */   "signExtensions": () => (/* binding */ signExtensions),
/* harmony export */   "simd": () => (/* binding */ simd),
/* harmony export */   "tailCall": () => (/* binding */ tailCall),
/* harmony export */   "threads": () => (/* binding */ threads)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var bigInt = function bigInt() {
    return function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return WebAssembly.instantiate(e);
            case 3:
              _context.t0 = _context.sent.instance.exports.b(BigInt(0));
              _context.t1 = BigInt(0);
              return _context.abrupt("return", _context.t0 === _context.t1);
            case 8:
              _context.prev = 8;
              _context.t2 = _context["catch"](0);
              return _context.abrupt("return", !1);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 8]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 126, 1, 126, 3, 2, 1, 0, 7, 5, 1, 1, 98, 0, 0, 10, 6, 1, 4, 0, 32, 0, 11]));
  },
  bulkMemory = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 3, 1, 0, 1, 10, 14, 1, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11])));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function bulkMemory() {
      return _ref2.apply(this, arguments);
    };
  }(),
  exceptions = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 6, 64, 25, 11, 11])));
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function exceptions() {
      return _ref3.apply(this, arguments);
    };
  }(),
  multiValue = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 0, 2, 127, 127, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 65, 0, 11])));
          case 1:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function multiValue() {
      return _ref4.apply(this, arguments);
    };
  }(),
  mutableGlobals = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 2, 8, 1, 1, 97, 1, 98, 3, 127, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 5, 1, 1, 97, 3, 1])));
          case 1:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function mutableGlobals() {
      return _ref5.apply(this, arguments);
    };
  }(),
  referenceTypes = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 7, 1, 5, 0, 208, 112, 26, 11])));
          case 1:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function referenceTypes() {
      return _ref6.apply(this, arguments);
    };
  }(),
  saturatedFloatToInt = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 12, 1, 10, 0, 67, 0, 0, 0, 0, 252, 0, 26, 11])));
          case 1:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function saturatedFloatToInt() {
      return _ref7.apply(this, arguments);
    };
  }(),
  signExtensions = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 192, 26, 11])));
          case 1:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function signExtensions() {
      return _ref8.apply(this, arguments);
    };
  }(),
  simd = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11])));
          case 1:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function simd() {
      return _ref9.apply(this, arguments);
    };
  }(),
  tailCall = /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt("return", WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 6, 1, 4, 0, 18, 0, 11])));
          case 1:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return function tailCall() {
      return _ref10.apply(this, arguments);
    };
  }(),
  threads = function threads() {
    return function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(e) {
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              return _context11.abrupt("return", ("undefined" != typeof MessageChannel && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e)));
            case 4:
              _context11.prev = 4;
              _context11.t0 = _context11["catch"](0);
              return _context11.abrupt("return", !1);
            case 7:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[0, 4]]);
      }));
      return function (_x2) {
        return _ref11.apply(this, arguments);
      };
    }()(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
  };

/***/ }),

/***/ "./node_modules/zlibjs/bin/node-zlib.js":
/*!**********************************************!*\
  !*** ./node_modules/zlibjs/bin/node-zlib.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function () {
  'use strict';

  function q(b) {
    throw b;
  }
  var t = void 0,
    v = !0;
  var B = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView;
  function G(b, a) {
    this.index = "number" === typeof a ? a : 0;
    this.m = 0;
    this.buffer = b instanceof (B ? Uint8Array : Array) ? b : new (B ? Uint8Array : Array)(32768);
    2 * this.buffer.length <= this.index && q(Error("invalid index"));
    this.buffer.length <= this.index && this.f();
  }
  G.prototype.f = function () {
    var b = this.buffer,
      a,
      c = b.length,
      d = new (B ? Uint8Array : Array)(c << 1);
    if (B) d.set(b);else for (a = 0; a < c; ++a) d[a] = b[a];
    return this.buffer = d;
  };
  G.prototype.d = function (b, a, c) {
    var d = this.buffer,
      e = this.index,
      f = this.m,
      g = d[e],
      k;
    c && 1 < a && (b = 8 < a ? (I[b & 255] << 24 | I[b >>> 8 & 255] << 16 | I[b >>> 16 & 255] << 8 | I[b >>> 24 & 255]) >> 32 - a : I[b] >> 8 - a);
    if (8 > a + f) g = g << a | b, f += a;else for (k = 0; k < a; ++k) g = g << 1 | b >> a - k - 1 & 1, 8 === ++f && (f = 0, d[e++] = I[g], g = 0, e === d.length && (d = this.f()));
    d[e] = g;
    this.buffer = d;
    this.m = f;
    this.index = e;
  };
  G.prototype.finish = function () {
    var b = this.buffer,
      a = this.index,
      c;
    0 < this.m && (b[a] <<= 8 - this.m, b[a] = I[b[a]], a++);
    B ? c = b.subarray(0, a) : (b.length = a, c = b);
    return c;
  };
  var aa = new (B ? Uint8Array : Array)(256),
    L;
  for (L = 0; 256 > L; ++L) {
    for (var R = L, ba = R, ca = 7, R = R >>> 1; R; R >>>= 1) ba <<= 1, ba |= R & 1, --ca;
    aa[L] = (ba << ca & 255) >>> 0;
  }
  var I = aa;
  function ha(b, a, c) {
    var d,
      e = "number" === typeof a ? a : a = 0,
      f = "number" === typeof c ? c : b.length;
    d = -1;
    for (e = f & 7; e--; ++a) d = d >>> 8 ^ S[(d ^ b[a]) & 255];
    for (e = f >> 3; e--; a += 8) d = d >>> 8 ^ S[(d ^ b[a]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 1]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 2]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 3]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 4]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 5]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 6]) & 255], d = d >>> 8 ^ S[(d ^ b[a + 7]) & 255];
    return (d ^ 4294967295) >>> 0;
  }
  var ia = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
    S = B ? new Uint32Array(ia) : ia;
  function ja() {}
  ;
  function ka(b) {
    this.buffer = new (B ? Uint16Array : Array)(2 * b);
    this.length = 0;
  }
  ka.prototype.getParent = function (b) {
    return 2 * ((b - 2) / 4 | 0);
  };
  ka.prototype.push = function (b, a) {
    var c,
      d,
      e = this.buffer,
      f;
    c = this.length;
    e[this.length++] = a;
    for (e[this.length++] = b; 0 < c;) if (d = this.getParent(c), e[c] > e[d]) f = e[c], e[c] = e[d], e[d] = f, f = e[c + 1], e[c + 1] = e[d + 1], e[d + 1] = f, c = d;else break;
    return this.length;
  };
  ka.prototype.pop = function () {
    var b,
      a,
      c = this.buffer,
      d,
      e,
      f;
    a = c[0];
    b = c[1];
    this.length -= 2;
    c[0] = c[this.length];
    c[1] = c[this.length + 1];
    for (f = 0;;) {
      e = 2 * f + 2;
      if (e >= this.length) break;
      e + 2 < this.length && c[e + 2] > c[e] && (e += 2);
      if (c[e] > c[f]) d = c[f], c[f] = c[e], c[e] = d, d = c[f + 1], c[f + 1] = c[e + 1], c[e + 1] = d;else break;
      f = e;
    }
    return {
      index: b,
      value: a,
      length: this.length
    };
  };
  function T(b) {
    var a = b.length,
      c = 0,
      d = Number.POSITIVE_INFINITY,
      e,
      f,
      g,
      k,
      h,
      m,
      r,
      p,
      l,
      n;
    for (p = 0; p < a; ++p) b[p] > c && (c = b[p]), b[p] < d && (d = b[p]);
    e = 1 << c;
    f = new (B ? Uint32Array : Array)(e);
    g = 1;
    k = 0;
    for (h = 2; g <= c;) {
      for (p = 0; p < a; ++p) if (b[p] === g) {
        m = 0;
        r = k;
        for (l = 0; l < g; ++l) m = m << 1 | r & 1, r >>= 1;
        n = g << 16 | p;
        for (l = m; l < e; l += h) f[l] = n;
        ++k;
      }
      ++g;
      k <<= 1;
      h <<= 1;
    }
    return [f, c, d];
  }
  ;
  function na(b, a) {
    this.k = oa;
    this.F = 0;
    this.input = B && b instanceof Array ? new Uint8Array(b) : b;
    this.b = 0;
    a && (a.lazy && (this.F = a.lazy), "number" === typeof a.compressionType && (this.k = a.compressionType), a.outputBuffer && (this.a = B && a.outputBuffer instanceof Array ? new Uint8Array(a.outputBuffer) : a.outputBuffer), "number" === typeof a.outputIndex && (this.b = a.outputIndex));
    this.a || (this.a = new (B ? Uint8Array : Array)(32768));
  }
  var oa = 2,
    pa = {
      NONE: 0,
      L: 1,
      t: oa,
      X: 3
    },
    qa = [],
    U;
  for (U = 0; 288 > U; U++) switch (v) {
    case 143 >= U:
      qa.push([U + 48, 8]);
      break;
    case 255 >= U:
      qa.push([U - 144 + 400, 9]);
      break;
    case 279 >= U:
      qa.push([U - 256 + 0, 7]);
      break;
    case 287 >= U:
      qa.push([U - 280 + 192, 8]);
      break;
    default:
      q("invalid literal: " + U);
  }
  na.prototype.h = function () {
    var b,
      a,
      c,
      d,
      e = this.input;
    switch (this.k) {
      case 0:
        c = 0;
        for (d = e.length; c < d;) {
          a = B ? e.subarray(c, c + 65535) : e.slice(c, c + 65535);
          c += a.length;
          var f = a,
            g = c === d,
            k = t,
            h = t,
            m = t,
            r = t,
            p = t,
            l = this.a,
            n = this.b;
          if (B) {
            for (l = new Uint8Array(this.a.buffer); l.length <= n + f.length + 5;) l = new Uint8Array(l.length << 1);
            l.set(this.a);
          }
          k = g ? 1 : 0;
          l[n++] = k | 0;
          h = f.length;
          m = ~h + 65536 & 65535;
          l[n++] = h & 255;
          l[n++] = h >>> 8 & 255;
          l[n++] = m & 255;
          l[n++] = m >>> 8 & 255;
          if (B) l.set(f, n), n += f.length, l = l.subarray(0, n);else {
            r = 0;
            for (p = f.length; r < p; ++r) l[n++] = f[r];
            l.length = n;
          }
          this.b = n;
          this.a = l;
        }
        break;
      case 1:
        var s = new G(B ? new Uint8Array(this.a.buffer) : this.a, this.b);
        s.d(1, 1, v);
        s.d(1, 2, v);
        var u = ra(this, e),
          w,
          C,
          x;
        w = 0;
        for (C = u.length; w < C; w++) if (x = u[w], G.prototype.d.apply(s, qa[x]), 256 < x) s.d(u[++w], u[++w], v), s.d(u[++w], 5), s.d(u[++w], u[++w], v);else if (256 === x) break;
        this.a = s.finish();
        this.b = this.a.length;
        break;
      case oa:
        var D = new G(B ? new Uint8Array(this.a.buffer) : this.a, this.b),
          M,
          z,
          N,
          X,
          Y,
          qb = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
          da,
          Fa,
          ea,
          Ga,
          la,
          ta = Array(19),
          Ha,
          Z,
          ma,
          E,
          Ia;
        M = oa;
        D.d(1, 1, v);
        D.d(M, 2, v);
        z = ra(this, e);
        da = sa(this.U, 15);
        Fa = ua(da);
        ea = sa(this.T, 7);
        Ga = ua(ea);
        for (N = 286; 257 < N && 0 === da[N - 1]; N--);
        for (X = 30; 1 < X && 0 === ea[X - 1]; X--);
        var Ja = N,
          Ka = X,
          K = new (B ? Uint32Array : Array)(Ja + Ka),
          y,
          O,
          A,
          fa,
          J = new (B ? Uint32Array : Array)(316),
          H,
          F,
          P = new (B ? Uint8Array : Array)(19);
        for (y = O = 0; y < Ja; y++) K[O++] = da[y];
        for (y = 0; y < Ka; y++) K[O++] = ea[y];
        if (!B) {
          y = 0;
          for (fa = P.length; y < fa; ++y) P[y] = 0;
        }
        y = H = 0;
        for (fa = K.length; y < fa; y += O) {
          for (O = 1; y + O < fa && K[y + O] === K[y]; ++O);
          A = O;
          if (0 === K[y]) {
            if (3 > A) for (; 0 < A--;) J[H++] = 0, P[0]++;else for (; 0 < A;) F = 138 > A ? A : 138, F > A - 3 && F < A && (F = A - 3), 10 >= F ? (J[H++] = 17, J[H++] = F - 3, P[17]++) : (J[H++] = 18, J[H++] = F - 11, P[18]++), A -= F;
          } else if (J[H++] = K[y], P[K[y]]++, A--, 3 > A) for (; 0 < A--;) J[H++] = K[y], P[K[y]]++;else for (; 0 < A;) F = 6 > A ? A : 6, F > A - 3 && F < A && (F = A - 3), J[H++] = 16, J[H++] = F - 3, P[16]++, A -= F;
        }
        b = B ? J.subarray(0, H) : J.slice(0, H);
        la = sa(P, 7);
        for (E = 0; 19 > E; E++) ta[E] = la[qb[E]];
        for (Y = 19; 4 < Y && 0 === ta[Y - 1]; Y--);
        Ha = ua(la);
        D.d(N - 257, 5, v);
        D.d(X - 1, 5, v);
        D.d(Y - 4, 4, v);
        for (E = 0; E < Y; E++) D.d(ta[E], 3, v);
        E = 0;
        for (Ia = b.length; E < Ia; E++) if (Z = b[E], D.d(Ha[Z], la[Z], v), 16 <= Z) {
          E++;
          switch (Z) {
            case 16:
              ma = 2;
              break;
            case 17:
              ma = 3;
              break;
            case 18:
              ma = 7;
              break;
            default:
              q("invalid code: " + Z);
          }
          D.d(b[E], ma, v);
        }
        var La = [Fa, da],
          Ma = [Ga, ea],
          Q,
          Na,
          ga,
          wa,
          Oa,
          Pa,
          Qa,
          Ra;
        Oa = La[0];
        Pa = La[1];
        Qa = Ma[0];
        Ra = Ma[1];
        Q = 0;
        for (Na = z.length; Q < Na; ++Q) if (ga = z[Q], D.d(Oa[ga], Pa[ga], v), 256 < ga) D.d(z[++Q], z[++Q], v), wa = z[++Q], D.d(Qa[wa], Ra[wa], v), D.d(z[++Q], z[++Q], v);else if (256 === ga) break;
        this.a = D.finish();
        this.b = this.a.length;
        break;
      default:
        q("invalid compression type");
    }
    return this.a;
  };
  function va(b, a) {
    this.length = b;
    this.N = a;
  }
  var xa = function () {
      function b(a) {
        switch (v) {
          case 3 === a:
            return [257, a - 3, 0];
          case 4 === a:
            return [258, a - 4, 0];
          case 5 === a:
            return [259, a - 5, 0];
          case 6 === a:
            return [260, a - 6, 0];
          case 7 === a:
            return [261, a - 7, 0];
          case 8 === a:
            return [262, a - 8, 0];
          case 9 === a:
            return [263, a - 9, 0];
          case 10 === a:
            return [264, a - 10, 0];
          case 12 >= a:
            return [265, a - 11, 1];
          case 14 >= a:
            return [266, a - 13, 1];
          case 16 >= a:
            return [267, a - 15, 1];
          case 18 >= a:
            return [268, a - 17, 1];
          case 22 >= a:
            return [269, a - 19, 2];
          case 26 >= a:
            return [270, a - 23, 2];
          case 30 >= a:
            return [271, a - 27, 2];
          case 34 >= a:
            return [272, a - 31, 2];
          case 42 >= a:
            return [273, a - 35, 3];
          case 50 >= a:
            return [274, a - 43, 3];
          case 58 >= a:
            return [275, a - 51, 3];
          case 66 >= a:
            return [276, a - 59, 3];
          case 82 >= a:
            return [277, a - 67, 4];
          case 98 >= a:
            return [278, a - 83, 4];
          case 114 >= a:
            return [279, a - 99, 4];
          case 130 >= a:
            return [280, a - 115, 4];
          case 162 >= a:
            return [281, a - 131, 5];
          case 194 >= a:
            return [282, a - 163, 5];
          case 226 >= a:
            return [283, a - 195, 5];
          case 257 >= a:
            return [284, a - 227, 5];
          case 258 === a:
            return [285, a - 258, 0];
          default:
            q("invalid length: " + a);
        }
      }
      var a = [],
        c,
        d;
      for (c = 3; 258 >= c; c++) d = b(c), a[c] = d[2] << 24 | d[1] << 16 | d[0];
      return a;
    }(),
    ya = B ? new Uint32Array(xa) : xa;
  function ra(b, a) {
    function c(a, c) {
      var b = a.N,
        d = [],
        f = 0,
        e;
      e = ya[a.length];
      d[f++] = e & 65535;
      d[f++] = e >> 16 & 255;
      d[f++] = e >> 24;
      var g;
      switch (v) {
        case 1 === b:
          g = [0, b - 1, 0];
          break;
        case 2 === b:
          g = [1, b - 2, 0];
          break;
        case 3 === b:
          g = [2, b - 3, 0];
          break;
        case 4 === b:
          g = [3, b - 4, 0];
          break;
        case 6 >= b:
          g = [4, b - 5, 1];
          break;
        case 8 >= b:
          g = [5, b - 7, 1];
          break;
        case 12 >= b:
          g = [6, b - 9, 2];
          break;
        case 16 >= b:
          g = [7, b - 13, 2];
          break;
        case 24 >= b:
          g = [8, b - 17, 3];
          break;
        case 32 >= b:
          g = [9, b - 25, 3];
          break;
        case 48 >= b:
          g = [10, b - 33, 4];
          break;
        case 64 >= b:
          g = [11, b - 49, 4];
          break;
        case 96 >= b:
          g = [12, b - 65, 5];
          break;
        case 128 >= b:
          g = [13, b - 97, 5];
          break;
        case 192 >= b:
          g = [14, b - 129, 6];
          break;
        case 256 >= b:
          g = [15, b - 193, 6];
          break;
        case 384 >= b:
          g = [16, b - 257, 7];
          break;
        case 512 >= b:
          g = [17, b - 385, 7];
          break;
        case 768 >= b:
          g = [18, b - 513, 8];
          break;
        case 1024 >= b:
          g = [19, b - 769, 8];
          break;
        case 1536 >= b:
          g = [20, b - 1025, 9];
          break;
        case 2048 >= b:
          g = [21, b - 1537, 9];
          break;
        case 3072 >= b:
          g = [22, b - 2049, 10];
          break;
        case 4096 >= b:
          g = [23, b - 3073, 10];
          break;
        case 6144 >= b:
          g = [24, b - 4097, 11];
          break;
        case 8192 >= b:
          g = [25, b - 6145, 11];
          break;
        case 12288 >= b:
          g = [26, b - 8193, 12];
          break;
        case 16384 >= b:
          g = [27, b - 12289, 12];
          break;
        case 24576 >= b:
          g = [28, b - 16385, 13];
          break;
        case 32768 >= b:
          g = [29, b - 24577, 13];
          break;
        default:
          q("invalid distance");
      }
      e = g;
      d[f++] = e[0];
      d[f++] = e[1];
      d[f++] = e[2];
      var h, k;
      h = 0;
      for (k = d.length; h < k; ++h) l[n++] = d[h];
      u[d[0]]++;
      w[d[3]]++;
      s = a.length + c - 1;
      p = null;
    }
    var d,
      e,
      f,
      g,
      k,
      h = {},
      m,
      r,
      p,
      l = B ? new Uint16Array(2 * a.length) : [],
      n = 0,
      s = 0,
      u = new (B ? Uint32Array : Array)(286),
      w = new (B ? Uint32Array : Array)(30),
      C = b.F,
      x;
    if (!B) {
      for (f = 0; 285 >= f;) u[f++] = 0;
      for (f = 0; 29 >= f;) w[f++] = 0;
    }
    u[256] = 1;
    d = 0;
    for (e = a.length; d < e; ++d) {
      f = k = 0;
      for (g = 3; f < g && d + f !== e; ++f) k = k << 8 | a[d + f];
      h[k] === t && (h[k] = []);
      m = h[k];
      if (!(0 < s--)) {
        for (; 0 < m.length && 32768 < d - m[0];) m.shift();
        if (d + 3 >= e) {
          p && c(p, -1);
          f = 0;
          for (g = e - d; f < g; ++f) x = a[d + f], l[n++] = x, ++u[x];
          break;
        }
        0 < m.length ? (r = za(a, d, m), p ? p.length < r.length ? (x = a[d - 1], l[n++] = x, ++u[x], c(r, 0)) : c(p, -1) : r.length < C ? p = r : c(r, 0)) : p ? c(p, -1) : (x = a[d], l[n++] = x, ++u[x]);
      }
      m.push(d);
    }
    l[n++] = 256;
    u[256]++;
    b.U = u;
    b.T = w;
    return B ? l.subarray(0, n) : l;
  }
  function za(b, a, c) {
    var d,
      e,
      f = 0,
      g,
      k,
      h,
      m,
      r = b.length;
    k = 0;
    m = c.length;
    a: for (; k < m; k++) {
      d = c[m - k - 1];
      g = 3;
      if (3 < f) {
        for (h = f; 3 < h; h--) if (b[d + h - 1] !== b[a + h - 1]) continue a;
        g = f;
      }
      for (; 258 > g && a + g < r && b[d + g] === b[a + g];) ++g;
      g > f && (e = d, f = g);
      if (258 === g) break;
    }
    return new va(f, a - e);
  }
  function sa(b, a) {
    var c = b.length,
      d = new ka(572),
      e = new (B ? Uint8Array : Array)(c),
      f,
      g,
      k,
      h,
      m;
    if (!B) for (h = 0; h < c; h++) e[h] = 0;
    for (h = 0; h < c; ++h) 0 < b[h] && d.push(h, b[h]);
    f = Array(d.length / 2);
    g = new (B ? Uint32Array : Array)(d.length / 2);
    if (1 === f.length) return e[d.pop().index] = 1, e;
    h = 0;
    for (m = d.length / 2; h < m; ++h) f[h] = d.pop(), g[h] = f[h].value;
    k = Aa(g, g.length, a);
    h = 0;
    for (m = f.length; h < m; ++h) e[f[h].index] = k[h];
    return e;
  }
  function Aa(b, a, c) {
    function d(b) {
      var c = h[b][m[b]];
      c === a ? (d(b + 1), d(b + 1)) : --g[c];
      ++m[b];
    }
    var e = new (B ? Uint16Array : Array)(c),
      f = new (B ? Uint8Array : Array)(c),
      g = new (B ? Uint8Array : Array)(a),
      k = Array(c),
      h = Array(c),
      m = Array(c),
      r = (1 << c) - a,
      p = 1 << c - 1,
      l,
      n,
      s,
      u,
      w;
    e[c - 1] = a;
    for (n = 0; n < c; ++n) r < p ? f[n] = 0 : (f[n] = 1, r -= p), r <<= 1, e[c - 2 - n] = (e[c - 1 - n] / 2 | 0) + a;
    e[0] = f[0];
    k[0] = Array(e[0]);
    h[0] = Array(e[0]);
    for (n = 1; n < c; ++n) e[n] > 2 * e[n - 1] + f[n] && (e[n] = 2 * e[n - 1] + f[n]), k[n] = Array(e[n]), h[n] = Array(e[n]);
    for (l = 0; l < a; ++l) g[l] = c;
    for (s = 0; s < e[c - 1]; ++s) k[c - 1][s] = b[s], h[c - 1][s] = s;
    for (l = 0; l < c; ++l) m[l] = 0;
    1 === f[c - 1] && (--g[0], ++m[c - 1]);
    for (n = c - 2; 0 <= n; --n) {
      u = l = 0;
      w = m[n + 1];
      for (s = 0; s < e[n]; s++) u = k[n + 1][w] + k[n + 1][w + 1], u > b[l] ? (k[n][s] = u, h[n][s] = a, w += 2) : (k[n][s] = b[l], h[n][s] = l, ++l);
      m[n] = 0;
      1 === f[n] && d(n);
    }
    return g;
  }
  function ua(b) {
    var a = new (B ? Uint16Array : Array)(b.length),
      c = [],
      d = [],
      e = 0,
      f,
      g,
      k,
      h;
    f = 0;
    for (g = b.length; f < g; f++) c[b[f]] = (c[b[f]] | 0) + 1;
    f = 1;
    for (g = 16; f <= g; f++) d[f] = e, e += c[f] | 0, e <<= 1;
    f = 0;
    for (g = b.length; f < g; f++) {
      e = d[b[f]];
      d[b[f]] += 1;
      k = a[f] = 0;
      for (h = b[f]; k < h; k++) a[f] = a[f] << 1 | e & 1, e >>>= 1;
    }
    return a;
  }
  ;
  function Ba(b, a) {
    this.input = b;
    this.b = this.c = 0;
    this.g = {};
    a && (a.flags && (this.g = a.flags), "string" === typeof a.filename && (this.filename = a.filename), "string" === typeof a.comment && (this.w = a.comment), a.deflateOptions && (this.l = a.deflateOptions));
    this.l || (this.l = {});
  }
  Ba.prototype.h = function () {
    var b,
      a,
      c,
      d,
      e,
      f,
      g,
      k,
      h = new (B ? Uint8Array : Array)(32768),
      m = 0,
      r = this.input,
      p = this.c,
      l = this.filename,
      n = this.w;
    h[m++] = 31;
    h[m++] = 139;
    h[m++] = 8;
    b = 0;
    this.g.fname && (b |= Ca);
    this.g.fcomment && (b |= Da);
    this.g.fhcrc && (b |= Ea);
    h[m++] = b;
    a = (Date.now ? Date.now() : +new Date()) / 1E3 | 0;
    h[m++] = a & 255;
    h[m++] = a >>> 8 & 255;
    h[m++] = a >>> 16 & 255;
    h[m++] = a >>> 24 & 255;
    h[m++] = 0;
    h[m++] = Sa;
    if (this.g.fname !== t) {
      g = 0;
      for (k = l.length; g < k; ++g) f = l.charCodeAt(g), 255 < f && (h[m++] = f >>> 8 & 255), h[m++] = f & 255;
      h[m++] = 0;
    }
    if (this.g.comment) {
      g = 0;
      for (k = n.length; g < k; ++g) f = n.charCodeAt(g), 255 < f && (h[m++] = f >>> 8 & 255), h[m++] = f & 255;
      h[m++] = 0;
    }
    this.g.fhcrc && (c = ha(h, 0, m) & 65535, h[m++] = c & 255, h[m++] = c >>> 8 & 255);
    this.l.outputBuffer = h;
    this.l.outputIndex = m;
    e = new na(r, this.l);
    h = e.h();
    m = e.b;
    B && (m + 8 > h.buffer.byteLength ? (this.a = new Uint8Array(m + 8), this.a.set(new Uint8Array(h.buffer)), h = this.a) : h = new Uint8Array(h.buffer));
    d = ha(r, t, t);
    h[m++] = d & 255;
    h[m++] = d >>> 8 & 255;
    h[m++] = d >>> 16 & 255;
    h[m++] = d >>> 24 & 255;
    k = r.length;
    h[m++] = k & 255;
    h[m++] = k >>> 8 & 255;
    h[m++] = k >>> 16 & 255;
    h[m++] = k >>> 24 & 255;
    this.c = p;
    B && m < h.length && (this.a = h = h.subarray(0, m));
    return h;
  };
  var Sa = 255,
    Ea = 2,
    Ca = 8,
    Da = 16;
  function V(b, a) {
    this.o = [];
    this.p = 32768;
    this.e = this.j = this.c = this.s = 0;
    this.input = B ? new Uint8Array(b) : b;
    this.u = !1;
    this.q = Ta;
    this.K = !1;
    if (a || !(a = {})) a.index && (this.c = a.index), a.bufferSize && (this.p = a.bufferSize), a.bufferType && (this.q = a.bufferType), a.resize && (this.K = a.resize);
    switch (this.q) {
      case Ua:
        this.b = 32768;
        this.a = new (B ? Uint8Array : Array)(32768 + this.p + 258);
        break;
      case Ta:
        this.b = 0;
        this.a = new (B ? Uint8Array : Array)(this.p);
        this.f = this.S;
        this.z = this.O;
        this.r = this.Q;
        break;
      default:
        q(Error("invalid inflate mode"));
    }
  }
  var Ua = 0,
    Ta = 1;
  V.prototype.i = function () {
    for (; !this.u;) {
      var b = W(this, 3);
      b & 1 && (this.u = v);
      b >>>= 1;
      switch (b) {
        case 0:
          var a = this.input,
            c = this.c,
            d = this.a,
            e = this.b,
            f = a.length,
            g = t,
            k = t,
            h = d.length,
            m = t;
          this.e = this.j = 0;
          c + 1 >= f && q(Error("invalid uncompressed block header: LEN"));
          g = a[c++] | a[c++] << 8;
          c + 1 >= f && q(Error("invalid uncompressed block header: NLEN"));
          k = a[c++] | a[c++] << 8;
          g === ~k && q(Error("invalid uncompressed block header: length verify"));
          c + g > a.length && q(Error("input buffer is broken"));
          switch (this.q) {
            case Ua:
              for (; e + g > d.length;) {
                m = h - e;
                g -= m;
                if (B) d.set(a.subarray(c, c + m), e), e += m, c += m;else for (; m--;) d[e++] = a[c++];
                this.b = e;
                d = this.f();
                e = this.b;
              }
              break;
            case Ta:
              for (; e + g > d.length;) d = this.f({
                B: 2
              });
              break;
            default:
              q(Error("invalid inflate mode"));
          }
          if (B) d.set(a.subarray(c, c + g), e), e += g, c += g;else for (; g--;) d[e++] = a[c++];
          this.c = c;
          this.b = e;
          this.a = d;
          break;
        case 1:
          this.r(Va, Wa);
          break;
        case 2:
          for (var r = W(this, 5) + 257, p = W(this, 5) + 1, l = W(this, 4) + 4, n = new (B ? Uint8Array : Array)(Xa.length), s = t, u = t, w = t, C = t, x = t, D = t, M = t, z = t, N = t, z = 0; z < l; ++z) n[Xa[z]] = W(this, 3);
          if (!B) {
            z = l;
            for (l = n.length; z < l; ++z) n[Xa[z]] = 0;
          }
          s = T(n);
          C = new (B ? Uint8Array : Array)(r + p);
          z = 0;
          for (N = r + p; z < N;) switch (x = Ya(this, s), x) {
            case 16:
              for (M = 3 + W(this, 2); M--;) C[z++] = D;
              break;
            case 17:
              for (M = 3 + W(this, 3); M--;) C[z++] = 0;
              D = 0;
              break;
            case 18:
              for (M = 11 + W(this, 7); M--;) C[z++] = 0;
              D = 0;
              break;
            default:
              D = C[z++] = x;
          }
          u = B ? T(C.subarray(0, r)) : T(C.slice(0, r));
          w = B ? T(C.subarray(r)) : T(C.slice(r));
          this.r(u, w);
          break;
        default:
          q(Error("unknown BTYPE: " + b));
      }
    }
    return this.z();
  };
  var Za = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
    Xa = B ? new Uint16Array(Za) : Za,
    $a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
    ab = B ? new Uint16Array($a) : $a,
    bb = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
    cb = B ? new Uint8Array(bb) : bb,
    db = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
    eb = B ? new Uint16Array(db) : db,
    fb = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
    gb = B ? new Uint8Array(fb) : fb,
    hb = new (B ? Uint8Array : Array)(288),
    $,
    ib;
  $ = 0;
  for (ib = hb.length; $ < ib; ++$) hb[$] = 143 >= $ ? 8 : 255 >= $ ? 9 : 279 >= $ ? 7 : 8;
  var Va = T(hb),
    jb = new (B ? Uint8Array : Array)(30),
    kb,
    lb;
  kb = 0;
  for (lb = jb.length; kb < lb; ++kb) jb[kb] = 5;
  var Wa = T(jb);
  function W(b, a) {
    for (var c = b.j, d = b.e, e = b.input, f = b.c, g = e.length, k; d < a;) f >= g && q(Error("input buffer is broken")), c |= e[f++] << d, d += 8;
    k = c & (1 << a) - 1;
    b.j = c >>> a;
    b.e = d - a;
    b.c = f;
    return k;
  }
  function Ya(b, a) {
    for (var c = b.j, d = b.e, e = b.input, f = b.c, g = e.length, k = a[0], h = a[1], m, r; d < h && !(f >= g);) c |= e[f++] << d, d += 8;
    m = k[c & (1 << h) - 1];
    r = m >>> 16;
    r > d && q(Error("invalid code length: " + r));
    b.j = c >> r;
    b.e = d - r;
    b.c = f;
    return m & 65535;
  }
  V.prototype.r = function (b, a) {
    var c = this.a,
      d = this.b;
    this.A = b;
    for (var e = c.length - 258, f, g, k, h; 256 !== (f = Ya(this, b));) if (256 > f) d >= e && (this.b = d, c = this.f(), d = this.b), c[d++] = f;else {
      g = f - 257;
      h = ab[g];
      0 < cb[g] && (h += W(this, cb[g]));
      f = Ya(this, a);
      k = eb[f];
      0 < gb[f] && (k += W(this, gb[f]));
      d >= e && (this.b = d, c = this.f(), d = this.b);
      for (; h--;) c[d] = c[d++ - k];
    }
    for (; 8 <= this.e;) this.e -= 8, this.c--;
    this.b = d;
  };
  V.prototype.Q = function (b, a) {
    var c = this.a,
      d = this.b;
    this.A = b;
    for (var e = c.length, f, g, k, h; 256 !== (f = Ya(this, b));) if (256 > f) d >= e && (c = this.f(), e = c.length), c[d++] = f;else {
      g = f - 257;
      h = ab[g];
      0 < cb[g] && (h += W(this, cb[g]));
      f = Ya(this, a);
      k = eb[f];
      0 < gb[f] && (k += W(this, gb[f]));
      d + h > e && (c = this.f(), e = c.length);
      for (; h--;) c[d] = c[d++ - k];
    }
    for (; 8 <= this.e;) this.e -= 8, this.c--;
    this.b = d;
  };
  V.prototype.f = function () {
    var b = new (B ? Uint8Array : Array)(this.b - 32768),
      a = this.b - 32768,
      c,
      d,
      e = this.a;
    if (B) b.set(e.subarray(32768, b.length));else {
      c = 0;
      for (d = b.length; c < d; ++c) b[c] = e[c + 32768];
    }
    this.o.push(b);
    this.s += b.length;
    if (B) e.set(e.subarray(a, a + 32768));else for (c = 0; 32768 > c; ++c) e[c] = e[a + c];
    this.b = 32768;
    return e;
  };
  V.prototype.S = function (b) {
    var a,
      c = this.input.length / this.c + 1 | 0,
      d,
      e,
      f,
      g = this.input,
      k = this.a;
    b && ("number" === typeof b.B && (c = b.B), "number" === typeof b.M && (c += b.M));
    2 > c ? (d = (g.length - this.c) / this.A[2], f = 258 * (d / 2) | 0, e = f < k.length ? k.length + f : k.length << 1) : e = k.length * c;
    B ? (a = new Uint8Array(e), a.set(k)) : a = k;
    return this.a = a;
  };
  V.prototype.z = function () {
    var b = 0,
      a = this.a,
      c = this.o,
      d,
      e = new (B ? Uint8Array : Array)(this.s + (this.b - 32768)),
      f,
      g,
      k,
      h;
    if (0 === c.length) return B ? this.a.subarray(32768, this.b) : this.a.slice(32768, this.b);
    f = 0;
    for (g = c.length; f < g; ++f) {
      d = c[f];
      k = 0;
      for (h = d.length; k < h; ++k) e[b++] = d[k];
    }
    f = 32768;
    for (g = this.b; f < g; ++f) e[b++] = a[f];
    this.o = [];
    return this.buffer = e;
  };
  V.prototype.O = function () {
    var b,
      a = this.b;
    B ? this.K ? (b = new Uint8Array(a), b.set(this.a.subarray(0, a))) : b = this.a.subarray(0, a) : (this.a.length > a && (this.a.length = a), b = this.a);
    return this.buffer = b;
  };
  function mb(b) {
    this.input = b;
    this.c = 0;
    this.G = [];
    this.R = !1;
  }
  mb.prototype.i = function () {
    for (var b = this.input.length; this.c < b;) {
      var a = new ja(),
        c = t,
        d = t,
        e = t,
        f = t,
        g = t,
        k = t,
        h = t,
        m = t,
        r = t,
        p = this.input,
        l = this.c;
      a.C = p[l++];
      a.D = p[l++];
      (31 !== a.C || 139 !== a.D) && q(Error("invalid file signature:" + a.C + "," + a.D));
      a.v = p[l++];
      switch (a.v) {
        case 8:
          break;
        default:
          q(Error("unknown compression method: " + a.v));
      }
      a.n = p[l++];
      m = p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24;
      a.$ = new Date(1E3 * m);
      a.ba = p[l++];
      a.aa = p[l++];
      0 < (a.n & 4) && (a.W = p[l++] | p[l++] << 8, l += a.W);
      if (0 < (a.n & Ca)) {
        h = [];
        for (k = 0; 0 < (g = p[l++]);) h[k++] = String.fromCharCode(g);
        a.name = h.join("");
      }
      if (0 < (a.n & Da)) {
        h = [];
        for (k = 0; 0 < (g = p[l++]);) h[k++] = String.fromCharCode(g);
        a.w = h.join("");
      }
      0 < (a.n & Ea) && (a.P = ha(p, 0, l) & 65535, a.P !== (p[l++] | p[l++] << 8) && q(Error("invalid header crc16")));
      c = p[p.length - 4] | p[p.length - 3] << 8 | p[p.length - 2] << 16 | p[p.length - 1] << 24;
      p.length - l - 4 - 4 < 512 * c && (f = c);
      d = new V(p, {
        index: l,
        bufferSize: f
      });
      a.data = e = d.i();
      l = d.c;
      a.Y = r = (p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24) >>> 0;
      ha(e, t, t) !== r && q(Error("invalid CRC-32 checksum: 0x" + ha(e, t, t).toString(16) + " / 0x" + r.toString(16)));
      a.Z = c = (p[l++] | p[l++] << 8 | p[l++] << 16 | p[l++] << 24) >>> 0;
      (e.length & 4294967295) !== c && q(Error("invalid input size: " + (e.length & 4294967295) + " / " + c));
      this.G.push(a);
      this.c = l;
    }
    this.R = v;
    var n = this.G,
      s,
      u,
      w = 0,
      C = 0,
      x;
    s = 0;
    for (u = n.length; s < u; ++s) C += n[s].data.length;
    if (B) {
      x = new Uint8Array(C);
      for (s = 0; s < u; ++s) x.set(n[s].data, w), w += n[s].data.length;
    } else {
      x = [];
      for (s = 0; s < u; ++s) x[s] = n[s].data;
      x = Array.prototype.concat.apply([], x);
    }
    return x;
  };
  function nb(b) {
    if ("string" === typeof b) {
      var a = b.split(""),
        c,
        d;
      c = 0;
      for (d = a.length; c < d; c++) a[c] = (a[c].charCodeAt(0) & 255) >>> 0;
      b = a;
    }
    for (var e = 1, f = 0, g = b.length, k, h = 0; 0 < g;) {
      k = 1024 < g ? 1024 : g;
      g -= k;
      do e += b[h++], f += e; while (--k);
      e %= 65521;
      f %= 65521;
    }
    return (f << 16 | e) >>> 0;
  }
  ;
  function ob(b, a) {
    var c, d;
    this.input = b;
    this.c = 0;
    if (a || !(a = {})) a.index && (this.c = a.index), a.verify && (this.V = a.verify);
    c = b[this.c++];
    d = b[this.c++];
    switch (c & 15) {
      case pb:
        this.method = pb;
        break;
      default:
        q(Error("unsupported compression method"));
    }
    0 !== ((c << 8) + d) % 31 && q(Error("invalid fcheck flag:" + ((c << 8) + d) % 31));
    d & 32 && q(Error("fdict flag is not supported"));
    this.J = new V(b, {
      index: this.c,
      bufferSize: a.bufferSize,
      bufferType: a.bufferType,
      resize: a.resize
    });
  }
  ob.prototype.i = function () {
    var b = this.input,
      a,
      c;
    a = this.J.i();
    this.c = this.J.c;
    this.V && (c = (b[this.c++] << 24 | b[this.c++] << 16 | b[this.c++] << 8 | b[this.c++]) >>> 0, c !== nb(a) && q(Error("invalid adler-32 checksum")));
    return a;
  };
  var pb = 8;
  function rb(b, a) {
    this.input = b;
    this.a = new (B ? Uint8Array : Array)(32768);
    this.k = sb.t;
    var c = {},
      d;
    if ((a || !(a = {})) && "number" === typeof a.compressionType) this.k = a.compressionType;
    for (d in a) c[d] = a[d];
    c.outputBuffer = this.a;
    this.I = new na(this.input, c);
  }
  var sb = pa;
  rb.prototype.h = function () {
    var b,
      a,
      c,
      d,
      e,
      f,
      g,
      k = 0;
    g = this.a;
    b = pb;
    switch (b) {
      case pb:
        a = Math.LOG2E * Math.log(32768) - 8;
        break;
      default:
        q(Error("invalid compression method"));
    }
    c = a << 4 | b;
    g[k++] = c;
    switch (b) {
      case pb:
        switch (this.k) {
          case sb.NONE:
            e = 0;
            break;
          case sb.L:
            e = 1;
            break;
          case sb.t:
            e = 2;
            break;
          default:
            q(Error("unsupported compression type"));
        }
        break;
      default:
        q(Error("invalid compression method"));
    }
    d = e << 6 | 0;
    g[k++] = d | 31 - (256 * c + d) % 31;
    f = nb(this.input);
    this.I.b = k;
    g = this.I.h();
    k = g.length;
    B && (g = new Uint8Array(g.buffer), g.length <= k + 4 && (this.a = new Uint8Array(g.length + 4), this.a.set(g), g = this.a), g = g.subarray(0, k + 4));
    g[k++] = f >> 24 & 255;
    g[k++] = f >> 16 & 255;
    g[k++] = f >> 8 & 255;
    g[k++] = f & 255;
    return g;
  };
  exports.deflate = tb;
  exports.deflateSync = ub;
  exports.inflate = vb;
  exports.inflateSync = wb;
  exports.gzip = xb;
  exports.gzipSync = yb;
  exports.gunzip = zb;
  exports.gunzipSync = Ab;
  function tb(b, a, c) {
    process.nextTick(function () {
      var d, e;
      try {
        e = ub(b, c);
      } catch (f) {
        d = f;
      }
      a(d, e);
    });
  }
  function ub(b, a) {
    var c;
    c = new rb(b).h();
    a || (a = {});
    return a.H ? c : Bb(c);
  }
  function vb(b, a, c) {
    process.nextTick(function () {
      var d, e;
      try {
        e = wb(b, c);
      } catch (f) {
        d = f;
      }
      a(d, e);
    });
  }
  function wb(b, a) {
    var c;
    b.subarray = b.slice;
    c = new ob(b).i();
    a || (a = {});
    return a.noBuffer ? c : Bb(c);
  }
  function xb(b, a, c) {
    process.nextTick(function () {
      var d, e;
      try {
        e = yb(b, c);
      } catch (f) {
        d = f;
      }
      a(d, e);
    });
  }
  function yb(b, a) {
    var c;
    b.subarray = b.slice;
    c = new Ba(b).h();
    a || (a = {});
    return a.H ? c : Bb(c);
  }
  function zb(b, a, c) {
    process.nextTick(function () {
      var d, e;
      try {
        e = Ab(b, c);
      } catch (f) {
        d = f;
      }
      a(d, e);
    });
  }
  function Ab(b, a) {
    var c;
    b.subarray = b.slice;
    c = new mb(b).i();
    a || (a = {});
    return a.H ? c : Bb(c);
  }
  function Bb(b) {
    var a = new Buffer(b.length),
      c,
      d;
    c = 0;
    for (d = b.length; c < d; ++c) a[c] = b[c];
    return a;
  }
  ;
}).call(this);

/***/ }),

/***/ "./src/constants/PSM.js":
/*!******************************!*\
  !*** ./src/constants/PSM.js ***!
  \******************************/
/***/ ((module) => {

/*
 * PSM = Page Segmentation Mode
 */
module.exports = {
  OSD_ONLY: '0',
  AUTO_OSD: '1',
  AUTO_ONLY: '2',
  AUTO: '3',
  SINGLE_COLUMN: '4',
  SINGLE_BLOCK_VERT_TEXT: '5',
  SINGLE_BLOCK: '6',
  SINGLE_LINE: '7',
  SINGLE_WORD: '8',
  CIRCLE_WORD: '9',
  SINGLE_CHAR: '10',
  SPARSE_TEXT: '11',
  SPARSE_TEXT_OSD: '12',
  RAW_LINE: '13'
};

/***/ }),

/***/ "./src/constants/imageType.js":
/*!************************************!*\
  !*** ./src/constants/imageType.js ***!
  \************************************/
/***/ ((module) => {

module.exports = {
  COLOR: 0,
  GREY: 1,
  BINARY: 2
};

/***/ }),

/***/ "./src/utils/getEnvironment.js":
/*!*************************************!*\
  !*** ./src/utils/getEnvironment.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var isElectron = __webpack_require__(/*! is-electron */ "./node_modules/is-electron/index.js");
module.exports = function (key) {
  var env = {};
  if (typeof WorkerGlobalScope !== 'undefined') {
    env.type = 'webworker';
  } else if (isElectron()) {
    env.type = 'electron';
  } else if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object') {
    env.type = 'browser';
  } else if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && "function" === 'function') {
    env.type = 'node';
  }
  if (typeof key === 'undefined') {
    return env;
  }
  return env[key];
};

/***/ }),

/***/ "./src/utils/log.js":
/*!**************************!*\
  !*** ./src/utils/log.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {

var _this = this;
var logging = false;
exports.logging = logging;
exports.setLogging = function (_logging) {
  logging = _logging;
};
exports.log = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return logging ? console.log.apply(_this, args) : null;
};

/***/ }),

/***/ "./src/worker-script/browser/cache.js":
/*!********************************************!*\
  !*** ./src/worker-script/browser/cache.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(/*! idb-keyval */ "./node_modules/idb-keyval/dist/index.js"),
  set = _require.set,
  get = _require.get,
  del = _require.del;
module.exports = {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: function checkCache(path) {
    return get(path).then(function (v) {
      return typeof v !== 'undefined';
    });
  }
};

/***/ }),

/***/ "./src/worker-script/browser/getCore.js":
/*!**********************************************!*\
  !*** ./src/worker-script/browser/getCore.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = __webpack_require__(/*! wasm-feature-detect */ "./node_modules/wasm-feature-detect/dist/esm/index.js"),
  simd = _require.simd;
var _require2 = __webpack_require__(/*! ../../../package.json */ "./package.json"),
  dependencies = _require2.dependencies;
module.exports = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(corePath, res) {
    var corePathImport, corePathImportFile, simdSupport;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof __webpack_require__.g.TesseractCore === 'undefined')) {
            _context.next = 19;
            break;
          }
          res.progress({
            status: 'loading tesseract core',
            progress: 0
          });

          // If the user specifies a core path, we use that
          // Otherwise, default to CDN
          corePathImport = corePath || "https://cdn.jsdelivr.net/npm/tesseract.js-core@v".concat(dependencies['tesseract.js-core'].substring(1)); // If a user specifies a specific JavaScript file, load that file.
          // Otherwise, assume a directory has been provided, and load either
          // tesseract-core.wasm.js or tesseract-core-simd.wasm.js depending
          // on whether this device has SIMD support.
          if (!(corePathImport.slice(-2) === 'js')) {
            _context.next = 7;
            break;
          }
          corePathImportFile = corePathImport;
          _context.next = 11;
          break;
        case 7:
          _context.next = 9;
          return simd();
        case 9:
          simdSupport = _context.sent;
          if (simdSupport) {
            corePathImportFile = "".concat(corePathImport.replace(/\/$/, ''), "/tesseract-core-simd.wasm.js");
          } else {
            corePathImportFile = "".concat(corePathImport.replace(/\/$/, ''), "/tesseract-core.wasm.js");
          }
        case 11:
          // Create a module named `global.TesseractCore`
          __webpack_require__.g.importScripts(corePathImportFile);

          // Tesseract.js-core versions through 4.0.3 create a module named `global.TesseractCoreWASM`,
          // so we account for that here to preserve backwards compatibility.
          // This part can be removed when Tesseract.js-core v4.0.3 becomes incompatible for other reasons
          if (!(typeof __webpack_require__.g.TesseractCore === 'undefined' && typeof __webpack_require__.g.TesseractCoreWASM !== 'undefined' && (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === 'object')) {
            _context.next = 16;
            break;
          }
          __webpack_require__.g.TesseractCore = __webpack_require__.g.TesseractCoreWASM;
          _context.next = 18;
          break;
        case 16:
          if (!(typeof __webpack_require__.g.TesseractCore === 'undefined')) {
            _context.next = 18;
            break;
          }
          throw Error('Failed to load TesseractCore');
        case 18:
          res.progress({
            status: 'loading tesseract core',
            progress: 1
          });
        case 19:
          return _context.abrupt("return", __webpack_require__.g.TesseractCore);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/worker-script/browser/gunzip.js":
/*!*********************************************!*\
  !*** ./src/worker-script/browser/gunzip.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! zlibjs */ "./node_modules/zlibjs/bin/node-zlib.js").gunzipSync;

/***/ }),

/***/ "./src/worker-script/constants/defaultOutput.js":
/*!******************************************************!*\
  !*** ./src/worker-script/constants/defaultOutput.js ***!
  \******************************************************/
/***/ ((module) => {

/*
 * default output formats for tesseract.js
 */

module.exports = {
  text: true,
  blocks: true,
  layoutBlocks: false,
  hocr: true,
  tsv: true,
  box: false,
  unlv: false,
  osd: false,
  pdf: false,
  imageColor: false,
  imageGrey: false,
  imageBinary: false,
  debug: false
};

/***/ }),

/***/ "./src/worker-script/constants/defaultParams.js":
/*!******************************************************!*\
  !*** ./src/worker-script/constants/defaultParams.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * default params for tesseract.js
 */
var PSM = __webpack_require__(/*! ../../constants/PSM */ "./src/constants/PSM.js");
module.exports = {
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  tessedit_char_whitelist: '',
  tessjs_create_hocr: '1',
  tessjs_create_tsv: '1',
  tessjs_create_box: '0',
  tessjs_create_unlv: '0',
  tessjs_create_osd: '0'
};

/***/ }),

/***/ "./src/worker-script/index.js":
/*!************************************!*\
  !*** ./src/worker-script/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var _this = this;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 *
 * Worker script for browser and node
 *
 * @fileoverview Worker script for browser and node
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
var isURL = __webpack_require__(/*! is-url */ "./node_modules/is-url/index.js");
var dump = __webpack_require__(/*! ./utils/dump */ "./src/worker-script/utils/dump.js");
var env = __webpack_require__(/*! ../utils/getEnvironment */ "./src/utils/getEnvironment.js")('type');
var setImage = __webpack_require__(/*! ./utils/setImage */ "./src/worker-script/utils/setImage.js");
var defaultParams = __webpack_require__(/*! ./constants/defaultParams */ "./src/worker-script/constants/defaultParams.js");
var defaultOutput = __webpack_require__(/*! ./constants/defaultOutput */ "./src/worker-script/constants/defaultOutput.js");
var _require = __webpack_require__(/*! ../utils/log */ "./src/utils/log.js"),
  log = _require.log,
  setLogging = _require.setLogging;
var PSM = __webpack_require__(/*! ../constants/PSM */ "./src/constants/PSM.js");

/*
 * Tesseract Module returned by TesseractCore.
 */
var TessModule;
/*
 * TessearctBaseAPI instance
 */
var api = null;
var latestJob;
var adapter = {};
var params = defaultParams;
var cachePathWorker;
var cacheMethodWorker;
var load = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref, res) {
    var workerId, jobId, _ref$payload$options, corePath, logging, Core;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          workerId = _ref.workerId, jobId = _ref.jobId, _ref$payload$options = _ref.payload.options, corePath = _ref$payload$options.corePath, logging = _ref$payload$options.logging;
          setLogging(logging);
          if (TessModule) {
            _context.next = 10;
            break;
          }
          _context.next = 5;
          return adapter.getCore(corePath, res);
        case 5:
          Core = _context.sent;
          res.progress({
            workerId: workerId,
            status: 'initializing tesseract',
            progress: 0
          });
          Core({
            TesseractProgress: function TesseractProgress(percent) {
              latestJob.progress({
                workerId: workerId,
                jobId: jobId,
                status: 'recognizing text',
                progress: Math.max(0, (percent - 30) / 70)
              });
            }
          }).then(function (tessModule) {
            TessModule = tessModule;
            res.progress({
              workerId: workerId,
              status: 'initialized tesseract',
              progress: 1
            });
            res.resolve({
              loaded: true
            });
          });
          _context.next = 11;
          break;
        case 10:
          res.resolve({
            loaded: true
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function load(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
var FS = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_ref3, res) {
    var _TessModule$FS;
    var workerId, _ref3$payload, method, args;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          workerId = _ref3.workerId, _ref3$payload = _ref3.payload, method = _ref3$payload.method, args = _ref3$payload.args;
          log("[".concat(workerId, "]: FS.").concat(method));
          res.resolve((_TessModule$FS = TessModule.FS)[method].apply(_TessModule$FS, _toConsumableArray(args)));
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function FS(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();
var loadLanguage = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(_ref5, res) {
    var workerId, _ref5$payload, langs, _ref5$payload$options, langPath, dataPath, cachePath, cacheMethod, _ref5$payload$options2, gzip, loadAndGunzipFile;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          workerId = _ref5.workerId, _ref5$payload = _ref5.payload, langs = _ref5$payload.langs, _ref5$payload$options = _ref5$payload.options, langPath = _ref5$payload$options.langPath, dataPath = _ref5$payload$options.dataPath, cachePath = _ref5$payload$options.cachePath, cacheMethod = _ref5$payload$options.cacheMethod, _ref5$payload$options2 = _ref5$payload$options.gzip, gzip = _ref5$payload$options2 === void 0 ? true : _ref5$payload$options2;
          // Remember cache options for later, as cache may be deleted if `initialize` fails
          cachePathWorker = cachePath;
          cacheMethodWorker = cacheMethod;
          loadAndGunzipFile = /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_lang) {
              var lang, readCache, data, newData, _data, path, fetchUrl, resp, isGzip;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    lang = typeof _lang === 'string' ? _lang : _lang.code;
                    readCache = ['refresh', 'none'].includes(cacheMethod) ? function () {
                      return Promise.resolve();
                    } : adapter.readCache;
                    data = null;
                    newData = false; // Check for existing .traineddata file in cache
                    // This automatically fails if cacheMethod is set to 'refresh' or 'none'
                    _context3.prev = 4;
                    _context3.next = 7;
                    return readCache("".concat(cachePath || '.', "/").concat(lang, ".traineddata"));
                  case 7:
                    _data = _context3.sent;
                    if (!(typeof _data !== 'undefined')) {
                      _context3.next = 14;
                      break;
                    }
                    log("[".concat(workerId, "]: Load ").concat(lang, ".traineddata from cache"));
                    res.progress({
                      workerId: workerId,
                      status: 'loading language traineddata (from cache)',
                      progress: 0.5
                    });
                    data = _data;
                    _context3.next = 15;
                    break;
                  case 14:
                    throw Error('Not found in cache');
                  case 15:
                    _context3.next = 44;
                    break;
                  case 17:
                    _context3.prev = 17;
                    _context3.t0 = _context3["catch"](4);
                    newData = true;
                    log("[".concat(workerId, "]: Load ").concat(lang, ".traineddata from ").concat(langPath));
                    if (!(typeof _lang === 'string')) {
                      _context3.next = 43;
                      break;
                    }
                    path = null; // For Node.js, langPath may be a URL or local file path
                    // The is-url package is used to tell the difference
                    // For the browser version, langPath is assumed to be a URL
                    if (env !== 'node' || isURL(langPath) || langPath.startsWith('moz-extension://') || langPath.startsWith('chrome-extension://') || langPath.startsWith('file://')) {
                      /** When langPath is an URL */
                      path = langPath.replace(/\/$/, '');
                    }

                    // langPath is a URL, fetch from server
                    if (!(path !== null)) {
                      _context3.next = 38;
                      break;
                    }
                    fetchUrl = "".concat(path, "/").concat(lang, ".traineddata").concat(gzip ? '.gz' : '');
                    _context3.next = 28;
                    return (env === 'webworker' ? fetch : adapter.fetch)(fetchUrl);
                  case 28:
                    resp = _context3.sent;
                    if (resp.ok) {
                      _context3.next = 31;
                      break;
                    }
                    throw Error("Network error while fetching ".concat(fetchUrl, ". Response code: ").concat(resp.status));
                  case 31:
                    _context3.t1 = Uint8Array;
                    _context3.next = 34;
                    return resp.arrayBuffer();
                  case 34:
                    _context3.t2 = _context3.sent;
                    data = new _context3.t1(_context3.t2);
                    _context3.next = 41;
                    break;
                  case 38:
                    _context3.next = 40;
                    return adapter.readCache("".concat(langPath, "/").concat(lang, ".traineddata").concat(gzip ? '.gz' : ''));
                  case 40:
                    data = _context3.sent;
                  case 41:
                    _context3.next = 44;
                    break;
                  case 43:
                    data = _lang.data; // eslint-disable-line
                  case 44:
                    // Check for gzip magic numbers (1F and 8B in hex)
                    isGzip = data[0] === 31 && data[1] === 139 || data[1] === 31 && data[0] === 139;
                    if (isGzip) {
                      data = adapter.gunzip(data);
                    }
                    if (TessModule) {
                      if (dataPath) {
                        try {
                          TessModule.FS.mkdir(dataPath);
                        } catch (err) {
                          res.reject(err.toString());
                        }
                      }
                      TessModule.FS.writeFile("".concat(dataPath || '.', "/").concat(lang, ".traineddata"), data);
                    }
                    if (!(newData && ['write', 'refresh', undefined].includes(cacheMethod))) {
                      _context3.next = 57;
                      break;
                    }
                    _context3.prev = 48;
                    _context3.next = 51;
                    return adapter.writeCache("".concat(cachePath || '.', "/").concat(lang, ".traineddata"), data);
                  case 51:
                    _context3.next = 57;
                    break;
                  case 53:
                    _context3.prev = 53;
                    _context3.t3 = _context3["catch"](48);
                    log("[".concat(workerId, "]: Failed to write ").concat(lang, ".traineddata to cache due to error:"));
                    log(_context3.t3.toString());
                  case 57:
                    return _context3.abrupt("return", Promise.resolve());
                  case 58:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, null, [[4, 17], [48, 53]]);
            }));
            return function loadAndGunzipFile(_x7) {
              return _ref7.apply(this, arguments);
            };
          }();
          res.progress({
            workerId: workerId,
            status: 'loading language traineddata',
            progress: 0
          });
          _context4.prev = 5;
          _context4.next = 8;
          return Promise.all((typeof langs === 'string' ? langs.split('+') : langs).map(loadAndGunzipFile));
        case 8:
          res.progress({
            workerId: workerId,
            status: 'loaded language traineddata',
            progress: 1
          });
          res.resolve(langs);
          _context4.next = 15;
          break;
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](5);
          res.reject(_context4.t0.toString());
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[5, 12]]);
  }));
  return function loadLanguage(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();
var setParameters = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(_ref8, res) {
    var _params, initParamNames, initParamStr;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _params = _ref8.payload.params;
          // A small number of parameters can only be set at initialization.
          // These can only be set using (1) the `oem` argument of `initialize` (for setting the oem)
          // or (2) the `config` argument of `initialize` (for all other settings).
          // Attempting to set these using this function will have no impact so a warning is printed.
          // This list is generated by searching the Tesseract codebase for parameters
          // defined with `[type]_INIT_MEMBER` rather than `[type]_MEMBER`.
          initParamNames = ['ambigs_debug_level', 'user_words_suffix', 'user_patterns_suffix', 'user_patterns_suffix', 'load_system_dawg', 'load_freq_dawg', 'load_unambig_dawg', 'load_punc_dawg', 'load_number_dawg', 'load_bigram_dawg', 'tessedit_ocr_engine_mode', 'tessedit_init_config_only', 'language_model_ngram_on', 'language_model_use_sigmoidal_certainty'];
          initParamStr = Object.keys(_params).filter(function (k) {
            return initParamNames.includes(k);
          }).join(', ');
          if (initParamStr.length > 0) console.log("Attempted to set parameters that can only be set during initialization: ".concat(initParamStr));
          Object.keys(_params).filter(function (k) {
            return !k.startsWith('tessjs_');
          }).forEach(function (key) {
            api.SetVariable(key, _params[key]);
          });
          params = _objectSpread(_objectSpread({}, params), _params);
          if (typeof res !== 'undefined') {
            res.resolve(params);
          }
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function setParameters(_x8, _x9) {
    return _ref9.apply(this, arguments);
  };
}();
var initialize = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(_ref10, res) {
    var workerId, _ref10$payload, _langs, oem, config, langs, configFile, configStr, status, langsArr, delCachePromise;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          workerId = _ref10.workerId, _ref10$payload = _ref10.payload, _langs = _ref10$payload.langs, oem = _ref10$payload.oem, config = _ref10$payload.config;
          langs = typeof _langs === 'string' ? _langs : _langs.map(function (l) {
            return typeof l === 'string' ? l : l.data;
          }).join('+');
          _context6.prev = 2;
          res.progress({
            workerId: workerId,
            status: 'initializing api',
            progress: 0
          });
          if (api !== null) {
            api.End();
          }
          // config argument may either be config file text, or object with key/value pairs
          // In the latter case we convert to config file text here
          if (_typeof(config) === 'object') {
            configStr = JSON.stringify(config).replace(/,/g, '\n').replace(/:/g, ' ').replace(/["'{}]/g, '');
          } else {
            configStr = config;
          }
          if (typeof configStr === 'string') {
            configFile = '/config';
            TessModule.FS.writeFile(configFile, configStr);
          }
          api = new TessModule.TessBaseAPI();
          status = api.Init(null, langs, oem);
          if (!(status === -1)) {
            _context6.next = 16;
            break;
          }
          if (!['write', 'refresh', undefined].includes(cacheMethodWorker)) {
            _context6.next = 15;
            break;
          }
          langsArr = langs.split('+');
          delCachePromise = langsArr.map(function (lang) {
            return adapter.deleteCache("".concat(cachePathWorker || '.', "/").concat(lang, ".traineddata"));
          });
          _context6.next = 15;
          return Promise.all(delCachePromise);
        case 15:
          res.reject('initialization failed');
        case 16:
          params = defaultParams;
          _context6.next = 19;
          return setParameters({
            payload: {
              params: params
            }
          });
        case 19:
          res.progress({
            workerId: workerId,
            status: 'initialized api',
            progress: 1
          });
          res.resolve();
          _context6.next = 26;
          break;
        case 23:
          _context6.prev = 23;
          _context6.t0 = _context6["catch"](2);
          res.reject(_context6.t0.toString());
        case 26:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[2, 23]]);
  }));
  return function initialize(_x10, _x11) {
    return _ref11.apply(this, arguments);
  };
}();
var getPDFInternal = function getPDFInternal(title, textonly) {
  var pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
  pdfRenderer.BeginDocument(title);
  pdfRenderer.AddImage(api);
  pdfRenderer.EndDocument();
  TessModule._free(pdfRenderer);
  return TessModule.FS.readFile('/tesseract-ocr.pdf');
};
var getPDF = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(_ref12, res) {
    var _ref12$payload, title, textonly;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _ref12$payload = _ref12.payload, title = _ref12$payload.title, textonly = _ref12$payload.textonly;
          res.resolve(getPDFInternal(title, textonly));
        case 2:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function getPDF(_x12, _x13) {
    return _ref13.apply(this, arguments);
  };
}();

// Combines default output with user-specified options and
// counts (1) total output formats requested and (2) outputs that require OCR
var processOutput = function processOutput(output) {
  var workingOutput = JSON.parse(JSON.stringify(defaultOutput));
  // Output formats were set using `setParameters` in previous versions
  // These settings are copied over for compatability
  if (params.tessjs_create_box === '1') workingOutput.box = true;
  if (params.tessjs_create_hocr === '1') workingOutput.hocr = true;
  if (params.tessjs_create_osd === '1') workingOutput.osd = true;
  if (params.tessjs_create_tsv === '1') workingOutput.tsv = true;
  if (params.tessjs_create_unlv === '1') workingOutput.unlv = true;
  var nonRecOutputs = ['imageColor', 'imageGrey', 'imageBinary', 'layoutBlocks', 'debug'];
  var recOutputCount = 0;
  for (var _i = 0, _Object$keys = Object.keys(output); _i < _Object$keys.length; _i++) {
    var prop = _Object$keys[_i];
    workingOutput[prop] = output[prop];
  }
  for (var _i2 = 0, _Object$keys2 = Object.keys(workingOutput); _i2 < _Object$keys2.length; _i2++) {
    var _prop = _Object$keys2[_i2];
    if (workingOutput[_prop]) {
      if (!nonRecOutputs.includes(_prop)) {
        recOutputCount += 1;
      }
    }
  }
  var skipRecognition = recOutputCount === 0;
  return {
    workingOutput: workingOutput,
    skipRecognition: skipRecognition
  };
};

// List of options for Tesseract.js (rather than passed through to Tesseract),
// not including those with prefix "tessjs_"
var tessjsOptions = ['rectangle', 'pdfTitle', 'pdfTextOnly', 'rotateAuto', 'rotateRadians'];
var recognize = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(_ref14, res) {
    var _ref14$payload, image, options, output, optionsTess, _i3, _Object$keys3, param, _i4, _Object$keys4, prop, _processOutput, workingOutput, skipRecognition, rotateRadiansFinal, psmInit, psmEdit, rotateRadiansCalc, rec, pdfTitle, pdfTextOnly, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _ref14$payload = _ref14.payload, image = _ref14$payload.image, options = _ref14$payload.options, output = _ref14$payload.output;
          try {
            optionsTess = {};
            if (_typeof(options) === 'object' && Object.keys(options).length > 0) {
              // The options provided by users contain a mix of options for Tesseract.js
              // and parameters passed through to Tesseract.
              for (_i3 = 0, _Object$keys3 = Object.keys(options); _i3 < _Object$keys3.length; _i3++) {
                param = _Object$keys3[_i3];
                if (!param.startsWith('tessjs_') && !tessjsOptions.includes(param)) {
                  optionsTess[param] = options[param];
                }
              }
            }
            if (output.debug) {
              optionsTess.debug_file = '/debugInternal.txt';
              TessModule.FS.writeFile('/debugInternal.txt', '');
            }
            // If any parameters are changed here they are changed back at the end
            if (Object.keys(optionsTess).length > 0) {
              api.SaveParameters();
              for (_i4 = 0, _Object$keys4 = Object.keys(optionsTess); _i4 < _Object$keys4.length; _i4++) {
                prop = _Object$keys4[_i4];
                api.SetVariable(prop, optionsTess[prop]);
              }
            }
            _processOutput = processOutput(output), workingOutput = _processOutput.workingOutput, skipRecognition = _processOutput.skipRecognition; // When the auto-rotate option is True, setImage is called with no angle,
            // then the angle is calculated by Tesseract and then setImage is re-called.
            // Otherwise, setImage is called once using the user-provided rotateRadiansFinal value.
            if (options.rotateAuto) {
              // The angle is only detected if auto page segmentation is used
              // Therefore, if this is not the mode specified by the user, it is enabled temporarily here
              psmInit = api.GetPageSegMode();
              psmEdit = false;
              if (![PSM.AUTO, PSM.AUTO_ONLY, PSM.OSD].includes(psmInit)) {
                psmEdit = true;
                api.SetVariable('tessedit_pageseg_mode', String(PSM.AUTO));
              }
              setImage(TessModule, api, image);
              api.FindLines();

              // The function GetAngle will be replaced with GetGradient in 4.0.4,
              // but for now we want to maintain compatibility.
              // We can switch to only using GetGradient in v5.
              rotateRadiansCalc = api.GetGradient ? api.GetGradient() : api.GetAngle(); // Restore user-provided PSM setting
              if (psmEdit) {
                api.SetVariable('tessedit_pageseg_mode', String(psmInit));
              }

              // Small angles (<0.005 radians/~0.3 degrees) are ignored to save on runtime
              if (Math.abs(rotateRadiansCalc) >= 0.005) {
                rotateRadiansFinal = rotateRadiansCalc;
                setImage(TessModule, api, image, rotateRadiansFinal);
              } else {
                // Image needs to be reset if run with different PSM setting earlier
                if (psmEdit) {
                  setImage(TessModule, api, image);
                }
                rotateRadiansFinal = 0;
              }
            } else {
              rotateRadiansFinal = options.rotateRadians || 0;
              setImage(TessModule, api, image, rotateRadiansFinal);
            }
            rec = options.rectangle;
            if (_typeof(rec) === 'object') {
              api.SetRectangle(rec.left, rec.top, rec.width, rec.height);
            }
            if (!skipRecognition) {
              api.Recognize(null);
            } else {
              if (output.layoutBlocks) {
                api.AnalyseLayout();
              }
              log('Skipping recognition: all output options requiring recognition are disabled.');
            }
            pdfTitle = options.pdfTitle;
            pdfTextOnly = options.pdfTextOnly;
            result = dump(TessModule, api, workingOutput, {
              pdfTitle: pdfTitle,
              pdfTextOnly: pdfTextOnly,
              skipRecognition: skipRecognition
            });
            result.rotateRadians = rotateRadiansFinal;
            if (output.debug) TessModule.FS.unlink('/debugInternal.txt');
            if (Object.keys(optionsTess).length > 0) {
              api.RestoreParameters();
            }
            res.resolve(result);
          } catch (err) {
            res.reject(err.toString());
          }
        case 2:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function recognize(_x14, _x15) {
    return _ref15.apply(this, arguments);
  };
}();
var detect = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(_ref16, res) {
    var image, results, best, oid, sid;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          image = _ref16.payload.image;
          try {
            setImage(TessModule, api, image);
            results = new TessModule.OSResults();
            if (!api.DetectOS(results)) {
              res.resolve({
                tesseract_script_id: null,
                script: null,
                script_confidence: null,
                orientation_degrees: null,
                orientation_confidence: null
              });
            } else {
              best = results.best_result;
              oid = best.orientation_id;
              sid = best.script_id;
              res.resolve({
                tesseract_script_id: sid,
                script: results.unicharset.get_script_from_script_id(sid),
                script_confidence: best.sconfidence,
                orientation_degrees: [0, 270, 180, 90][oid],
                orientation_confidence: best.oconfidence
              });
            }
          } catch (err) {
            res.reject(err.toString());
          }
        case 2:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function detect(_x16, _x17) {
    return _ref17.apply(this, arguments);
  };
}();
var terminate = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(_, res) {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          try {
            if (api !== null) {
              api.End();
            }
            res.resolve({
              terminated: true
            });
          } catch (err) {
            res.reject(err.toString());
          }
        case 1:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function terminate(_x18, _x19) {
    return _ref18.apply(this, arguments);
  };
}();

/**
 * dispatchHandlers
 *
 * @name dispatchHandlers
 * @function worker data handler
 * @access public
 * @param {object} data
 * @param {string} data.jobId - unique job id
 * @param {string} data.action - action of the job, only recognize and detect for now
 * @param {object} data.payload - data for the job
 * @param {function} send - trigger job to work
 */
exports.dispatchHandlers = function (packet, send) {
  var res = function res(status, data) {
    // Return only the necessary info to avoid sending unnecessarily large messages
    var packetRes = {
      jobId: packet.jobId,
      workerId: packet.workerId,
      action: packet.action
    };
    send(_objectSpread(_objectSpread({}, packetRes), {}, {
      status: status,
      data: data
    }));
  };
  res.resolve = res.bind(_this, 'resolve');
  res.reject = res.bind(_this, 'reject');
  res.progress = res.bind(_this, 'progress');
  latestJob = res;
  ({
    load: load,
    FS: FS,
    loadLanguage: loadLanguage,
    initialize: initialize,
    setParameters: setParameters,
    recognize: recognize,
    getPDF: getPDF,
    detect: detect,
    terminate: terminate
  })[packet.action](packet, res).catch(function (err) {
    return res.reject(err.toString());
  });
};

/**
 * setAdapter
 *
 * @name setAdapter
 * @function
 * @access public
 * @param {object} adapter - implementation of the worker, different in browser and node environment
 */
exports.setAdapter = function (_adapter) {
  adapter = _adapter;
};

/***/ }),

/***/ "./src/worker-script/utils/arrayBufferToBase64.js":
/*!********************************************************!*\
  !*** ./src/worker-script/utils/arrayBufferToBase64.js ***!
  \********************************************************/
/***/ ((module) => {

// Copied from https://gist.github.com/jonleighton/958841
// Copyright 2011 Jon Leighton, MIT LICENSE

/* eslint no-bitwise: 0 */
module.exports = function (arrayBuffer) {
  var base64 = '';
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;
  var a;
  var b;
  var c;
  var d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += "".concat(encodings[a] + encodings[b], "==");
  } else if (byteRemainder === 2) {
    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += "".concat(encodings[a] + encodings[b] + encodings[c], "=");
  }
  return base64;
};

/***/ }),

/***/ "./src/worker-script/utils/dump.js":
/*!*****************************************!*\
  !*** ./src/worker-script/utils/dump.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 *
 * Dump data to a big JSON tree
 *
 * @fileoverview dump data to JSON tree
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
var arrayBufferToBase64 = __webpack_require__(/*! ./arrayBufferToBase64 */ "./src/worker-script/utils/arrayBufferToBase64.js");
var imageType = __webpack_require__(/*! ../../constants/imageType */ "./src/constants/imageType.js");

/**
 * deindent
 *
 * The generated HOCR is excessively indented, so
 * we get rid of that indentation
 *
 * @name deindent
 * @function deindent string
 * @access public
 */
var deindent = function deindent(html) {
  var lines = html.split('\n');
  if (lines[0].substring(0, 2) === '  ') {
    for (var i = 0; i < lines.length; i += 1) {
      if (lines[i].substring(0, 2) === '  ') {
        lines[i] = lines[i].slice(2);
      }
    }
  }
  return lines.join('\n');
};

/**
 * dump
 *
 * @name dump
 * @function dump recognition result to a JSON object
 * @access public
 */
module.exports = function (TessModule, api, output, options) {
  var _options$pdfTitle, _options$pdfTextOnly;
  var ri = api.GetIterator();
  var RIL_BLOCK = TessModule.RIL_BLOCK,
    RIL_PARA = TessModule.RIL_PARA,
    RIL_TEXTLINE = TessModule.RIL_TEXTLINE,
    RIL_WORD = TessModule.RIL_WORD,
    RIL_SYMBOL = TessModule.RIL_SYMBOL;
  var blocks = [];
  var block;
  var para;
  var textline;
  var word;
  var symbol;
  var enumToString = function enumToString(value, prefix) {
    return Object.keys(TessModule).filter(function (e) {
      return e.startsWith("".concat(prefix, "_")) && TessModule[e] === value;
    }).map(function (e) {
      return e.slice(prefix.length + 1);
    })[0];
  };
  var getImage = function getImage(type) {
    api.WriteImage(type, '/image.png');
    var pngBuffer = TessModule.FS.readFile('/image.png');
    var pngStr = "data:image/png;base64,".concat(arrayBufferToBase64(pngBuffer.buffer));
    TessModule.FS.unlink('/image.png');
    return pngStr;
  };
  var getPDFInternal = function getPDFInternal(title, textonly) {
    var pdfRenderer = new TessModule.TessPDFRenderer('tesseract-ocr', '/', textonly);
    pdfRenderer.BeginDocument(title);
    pdfRenderer.AddImage(api);
    pdfRenderer.EndDocument();
    TessModule._free(pdfRenderer);
    return TessModule.FS.readFile('/tesseract-ocr.pdf');
  };

  // If output.layoutBlocks is true and options.skipRecognition is true,
  // the user wants layout data but text recognition has not been run.
  // In this case, fields that require text recognition are skipped.
  if (output.blocks || output.layoutBlocks) {
    ri.Begin();
    do {
      if (ri.IsAtBeginningOf(RIL_BLOCK)) {
        var poly = ri.BlockPolygon();
        var polygon = null;
        // BlockPolygon() returns null when automatic page segmentation is off
        if (TessModule.getPointer(poly) > 0) {
          var n = poly.get_n();
          var px = poly.get_x();
          var py = poly.get_y();
          polygon = [];
          for (var i = 0; i < n; i += 1) {
            polygon.push([px.getValue(i), py.getValue(i)]);
          }
          /*
           * TODO: find out why _ptaDestroy doesn't work
           */
          // TessModule._ptaDestroy(TessModule.getPointer(poly));
        }

        block = {
          paragraphs: [],
          text: !options.skipRecognition ? ri.GetUTF8Text(RIL_BLOCK) : null,
          confidence: !options.skipRecognition ? ri.Confidence(RIL_BLOCK) : null,
          baseline: ri.getBaseline(RIL_BLOCK),
          bbox: ri.getBoundingBox(RIL_BLOCK),
          blocktype: enumToString(ri.BlockType(), 'PT'),
          polygon: polygon
        };
        blocks.push(block);
      }
      if (ri.IsAtBeginningOf(RIL_PARA)) {
        para = {
          lines: [],
          text: !options.skipRecognition ? ri.GetUTF8Text(RIL_PARA) : null,
          confidence: !options.skipRecognition ? ri.Confidence(RIL_PARA) : null,
          baseline: ri.getBaseline(RIL_PARA),
          bbox: ri.getBoundingBox(RIL_PARA),
          is_ltr: !!ri.ParagraphIsLtr()
        };
        block.paragraphs.push(para);
      }
      if (ri.IsAtBeginningOf(RIL_TEXTLINE)) {
        textline = {
          words: [],
          text: !options.skipRecognition ? ri.GetUTF8Text(RIL_TEXTLINE) : null,
          confidence: !options.skipRecognition ? ri.Confidence(RIL_TEXTLINE) : null,
          baseline: ri.getBaseline(RIL_TEXTLINE),
          bbox: ri.getBoundingBox(RIL_TEXTLINE)
        };
        para.lines.push(textline);
      }
      if (ri.IsAtBeginningOf(RIL_WORD)) {
        var fontInfo = ri.getWordFontAttributes();
        var wordDir = ri.WordDirection();
        word = {
          symbols: [],
          choices: [],
          text: !options.skipRecognition ? ri.GetUTF8Text(RIL_WORD) : null,
          confidence: !options.skipRecognition ? ri.Confidence(RIL_WORD) : null,
          baseline: ri.getBaseline(RIL_WORD),
          bbox: ri.getBoundingBox(RIL_WORD),
          is_numeric: !!ri.WordIsNumeric(),
          in_dictionary: !!ri.WordIsFromDictionary(),
          direction: enumToString(wordDir, 'DIR'),
          language: ri.WordRecognitionLanguage(),
          is_bold: fontInfo.is_bold,
          is_italic: fontInfo.is_italic,
          is_underlined: fontInfo.is_underlined,
          is_monospace: fontInfo.is_monospace,
          is_serif: fontInfo.is_serif,
          is_smallcaps: fontInfo.is_smallcaps,
          font_size: fontInfo.pointsize,
          font_id: fontInfo.font_id,
          font_name: fontInfo.font_name
        };
        var wc = new TessModule.WordChoiceIterator(ri);
        do {
          word.choices.push({
            text: !options.skipRecognition ? wc.GetUTF8Text() : null,
            confidence: !options.skipRecognition ? wc.Confidence() : null
          });
        } while (wc.Next());
        TessModule.destroy(wc);
        textline.words.push(word);
      }

      // let image = null;
      // var pix = ri.GetBinaryImage(TessModule.RIL_SYMBOL)
      // var image = pix2array(pix);
      // // for some reason it seems that things stop working if you destroy pics
      // TessModule._pixDestroy(TessModule.getPointer(pix));
      if (ri.IsAtBeginningOf(RIL_SYMBOL)) {
        symbol = {
          choices: [],
          image: null,
          text: !options.skipRecognition ? ri.GetUTF8Text(RIL_SYMBOL) : null,
          confidence: !options.skipRecognition ? ri.Confidence(RIL_SYMBOL) : null,
          baseline: ri.getBaseline(RIL_SYMBOL),
          bbox: ri.getBoundingBox(RIL_SYMBOL),
          is_superscript: !!ri.SymbolIsSuperscript(),
          is_subscript: !!ri.SymbolIsSubscript(),
          is_dropcap: !!ri.SymbolIsDropcap()
        };
        word.symbols.push(symbol);
        var ci = new TessModule.ChoiceIterator(ri);
        do {
          symbol.choices.push({
            text: !options.skipRecognition ? ci.GetUTF8Text() : null,
            confidence: !options.skipRecognition ? ci.Confidence() : null
          });
        } while (ci.Next());
        // TessModule.destroy(i);
      }
    } while (ri.Next(RIL_SYMBOL));
    TessModule.destroy(ri);
  }
  return {
    text: output.text ? api.GetUTF8Text() : null,
    hocr: output.hocr ? deindent(api.GetHOCRText()) : null,
    tsv: output.tsv ? api.GetTSVText() : null,
    box: output.box ? api.GetBoxText() : null,
    unlv: output.unlv ? api.GetUNLVText() : null,
    osd: output.osd ? api.GetOsdText() : null,
    pdf: output.pdf ? getPDFInternal((_options$pdfTitle = options.pdfTitle) !== null && _options$pdfTitle !== void 0 ? _options$pdfTitle : 'Tesseract OCR Result', (_options$pdfTextOnly = options.pdfTextOnly) !== null && _options$pdfTextOnly !== void 0 ? _options$pdfTextOnly : false) : null,
    imageColor: output.imageColor ? getImage(imageType.COLOR) : null,
    imageGrey: output.imageGrey ? getImage(imageType.GREY) : null,
    imageBinary: output.imageBinary ? getImage(imageType.BINARY) : null,
    confidence: !options.skipRecognition ? api.MeanTextConf() : null,
    blocks: output.blocks && !options.skipRecognition ? blocks : null,
    layoutBlocks: output.layoutBlocks && options.skipRecognition ? blocks : null,
    psm: enumToString(api.GetPageSegMode(), 'PSM'),
    oem: enumToString(api.oem(), 'OEM'),
    version: api.Version(),
    debug: output.debug ? TessModule.FS.readFile('/debugInternal.txt', {
      encoding: 'utf8',
      flags: 'a+'
    }) : null
  };
};

/***/ }),

/***/ "./src/worker-script/utils/setImage.js":
/*!*********************************************!*\
  !*** ./src/worker-script/utils/setImage.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var bmp = __webpack_require__(/*! bmp-js */ "./node_modules/bmp-js/index.js");

/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */
module.exports = function (TessModule, api, image) {
  var _image$slice$join$mat;
  var angle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  // Check for bmp magic numbers (42 and 4D in hex)
  var isBmp = image[0] === 66 && image[1] === 77 || image[1] === 66 && image[0] === 77;
  var exif = parseInt((_image$slice$join$mat = image.slice(0, 500).join(' ').match(/1 18 0 3 0 0 0 1 0 (\d)/)) === null || _image$slice$join$mat === void 0 ? void 0 : _image$slice$join$mat[1], 10) || 1;

  // /*
  //  * Leptonica supports some but not all bmp files
  //  * @see https://github.com/DanBloomberg/leptonica/issues/607#issuecomment-1068802516
  //  * We therefore use bmp-js to convert all bmp files into a format Leptonica is known to support
  //  */
  if (isBmp) {
    // Not sure what this line actually does, but removing breaks the function
    var buf = Buffer.from(Array.from(_objectSpread(_objectSpread({}, image), {}, {
      length: Object.keys(image).length
    })));
    var bmpBuf = bmp.decode(buf);
    TessModule.FS.writeFile('/input', bmp.encode(bmpBuf).data);
  } else {
    TessModule.FS.writeFile('/input', image);
  }
  var res = api.SetImageFile(exif, angle);
  if (res === 1) throw Error('Error attempting to read image.');
};

/***/ }),

/***/ "./node_modules/idb-keyval/dist/index.js":
/*!***********************************************!*\
  !*** ./node_modules/idb-keyval/dist/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "createStore": () => (/* binding */ createStore),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "delMany": () => (/* binding */ delMany),
/* harmony export */   "entries": () => (/* binding */ entries),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "getMany": () => (/* binding */ getMany),
/* harmony export */   "keys": () => (/* binding */ keys),
/* harmony export */   "promisifyRequest": () => (/* binding */ promisifyRequest),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "setMany": () => (/* binding */ setMany),
/* harmony export */   "update": () => (/* binding */ update),
/* harmony export */   "values": () => (/* binding */ values)
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function promisifyRequest(request) {
  return new Promise(function (resolve, reject) {
    // @ts-ignore - file size hacks
    request.oncomplete = request.onsuccess = function () {
      return resolve(request.result);
    };
    // @ts-ignore - file size hacks
    request.onabort = request.onerror = function () {
      return reject(request.error);
    };
  });
}
function createStore(dbName, storeName) {
  var request = indexedDB.open(dbName);
  request.onupgradeneeded = function () {
    return request.result.createObjectStore(storeName);
  };
  var dbp = promisifyRequest(request);
  return function (txMode, callback) {
    return dbp.then(function (db) {
      return callback(db.transaction(storeName, txMode).objectStore(storeName));
    });
  };
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore('keyval-store', 'keyval');
  }
  return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key) {
  var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
  return customStore('readonly', function (store) {
    return promisifyRequest(store.get(key));
  });
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set(key, value) {
  var customStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetStore();
  return customStore('readwrite', function (store) {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function setMany(entries) {
  var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
  return customStore('readwrite', function (store) {
    entries.forEach(function (entry) {
      return store.put(entry[1], entry[0]);
    });
    return promisifyRequest(store.transaction);
  });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function getMany(keys) {
  var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
  return customStore('readonly', function (store) {
    return Promise.all(keys.map(function (key) {
      return promisifyRequest(store.get(key));
    }));
  });
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function update(key, updater) {
  var customStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetStore();
  return customStore('readwrite', function (store) {
    return (
      // Need to create the promise manually.
      // If I try to chain promises, the transaction closes in browsers
      // that use a promise polyfill (IE10/11).
      new Promise(function (resolve, reject) {
        store.get(key).onsuccess = function () {
          try {
            store.put(updater(this.result), key);
            resolve(promisifyRequest(store.transaction));
          } catch (err) {
            reject(err);
          }
        };
      })
    );
  });
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function del(key) {
  var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
  return customStore('readwrite', function (store) {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
/**
 * Delete multiple keys at once.
 *
 * @param keys List of keys to delete.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function delMany(keys) {
  var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
  return customStore('readwrite', function (store) {
    keys.forEach(function (key) {
      return store.delete(key);
    });
    return promisifyRequest(store.transaction);
  });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function clear() {
  var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
  return customStore('readwrite', function (store) {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}
function eachCursor(store, callback) {
  store.openCursor().onsuccess = function () {
    if (!this.result) return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function keys() {
  var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
  return customStore('readonly', function (store) {
    // Fast path for modern browsers
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    var items = [];
    return eachCursor(store, function (cursor) {
      return items.push(cursor.key);
    }).then(function () {
      return items;
    });
  });
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function values() {
  var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
  return customStore('readonly', function (store) {
    // Fast path for modern browsers
    if (store.getAll) {
      return promisifyRequest(store.getAll());
    }
    var items = [];
    return eachCursor(store, function (cursor) {
      return items.push(cursor.value);
    }).then(function () {
      return items;
    });
  });
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function entries() {
  var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
  return customStore('readonly', function (store) {
    // Fast path for modern browsers
    // (although, hopefully we'll get a simpler path some day)
    if (store.getAll && store.getAllKeys) {
      return Promise.all([promisifyRequest(store.getAllKeys()), promisifyRequest(store.getAll())]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          keys = _ref2[0],
          values = _ref2[1];
        return keys.map(function (key, i) {
          return [key, values[i]];
        });
      });
    }
    var items = [];
    return customStore('readonly', function (store) {
      return eachCursor(store, function (cursor) {
        return items.push([cursor.key, cursor.value]);
      }).then(function () {
        return items;
      });
    });
  });
}


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"tesseract.js","version":"4.1.4","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.dev.js","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.21.4","@babel/eslint-parser":"^7.21.3","@babel/preset-env":"^7.21.4","@rollup/plugin-commonjs":"^24.1.0","acorn":"^8.8.2","babel-loader":"^9.1.2","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.32.0","eslint-config-airbnb-base":"^14.2.1","eslint-plugin-import":"^2.27.5","expect.js":"^0.3.1","express":"^4.18.2","mocha":"^10.2.0","mocha-headless-chrome":"^4.0.0","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^5.0.0","rollup":"^3.20.7","wait-on":"^7.0.1","webpack":"^5.79.0","webpack-bundle-analyzer":"^4.8.0","webpack-cli":"^5.0.1","webpack-dev-middleware":"^6.0.2","rollup-plugin-sourcemaps":"^0.6.3"},"dependencies":{"bmp-js":"^0.1.0","idb-keyval":"^6.2.0","is-electron":"^2.2.2","is-url":"^1.2.4","node-fetch":"^2.6.9","opencollective-postinstall":"^2.0.3","regenerator-runtime":"^0.13.3","tesseract.js-core":"^4.0.4","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"overrides":{"@rollup/pluginutils":"^5.0.2"},"repository":{"type":"git","url":"https://github.com/naptha/tesseract.js.git"},"bugs":{"url":"https://github.com/naptha/tesseract.js/issues"},"homepage":"https://github.com/naptha/tesseract.js","collective":{"type":"opencollective","url":"https://opencollective.com/tesseractjs"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./src/worker-script/browser/index.js ***!
  \********************************************/
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 *
 * Browser worker scripts
 *
 * @fileoverview Browser worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

var worker = __webpack_require__(/*! .. */ "./src/worker-script/index.js");
var getCore = __webpack_require__(/*! ./getCore */ "./src/worker-script/browser/getCore.js");
var gunzip = __webpack_require__(/*! ./gunzip */ "./src/worker-script/browser/gunzip.js");
var cache = __webpack_require__(/*! ./cache */ "./src/worker-script/browser/cache.js");

/*
 * register message handler
 */
__webpack_require__.g.addEventListener('message', function (_ref) {
  var data = _ref.data;
  worker.dispatchHandlers(data, function (obj) {
    return postMessage(obj);
  });
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
worker.setAdapter(_objectSpread({
  getCore: getCore,
  gunzip: gunzip,
  fetch: function fetch() {}
}, cache));
})();

/******/ })()
;
//# sourceMappingURL=worker.dev.js.map