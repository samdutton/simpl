// @name: UserAgent.js
// @require: Valid.js
// @cutoff: @assert @node

(function(global) {
"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert
var Spec = global["Spec"] || require("uupaa.spec.js");

var _inNode = "process" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function UserAgent(spec) { // @arg SpecObject: SpecObject.
                           // @ret SpecObject: { DEVICE, OS, ... }
                           // @help: UserAgent
                           // @desc: Parse UserAgent.
//{@assert
    _if(!Valid.type(spec, "Object"), "UserAgent(spec)");
//}@assert

    return _userAgent(spec);
}

UserAgent["repository"] = "https://github.com/uupaa/UserAgent.js";

// --- implement -------------------------------------------
function _userAgent(spec) { // @arg SpecObject:
                            // @ret SpecObject:
                            // @desc: detect DEVICE.ID, OS.TYPE, OS.VERSION

    // "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
    //                                                   ~~~~~~
    //                                                  device id
    //
    var ua    = spec["BROWSER"]["USER_AGENT"];
    var info  = spec["DEVICE"]["INFO"] || {};
    var os    = ""; // OS.TYPE value
    var id    = ""; // DEVICE.Id value
    var ver   = "0.0.0";

    // detect DEVICE.ID and DEVICE.OS
    if ( /PlayStation|Xbox|Nintendo/i.test(ua) ) {
        os = "Game";
        id = _getGameDeviceID(ua);
    } else if ( /Android/.test(ua) ) {
        // Mozilla/5.0 (Linux; U; Android 2.2;   ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
        // Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
        //                                ~~~~~
        //                                | | +-- Patch
        //                                | +---- Minor
        //                                +------ Major
        os = "Android";
        id = _getAndroidDeviceID(ua);
        ver = ua.split("Android")[1].split(";")[0];
    } else if ( /iPhone|iPad|iPod/.test(ua) ) {
        // Mozilla/5.0 (iPhone; CPU iPhone OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
        // Mozilla/5.0 (iPod;   CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
        //                                    ~~~~~
        //                                    | | +-- Patch
        //                                    | +---- Minor
        //                                    +------ Major
        os = "iOS";
        id = _getiOSDeviceID(ua, info);
        ver = ua.split(/OS /)[1].split(" ")[0];
    } else if ( /Windows Phone/.test(ua) ) {
        os = "Windows Phone";
        id = _getWindowsPhoneDeviceID(ua);
        ver = ua.split(/Windows Phone (?:OS )?/)[1].split(";")[0];
    } else if ( /Mac OS X/.test(ua) ) {
        os = "Mac OS X";
        ver = ua.split("Mac OS X ")[1].split(")")[0];
    } else if ( /Windows/.test(ua) ) {
        os = "Windows";
        ver = ua.replace(" NT ", " ").split("Windows ")[1].split(";")[0];
    } else if ( /Firefox/.test(ua) ) {
        os = "Firefox OS";
    }

    // overwrite device id.
    switch (id) {
    case "Nexus 7": // -> "Nexus 7 (2013)"
        id = (info["devicePixelRatio"] || 1) === 2 ? "Nexus 7 (2013)" // Nexus 7 (2013)
                                                   : "Nexus 7";       // Nexus 7 (2012)
    }

    spec["DEVICE"]["ID"] = id;
    spec["OS"]["TYPE"] = os;
    spec["OS"]["VERSION"] = Spec["normalizeVersionString"](ver);
    return spec;
}

function _getGameDeviceID(userAgent) { // @arg String:
                                       // @ret String: id
    var id = /PlayStation 3/i.test(userAgent)        ? "PS 3"
           : /PlayStation 4/i.test(userAgent)        ? "PS 4"
           : /PlayStation Vita/i.test(userAgent)     ? "PS Vita"
           : /PlayStation Portable/i.test(userAgent) ? "PSP"
           : /Xbox One/i.test(userAgent)             ? "Xbox One"
           : /Xbox/i.test(userAgent)                 ? "Xbox 360"
           : /WiiU/i.test(userAgent)                 ? "Wii U"
           : /Wii/i.test(userAgent)                  ? "Wii"
           : /3DS/i.test(userAgent)                  ? "3DS"
                                                     : "";
    return id;
}

function _getAndroidDeviceID(userAgent) { // @arg String:
                                          // @ret String: id
    // Examples:
    //
    //      Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; HTC6500LVW      4G Build/JDQ39)       AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    //      Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFTT               Build/IML74K)      AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.4 Mobile Safari/535.19 Silk-Accelerated=true
    //      Mozilla/5.0 (Linux;    Android 4.1.1;        Nexus 7            Build/JRO03S)      AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19
    //      Mozilla/5.0 (Linux; U; Android 1.5;   ja-jp; GDDJ-09            Build/CDB56)       AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1
    //      Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    //      Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; SC-01D             Build/MASTER)      AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    //      Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus       Build/ITL41D)      AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    //      Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; URBANO PROGRESSO   Build/010.0.3000)  AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    //      Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; Sony Tablet S      Build/THMAS11000)  AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    //                                                   ~~~~~~~~~~~~~~~~
    //                                                     device id
    //
    // Exceptional pattern:
    //
    //      Mozilla/5.0 (Linux; U; Android 2.3;   ja-jp; SonyEricssonSO-01C Build/3.0.A.1.34)  AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    //                                                               ~~~~~~
    //      Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D         Build/7.0.D.1.117) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    //                                                       ~~~~~~
    //      Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0

    if (/Firefox/.test(userAgent)) {
        return "";
    }
    var id = userAgent.replace(" 4G ", "").split("Build/")[0].split(";").slice(-1).join().trim();

    if ( /^Sony/.test(id) ) {
        if ( /Tablet/.test(id) ) {
            // Sony Tablet
        } else {
            // Remove "Sony" and "Ericsson" prefixes.
            id = id.replace(/^Sony/, "").
                    replace(/^Ericsson/, "");
        }
    }
    return id;
}

function _getiOSDeviceID(userAgent,    // @arg String:
                         deviceInfo) { // @arg Object: override device info. { screen:Object, devicePixelRatio }
                                       // @ret String: id
    // Examples:
    //
    //      Mozilla/5.0 (iPad;   CPU        OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    //      Mozilla/5.0 (iPod;   CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
    //      Mozilla/5.0 (iPhone; CPU iPhone OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    //                   ~~~~~~
    //                  device id

    deviceInfo = deviceInfo || global;

    var id = /iPad/.test(userAgent) ? "iPad"
           : /iPod/.test(userAgent) ? "iPod"
                                    : "iPhone";
    var dpr = deviceInfo["devicePixelRatio"] || 1;
    var longEdge = Math.max( (deviceInfo["screen"] || {})["width"]  || 0,
                             (deviceInfo["screen"] || {})["height"] || 0 ); // iPhone 4S: 480, iPhone 5: 568

    switch (id) {
    case "iPad":
        id = (dpr === 1) ? "iPad 2"  // maybe, candidate: iPad 2, iPad mini
                         : "iPad 3"; // maybe, candidate: iPad 3, iPad 4, iPad Air, iPad mini Retina, ...
        break;
    case "iPhone":
        id = (dpr === 1)      ? "iPhone 3GS"
           : (longEdge > 480) ? "iPhone 5"   // maybe, candidate: iPhone 5, iPhone 5c, iPhone 5s, iPhone 6...
                              : "iPhone 4";  // maybe, condidate: iPhone 4, iPhone 4S
        break;
    case "iPod":
        id = (longEdge > 480) ? "iPod touch 5"  // maybe, candidate: iPod touch 5, iPod touch 6...
           : (dpr === 2)      ? "iPod touch 4"
                              : "iPod touch 3";
    }
    return id;
}

function _getWindowsPhoneDeviceID(userAgent) { // @arg String:
                                               // @ret String: id
    // Examples:
    //      Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG;                         GW910         )
    //      Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; FujitsuToshibaMobileCommun; IS12T;    KDDI)
    //      Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG;                    SGH-i917      )
    //                                                                                                                      ~~~~~~~~
    //                                                                                                                      device id
    //
    //      Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HUAWEI; W1-U00   )
    //      Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA;  Lumia 920)
    //                                                                                                             ~~~~~~~~~
    //
    // Exceptional pattern:
    //
    //      Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0;            HTC; Windows Phone 8S by HTC; 1.04.163.03)
    //                                                                                                                        ~~
    //      Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC)
    //      Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC) BMID/E67A464280
    //                                                                                                                        ~~
    //      Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8X by HTC)
    //                                                                                                                        ~~

    var ua = userAgent.split("(")[1].split(")")[0];
    var token = ua.replace("ARM; ", "").replace("Touch; ", "").
                   replace(/LG; /i, "").replace(/ZTE; /i, "").
                   replace(/HTC; /i, "").replace(/DELL; /i, "").
                   replace(/ACER; /i, "").replace(/Alcatel; /i, "").
                   replace(/NOKIA; /i, "").replace(/SAMSUNG; /i, "").
                   replace(/FujitsuToshibaMobileCommun; /i, "").
                   replace(/Windows Phone /g, "").replace(" by HTC", ""). // nonsense!
                   split(/IEMobile\//)[1].split("; ");

//  var ieVersion = token[0];
    var id = (token[1] || "").trim();

    return id;
}

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
    module["exports"] = UserAgent;
}
//}@node
if (global["UserAgent"]) {
    global["UserAgent_"] = UserAgent; // already exsists
} else {
    global["UserAgent"]  = UserAgent;
}

})((this || 0).self || global);

