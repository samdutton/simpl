// @name: Device.js
// @require: Valid.js, Spec.js
// @cutouff: @assert @node @androidjp @windowsphone

(function(global) {
"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert
var Spec = global["Spec"] || require("uupaa.spec.js");

var _inNode = "process" in global;

// --- define ----------------------------------------------
// --- OS TYPE ---
var IOS         = 1;
var ANDROID     = 2;
var WPHONE      = 3;
var GAME        = 4;
var FIREFOXOS   = 5;

// --- Device Brand / Maker ---
var APPLE       = 1;
var GOOGLE      = 2;
var AMAZON      = 3;
var MICROSOFT   = 4;
var NINTENDO    = 5;
var SONY        = 6;
var SHARP       = 30;
var FUJITSU     = 31;
var NEC         = 32;
var PANASONIC   = 33;
var TOSHIBA     = 34;
var KYOCERA     = 35;
var CASIO       = 36;
var DELL        = 37;
var ACER        = 38;
var NOKIA       = 39;
var SAMSUNG     = 40;
var HUAWEI      = 41;
var PANTECH     = 42;
var LG          = 43;
var ZTE         = 45;
var HTC         = 44;
var MOTOROLA    = 46;
var ASUS        = 47;
var RAKUTEN     = 48;
var MOZILLA     = 50;

// --- SoC ---
var A4          = 10;
var A5          = 11;
var A5X         = 12;
var A6          = 13;
var A6X         = 14;
var A7          = 15;
var Z2560       = 50;
var MSM7227     = 100;
var QSD8250     = 101;
var QSD8650     = 102;
var MSM8225     = 103;
var APQ8055     = 104;
var MSM7230     = 105;
var MSM8227     = 106;
var MSM8230     = 107;
var MSM8255     = 108;
var MSM8255T    = 109;
var MSM8260     = 110;
var MSM8627     = 111;
var MSM8655     = 112;
var MSM8660     = 113;
var APQ8060     = 114;
var MSM8260A    = 115;
var MSM8660A    = 116;
var MSM8960     = 117;
var APQ8064     = 118;
var APQ8064T    = 119;
var APQ8064AB   = 120;
var MSM8930     = 121;
var MSM8974     = 122;
var APQ8074     = 123;
var MSM8974AB   = 124;
var MSM8974AC   = 125;
var T20         = 300;
var AP25H       = 301;
var AP33        = 302;
var AP37        = 303;
var T30L        = 304;
var OMAP3630    = 330;
var OMAP4430    = 331;
var OMAP4460    = 332;
var OMAP4470    = 333;
var S5PC110     = 352;
var EXYNOS4210  = 353;
var EXYNOS4412  = 354;
var EXYNOS5250  = 355;
var S5L8900     = 350;
var S5PC100     = 351;
var K3V2        = 370;
var K3V2T       = 371;
var MTK8125     = 380;
var APE5R       = 390;
var CXD5315GG   = 400;
var LOWSPEC     = 401; // LowSpec Game Console
var HIGHSPEC    = 402; // HighSpec Game Console

// --- WiFi, GPS, 3G, LTE, NFC ---
var FN_WIFI     = 0x0001;
var FN_GPS      = 0x0002;
var FN_3G       = 0x0004;
var FN_LTE      = 0x0008;
var FN_NFC      = 0x0010;
var FN_BTLE     = 0x0100; // Bluetooth low energy
var FN_DIRECT   = 0x0200; // WiFi Direct
// alias
var FN_WG3LN    = FN_WIFI | FN_GPS | FN_3G | FN_LTE | FN_NFC;
var FN_WG3_N    = FN_WIFI | FN_GPS | FN_3G |          FN_NFC;
var FN_WG3L_    = FN_WIFI | FN_GPS | FN_3G | FN_LTE;
var FN_WG3__    = FN_WIFI | FN_GPS | FN_3G;
var FN_WG__N    = FN_WIFI | FN_GPS |                  FN_NFC;
var FN_W_3L_    = FN_WIFI |          FN_3G | FN_LTE;
var FN__G3L_    =           FN_GPS | FN_3G | FN_LTE;
var FN_WG___    = FN_WIFI | FN_GPS;
var FN_W____    = FN_WIFI;

// --- CPU type ---
var ARM         = 1;
var ARM64       = 2;
var ATOM        = 3;

// --- GPU type ---
var POWERVR     = 1;
var ADRENO      = 2;
var TEGRA       = 3;
var MALI        = 4;
var IMMERSION   = 5;

// --- OS HIGHEST VERSION ---
var IVER        = 710; // 2014-04-10
var AVER        = 443; // 2014-04-10

var CPU_TYPES = {
        0:  "UNKNOWN",  1:  "ARM",      2:  "ARM64",    3: "ATOM"
    };
var OS_TYPES = {
        0:  "UNKNOWN",  1:  "iOS",      2:  "Android",  3:  "Windows Phone",
        4:  "Game",     5:  "Firefox OS"
    };
var GPU_TYPES = {
        0:  "UNKNOWN",  1:  "PowerVR",  2:  "Adreno",   3:  "Tegra",
        4:  "Mali",     5:  "Immersion"
    };
var BRANDS = {
        0:  "UNKNOWN",
        1:  "Apple",    2:  "Google",   3:  "Amazon",   4:  "MicroSoft",
        5:  "Nintendo", 6:  "SONY",
        30: "SHARP",    31: "Fujitsu",  32: "NEC",      33: "Panasonic",
        34: "TOSHIBA",  35: "Kyocera",  36: "CASIO",    37: "DELL",
        38: "Acer",     39: "Nokia",    40: "Samsung",  41: "Huawei",
        42: "Pantech",  43: "LG",       44: "HTC",      45: "ZTE",
        46: "Motorola", 47: "ASUS",     48: "Rakuten",  49: "Spreadtrum",
        50: "Mozilla"
    };
var SOCS = {
        0:  "UNKNOWN",
        // --- Apple ---
        10: "A4",       11: "A5",       12: "A5X",      13: "A6",
        14: "A6X",      15: "A7",
        // --- Intel ---
        50: "Z2560",
        // --- Snapdragon ---
        100: "MSM7227", 101: "QSD8250", 102: "QSD8650", 103: "MSM8225",
        104: "APQ8055", 105: "MSM7230", 106: "MSM8227", 107: "MSM8230",
        108: "MSM8255", 109: "MSM8255T",110: "MSM8260", 111: "MSM8627",
        112: "MSM8655", 113: "MSM8660", 114: "APQ8060", 115: "MSM8260A",
        116: "MSM8660A",117: "MSM8960", 118: "APQ8064", 119: "APQ8064T",
        120: "APQ8064AB",121:"MSM8930", 122: "MSM8974", 123: "APQ8074",
        124: "MSM8974AB",
        // --- Tegra ---
        300: "T20",     301: "AP25H",   302: "AP33",    303: "AP37",
        304: "T30L",
        // --- OMAP ---
        330: "OMAP3630",331: "OMAP4430",332: "OMAP4460",333: "OMAP4470",
        // --- Samsung, Exynos ---
        350: "S5L8900", 351: "S5PC100", 352: "S5PC110", 353: "Exynos4210",
        354: "Exynos4412", 355: "Exynos5250",
        // --- HiSilicon ---
        370: "K3V2",    371: "K3V2T",
        // --- MediaTek,Spreadtrum,R-Mobile ---
        380: "MTK8125", 385: "SC6821",  390: "APE5R",
        // --- Other ---
        400: "CXD5315GG", 401: "LowSpec", 402: "HighSpec"
    };

var SOC_DATA    = 1;
var DEVICE_DATA = 2;
var QUERY_TOKEN_TABLE = {
        "CPU.TYPE":             [SOC_DATA,     0, function(v) { return CPU_TYPES[v]; }],
        "CPU.CLOCK":            [SOC_DATA,     1],
        "CPU.CORES":            [SOC_DATA,     2],
        "GPU.TYPE":             [SOC_DATA,     3, function(v) { return GPU_TYPES[v]; }],
        "GPU.ID":               [SOC_DATA,     4],
        "OS.TYPE":              [DEVICE_DATA,  0, function(v) { return OS_TYPES[v]; }],
        "DEVICE.BRAND":         [DEVICE_DATA,  1, function(v) { return BRANDS[v]; }],
        "DEVICE.SOC":           [DEVICE_DATA,  2, function(v) { return SOCS[v]; }],
        "OS.RELEASE_VERSION":   [DEVICE_DATA,  3, function(v) { return _toVersionString(v); }],
        "OS.HIGHEST_VERSION":   [DEVICE_DATA,  4, function(v) { return _toVersionString(v); }],
        "DISPLAY.SHORT":        [DEVICE_DATA,  5],
        "DISPLAY.LONG":         [DEVICE_DATA,  6],
        "DISPLAY.PPI":          [DEVICE_DATA,  7],
        "DISPLAY.DPR":          [DEVICE_DATA,  8],
        "MEMORY.RAM":           [DEVICE_DATA,  9],
        "INPUT.TOUCH":          [DEVICE_DATA,  10]
    };

// --- interface -------------------------------------------
function Device(spec) { // @arg SpecObject: SpecObject
                        // @ret SpecObject: { DEVICE, OS, ... }
                        // @help: Device
                        // @desc: Detect device spec.
//{@assert
    _if(!Valid.type(spec, "Object"), "Device(spec)");
//}@assert

    return _device(spec["DEVICE"]["ID"], spec);
}

Device["repository"] = "https://github.com/uupaa/Device.js";

Device["id"]      = Device_id;      // Device.id(id:DeviceIDString):SpecObject
Device["add"]     = Device_add;     // Device.add(data:Object):void
Device["has"]     = Device_has;     // Device.has(id:DeviceIDString):Boolean
Device["query"]   = Device_query;   // Device.query(selector:DeviceQueryString, caseSensitive:Boolean = false):IDArray

// --- implement -------------------------------------------
function Device_id(id) { // @arg DeviceIDString:
                         // @ret SpecObject:
                         // @help: Device.id
//{@assert
    _if(!Valid.type(id, "String"), "Device.id(id)");
//}@assert

    return _device(id, Spec());
}

function _device(id, spec) {
    if ( !id || !(id in DEVICE_CATALOG) ) { // unknown device?
        switch (spec["OS"]["TYPE"]) {
        case "Windows Phone":
            return _applyDeviceData("WindowsDevPhone", spec);
        case "iOS":
            return _applyDeviceData("iDevPhone", spec);
        case "Android":
            var device = parseFloat(spec["OS"]["VERSION"]) < 4.2 ? "AndroidDevPhone2"
                                                                 : "AndroidDevPhone";
            return _applyDeviceData(device, spec);
        case "Firefox OS":
            return _applyDeviceData("FirefoxDevPhone", spec);
        }
        return spec;
    }
    return _applyDeviceData(id, spec);
}

function _applyDeviceData(id,     // @arg String: DEVICE ID
                          spec) { // @arg SpecObject:
                                  // @ret SpecObject: { DEVICE, OS, CPU, ... }
    var data    = DEVICE_CATALOG[id];
    var soc     = SOC_CATALOG[ SOCS[ data[2] ] || "" ]; // [TYPE, CPU-CLOCK, CPU-CORES, GPU-TYPE, GPU-ID]

    var DEVICE  = spec["DEVICE"];
    var OS      = spec["OS"];
    var CPU     = spec["CPU"];
    var GPU     = spec["GPU"];
    var INPUT   = spec["INPUT"];
    var MEMORY  = spec["MEMORY"];
    var DISPLAY = spec["DISPLAY"];
    var NETWORK = spec["NETWORK"];
    var GPU_TYPE = GPU_TYPES[ soc[3] ] || "";

//  DEVICE["ID"]        = id;
    DEVICE["MAYBE"]     = /iPad 2|iPad 3|iPhone 4|iPhone 5|iPod touch 5/.test(id);
    DEVICE["BRAND"]     = BRANDS[ data[1] ] || "";
    DEVICE["SOC"]       = SOCS[ data[2] ] || "";
    OS["TYPE"]          = OS_TYPES[ data[0] ] || "";
    OS["RELEASE_VERSION"] = _toVersionString(data[3]);
    OS["HIGHEST_VERSION"] = _toVersionString(data[4]);
    CPU["TYPE"]         = CPU_TYPES[ soc[0] ] || "";
    CPU["CLOCK"]        = soc[1];
    CPU["CORES"]        = soc[2];
    CPU["SIMD"]         = (GPU_TYPE === "T20" || GPU_TYPE === "AP25H") ? false : true; // Tegra2 NEON unsupported
    GPU["TYPE"]         = GPU_TYPE;
    GPU["ID"]           = soc[4];
    INPUT["TOUCH"]      = data[10];
    MEMORY["RAM"]       = data[9];
    DISPLAY["PPI"]      = data[7];
    DISPLAY["DPR"]      = data[8];
    DISPLAY["INCH"]     = data[11];
    DISPLAY["LONG"]     = Math.max(data[5], data[6]);
    DISPLAY["SHORT"]    = Math.min(data[5], data[6]);
    NETWORK["GPS"]      = (FN_GPS    & data[12]) === FN_GPS;
    NETWORK["3G"]       = (FN_3G     & data[12]) === FN_3G;
    NETWORK["LTE"]      = (FN_LTE    & data[12]) === FN_LTE;
    NETWORK["NFC"]      = (FN_NFC    & data[12]) === FN_NFC;
    NETWORK["WIFI"]     = (FN_WIFI   & data[12]) === FN_WIFI;
    NETWORK["BTLE"]     = (FN_BTLE   & data[12]) === FN_BTLE;
    NETWORK["DIRECT"]   = (FN_DIRECT & data[12]) === FN_DIRECT;

    return spec;
}

function _toVersionString(number) {
    var s = (10000 + number).toString();

    return parseInt(s[1] + s[2], 10) + "." + s[3] + "." + s[4];
}

function Device_add(data) { // @arg Object:
                            // @help: Device.add
//{@assert
    _if(!Valid.type(data, "Object"), "Device.add(data)");
//}@assert

    for (var key in data) {
        DEVICE_CATALOG[key] = data[key];
    }
}

function Device_has(id) { // @arg DeviceIDString:
                          // @ret Boolean:
                          // @help: Device.has
//{@assert
    _if(!Valid.type(id, "String"), "Device.has(id)");
//}@assert

    return id in DEVICE_CATALOG;
}

function Device_query(selector,        // @arg DeviceQueryString: query string. "GPU.TYPE=Adreno;GPU.ID=330"
                      caseSensitive) { // @arg Boolean(= false): true is case-sensitive, false is ignore case.
                                       // @ret IDArray: [id, ...]
                                       // @help: Device.query
                                       // @desc: Query device catlog.
//{@assert
    _if(!Valid.type(selector, "String"), "Device.query(selector): " + selector);
    _if(!Valid.type(caseSensitive, "Boolean/omit"), "Device.query(,caseSensitive)");
//}@assert

    return _filter( _parse(selector), caseSensitive || false );
}

function _parse(selector) {
    return selector.replace(/[; ]*$/, "").                // trim tail ";"
           trim().split(/\s*;\s*/).reduce(_tokenize, []); // split(";")

    function _tokenize(result, token) {
        if (token) {
            var keyValue = token.split(/\s*(==|=|<=|>=|<|>)\s*/); // ["DEVICE.SOC", "=", "MSM8974"]
                                                                  //  ~~~~~~~~~~~~  ~~~  ~~~~~~~~~
                                                                  //    keyword     ope    value
            var keyword  = keyValue[0].toUpperCase();
            var operator = keyValue[1] || "";
            var value    = keyValue[2] || "";

            if (keyword in QUERY_TOKEN_TABLE) {
                // Device.query("DEVICE.SOC=SHL24") equ
                // Device.query("DEVICE.SOC=" + Device.id("SHL24").DEVICE.SOC)
                if (value in DEVICE_CATALOG) {

                    value = keyword.split(".").reduce(function(spec, key) {
                        return spec[key];
                    }, Device["id"](value));
                }
                result.push([keyword, operator, value]); // result: [ ["DEVICE.SOC", "=", "MSM8974"], ... ]
            } else {
                throw new Error("Device.query token: " + token);
            }
        }
        return result;
    }
}

function _filter(parts, caseSensitive) {
    var lastData = 0; // 0 or DEVICE_DATA or SOC_DATA

    // --- query phase ---
    var result = parts.reduce(function(prev, queryArray, index) { // "GPU.TYPE=Adreno"
        var keyword  = queryArray[0]; // "GPU.TYPE"
        var operator = queryArray[1]; // "="
        var value    = queryArray[2]; // "Adreno"

        if ( lastData === SOC_DATA && QUERY_TOKEN_TABLE[keyword][0] === DEVICE_DATA) {
            // convert SoCID list to DeviceID list. query( SOC_DATA -> DEVICE_DATA )
            prev = _convertSoCIDToDeviceID(prev);
        } else if ( lastData === DEVICE_DATA && QUERY_TOKEN_TABLE[keyword][0] === SOC_DATA) {
            // convert DeviceID list to SoCID list. query( DEVICE_DATA -> SOC_DATA )
            prev = _convertDeviceIDToSoCID(prev);
        }
        lastData = QUERY_TOKEN_TABLE[keyword][0]; // 1 = SOC_DATA, 2 = DEVICE_DATA

        var rv = _find( QUERY_TOKEN_TABLE[keyword], operator, value, caseSensitive );

        return index ? _and(prev, rv)
                     : rv;
    }, []);

    return result;
}

function _convertSoCIDToDeviceID(socIDList) { // ["A5", "A6", ...]
    return socIDList.reduce(function(prev, socID) { // "A5"
        for (var deviceID in DEVICE_CATALOG) { // "iPhone 5s"
            if (SOCS[DEVICE_CATALOG[deviceID][2]] === socID) {
                prev.push(deviceID);
            }
        }
        return prev;
    }, []);
}

function _convertDeviceIDToSoCID(deviceIDList) { // ["iPhone 5s", "iPhone 5", ...]
    return deviceIDList.reduce(function(prev, deviceID) { // "iPhone 5s"
        var findSocID = SOCS[DEVICE_CATALOG[deviceID][2]];

        for (var socID in SOC_CATALOG) {
            if (socID === findSocID) {
                prev.push(socID);
            }
        }
        return prev;
    }, []);
}

function _find(map,             // @arg Array: [catalog, index, preprocess]
                                //          catalog    - Integer: 1 is SOC_DATA
                                //                                2 is DEVICE_DATA
                                //          index      - Integer: DEVICE_CATALOG or SOC_CATALOG column index. from 0 to 10
                                //          preprocess - Function(= null)
               operator,        // @arg String: operator. "=", "==", ">=", "<=", "<", ">"
               value,           // @arg String: query value.
               caseSensitive) { // @arg Boolean(= false): true is case-sensitive, false is ignore case.
                                // @ret Array: matched id. [id, ...]
    var rv = [];
    var catalog = map[0] === SOC_DATA ? SOC_CATALOG
                                      : DEVICE_CATALOG;
    var index = map[1];
    var preprocess = map[2] || null;

    if (!caseSensitive) {
        value = (value + "").toLowerCase();
    }
    for (var id in catalog) {
        var specValue = catalog[id][index]; // pick one from [OS.TYPE, BRAND, SOC, OS.VER, DISP.SIZE, PPI, DPR, RAM, INCH, FN]
                                            //               [CPU.TYPE, CPU.CLOCK, CPU.CORES, GPU.TYPE, GPU.ID]
        if (preprocess) {
            specValue = preprocess(specValue);
        }
        if (!caseSensitive && typeof specValue === "string") {
            specValue = specValue.toLowerCase();
        }
        if (specValue) { // 0, 0.0, false, "" are skip
            switch (operator) {
            case "=":
            case "==": if (specValue == value) { rv.push(id); } break;
            case "<=": if (specValue <= value) { rv.push(id); } break;
            case ">=": if (specValue >= value) { rv.push(id); } break;
            case "<":  if (specValue <  value) { rv.push(id); } break;
            case ">":  if (specValue >  value) { rv.push(id); }
            }
        }
    }
    return rv;
}

function _and(source,    // @arg Array: source array
              compare) { // @arg Array: compare array
                         // @ret Array:
                         // @desc: Array.and
    var rv = [], pos = 0;
    var copiedSource = source.concat();
    var compareValue = null, compareIndex = 0, compareLength = compare.length;

    for (; compareIndex < compareLength; ++compareIndex) { // loop compare
        if (compareIndex in compare) {
            compareValue = compare[compareIndex];

            pos = copiedSource.indexOf(compareValue);
            if (pos >= 0) { // copiedSource has compareValue
                rv.push(compareValue);
                copiedSource.splice(pos, 1);
            }
        }
    }
    return rv;
}

// Device list: https://www.handsetdetection.com/properties/vendormodel/
var DEVICE_CATALOG = {
    "":                 [0,        0,        "",          0,0,      0,0,      0,  0,  128,  1,     4,  0       ], // UNKNOWN DEVICE
    "iDevPhone":        [IOS,      APPLE,    A7,       IVER,IVER, 640,1136, 326,  2, 1024,  5,     4,  FN_WG3L_], // Unknown iOS Phone (iPhone 5s based)
    "AndroidDevPhone":  [ANDROID,  GOOGLE,   APQ8064,  AVER,AVER, 768,1280, 318,  2, 2048,  5,   4.7,  FN_WG3LN], // Unknown Android Phone (Nexus 4 based)
    "AndroidDevPhone2": [ANDROID,  GOOGLE,   MSM8655,   220,410,    0,0,      0,  0,  512,  2,     4,  FN_WG3__], // Unknown Low spec Android Phone (INFOBAR A01 based)
    "WindowsDevPhone":  [WPHONE,   MICROSOFT,MSM8960,     0,0,    480,800,  233,  0, 1024,  4,     0,  FN_WG3LN], // Unknown Windows Phone (ATIV Odyssey based)
    "FirefoxDevPhone":  [FIREFOXOS,MOZILLA,  MSM8260,     0,0,    540,960,    0,  0,  512,  2,   4.3,  FN_WG3__], // Unknown Firefox OS Phone (Keon based)
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Apple ---
    "iPhone 5s":        [IOS,      APPLE,    A7,        700,IVER, 640,1136, 326,  2, 1024,  5,     4,  FN_WG3L_],
    "iPhone 5c":        [IOS,      APPLE,    A6,        700,IVER, 640,1136, 326,  2, 1024,  5,     4,  FN_WG3L_],
    "iPhone 5":         [IOS,      APPLE,    A6,        600,IVER, 640,1136, 326,  2, 1024,  5,     4,  FN_WG3L_],
    "iPhone 4S":        [IOS,      APPLE,    A5,        511,IVER, 640,960,  326,  2,  512,  5,   3.5,  FN_WG3__],
    "iPhone 4":         [IOS,      APPLE,    A4,        400,IVER, 640,960,  326,  2,  512,  5,   3.5,  FN_WG3__],
    "iPhone 3GS":       [IOS,      APPLE,    S5PC100,   300,615,  320,480,  163,  1,  256,  5,   3.5,  FN_WG3__],
    "iPhone 3G":        [IOS,      APPLE,    S5L8900,   200,421,  320,480,  163,  1,  128,  5,   3.5,  FN_WG3__],
    "iPad Air":         [IOS,      APPLE,    A7,        700,IVER,1536,2048, 264,  2, 1024, 10,   9.7,  FN_WG3L_],
    "iPad 4":           [IOS,      APPLE,    A6X,       600,IVER,1536,2048, 264,  2, 1024, 10,   9.7,  FN_WG3L_],
    "iPad 3":           [IOS,      APPLE,    A5X,       510,IVER,1536,2048, 264,  2, 1024, 10,   9.7,  FN_WG3__],
    "iPad 2":           [IOS,      APPLE,    A5,        430,IVER, 768,1024, 132,  1,  512, 10,   9.7,  FN_WG3__],
    "iPad 1":           [IOS,      APPLE,    A4,        320,615,  768,1024, 132,  1,  256, 10,   9.7,  FN_WG___],
    "iPad mini Retina": [IOS,      APPLE,    A7,        700,IVER,1536,2048, 326,  2, 1024, 10,   7.9,  FN_WG3L_],
    "iPad mini":        [IOS,      APPLE,    A5,        600,IVER, 768,1024, 132,  2,  512, 10,   7.9,  FN_WG3__],
    "iPod touch 5":     [IOS,      APPLE,    A5,        600,IVER, 640,1136, 326,  2,  512,  5,     4,  FN_W____],
    "iPod touch 4":     [IOS,      APPLE,    A4,        410,615,  640,960,  326,  2,  256,  5,     4,  FN_W____],
  //"iPod touch 3":     [IOS,      APPLE,    CortexA8,  310,511,  640,960,  326,  2,  256,  5,   3.5,  FN_W____], // iPod touch 32/64GB Model
    "iPod touch 3":     [IOS,      APPLE,    S5PC100,   310,511,  640,960,  326,  2,  128,  5,   3.5,  FN_W____], // iPod touch 8GB Model
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Google Play Edition devices ---
    "C6806":            [ANDROID,  SONY,     MSM8974,   422,AVER,1080,1920, 342,  0, 2048,  5,   6.4,  FN_WG3LN], // Xperia Z Ultra Google Edition
    "HTC6500LVW":       [ANDROID,  HTC,      APQ8064T,  422,AVER,1080,1920, 468,  0, 2048, 10,   4.7,  FN_WG3LN], // HTC One Google Play Edition
    "GT-I9505G":        [ANDROID,  SAMSUNG,  APQ8064AB, 422,AVER,1080,1920, 441,  0, 2048,  5,     5,  FN_WG3LN], // Galaxy S4 Google Play Edition
    // --- Google Nexus series ---
    "Nexus 10":         [ANDROID,  GOOGLE,   EXYNOS5250,420,AVER,1600,2560, 300,  2, 2048,  5,    10,  FN_WG__N],
    "Nexus 7 (2013)":   [ANDROID,  GOOGLE,   APQ8064,   430,AVER,1200,1920, 323,  2, 2048,  5,     7,  FN_WG3LN],
    "Nexus 7":          [ANDROID,  GOOGLE,   T30L,      411,AVER, 800,1280, 216,1.33,1024,  5,     7,  FN_WG3LN],
    "Nexus 5":          [ANDROID,  GOOGLE,   MSM8974,   440,AVER,1080,1920, 445,  3, 2048,  5,     5,  FN_WG3LN],
    "Nexus 4":          [ANDROID,  GOOGLE,   APQ8064,   420,AVER, 768,1280, 318,  2, 2048,  5,   4.7,  FN_WG3LN],
    "Galaxy Nexus":     [ANDROID,  GOOGLE,   OMAP4460,  400,422,  720,1280, 316,  2, 1024,  2,   4.7,  FN_WG3LN], // LTE (partial)
    "Nexus S":          [ANDROID,  GOOGLE,   S5PC110,   232,410,  480,800,  233,1.5,  512,  5,     4,  FN_WG3_N],
    "Nexus One":        [ANDROID,  GOOGLE,   QSD8250,   210,236,  480,800,  252,1.5,  512,  2,   3.7,  FN_WG3__],
    // --- Sony global models ---
    "SGP412JP":         [ANDROID,  SONY,     APQ8074,   420,420, 1080,1920, 342,  0, 2048,  5,   6.4,  FN_WG__N], // Xperia Z Ultra WiFi Edition
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Kindle ---
    "KFOT":             [ANDROID,  AMAZON,   OMAP4430,  234,234,  600,1024,   0,  0,  512,  5,     7,  FN_W____], // Kindle Fire
    "KFTT":             [ANDROID,  AMAZON,   OMAP4460,  403,403,  800,1280,   0,  0, 1024,  5,     7,  FN_W____], // Kindle Fire HD
    "KFJWI":            [ANDROID,  AMAZON,   OMAP4470,  403,403, 1200,1920,   0,  0, 1024,  5,   8.9,  FN_W_3L_], // Kindle Fire HD 8.9
    "KFJWA":            [ANDROID,  AMAZON,   OMAP4470,  403,403, 1200,1920,   0,  0, 1024,  5,   8.9,  FN_W_3L_], // Kindle Fire HD 8.9 4G
    "KFSOWI":           [ANDROID,  AMAZON,   OMAP4470,  422,422,  800,1280,   0,  0, 1024,  5,     7,  FN_W____], // Kindle Fire HD 7 (2nd)
    "KFTHWI":           [ANDROID,  AMAZON,   MSM8974,   422,422, 1200,1920,   0,  0, 2048,  5,     7,  FN_W_3L_], // Kindle Fire HDX 7 (3rd)
    "KFTHWA":           [ANDROID,  AMAZON,   MSM8974,   422,422, 1200,1920,   0,  0, 2048,  5,     7,  FN_W_3L_], // Kindle Fire HDX 7 (3rd) 4G
    "KFAPWI":           [ANDROID,  AMAZON,   MSM8974,   422,422, 1600,2560,   0,  0, 2048,  5,   8.9,  FN_W_3L_], // Kindle Fire HDX 8.9 (3rd)
    "KFAPWA":           [ANDROID,  AMAZON,   MSM8974,   422,422, 1600,2560,   0,  0, 2048,  5,   8.9,  FN_W_3L_], // Kindle Fire HDX 8.9 (3rd) 4G

//{@androidjp
    // --- docomo ---
    // http://spec.nttdocomo.co.jp/spmss/
    // 2013 winter
    "L-01F":            [ANDROID,  LG,       MSM8974,   422,422, 1080,1776, 480,  0, 2048,  5,   5.2,  FN_WG3LN], // G2 L-01F
    "SC-01F":           [ANDROID,  SAMSUNG,  MSM8974,   430,433, 1080,1920, 480,  0, 2048,  5,   5.7,  FN_WG3LN], // GALAXY Note 3, S Browser
    "SC-02F":           [ANDROID,  SAMSUNG,  MSM8974,   430,430, 1080,1920, 480,  0, 2048,  5,     5,  FN_WG3LN], // GALAXY J SC-02F, S Browser
    "SH-01F":           [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1776, 480,  0, 2048,  5,     5,  FN_WG3LN], // AQUOS PHONE ZETA SH-01F
    "SH-01FDQ":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1776, 480,  0, 2048,  5,     5,  FN_WG3LN], // SH-01F DRAGON QUEST
    "SH-02F":           [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920, 487,  0, 2048,  5,   4.5,  FN_WG3LN], // AQUOS PHONE EX SH-02F
    "SH-03F":           [ANDROID,  SHARP,    MSM8960,   404,404,  540,888,  268,  0,  680,  5,   4.1,  FN_WG3L_], // JUNIOR 2 (no Google Play)
    "SO-01F":           [ANDROID,  SONY,     MSM8974,   422,422, 1080,1776, 480,  3, 2048,  5,     5,  FN_WG3LN], // Xperia Z1
    "SO-02F":           [ANDROID,  SONY,     MSM8974,   422,422,  720,1184, 320,  0, 2048,  5,   4.3,  FN_WG3LN], // Xperia Z1 f SO-02F
    "SO-03F":           [ANDROID,  SONY,     MSM8974AB, 442,442, 1080,1920,   0,  0, 3072,  5,   5.2,  FN_WG3LN], // Xperia Z2 (Sirius)
    "F-01F":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1776, 480,  0, 2048,  5,     5,  FN_WG3LN], // ARROWS NX F-01F
    "F-02F":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1504,2560, 320,  0, 2048,  5,  10.1,  FN_WG3LN], // ARROWS Tab F-02F
    "F-03F":            [ANDROID,  FUJITSU,  MSM8974,   422,422,  720,1184, 320,  0, 2048,  5,   4.7,  FN_WG3LN], // Disney Mobile on docomo F-03F
    "F-04F":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0, 2048,  5,   4.3,  FN_WG3__], // (no Google Play)
    // 2013 summer
    "L-05E":            [ANDROID,  LG,       APQ8064T,  422,422,  720,1280, 320,  0, 2048,  5,   4.5,  FN_WG3LN],
    "N-06E":            [ANDROID,  NEC,      APQ8064T,  422,422,  720,1184, 320,  0, 2048,  5,   4.7,  FN_WG3LN],
    "SC-04E":           [ANDROID,  SAMSUNG,  APQ8064T,  422,430, 1080,1920, 441,  0, 2048,  5,     5,  FN_WG3LN], // Galaxy S4, S Browser
    "SO-04E":           [ANDROID,  SONY,     APQ8064,   412,422,  720,1184, 320,  0, 2048,  5,   4.6,  FN_WG3LN], // Xperia A SO-04E
    "SO-04EM":          [ANDROID,  SONY,     APQ8064,   422,422,  720,1184, 320,  0, 2048,  5,   4.6,  FN_WG3LN], // Xperia feat. HATSUNE MIKU SO-04E
    "SH-06E":           [ANDROID,  SHARP,    APQ8064T,  422,422, 1080,1920, 480,  0, 2048,  5,   4.8,  FN_WG3LN], // 
    "SH-07E":           [ANDROID,  SHARP,    APQ8064T,  422,422,  720,1280, 320,  0, 2048,  2,   4.3,  FN_WG3LN],
    "SH-08E":           [ANDROID,  SHARP,    APQ8064T,  422,422, 1200,1824, 320,  0, 2048,  5,     7,  FN_WG3LN],
    "P-03E":            [ANDROID,  PANASONIC,APQ8064T,  422,422, 1080,1920, 480,  0, 2048,  5,   4.7,  FN_WG3LN],
    "F-06E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422, 1080,1776, 480,  0, 2048,  5,   5.2,  FN_WG3LN],
    "F-07E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  720,1184, 320,  0, 2048,  5,   4.7,  FN_WG3LN],
    "F-08E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,867,  240,  0, 2048,  5,   4.3,  FN_WG3L_],
    "F-09E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0, 2048,  5,   4.3,  FN_WG3L_],
    // 2012 Q3
    "L-01E":            [ANDROID,  LG,       APQ8064,   404,412,  720,1280, 320,  0, 2048,  5,   4.7,  FN_WG3L_],
    "L-02E":            [ANDROID,  LG,       MSM8960,   404,412,  720,1280, 320,  0, 1024,  5,   4.5,  FN_WG3L_],
    "L-04E":            [ANDROID,  LG,       APQ8064T,  412,412, 1080,1920, 480,  0, 2048,  5,     5,  FN_WG3LN],
    "N-02E":            [ANDROID,  NEC,      MSM8960,   404,412,  480,800,  240,  0, 1024,  5,     4,  FN_WG3L_],
    "N-03E":            [ANDROID,  NEC,      APQ8064,   404,412,  720,1280, 320,  0, 2048,  5,   4.7,  FN_WG3L_],
    "N-04E":            [ANDROID,  NEC,      APQ8064,   412,412,  720,1280, 320,  0, 2048,  5,   4.7,  FN_WG3L_],
    "N-05E":            [ANDROID,  NEC,      MSM8960,   412,412,  540,960,  240,  0, 1024,  5,   4.3,  FN_WG3L_],
    "SC-01E":           [ANDROID,  SAMSUNG,  APQ8060,   404,404,  800,1280, 160,  0, 1024,  5,   7.7,  FN_WG3L_],
    "SC-02E":           [ANDROID,  SAMSUNG,  EXYNOS4412,411,430,  720,1280, 320,  0, 2048,  5,   5.5,  FN_WG3L_],
    "SC-03E":           [ANDROID,  SAMSUNG,  EXYNOS4412,411,430,  720,1280, 320,  0, 2048,  5,   4.8,  FN_WG3L_],
    "SH-01E":           [ANDROID,  SHARP,    MSM8960,   404,412,  540,888,  240,  0, 1024,  2,   4.1,  FN_WG3L_],
    "SH-01EVW":         [ANDROID,  SHARP,    MSM8960,   404,412,  540,888,  240,  0, 1024,  2,   4.1,  FN_WG3L_],
    "SH-02E":           [ANDROID,  SHARP,    APQ8064,   404,412,  720,1280, 320,  0, 2048,  2,   4.9,  FN_WG3LN],
    "SH-04E":           [ANDROID,  SHARP,    APQ8064,   412,412,  720,1184, 320,  0, 2048,  5,   4.5,  FN_WG3LN],
    "SH-05E":           [ANDROID,  SHARP,    MSM8960,   404,404,  540,960,  240,  0, 1024,  2,   4.1,  FN__G3L_], // JUNIOR (no Google Play, no WiFi)
    "SO-01E":           [ANDROID,  SONY,     MSM8960,   404,412,  720,1184, 320,  0, 1024,  5,   4.3,  FN_WG3LN],
    "SO-02E":           [ANDROID,  SONY,     APQ8064,   412,422,  720,1184, 320,  3, 1024,  5,     5,  FN_WG3LN], // Xperia Z
    "SO-03E":           [ANDROID,  SONY,     APQ8064,   412,412, 1128,1920, 240,  0, 2048,  5,  10.1,  FN_WG3LN],
    "P-02E":            [ANDROID,  PANASONIC,APQ8064,   412,412, 1080,1920, 480,  0, 2048,  5,     5,  FN_WG3LN],
    "F-02E":            [ANDROID,  FUJITSU,  AP37,      412,412, 1080,1920, 480,  0, 2048,  5,     5,  FN_WG3LN],
    "F-03E":            [ANDROID,  FUJITSU,  MSM8960,   404,412,  540,960,  240,  0, 1024,  5,     4,  FN_WG3LN],
    "F-04E":            [ANDROID,  FUJITSU,  AP33,      404,422,  720,1280, 320,  0, 2048,  5,   4.7,  FN_WG3LN],
    "F-05E":            [ANDROID,  FUJITSU,  AP37,      404,412, 1200,1920, 240,  0, 2048,  5,  10.1,  FN_WG3LN],
    "HW-01E":           [ANDROID,  HUAWEI,   MSM8960,   404,404,  720,1280, 320,  0, 1024,  5,   4.5,  FN_WG3L_],
    "HW-03E":           [ANDROID,  HUAWEI,   K3V2,      412,412,  720,1280, 320,  0, 2048,  5,   4.7,  FN_WG3L_],
    "dtab01":           [ANDROID,  HUAWEI,   K3V2T,     412,412,  800,1280, 160,  0, 1024,  5,  10.1,  FN_WG3__], // dtab
    // 2012 Q1
    "L-05D":            [ANDROID,  LG,       MSM8960,   404,412,  480,800,  240,1.5, 1024,  5,     4,  FN_WG3L_], // Optimus it
    "L-06D":            [ANDROID,  LG,       APQ8060,   404,404,  768,1024, 320,  0, 1024,  5,     5,  FN_WG3L_],
    "L-06DJOJO":        [ANDROID,  LG,       APQ8060,   404,404,  768,1024, 320,  0, 1024,  5,     5,  FN_WG3L_],
    "N-07D":            [ANDROID,  NEC,      MSM8960,   404,412,  720,1280, 342,  0, 1024,  5,   4.3,  FN_WG3L_],
    "N-08D":            [ANDROID,  NEC,      MSM8960,   404,404,  800,1280, 213,  0, 1024,  5,     7,  FN_WG3L_],
    "SC-06D":           [ANDROID,  SAMSUNG,  MSM8960,   404,412,  720,1280, 320,  2, 2048,  5,   4.8,  FN_WG3L_], // Galaxy S III
    "SH-06D":           [ANDROID,  SHARP,    OMAP4460,  235,404,  720,1280, 320,  0, 1024,  5,   4.5,  FN_WG3__],
    "SH-06DNERV":       [ANDROID,  SHARP,    OMAP4460,  235,404,  720,1280, 320,  0, 1024,  2,   4.5,  FN_WG3__],
    "SH-07D":           [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,  240,  0, 1024,  2,   3.4,  FN_WG3__],
    "SH-09D":           [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 312,  0, 1024,  2,   4.7,  FN_WG3L_],
    "SH-10D":           [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 320,  0, 1024,  2,   4.5,  FN_WG3L_],
    "SO-04D":           [ANDROID,  SONY,     MSM8960,   404,412,  720,1184, 320,  0, 1024,  5,   4.6,  FN_WG3L_],
    "SO-05D":           [ANDROID,  SONY,     MSM8960,   404,412,  540,888,  240,1.5, 1024,  5,   3.7,  FN_WG3L_], // Xperia SX
    "P-06D":            [ANDROID,  PANASONIC,OMAP4460,  404,404,  720,1280, 320,  0, 1024,  5,   4.6,  FN_WG3__],
    "P-07D":            [ANDROID,  PANASONIC,MSM8960,   404,404,  720,1280, 320,  0, 1024,  5,     5,  FN_WG3L_],
    "P-08D":            [ANDROID,  PANASONIC,OMAP4460,  404,404,  800,1280, 160,  0, 1024,  5,  10.1,  FN_WG3__],
    "F-09D":            [ANDROID,  FUJITSU,  MSM8255,   403,403,  480,800,  240,  0, 1024,  2,   3.7,  FN_WG3__],
    "F-10D":            [ANDROID,  FUJITSU,  AP33,      403,422,  720,1280, 323,  2, 1024,  5,   4.6,  FN_WG3L_], // ARROWS X
    "F-11D":            [ANDROID,  FUJITSU,  MSM8255,   403,422,  480,800,  240,  0, 1024,  5,   3.7,  FN_WG3__],
    "F-12D":            [ANDROID,  FUJITSU,  MSM8255,   403,403,  480,800,  235,  0, 1024,  5,   4.0,  FN_WG3__],
    "T-02D":            [ANDROID,  TOSHIBA,  MSM8960,   404,412,  540,960,  257,  0, 1024,  5,   4.3,  FN_WG3L_],
    // 2011 Q3
    "L-01D":            [ANDROID,  LG,       APQ8060,   235,404,  720,1280, 320,  0, 1024,  5,   4.5,  FN_WG3L_],
    "L-02D":            [ANDROID,  LG,       OMAP4430,  237,404,  480,800,  240,  0, 1024,  5,   4.3,  FN_WG3__],
    "N-01D":            [ANDROID,  NEC,      MSM8255T,  235,235,  480,800,  235,  0,  512,  5,     4,  FN_WG3__],
    "N-04D":            [ANDROID,  NEC,      APQ8060,   236,404,  720,1280, 342,  0, 1024,  5,   4.3,  FN_WG3L_],
    "N-05D":            [ANDROID,  NEC,      MSM8260,   236,404,  720,1280, 320,  0, 1024,  5,   4.3,  FN_WG3__],
    "N-06D":            [ANDROID,  NEC,      APQ8060,   236,404,  800,1280, 213,  0, 1024,  5,     7,  FN_WG3L_],
    "SC-01D":           [ANDROID,  SAMSUNG,  APQ8060,   320,404,  800,1200, 160,  0, 1024,  5,  10.1,  FN_WG3L_],
    "SC-02D":           [ANDROID,  SAMSUNG,  EXYNOS4210,320,404,  600,1024, 160,  0, 1024,  5,     7,  FN_WG3__],
    "SC-03D":           [ANDROID,  SAMSUNG,  APQ8060,   236,404,  480,800,  240,1.5, 1024,  5,   4.5,  FN_WG3LN], // GALAXY S II LTE
    "SC-04D":           [ANDROID,  SAMSUNG,  OMAP4460,  401,422,  720,1280, 320,  2, 1024,  5,   4.7,  FN_WG3_N], // Galaxy Nexus
    "SC-05D":           [ANDROID,  SAMSUNG,  APQ8060,   236,412,  800,1280, 320,  0, 1024,  5,   5.3,  FN_WG3LN],
    "SH-01D":           [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280, 328,  0, 1024,  2,   4.5,  FN_WG3__],
    "SH-02D":           [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,  300,  0,  512,  2,   3.7,  FN_WG3__],
    "SH-04D":           [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,  300,  0,  512,  2,   3.7,  FN_WG3__],
    "SO-01D":           [ANDROID,  SONY,     MSM8255,   234,234,  480,854,  240,1.5,  512,  2,     4,  FN_WG3__], // Xperia Play
    "SO-02D":           [ANDROID,  SONY,     MSM8260,   237,404,  720,1280, 320,  0, 1024,  5,   4.3,  FN_WG3__],
    "SO-03D":           [ANDROID,  SONY,     MSM8260,   237,404,  720,1280, 320,  0, 1024,  5,   4.3,  FN_WG3__],
    "P-01D":            [ANDROID,  PANASONIC,MSM8255,   234,234,  480,800,  240,1.5,  512,  2,   3.2,  FN_WG3__],
    "P-02D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  240,  0, 1024,  2,     4,  FN_WG3__],
    "P-04D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  257,  0, 1024,  5,   4.3,  FN_WG3__],
    "P-05D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  257,  0, 1024,  5,   4.3,  FN_WG3__],
    "F-01D":            [ANDROID,  FUJITSU,  OMAP4430,  320,403,  800,1280, 160,  0, 1024,  5,  10.1,  FN_WG3L_],
    "F-03D":            [ANDROID,  FUJITSU,  MSM8255,   235,235,  480,800,  240,  0,  512,  2,   3.7,  FN_WG3__],
    "F-05D":            [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0, 1024,  2,   4.3,  FN_WG3L_],
    "F-07D":            [ANDROID,  FUJITSU,  MSM8255,   235,235,  480,800,  235,  0,  512,  5,     4,  FN_WG3__],
    "F-08D":            [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0, 1024,  2,   4.3,  FN_WG3__],
    "T-01D":            [ANDROID,  TOSHIBA,  OMAP4430,  235,403,  720,1280, 320,  0, 1024,  2,   4.3,  FN_WG3__],
    // 2011 Q1
    "SC-02C":           [ANDROID,  SAMSUNG,  EXYNOS4210,403,403,  480,800,  240,  0, 1024,  5,   4.3,  FN_WG3__], // Galaxy S II
    "SO-01C":           [ANDROID,  SONY,     MSM8255,   232,234,  480,854,    0,1.5,  512,  2,   4.2,  FN_WG3__], // Xperia arc
    "SO-02C":           [ANDROID,  SONY,     MSM8255,   233,234,  480,854,    0,  0,  512,  2,   4.2,  FN_WG3__], // Xperia acro
    "SO-03C":           [ANDROID,  SONY,     MSM8255,   234,234,  480,854,    0,  0,  512,  2,   3.3,  FN_WG3__], // Xperia acro
    "SH-12C":           [ANDROID,  SHARP,    MSM8255T,  233,233,  540,960,    0,  0,  512,  2,   4.2,  FN_WG3__],
    "SH-13C":           [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  512,  2,   3.7,  FN_WG3__],
    "N-04C":            [ANDROID,  NEC,      MSM7230,   220,233,  480,854,    0,  0,  512,  2,     4,  FN_WG3__],
    "N-06C":            [ANDROID,  NEC,      MSM8255,   230,230,  480,854,    0,  0,  512,  2,     4,  FN_WG3__],
    "P-07C":            [ANDROID,  PANASONIC,OMAP3630,  230,230,  480,800,    0,  0,  512,  2,   4.3,  FN_WG3__],
    "F-12C":            [ANDROID,  FUJITSU,  MSM8255,   230,230,  480,800,    0,  0,  512,  2,   3.7,  FN_WG3__],
    "L-04C":            [ANDROID,  LG,       MSM7227,   220,230,  320,480,    0,  0,  512,  2,   3.2,  FN_WG3__],
    "L-06C":            [ANDROID,  LG,       T20,       300,310,  768,1280,   0,  0, 1024,  2,   8.9,  FN_WG3__],
    "L-07C":            [ANDROID,  LG,       OMAP3630,  233,233,  480,800,    0,  0,  512,  2,     4,  FN_WG3__],
    "T-01C":            [ANDROID,  TOSHIBA,  QSD8250,   211,222,  480,854,    0,1.5,    0,  2,     4,  FN_WG3__], // REGZA Phone
    "SH-03C":           [ANDROID,  SONY,     QSD8250,   211,222,  480,800,    0,  0,    0,  2,   3.8,  FN_WG3__],
    "SC-01C":           [ANDROID,  SAMSUNG,  S5PC110,   220,236,  600,1024,   0,1.5,    0,  2,     7,  FN_WG3__], // GALAXY Tab
    "SC-02B":           [ANDROID,  SAMSUNG,  S5PC110,   220,236,  480,800,    0,1.5,    0,  2,     4,  FN_WG3__], // GALAXY S
    "SH-10B":           [ANDROID,  SHARP,    QSD8250,   160,160,  480,960,    0,  1,    0,  2,     5,  FN_WG3__], // LYNX
    "SO-01B":           [ANDROID,  SONY,     QSD8250,   160,211,  480,854,    0,1.5,  384,  1,     4,  FN_WG3__], // Xperia
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- au ---
    // http://www.au.kddi.com/developer/android/
    // 2014 spring
    "SCL23":            [ANDROID,  SAMSUNG,  MSM8974AC, 442,442, 1080,1920,   0,  3, 2048, 10,   5.1,  FN_WG3LN], // Galaxy S5, S Browser
    "SHT22":            [ANDROID,  SHARP,    MSM8974,   422,422, 1200,1920, 322,  0, 2048, 10,     7,  FN_WG3LN], // AQUOS PAD SHT22
    "SHL24":            [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920, 486,  0, 2048, 10,   4.5,  FN_WG3LN], // AQUOS PHONE SERIE mini SHL24
    "URBANO L02":       [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280, 314,  0, 2048, 10,   4.7,  FN_WG3LN], // URBANO L02
    "LGL23":            [ANDROID,  LG,       MSM8974,   422,422,  720,1280, 246,  0, 2048, 10,     6,  FN_WG3LN], // G Flex LGL23
    "SOL24":            [ANDROID,  SONY,     MSM8974,   422,422, 1080,1920, 341,  0, 2048, 10,   6.4,  FN_WG3LN], // Xperia Z Ultra SOL24
    // 2013 winter
    "FJT21":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1600,2560, 300,  0, 2048, 10,  10.1,  FN_WG3LN],
    "SOL23":            [ANDROID,  SONY,     MSM8974,   422,422, 1080,1920, 442,  3, 2048, 10,     5,  FN_WG3LN], // Xperia Z1
    "SCL22":            [ANDROID,  SAMSUNG,  MSM8974,   430,430, 1080,1920, 386,  0, 3072, 10,   5.7,  FN_WG3LN], // S Browser
    "KYL22":            [ANDROID,  KYOCERA,  MSM8974,   422,422, 1080,1920, 443,  0, 2048,  5,     5,  FN_WG3LN],
    "LGL22":            [ANDROID,  LG,       MSM8974,   422,422, 1080,1920, 422,  0, 2048, 10,   5.2,  FN_WG3LN], // isai
    "SHL23":            [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920, 460,  0, 2048,  5,   4.8,  FN_WG3LN],
    "FJL22":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1920, 444,  0, 2048, 10,     5,  FN_WG3LN],
    // 2013 summer
    "SHL22":            [ANDROID,  SHARP,    APQ8064T,  422,422,  720,1280, 302,  0, 2048,  5,   4.9,  FN_WG3LN],
    "KYY21":            [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280, 314,  0, 2048,  5,   4.7,  FN_WG3LN], // URBANO L01
    "HTL22":            [ANDROID,  HTC,      APQ8064T,  412,422, 1080,1920, 468,  0, 2048, 10,   4.7,  FN_WG3LN], // HTC J One
    "SOL22":            [ANDROID,  SONY,     APQ8064,   412,422, 1080,1920, 443,  0, 2048, 10,     5,  FN_WG3LN], // Xperia UL
    // 2013 spring
    "HTX21":            [ANDROID,  HTC,      APQ8064,   411,411,  720,1280, 314,  0, 1024, 10,   4.7,  FN_WG3LN], // INFOBAR A02
    // 2012 fall and winter
    "SHT21":            [ANDROID,  SHARP,    MSM8960,   404,412,  800,1280, 216,  0, 1024,  2,     7,  FN_WG3LN], // AQUOS PAD
    "HTL21":            [ANDROID,  HTC,      APQ8064,   411,411, 1080,1920, 444,  3, 2048, 10,     5,  FN_WG3LN], // HTC J Butterfly
    "SCL21":            [ANDROID,  SAMSUNG,  MSM8960,   404,412,  720,1280, 306,  0, 2048, 10,   4.8,  FN_WG3L_], // GALAXY SIII Progre
    "CAL21":            [ANDROID,  CASIO,    MSM8960,   404,404,  480,800,  236,  0, 1024,  5,     4,  FN_WG3L_], // G'zOne TYPE-L
    "SHL21":            [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 309,  0, 1024,  2,   4.7,  FN_WG3L_], // AUOS PHONE SERIE
    "KYL21":            [ANDROID,  KYOCERA,  MSM8960,   404,404,  720,1280, 314,  0, 1024,  5,   4.7,  FN_WG3L_], // DIGNO S
    "FJL21":            [ANDROID,  FUJITSU,  MSM8960,   404,404,  720,1280, 342,  2, 1024, 10,   4.3,  FN_WG3L_], // ARROWS ef
    "SOL21":            [ANDROID,  SONY,     MSM8960,   404,412,  720,1280, 345,  0, 1024, 10,   4.3,  FN_WG3L_], // Xperia VL
    "LGL21":            [ANDROID,  LG,       APQ8064,   404,404,  720,1280, 315,  0, 2048, 10,   4.7,  FN_WG3L_], // Optimus G
    "PTL21":            [ANDROID,  PANTECH,  MSM8960,   404,412,  720,1280, 342,  0, 1024,  5,   4.3,  FN_WG3L_], // VEGA
    // 2012 summer
    "ISW13F":           [ANDROID,  FUJITSU,  AP33,      403,403,  720,1280, 322,  0, 1024,  3,   4.6,  FN_WG3__], // ARROWS Z ISW13F
    "IS17SH":           [ANDROID,  SHARP,    MSM8655,   404,404,  540,960,  240,  0, 1024,  2,   4.2,  FN_WG3__], // AQUOS PHONE CL
    "IS15SH":           [ANDROID,  SHARP,    MSM8655,   404,404,  540,960,  298,  0, 1024,  2,   3.7,  FN_WG3__], // AQUOS PHONE SL
    "ISW16SH":          [ANDROID,  SHARP,    MSM8660A,  404,404,  720,1280, 318,  2, 1024,  2,   4.6,  FN_WG3__], // AQUOS PHONE SERIE
    "URBANO PROGRESSO": [ANDROID,  KYOCERA,  MSM8655,   403,403,  480,800,  235,  0, 1024,  5,     4,  FN_WG3__],
    "ISW13HT":          [ANDROID,  HTC,      MSM8660A,  403,403,  540,960,  204,  0, 1024,  4,   4.3,  FN_WG3__], // HTC J
    // 2012 spring
    "IS12S":            [ANDROID,  SONY,     MSM8660,   237,404,  720,1280, 342,  0, 1024, 10,   4.3,  FN_WG3__], // Xperia acro HD
    "IS12M":            [ANDROID,  MOTOROLA, OMAP4430,  236,404,  540,960,  256,  0, 1024, 10,   4.3,  FN_WG3__], // MOTOROLA RAZR
    "INFOBAR C01":      [ANDROID,  SHARP,    MSM8655,   235,235,  480,854,  309,  0,  512,  2,   3.2,  FN_WG3__], // INFOBAR C01
    "ISW11SC":          [ANDROID,  SAMSUNG,  EXYNOS4210,236,404,  720,1080, 315,  2, 1024, 10,   4.7,  FN_WG3__], // GALAXY SII WiMAX
    "IS11LG":           [ANDROID,  LG,       AP25H,     237,404,  480,800,  235,  0, 1024, 10,     4,  FN_WG3__], // Optimus X
    "IS12F":            [ANDROID,  FUJITSU,  MSM8655,   235,235,  480,800,  235,  0,  512,  4,     4,  FN_WG3__], // ARROWS ES
    // 2011 fall and winter
    "IS14SH":           [ANDROID,  SHARP,    MSM8655,   235,235,  540,960,  298,  0,  512,  2,   3.7,  FN_WG3__], // AQUOS PHONE
    "IS11N":            [ANDROID,  NEC,      MSM8655,   235,235,  480,800,  262,  0,  512,  5,   3.6,  FN_WG3__], // MEDIAS BR
    "ISW11F":           [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0, 1024,  3,   4.3,  FN_WG3__], // ARROWS Z
    "ISW11K":           [ANDROID,  KYOCERA,  MSM8655,   235,235,  480,800,  234,  0, 1024, 10,     4,  FN_WG3__], // DIGNO
    "IS13SH":           [ANDROID,  SHARP,    MSM8655,   235,235,  540,960,  258,  0,  512,  2,   4.2,  FN_WG3__], // AQUOS PHONE
    "ISW12HT":          [ANDROID,  HTC,      MSM8660,   234,403,  540,960,  256,  0, 1024,  4,   4.3,  FN_WG3__], // HTC EVO 3D
    "ISW11M":           [ANDROID,  MOTOROLA, T20,       234,234,  540,960,  256,  0, 1024,  2,   4.3,  FN_WG3__], // MOTOROLA PHOTON
    // 2011 summer
    "EIS01PT":          [ANDROID,  PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  512,  5,   3.7,  FN_WG3__],
    "IS11PT":           [ANDROID,  PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  512,  5,   3.7,  FN_WG3__], // MIRACH
    "IS11T":            [ANDROID,  TOSHIBA,  MSM8655,   234,234,  480,854,  243,  0,  512,  3,     4,  FN_WG3__], // REGZA Phone
    "IS11CA":           [ANDROID,  CASIO,    MSM8655,   233,233,  480,800,  262,  0,  512,  5,   3.6,  FN_WG3__], // G'zOne
    "INFOBAR A01":      [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  265,1.5,  512,  2,   3.7,  FN_WG3__], // INFOBAR A01
    "IS12SH":           [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  263,  0,  512,  2,   4.2,  FN_WG3__], // AQUOS PHONE
    "IS11SH":           [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  298,  0,  512,  2,   3.7,  FN_WG3__], // AQUOS PHONE
    "IS11S":            [ANDROID,  SONY,     MSM8655,   233,234,  480,854,  232,  0,  512,  2,   4.2,  FN_WG3__], // Xperia acro
    // 2011 spring and legacy
    "ISW11HT":          [ANDROID,  HTC,      QSD8650,   221,234,  480,800,  254,1.5,  512,  2,   4.3,  FN_WG3__], // HTC EVO WiMAX
    "IS06":             [ANDROID,  PANTECH,  QSD8650,   221,221,  480,800,  254,1.5,  512,  5,   3.7,  FN_WG3__], // SIRIUS alpha
    "IS05":             [ANDROID,  SHARP,    MSM8655,   221,234,  480,854,  290,  0,  512,  2,   3.4,  FN_WG3__],
    "IS04":             [ANDROID,  TOSHIBA,  QSD8650,   210,222,  480,854,  290,  0,  512,  2,   4.0,  FN_WG3__],
    "IS03":             [ANDROID,  SHARP,    QSD8650,   210,221,  640,960,  331,  2,  512,  2,   3.5,  FN_WG3__],
    "IS01":             [ANDROID,  SHARP,    QSD8650,   160,160,  480,960,  213,  1,  256,  1,   5.0,  FN_WG3__],
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- SoftBank ---
    // https://www.support.softbankmobile.co.jp/partner/smp_info/smp_info_search_t.cfm
    "WX05SH":           [ANDROID,  SHARP,    MSM8260A,  412,412,  480,854,    0,  0, 1024,  5,     4,  FN_WG3LN],
    "SBM303SH":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0, 2048,  5,   4.5,  FN_WG3LN], // AQUOS PHONE Xx mini 303SH
    "DM016SH":          [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0, 2048,  2,   5.2,  FN_WG3LN],
    "301F":             [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1920,   0,  0, 2048,  2,     5,  FN_WG3LN],
    "SBM302SH":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0, 2048,  5,   5.2,  FN_WG3LN],
//  "EM01L":            [ANDROID,  GOOGLE,   MSM8974,   440,440, 1080,1920, 445,  3, 2048,  5,     5,  FN_WG3LN], // E-Mobile Nexus 5 EM01L
    "101F":             [ANDROID,  FUJITSU,  MSM8960,   404,412,  540,960,    0,  0, 1024,  2,   4.3,  FN_WG3LN],
    "WX04SH":           [ANDROID,  SHARP,    MSM8260A,  412,412,  480,854,    0,  0, 1024,  5,     4,  FN_WG3LN],
    "204HW":            [ANDROID,  HUAWEI,   MSM8225,   410,410,  480,800,    0,  0, 1024,  2,     4,  FN_WG3__], // for Silver Age
    "EM01F":            [ANDROID,  FUJITSU,  APQ8064,   412,412,  720,1280,   0,  0, 2048,  5,   4.7,  FN_WG3LN], // ARROWS S EM01F
    "DM015K":           [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0, 1536,  2,   4.3,  FN_WG3L_],
    "WX10K":            [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0, 1024,  2,   4.7,  FN_WG3L_],
    "202K":             [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280, 340,  0, 1024,  2,   4.3,  FN_WG3L_],
    "202F":             [ANDROID,  FUJITSU,  APQ8064T,  422,422, 1080,1920,   0,  0, 2048,  2,     5,  FN_WG3__],
    "SBM206SH":         [ANDROID,  SHARP,    APQ8064T,  422,422, 1080,1920,   0,  0, 2048,  2,     5,  FN_WG3__],
    "SBM205SH":         [ANDROID,  SHARP,    MSM8960,   412,412,  480,854,    0,  0, 1024,  2,     4,  FN_WG3L_],
    "DM014SH":          [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280,   0,  0, 1024,  2,   4.5,  FN_WG3L_],
    "SBM204SH":         [ANDROID,  SHARP,    MSM8255,   404,404,  480,800,    0,  0, 1024,  2,     4,  FN_WG3__],
    "WX04K":            [ANDROID,  KYOCERA,  APE5R,     234,411,  480,800,    0,  0, 1024,  2,     4,  FN_WG3__],
    "SBM203SH":         [ANDROID,  SHARP,    APQ8064,   412,412,  720,1280,   0,  0, 2048,  2,   4.9,  FN_WG3_N],
    "201F":             [ANDROID,  FUJITSU,  APQ8064,   412,412,  720,1280,   0,  0, 2048,  2,   4.7,  FN_WG3_N],
    "201K":             [ANDROID,  KYOCERA,  MSM8960,   412,412,  480,800,    0,  0, 1024,  2,   3.7,  FN_WG3L_],
    "SBM200SH":         [ANDROID,  SHARP,    MSM8960,   404,410,  720,1280,   0,  0, 1024,  2,   4.5,  FN_WG3LN],
    "DM013SH":          [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0, 1024,  2,   3.7,  FN_WG3__],
    "SBM107SHB":        [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0, 1024,  2,   3.7,  FN_WG3__],
    "WX06K":            [ANDROID,  KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  512,  2,   3.5,  FN_WG3__],
    "SBM107SH":         [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0, 1024,  2,   3.7,  FN_WG3__],
    "SBM102SH2":        [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280,   0,  0, 1024,  2,   4.5,  FN_WG3__],
    "SBM106SH":         [ANDROID,  SHARP,    MSM8260A,  404,404,  720,1280,   0,  0, 1024,  2,   4.7,  FN_WG3__],
    "102P":             [ANDROID,  PANASONIC,OMAP4430,  235,235,  540,960,  275,  0, 1024,  2,   4.3,  FN_WG3__],
    "101DL":            [ANDROID,  DELL,     MSM8260,   235,235,  540,960,    0,  0, 1024,  2,   4.3,  FN_WG3__],
    "SBM104SH":         [ANDROID,  SHARP,    OMAP4460,  403,403,  720,1280, 326,  0, 1024,  2,   4.5,  FN_WG3__],
    "DM012SH":          [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,    0,  0,  512,  2,     4,  FN_WG3__],
    "101K":             [ANDROID,  KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  512,  2,   3.5,  FN_WG3__],
    "SBM103SH":         [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,  275,  0,  512,  2,     4,  FN_WG3__],
    "101N":             [ANDROID,  NEC,      MSM8255,   235,235,  480,800,    0,  0,  512,  2,     4,  FN_WG3__],
    "101P":             [ANDROID,  PANASONIC,OMAP4430,  235,235,  480,854,    0,  0, 1024,  2,     4,  FN_WG3__],
    "SBM102SH":         [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280, 326,  0, 1024,  2,   4.5,  FN_WG3__],
    "DM011SH":          [ANDROID,  SHARP,    MSM8255,   235,235,  480,854,  288,  0,  512,  2,   3.4,  FN_WG3__],
    "SBM101SH":         [ANDROID,  SHARP,    MSM8255,   235,235,  480,854,  288,  0,  512,  2,   3.4,  FN_WG3__],
    "DM010SH":          [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  512,  2,     4,  FN_WG3__],
    "DM009SH":          [ANDROID,  SHARP,    MSM8255,   220,234,  480,800,    0,  0,  512,  2,     4,  FN_WG3__],
    "SBM009SHY":        [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,  288,  0,  512,  2,     4,  FN_WG3__],
    "SBM007SHK":        [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  512,  2,   3.4,  FN_WG3__],
    "SBM009SH":         [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  512,  2,     4,  FN_WG3__],
    "003P":             [ANDROID,  PANASONIC,OMAP3630,  233,233,  480,854,    0,  0,  512,  2,   4.3,  FN_WG3__],
    "SBM007SHJ":        [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  512,  2,   3.4,  FN_WG3__],
    "SBM007SH":         [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  512,  2,   3.4,  FN_WG3__],
    "SBM006SH":         [ANDROID,  SHARP,    MSM8255,   233,233,  540,960,    0,  0,  512,  2,   4.2,  FN_WG3__],
    "SBM005SH":         [ANDROID,  SHARP,    MSM8255,   221,221,  480,800,    0,  0,  512,  2,   3.8,  FN_WG3__],
    "001DL":            [ANDROID,  DELL,     QSD8250,   220,220,  480,800,    0,  0,  512,  2,     5,  FN_WG3__],
    "SBM003SH":         [ANDROID,  SHARP,    MSM8255,   220,234,  480,800,    0,1.5,  512,  2,   3.8,  FN_WG3__],
    "001HT":            [ANDROID,  HTC,      MSM8255,   220,233,  480,800,    0,1.5,  384,  2,   4.3,  FN_WG3__],
//  "SBM201HW":         [ANDROID,  HUAWEI,   MSM8960,   400,400,  540,960,    0,  0, 1024,  2,   4.3,  FN_WG3L_],
//  "SBM007HW":         [ANDROID,  HUAWEI,   MSM8255,   234,234,  480,800,    0,  0,  512,  2,   3.7,  FN_WG3__], // Vision
//  "X06HT":            [ANDROID,  HTC,      QSD8250,   210,220,  480,800,    0,  1,  512,  2,   3.7,  FN_WG3__],
//  "009Z":             [ANDROID,  ZTE,      MSM8255,   234,234,  480,800,    0,  0,  512,  2,   3.8,  FN_WG3__], // STAR7
//  "008Z":             [ANDROID,  ZTE,      MSM8255,   230,230,  480,800,    0,  0,  512,  2,   3.8,  FN_WG3__],
//  "003Z":             [ANDROID,  ZTE,      MSM7227,   220,220,  480,800,    0,  0,  512,  2,   3.5,  FN_WG3__], // Libero
//  "201M":             [ANDROID,  MOTOROLA, MSM8960,   400,410,  540,960,    0,  0, 1024,  2,   4.3,  FN_WG3L_], // Motorola RAZR
//}@androidjp
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- WiFi tablet ---
    "Kobo Arc 7":       [ANDROID,  RAKUTEN,  MTK8125,   422,422,  600,1024,   0,  0, 1024,  5,     7,  FN_W____], // Kobo Arc 7
    "MeMo Pad HD7":     [ANDROID,  ASUS,     MTK8125,   421,421,  800,1280,   0,  0, 1024, 10,     7,  FN_WG___], // MeMo Pad HD7
    "MeMo Pad FHD10":   [ANDROID,  ASUS,     Z2560,     422,422, 1200,1920,   0,  0, 2048, 10,  10.1,  FN_WG___ | FN_DIRECT], // MeMo Pad FHD10
//{@windowsphone
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Windows Phone 7.5 ---
    // https://www.handsetdetection.com/properties/vendormodel/
    // http://en.wikipedia.org/wiki/List_of_Windows_Phone_7_devices
    "Allegro":          [WPHONE,   ACER,     MSM8255,   750,750,  480,800,  259,  0,  512,  4,     0,  FN_WG3__],
//  "OneTouchView":     [WPHONE,   ALCATEL,  MSM7227,   750,780,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "IS12T":            [WPHONE,   FUJITSU,  MSM8655,   750,750,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "Radar":            [WPHONE,   HTC,      MSM8255,   750,750,  480,800,  246,  0,  512,  4,     0,  FN_WG3__],
    "P6800":            [WPHONE,   HTC,      MSM8255T,  750,750,  480,800,  198,  0,  512,  4,     0,  FN_WG3__], // Titan
    "PI86100":          [WPHONE,   HTC,      MSM8255T,  750,750,  480,800,  198,  0,  512,  4,     0,  FN_WG3L_], // Titan II
    "Lumia 510":        [WPHONE,   NOKIA,    MSM7227,   750,750,  480,800,    0,  0,  256,  4,     0,  FN_WG3__],
    "Lumia 610":        [WPHONE,   NOKIA,    MSM7227,   750,750,  480,800,    0,  0,  256,  4,     0,  FN_WG3__],
    "Lumia 710":        [WPHONE,   NOKIA,    MSM8255,   750,750,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "Lumia 800":        [WPHONE,   NOKIA,    MSM8255,   750,750,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "Lumia 900":        [WPHONE,   NOKIA,    APQ8055,   750,750,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "SGH-i667":         [WPHONE,   SAMSUNG,  MSM8255T,  750,750,  480,800,  233,  0,  512,  4,     0,  FN_WG3__], // Focus 2
    "SGH-i937":         [WPHONE,   SAMSUNG,  MSM8255,   750,750,  480,800,  217,  0,  512,  4,     0,  FN_WG3__], // Focus S
    "GT-S7530":         [WPHONE,   SAMSUNG,  MSM7227,   750,750,  480,800,  233,  0,  384,  4,     0,  FN_WG3__], // Omnia M
    "GT-I8350":         [WPHONE,   SAMSUNG,  MSM8255,   750,750,  480,800,  252,  0,  512,  4,     0,  FN_WG3__], // Omnia W
    "Orbit":            [WPHONE,   ZTE,      MSM7227,   750,750,  480,800,  233,  0,  512,  4,     0,  FN_WG3__],
    "Tania":            [WPHONE,   ZTE,      MSM8255,   750,750,  480,800,  217,  0,  512,  4,     0,  FN_WG3__],
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Windows Phone 8 ---
    // http://en.wikipedia.org/wiki/List_of_Windows_Phone_8_devices
    "8S":               [WPHONE,   HTC,      MSM8627,   800,800,  480,800,    0,  0,  512,  4,     0,  FN_WG3__],
    "8X":               [WPHONE,   HTC,      MSM8960,   800,800,  720,1280, 342,  0, 1024,  4,     0,  FN_WG3_N], // LTE not impl
    "8XT":              [WPHONE,   HTC,      MSM8930,   800,800,  480,800,    0,  0, 1024,  4,     0,  FN_WG3_N],
    "W1-U00":           [WPHONE,   HUAWEI,   MSM8230,   800,800,  480,800,    0,  0,  512,  4,     0,  FN_WG3__], // Ascend W1
    "W2-U00":           [WPHONE,   HUAWEI,   MSM8230,   800,800,  480,800,    0,  0,  512,  4,     0,  FN_WG3__], // Ascend W2
    "Lumia 520":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  235,  0,  512,  4,     0,  FN_WG3__],
    "Lumia 525":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  235,  0, 1024,  4,     0,  FN_WG3__],
    "Lumia 620":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  246,  0,  512,  4,     0,  FN_WG3_N], // LTE not impl
    "Lumia 625":        [WPHONE,   NOKIA,    MSM8930,   800,800,  480,800,  201,  0,  512,  4,     0,  FN_WG3L_],
    "Lumia 720":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  217,  0,  512,  4,     0,  FN_WG3_N],
    "Lumia 810":        [WPHONE,   NOKIA,    MSM8260A,  800,800,  480,800,  217,  0,  512,  4,     0,  FN_WG3_N],
    "Lumia 820":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  217,  0, 1024,  4,     0,  FN_WG3LN],
    "Lumia 822":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  217,  0, 1024,  4,     0,  FN_WG3LN],
    "Lumia 920":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0, 1024,  4,     0,  FN_WG3LN],
    "Lumia 925":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0, 1024,  4,     0,  FN_WG3LN],
    "Lumia 928":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0, 1024,  4,     0,  FN_WG3LN],
    "Lumia 1020":       [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0, 2048,  4,     0,  FN_WG3LN],
    "Lumia 1320":       [WPHONE,   NOKIA,    MSM8930,   800,800,  768,1280, 245,  0, 1024,  4,     0,  FN_WG3L_], // SoC 8930AB -> MSM8930
    "Lumia 1520":       [WPHONE,   NOKIA,    MSM8974,   800,800, 1080,1920, 367,  0, 2048,  4,     0,  FN_WG3LN], // SoC 8974AA -> MSM8974
    "GT-I8750":         [WPHONE,   SAMSUNG,  MSM8960,   800,800,  720,1280, 306,  0, 1024,  4,     0,  FN_WG3LN], // ATIV S
    "SGH-T899M":        [WPHONE,   SAMSUNG,  MSM8960,   800,800,  720,1280, 306,  0, 1024,  4,     0,  FN_WG3LN], // ATIV S
    "SPH-I800":         [WPHONE,   SAMSUNG,  MSM8930,   800,800,  720,1280, 308,  0, 1024,  4,     0,  FN_WG3LN], // ATIV S Neo, SoC MSM8930AA -> MSM8930
    "SCH-I930":         [WPHONE,   SAMSUNG,  MSM8960,   800,800,  480,800,  233,  0, 1024,  4,     0,  FN_WG3LN], // ATIV Odyssey
//}@windowsphone
    //                  [0]        [1]       [2]        [3] [4]  [5]  [6]   [7]  [8]  [9]  [10]  [11]  [12]
    //                  OS.TYPE,   BRAND     SOC         OS.VER  DISP.SIZE  PPI  DPR  RAM TOUCH  INCH  WiFi+GPS+3G+LTE+NFC
    // --- Game Console ---
    "PS 4":             [GAME,     SONY,     HIGHSPEC,    0,0,      0,0,      0,  0, 8192,  0,     0,  FN_W____], // PlayStation 4
    "PS 3":             [GAME,     SONY,     HIGHSPEC,    0,0,      0,0,      0,  0,  256,  0,     0,  FN_W____], // PlayStation 3
    "PS Vita":          [GAME,     SONY,     CXD5315GG,   0,0,    544,960,  220,  0,  512,  5,     0,  FN_WG3__], // PlayStation Vita
    "PSP":              [GAME,     SONY,     LOWSPEC,     0,0,      0,0,      0,  0,   64,  0,     0,  FN_W____], // PlayStation Portable
    "Xbox One":         [GAME,     MICROSOFT,HIGHSPEC,    0,0,      0,0,      0,  0, 8192,  0,     0,  FN_W____], // Xbox One
    "Xbox 360":         [GAME,     MICROSOFT,HIGHSPEC,    0,0,      0,0,      0,  0,  512,  0,     0,  FN_W____], // Xbox 360
    "Wii U":            [GAME,     NINTENDO, HIGHSPEC,    0,0,      0,0,      0,  0, 2048,  0,     0,  FN_W____], // Wii U
    "Wii":              [GAME,     NINTENDO, LOWSPEC,     0,0,      0,0,      0,  0,   64,  0,     0,  FN_W____], // Wii
    "3DS":              [GAME,     NINTENDO, LOWSPEC,     0,0,      0,0,      0,  0,   64,  0,     0,  FN_W____]  // 3DS
};

var SOC_CATALOG = {
    //            [0]    [1]   [2]    [3]       [4]
    //            CPU    CPU   CPU    GPU       GPU
    //            TYPE   CLOCK CORES  TYPE      ID
    "":           [ARM,  1.5,  2,     POWERVR,  "SGX554MP4"     ], // UNKNOWN SOC
    // --- Apple ---
    "A4":         [ARM,  0.8,  1,     POWERVR,  "SGX535"        ],
    "A5":         [ARM,  0.8,  2,     POWERVR,  "SGX543MP2"     ],
    "A5X":        [ARM,  1.0,  2,     POWERVR,  "SGX543MP4"     ],
    "A6":         [ARM,  1.3,  2,     POWERVR,  "SGX543MP3"     ],
    "A6X":        [ARM,  1.4,  2,     POWERVR,  "SGX554MP4"     ],
    "A7":         [ARM64,1.3,  2,     POWERVR,  "G6430"         ],
    // --- Intel ---
    "Z2560":      [ATOM, 1.6,  2,     POWERVR,  "SGX544MP2"     ],
    // --- Snapdragon ---
    // http://en.wikipedia.org/wiki/Snapdragon_(system_on_chip)
    "MSM7227":    [ARM,  0.6,  1,     ADRENO,   "200"           ],
    "QSD8250":    [ARM,  1.0,  1,     ADRENO,   "200"           ],
    "QSD8650":    [ARM,  1.0,  1,     ADRENO,   "200"           ],
    "MSM8225":    [ARM,  1.2,  1,     ADRENO,   "203"           ],
    "APQ8055":    [ARM,  1.4,  1,     ADRENO,   "205"           ],
    "MSM7230":    [ARM,  0.8,  1,     ADRENO,   "205"           ],
    "MSM8227":    [ARM,  1.0,  2,     ADRENO,   "305"           ],
    "MSM8230":    [ARM,  1.2,  2,     ADRENO,   "305"           ],
    "MSM8255":    [ARM,  1.0,  1,     ADRENO,   "205"           ],
    "MSM8255T":   [ARM,  1.4,  1,     ADRENO,   "205"           ],
    "MSM8260":    [ARM,  1.7,  2,     ADRENO,   "220"           ],
    "MSM8627":    [ARM,  1.0,  2,     ADRENO,   "305"           ],
    "MSM8655":    [ARM,  1.0,  1,     ADRENO,   "205"           ],
    "MSM8660":    [ARM,  1.2,  2,     ADRENO,   "220"           ],
    "APQ8060":    [ARM,  1.2,  2,     ADRENO,   "220"           ],
    "MSM8260A":   [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "MSM8660A":   [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "MSM8960":    [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "APQ8064":    [ARM,  1.5,  4,     ADRENO,   "320"           ],
    "APQ8064T":   [ARM,  1.7,  4,     ADRENO,   "320"           ],
    "APQ8064AB":  [ARM,  1.9,  4,     ADRENO,   "320"           ],
    "MSM8930":    [ARM,  1.2,  2,     ADRENO,   "305"           ],
    "MSM8974":    [ARM,  2.2,  4,     ADRENO,   "330"           ],
    "APQ8074":    [ARM,  2.2,  4,     ADRENO,   "330"           ],
    "MSM8974AB":  [ARM,  2.3,  4,     ADRENO,   "330"           ],
    "MSM8974AC":  [ARM,  2.5,  4,     ADRENO,   "330"           ], // Snapdragon 801
  //"---------":  [ARM64,2.5,  4,     ADRENO,   "405"           ], // Snapdragon 610
  //"---------":  [ARM64,2.5,  8,     ADRENO,   "405"           ], // Snapdragon 615
    // --- Tegra ---
    // http://en.wikipedia.org/wiki/Tegra
    "T20":        [ARM,  1.0,  2,     TEGRA,    "T20"           ],
    "AP25H":      [ARM,  1.2,  2,     TEGRA,    "AP25"          ],
    "AP33":       [ARM,  1.5,  4,     TEGRA,    "AP33"          ],
    "AP37":       [ARM,  1.7,  4,     TEGRA,    "AP37"          ],
    "T30L":       [ARM,  1.3,  4,     TEGRA,    "T30L"          ],
    // --- OMAP ---
    // http://en.wikipedia.org3wiki/OMAP
    "OMAP3630":   [ARM,  1.0,  1,     POWERVR,  "SGX530"        ],
    "OMAP4430":   [ARM,  1.2,  2,     POWERVR,  "SGX540"        ],
    "OMAP4460":   [ARM,  1.2,  2,     POWERVR,  "SGX540"        ],
    "OMAP4470":   [ARM,  1.3,  2,     POWERVR,  "SGX544"        ],
    // --- Samsung, Exynos ---
    // http://ja.wikipedia.org/wiki/Exynos
    "S5L8900":    [ARM,  0.4,  1,     POWERVR,  "MBX Lite"      ], // iPhone 3G, ARMv6
    "S5PC100":    [ARM,  0.6,  1,     POWERVR,  "SGX535"        ], // iPhone 3GS, iPod touch 3
    "S5PC110":    [ARM,  1.0,  1,     POWERVR,  "SGX540"        ],
    "Exynos4210": [ARM,  1.2,  2,     MALI,     "400MP4"        ],
    "Exynos4412": [ARM,  1.4,  4,     MALI,     "400MP4"        ],
    "Exynos5250": [ARM,  1.7,  2,     MALI,     "T604"          ],
    "Exynos5422": [ARM,  2.1,  4,     MALI,     "T628MP6"       ],
    // --- HiSilicon ---
    "K3V2":       [ARM,  1.2,  4,     IMMERSION,"Immersion.16"  ],
    "K3V2T":      [ARM,  1.2,  4,     IMMERSION,"Immersion.16"  ],
    // --- MediaTek ---
    "MTK8125":    [ARM,  1.2,  4,     POWERVR,  "SGX544"        ], // MeMo Pad HD7, Kobo Arc 7
//  "MT6572":     [ARM,  1.3,  2,     MALI,     "400MP1"        ],
//  "MT6582":     [ARM,  1.3,  4,     MALI,     "400MP2"        ],
//  "MT6588":     [ARM,  1.7,  4,     MALI,     "450MP4"        ],
//  "MT6592":     [ARM,  2.0,  8,     MALI,     "450MP4"        ],
    // --- Spreadtrum ---
//  "SC6821":     [ARM,  1.0,  1,     POWERVR,  "SC6821"        ], // Firefox OS, maybe
    // --- R-Mobile ---  
    "APE5R":      [ARM,  1.2,  2,     POWERVR,  "SGX543MP"      ],
    // --- Game and Other ---
    "LowSpec":    ["",   0.5,  1,     POWERVR,  ""              ],
    "CXD5315GG":  [ARM,  1.2,  4,     POWERVR,  "SGX543MP4+"    ],
    "HighSpec":   ["",   2.0,  4,     POWERVR,  ""              ]
};

//{@assert
function _if(value, msg) {
    if (value) {
        console.error(Valid.stack(msg));
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = Device;
}
//}@node
if (global["Device"]) {
    global["Device_"] = Device; // already exsists
} else {
    global["Device"]  = Device;
}

})((this || 0).self || global);

