"undefined" == typeof jwplayer && (jwplayer = function(f) {
    if (jwplayer.api) return jwplayer.api.selectPlayer(f)
  }, jwplayer.version = "6.9.4858", jwplayer.vid = document.createElement("video"), jwplayer.audio = document.createElement("audio"), jwplayer.source = document.createElement("source"), function(f) {
    function c(e) {
      return function() {
        return a(e)
      }
    }

    function m(e, a, j, l, b) {
      return function() {
        var c, g;
        if (b) j(e);
        else {
          try {
            if (c = e.responseXML)
              if (g = c.firstChild, c.lastChild && "parsererror" === c.lastChild.nodeName) {
                l && l("Invalid XML",
                  a, e);
                return
              }
          } catch (h) {}
          if (c && g) return j(e);
          (c = d.parseXML(e.responseText)) && c.firstChild ? (e = d.extend({}, e, {
            responseXML: c
          }), j(e)) : l && l(e.responseText ? "Invalid XML" : a, a, e)
        }
      }
    }
    var k = document,
      h = window,
      b = navigator,
      d = f.utils = function() {};
    d.exists = function(e) {
      switch (typeof e) {
        case "string":
          return 0 < e.length;
        case "object":
          return null !== e;
        case "undefined":
          return !1
      }
      return !0
    };
    d.styleDimension = function(e) {
      return e + (0 < e.toString().indexOf("%") ? "" : "px")
    };
    d.getAbsolutePath = function(e, a) {
      d.exists(a) || (a = k.location.href);
      if (d.exists(e)) {
        var j;
        if (d.exists(e)) {
          j = e.indexOf("://");
          var l = e.indexOf("?");
          j = 0 < j && (0 > l || l > j)
        } else j = void 0;
        if (j) return e;
        j = a.substring(0, a.indexOf("://") + 3);
        var l = a.substring(j.length, a.indexOf("/", j.length + 1)),
          b;
        0 === e.indexOf("/") ? b = e.split("/") : (b = a.split("?")[0], b = b.substring(j.length + l.length + 1, b.lastIndexOf("/")), b = b.split("/").concat(e.split("/")));
        for (var c = [], g = 0; g < b.length; g++) b[g] && (d.exists(b[g]) && "." != b[g]) && (".." == b[g] ? c.pop() : c.push(b[g]));
        return j + l + "/" + c.join("/")
      }
    };
    d.extend = function() {
      var e =
        Array.prototype.slice.call(arguments, 0);
      if (1 < e.length) {
        for (var a = e[0], j = function(e, l) {
            void 0 !== l && null !== l && (a[e] = l)
          }, l = 1; l < e.length; l++) d.foreach(e[l], j);
        return a
      }
      return null
    };
    var n = window.console = window.console || {
      log: function() {}
    };
    d.log = function() {
      var e = Array.prototype.slice.call(arguments, 0);
      "object" === typeof n.log ? n.log(e) : n.log.apply(n, e)
    };
    var a = d.userAgentMatch = function(e) {
      return null !== b.userAgent.toLowerCase().match(e)
    };
    d.isFF = c(/firefox/i);
    d.isChrome = c(/chrome/i);
    d.isIPod = c(/iP(hone|od)/i);
    d.isIPad = c(/iPad/i);
    d.isSafari602 = c(/Macintosh.*Mac OS X 10_8.*6\.0\.\d* Safari/i);
    d.isIETrident = function(e) {
      return e ? (e = parseFloat(e).toFixed(1), a(RegExp("trident/.+rv:\\s*" + e, "i"))) : a(/trident/i)
    };
    d.isMSIE = function(e) {
      return e ? (e = parseFloat(e).toFixed(1), a(RegExp("msie\\s*" + e, "i"))) : a(/msie/i)
    };
    d.isIE = function(e) {
      return e ? (e = parseFloat(e).toFixed(1), 11 <= e ? d.isIETrident(e) : d.isMSIE(e)) : d.isMSIE() || d.isIETrident()
    };
    d.isSafari = function() {
      return a(/safari/i) && !a(/chrome/i) && !a(/chromium/i) && !a(/android/i)
    };
    d.isIOS = function(e) {
      return e ? a(RegExp("iP(hone|ad|od).+\\sOS\\s" + e, "i")) : a(/iP(hone|ad|od)/i)
    };
    d.isAndroidNative = function(e) {
      return d.isAndroid(e, !0)
    };
    d.isAndroid = function(e, b) {
      return b && a(!a(/chrome\/18/)) ? !1 : e ? (d.isInt(e) && !/\./.test(e) && (e = "" + e + "."), a(RegExp("Android\\s*" + e, "i"))) : a(/Android/i)
    };
    d.isMobile = function() {
      return d.isIOS() || d.isAndroid()
    };
    d.saveCookie = function(e, a) {
      k.cookie = "jwplayer." + e + "\x3d" + a + "; path\x3d/"
    };
    d.getCookies = function() {
      for (var e = {}, a = k.cookie.split("; "), j = 0; j < a.length; j++) {
        var l =
          a[j].split("\x3d");
        0 === l[0].indexOf("jwplayer.") && (e[l[0].substring(9, l[0].length)] = l[1])
      }
      return e
    };
    d.isInt = function(e) {
      return 0 === e % 1
    };
    d.typeOf = function(e) {
      var a = typeof e;
      return "object" === a ? !e ? "null" : e instanceof Array ? "array" : a : a
    };
    d.translateEventResponse = function(e, a) {
      var j = d.extend({}, a);
      if (e == f.events.JWPLAYER_FULLSCREEN && !j.fullscreen) j.fullscreen = "true" === j.message, delete j.message;
      else if ("object" == typeof j.data) {
        var l = j.data;
        delete j.data;
        j = d.extend(j, l)
      } else "object" == typeof j.metadata &&
        d.deepReplaceKeyName(j.metadata, ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]);
      d.foreach(["position", "duration", "offset"], function(e, l) {
        j[l] && (j[l] = Math.round(1E3 * j[l]) / 1E3)
      });
      return j
    };
    d.flashVersion = function() {
      if (d.isAndroid()) return 0;
      var e = b.plugins,
        a;
      try {
        if ("undefined" !== e && (a = e["Shockwave Flash"])) return parseInt(a.description.replace(/\D+(\d+)\..*/, "$1"), 10)
      } catch (j) {}
      if ("undefined" != typeof h.ActiveXObject) try {
        if (a = new h.ActiveXObject("ShockwaveFlash.ShockwaveFlash")) return parseInt(a.GetVariable("$version").split(" ")[1].split(",")[0],
          10)
      } catch (l) {}
      return 0
    };
    d.getScriptPath = function(e) {
      for (var a = k.getElementsByTagName("script"), j = 0; j < a.length; j++) {
        var l = a[j].src;
        if (l && 0 <= l.indexOf(e)) return l.substr(0, l.indexOf(e))
      }
      return ""
    };
    d.deepReplaceKeyName = function(e, a, j) {
      switch (f.utils.typeOf(e)) {
        case "array":
          for (var l = 0; l < e.length; l++) e[l] = f.utils.deepReplaceKeyName(e[l], a, j);
          break;
        case "object":
          d.foreach(e, function(l, b) {
            var d;
            if (a instanceof Array && j instanceof Array) {
              if (a.length != j.length) return;
              d = a
            } else d = [a];
            for (var c = l, g = 0; g < d.length; g++) c =
              c.replace(RegExp(a[g], "g"), j[g]);
            e[c] = f.utils.deepReplaceKeyName(b, a, j);
            l != c && delete e[l]
          })
      }
      return e
    };
    var g = d.pluginPathType = {
      ABSOLUTE: 0,
      RELATIVE: 1,
      CDN: 2
    };
    d.getPluginPathType = function(e) {
      if ("string" == typeof e) {
        e = e.split("?")[0];
        var a = e.indexOf("://");
        if (0 < a) return g.ABSOLUTE;
        var j = e.indexOf("/");
        e = d.extension(e);
        return 0 > a && 0 > j && (!e || !isNaN(e)) ? g.CDN : g.RELATIVE
      }
    };
    d.getPluginName = function(e) {
      return e.replace(/^(.*\/)?([^-]*)-?.*\.(swf|js)$/, "$2")
    };
    d.getPluginVersion = function(e) {
      return e.replace(/[^-]*-?([^\.]*).*$/,
        "$1")
    };
    d.isYouTube = function(e) {
      return /^(http|\/\/).*(youtube\.com|youtu\.be)\/.+/.test(e)
    };
    d.youTubeID = function(e) {
      try {
        return /v[=\/]([^?&]*)|youtu\.be\/([^?]*)|^([\w-]*)$/i.exec(e).slice(1).join("").replace("?", "")
      } catch (a) {
        return ""
      }
    };
    d.isRtmp = function(e, a) {
      return 0 === e.indexOf("rtmp") || "rtmp" == a
    };
    d.foreach = function(e, a) {
      var j, l;
      for (j in e) "function" == d.typeOf(e.hasOwnProperty) ? e.hasOwnProperty(j) && (l = e[j], a(j, l)) : (l = e[j], a(j, l))
    };
    d.isHTTPS = function() {
      return 0 === h.location.href.indexOf("https")
    };
    d.repo = function() {
      var e = "http://p.jwpcdn.com/" + f.version.split(/\W/).splice(0, 2).join("/") + "/";
      try {
        d.isHTTPS() && (e = e.replace("http://", "https://ssl."))
      } catch (a) {}
      return e
    };
    d.ajax = function(e, a, j, l) {
      var b, c = !1;
      0 < e.indexOf("#") && (e = e.replace(/#.*$/, ""));
      if (e && 0 <= e.indexOf("://") && e.split("/")[2] != h.location.href.split("/")[2] && d.exists(h.XDomainRequest)) b = new h.XDomainRequest, b.onload = m(b, e, a, j, l), b.ontimeout = b.onprogress = function() {}, b.timeout = 5E3;
      else if (d.exists(h.XMLHttpRequest)) {
        var g = b = new h.XMLHttpRequest,
          k = e;
        b.onreadystatechange = function() {
          if (4 === g.readyState) switch (g.status) {
            case 200:
              m(g, k, a, j, l)();
              break;
            case 404:
              j("File not found", k, g)
          }
        }
      } else return j && j("", e, b), b;
      b.overrideMimeType && b.overrideMimeType("text/xml");
      var n = e,
        f = b;
      b.onerror = function() {
        j("Error loading file", n, f)
      };
      try {
        b.open("GET", e, !0)
      } catch (G) {
        c = !0
      }
      setTimeout(function() {
        if (c) j && j(e, e, b);
        else try {
          b.send()
        } catch (a) {
          j && j(e, e, b)
        }
      }, 0);
      return b
    };
    d.parseXML = function(a) {
      var b;
      try {
        if (h.DOMParser) {
          if (b = (new h.DOMParser).parseFromString(a, "text/xml"),
            b.childNodes && b.childNodes.length && "parsererror" == b.childNodes[0].firstChild.nodeName) return
        } else b = new h.ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)
      } catch (j) {
        return
      }
      return b
    };
    d.filterPlaylist = function(a, b, j) {
      var l = [],
        c, g, h, k;
      for (c = 0; c < a.length; c++)
        if (g = d.extend({}, a[c]), g.sources = d.filterSources(g.sources, !1, j), 0 < g.sources.length) {
          for (h = 0; h < g.sources.length; h++) k = g.sources[h], k.label || (k.label = h.toString());
          l.push(g)
        }
      if (b && 0 === l.length)
        for (c = 0; c < a.length; c++)
          if (g = d.extend({}, a[c]),
            g.sources = d.filterSources(g.sources, !0, j), 0 < g.sources.length) {
            for (h = 0; h < g.sources.length; h++) k = g.sources[h], k.label || (k.label = h.toString());
            l.push(g)
          }
      return l
    };
    d.between = function(a, b, j) {
      return Math.max(Math.min(a, j), b)
    };
    d.filterSources = function(a, b, j) {
      var l, c;
      if (a) {
        c = [];
        for (var g = 0; g < a.length; g++) {
          var h = d.extend({}, a[g]),
            k = h.file,
            n = h.type;
          k && (h.file = k = d.trim("" + k), n || (n = d.extension(k), h.type = n = d.extensionmap.extType(n)), b ? f.embed.flashCanPlay(k, n) && (l || (l = n), n == l && c.push(h)) : f.embed.html5CanPlay(k,
            n, j) && (l || (l = n), n == l && c.push(h)))
        }
      }
      return c
    };
    d.canPlayHTML5 = function(a) {
      a = d.extensionmap.types[a];
      return !!a && !!f.vid.canPlayType && !!f.vid.canPlayType(a)
    };
    d.seconds = function(a) {
      a = a.replace(",", ".");
      var b = a.split(":"),
        j = 0;
      "s" == a.slice(-1) ? j = parseFloat(a) : "m" == a.slice(-1) ? j = 60 * parseFloat(a) : "h" == a.slice(-1) ? j = 3600 * parseFloat(a) : 1 < b.length ? (j = parseFloat(b[b.length - 1]), j += 60 * parseFloat(b[b.length - 2]), 3 == b.length && (j += 3600 * parseFloat(b[b.length - 3]))) : j = parseFloat(a);
      return j
    };
    d.serialize = function(a) {
      return null ===
        a ? null : "true" == a.toString().toLowerCase() ? !0 : "false" == a.toString().toLowerCase() ? !1 : isNaN(Number(a)) || 5 < a.length || 0 === a.length ? a : Number(a)
    }
  }(jwplayer), function(f) {
    function c(a) {
      var l = document.createElement("style");
      a && l.appendChild(document.createTextNode(a));
      l.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(l);
      return l
    }

    function m(a, l, e) {
      if (!b.exists(l)) return "";
      e = e ? " !important" : "";
      return "string" === typeof l && isNaN(l) ? /png|gif|jpe?g/i.test(l) && 0 > l.indexOf("url") ? "url(" + l + ")" :
        l + e : 0 === l || "z-index" === a || "opacity" === a ? "" + l + e : /color/i.test(a) ? "#" + b.pad(l.toString(16).replace(/^0x/i, ""), 6) + e : Math.ceil(l) + "px" + e
    }

    function k(a, l) {
      for (var b = 0; b < a.length; b++) {
        var e = a[b],
          c, d;
        if (void 0 !== e && null !== e)
          for (c in l) {
            d = c;
            d = d.split("-");
            for (var g = 1; g < d.length; g++) d[g] = d[g].charAt(0).toUpperCase() + d[g].slice(1);
            d = d.join("");
            e.style[d] !== l[c] && (e.style[d] = l[c])
          }
      }
    }

    function h(b) {
      var l = d[b].sheet,
        c, g, h;
      if (l) {
        c = l.cssRules;
        g = e[b];
        h = b;
        var k = a[h];
        h += " { ";
        for (var n in k) h += n + ": " + k[n] + "; ";
        h += "}";
        if (void 0 !== g && g < c.length && c[g].selectorText === b) {
          if (h === c[g].cssText) return;
          l.deleteRule(g)
        } else g = c.length, e[b] = g;
        try {
          l.insertRule(h, g)
        } catch (f) {}
      }
    }
    var b = f.utils,
      d = {},
      n, a = {},
      g = null,
      e = {};
    b.cssKeyframes = function(a, b) {
      var e = d.keyframes;
      e || (e = c(), d.keyframes = e);
      var e = e.sheet,
        g = "@keyframes " + a + " { " + b + " }";
      try {
        e.insertRule(g, e.cssRules.length)
      } catch (h) {}
      g = g.replace(/(keyframes|transform)/g, "-webkit-$1");
      try {
        e.insertRule(g, e.cssRules.length)
      } catch (k) {}
    };
    var p = b.css = function(b, l, e) {
      a[b] || (a[b] = {});
      var k =
        a[b];
      e = e || !1;
      var f = !1,
        p, q;
      for (p in l) q = m(p, l[p], e), "" !== q ? q !== k[p] && (k[p] = q, f = !0) : void 0 !== k[p] && (delete k[p], f = !0);
      if (f) {
        if (!d[b]) {
          l = n && n.sheet && n.sheet.cssRules && n.sheet.cssRules.length || 0;
          if (!n || 5E4 < l) n = c();
          d[b] = n
        }
        null !== g ? g.styleSheets[b] = a[b] : h(b)
      }
    };
    p.style = function(a, b, e) {
      if (!(void 0 === a || null === a)) {
        void 0 === a.length && (a = [a]);
        var c = {},
          d;
        for (d in b) c[d] = m(d, b[d]);
        if (null !== g && !e) {
          b = (b = a.__cssRules) || {};
          for (var h in c) b[h] = c[h];
          a.__cssRules = b;
          0 > g.elements.indexOf(a) && g.elements.push(a)
        } else k(a,
          c)
      }
    };
    p.block = function(a) {
      null === g && (g = {
        id: a,
        styleSheets: {},
        elements: []
      })
    };
    p.unblock = function(a) {
      if (g && (!a || g.id === a)) {
        for (var b in g.styleSheets) h(b);
        for (a = 0; a < g.elements.length; a++) b = g.elements[a], k(b, b.__cssRules);
        g = null
      }
    };
    b.clearCss = function(b) {
      for (var e in a) 0 <= e.indexOf(b) && delete a[e];
      for (var c in d) 0 <= c.indexOf(b) && h(c)
    };
    b.transform = function(a, b) {
      var e = {};
      b = b || "";
      e.transform = b;
      e["-webkit-transform"] = b;
      e["-ms-transform"] = b;
      e["-moz-transform"] = b;
      e["-o-transform"] = b;
      "string" === typeof a ? p(a, e) :
        p.style(a, e)
    };
    b.dragStyle = function(a, b) {
      p(a, {
        "-webkit-user-select": b,
        "-moz-user-select": b,
        "-ms-user-select": b,
        "-webkit-user-drag": b,
        "user-select": b,
        "user-drag": b
      })
    };
    b.transitionStyle = function(a, b) {
      navigator.userAgent.match(/5\.\d(\.\d)? safari/i) || p(a, {
        "-webkit-transition": b,
        "-moz-transition": b,
        "-o-transition": b,
        transition: b
      })
    };
    b.rotate = function(a, e) {
      b.transform(a, "rotate(" + e + "deg)")
    };
    b.rgbHex = function(a) {
      a = String(a).replace("#", "");
      3 === a.length && (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]);
      return "#" + a.substr(-6)
    };
    b.hexToRgba = function(a, b) {
      var e = "rgb",
        c = [parseInt(a.substr(1, 2), 16), parseInt(a.substr(3, 2), 16), parseInt(a.substr(5, 2), 16)];
      void 0 !== b && 100 !== b && (e += "a", c.push(b / 100));
      return e + "(" + c.join(",") + ")"
    }
  }(jwplayer), function(f) {
    var c = f.foreach,
      m = {
        mp4: "video/mp4",
        ogg: "video/ogg",
        oga: "audio/ogg",
        vorbis: "audio/ogg",
        webm: "video/webm",
        aac: "audio/mp4",
        mp3: "audio/mpeg",
        hls: "application/vnd.apple.mpegurl"
      },
      k = {
        mp4: m.mp4,
        f4v: m.mp4,
        m4v: m.mp4,
        mov: m.mp4,
        m4a: m.aac,
        f4a: m.aac,
        aac: m.aac,
        mp3: m.mp3,
        ogv: m.ogg,
        ogg: m.ogg,
        oga: m.vorbis,
        vorbis: m.vorbis,
        webm: m.webm,
        m3u8: m.hls,
        m3u: m.hls,
        hls: m.hls
      },
      h = f.extensionmap = {};
    c(k, function(b, c) {
      h[b] = {
        html5: c
      }
    });
    c({
      flv: "video",
      f4v: "video",
      mov: "video",
      m4a: "video",
      m4v: "video",
      mp4: "video",
      aac: "video",
      f4a: "video",
      mp3: "sound",
      smil: "rtmp",
      m3u8: "hls",
      hls: "hls"
    }, function(b, c) {
      h[b] || (h[b] = {});
      h[b].flash = c
    });
    h.types = m;
    h.mimeType = function(b) {
      var d;
      c(m, function(c, a) {
        !d && a == b && (d = c)
      });
      return d
    };
    h.extType = function(b) {
      return h.mimeType(k[b])
    }
  }(jwplayer.utils), function(f) {
    var c = f.loaderstatus = {
        NEW: 0,
        LOADING: 1,
        ERROR: 2,
        COMPLETE: 3
      },
      m = document;
    f.scriptloader = function(k) {
      function h(b) {
        a = c.ERROR;
        n.sendEvent(d.ERROR, b)
      }

      function b(b) {
        a = c.COMPLETE;
        n.sendEvent(d.COMPLETE, b)
      }
      var d = jwplayer.events,
        n = f.extend(this, new d.eventdispatcher),
        a = c.NEW;
      this.load = function() {
        if (a == c.NEW) {
          var g = f.scriptloader.loaders[k];
          if (g && (a = g.getStatus(), 2 > a)) {
            g.addEventListener(d.ERROR, h);
            g.addEventListener(d.COMPLETE, b);
            return
          }
          var e = m.createElement("script");
          e.addEventListener ? (e.onload = b, e.onerror = h) : e.readyState && (e.onreadystatechange =
            function(a) {
              ("loaded" == e.readyState || "complete" == e.readyState) && b(a)
            });
          m.getElementsByTagName("head")[0].appendChild(e);
          e.src = k;
          a = c.LOADING;
          f.scriptloader.loaders[k] = this
        }
      };
      this.getStatus = function() {
        return a
      }
    };
    f.scriptloader.loaders = {}
  }(jwplayer.utils), function(f) {
    f.trim = function(c) {
      return c.replace(/^\s*/, "").replace(/\s*$/, "")
    };
    f.pad = function(c, f, k) {
      for (k || (k = "0"); c.length < f;) c = k + c;
      return c
    };
    f.xmlAttribute = function(c, f) {
      for (var k = 0; k < c.attributes.length; k++)
        if (c.attributes[k].name && c.attributes[k].name.toLowerCase() ==
          f.toLowerCase()) return c.attributes[k].value.toString();
      return ""
    };
    f.extension = function(c) {
      if (!c || "rtmp" == c.substr(0, 4)) return "";
      var f;
      f = c.match(/manifest\(format=(.*),audioTrack/);
      f = !f || !f[1] ? !1 : f[1].split("-")[0];
      if (f) return f;
      c = c.substring(c.lastIndexOf("/") + 1, c.length).split("?")[0].split("#")[0];
      if (-1 < c.lastIndexOf(".")) return c.substr(c.lastIndexOf(".") + 1, c.length).toLowerCase()
    };
    f.stringToColor = function(c) {
      c = c.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2");
      3 == c.length && (c = c.charAt(0) + c.charAt(0) +
        c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2));
      return parseInt(c, 16)
    }
  }(jwplayer.utils), function(f) {
    var c = "touchmove",
      m = "touchstart";
    f.touch = function(k) {
      function h(g) {
        g.type == m ? (a = !0, e = d(j.DRAG_START, g)) : g.type == c ? a && (p || (b(j.DRAG_START, g, e), p = !0), b(j.DRAG, g)) : (a && (p ? b(j.DRAG_END, g) : (g.cancelBubble = !0, b(j.TAP, g))), a = p = !1, e = null)
      }

      function b(a, b, e) {
        if (g[a] && (b.preventManipulation && b.preventManipulation(), b.preventDefault && b.preventDefault(), b = e ? e : d(a, b))) g[a](b)
      }

      function d(a, b) {
        var c = null;
        b.touches &&
          b.touches.length ? c = b.touches[0] : b.changedTouches && b.changedTouches.length && (c = b.changedTouches[0]);
        if (!c) return null;
        var g = n.getBoundingClientRect(),
          c = {
            type: a,
            target: n,
            x: c.pageX - window.pageXOffset - g.left,
            y: c.pageY,
            deltaX: 0,
            deltaY: 0
          };
        a != j.TAP && e && (c.deltaX = c.x - e.x, c.deltaY = c.y - e.y);
        return c
      }
      var n = k,
        a = !1,
        g = {},
        e = null,
        p = !1,
        j = f.touchEvents;
      document.addEventListener(c, h);
      document.addEventListener("touchend", function(c) {
        a && p && b(j.DRAG_END, c);
        a = p = !1;
        e = null
      });
      document.addEventListener("touchcancel", h);
      k.addEventListener(m,
        h);
      k.addEventListener("touchend", h);
      this.addEventListener = function(a, b) {
        g[a] = b
      };
      this.removeEventListener = function(a) {
        delete g[a]
      };
      return this
    }
  }(jwplayer.utils), function(f) {
    f.touchEvents = {
      DRAG: "jwplayerDrag",
      DRAG_START: "jwplayerDragStart",
      DRAG_END: "jwplayerDragEnd",
      TAP: "jwplayerTap"
    }
  }(jwplayer.utils), function(f) {
    f.key = function(c) {
      var m, k, h;
      this.edition = function() {
        return h && h.getTime() < (new Date).getTime() ? "invalid" : m
      };
      this.token = function() {
        return k
      };
      f.exists(c) || (c = "");
      try {
        c = f.tea.decrypt(c, "36QXq4W@GSBV^teR");
        var b = c.split("/");
        (m = b[0]) ? /^(free|pro|premium|enterprise|ads)$/i.test(m) ? (k = b[1], b[2] && 0 < parseInt(b[2]) && (h = new Date, h.setTime(String(b[2])))) : m = "invalid": m = "free"
      } catch (d) {
        m = "invalid"
      }
    }
  }(jwplayer.utils), function(f) {
    var c = f.tea = {};
    c.encrypt = function(h, b) {
      if (0 == h.length) return "";
      var d = c.strToLongs(k.encode(h));
      1 >= d.length && (d[1] = 0);
      for (var n = c.strToLongs(k.encode(b).slice(0, 16)), a = d.length, g = d[a - 1], e = d[0], f, j = Math.floor(6 + 52 / a), l = 0; 0 < j--;) {
        l += 2654435769;
        f = l >>> 2 & 3;
        for (var r = 0; r < a; r++) e = d[(r + 1) % a],
          g = (g >>> 5 ^ e << 2) + (e >>> 3 ^ g << 4) ^ (l ^ e) + (n[r & 3 ^ f] ^ g), g = d[r] += g
      }
      d = c.longsToStr(d);
      return m.encode(d)
    };
    c.decrypt = function(h, b) {
      if (0 == h.length) return "";
      for (var d = c.strToLongs(m.decode(h)), n = c.strToLongs(k.encode(b).slice(0, 16)), a = d.length, g = d[a - 1], e = d[0], f, j = 2654435769 * Math.floor(6 + 52 / a); 0 != j;) {
        f = j >>> 2 & 3;
        for (var l = a - 1; 0 <= l; l--) g = d[0 < l ? l - 1 : a - 1], g = (g >>> 5 ^ e << 2) + (e >>> 3 ^ g << 4) ^ (j ^ e) + (n[l & 3 ^ f] ^ g), e = d[l] -= g;
        j -= 2654435769
      }
      d = c.longsToStr(d);
      d = d.replace(/\0+$/, "");
      return k.decode(d)
    };
    c.strToLongs = function(c) {
      for (var b =
          Array(Math.ceil(c.length / 4)), d = 0; d < b.length; d++) b[d] = c.charCodeAt(4 * d) + (c.charCodeAt(4 * d + 1) << 8) + (c.charCodeAt(4 * d + 2) << 16) + (c.charCodeAt(4 * d + 3) << 24);
      return b
    };
    c.longsToStr = function(c) {
      for (var b = Array(c.length), d = 0; d < c.length; d++) b[d] = String.fromCharCode(c[d] & 255, c[d] >>> 8 & 255, c[d] >>> 16 & 255, c[d] >>> 24 & 255);
      return b.join("")
    };
    var m = {
        code: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d",
        encode: function(c, b) {
          var d, f, a, g, e = [],
            p = "",
            j, l, r = m.code;
          l = ("undefined" == typeof b ? 0 : b) ? k.encode(c) :
            c;
          j = l.length % 3;
          if (0 < j)
            for (; 3 > j++;) p += "\x3d", l += "\x00";
          for (j = 0; j < l.length; j += 3) d = l.charCodeAt(j), f = l.charCodeAt(j + 1), a = l.charCodeAt(j + 2), g = d << 16 | f << 8 | a, d = g >> 18 & 63, f = g >> 12 & 63, a = g >> 6 & 63, g &= 63, e[j / 3] = r.charAt(d) + r.charAt(f) + r.charAt(a) + r.charAt(g);
          e = e.join("");
          return e = e.slice(0, e.length - p.length) + p
        },
        decode: function(c, b) {
          b = "undefined" == typeof b ? !1 : b;
          var d, f, a, g, e, p = [],
            j, l = m.code;
          j = b ? k.decode(c) : c;
          for (var r = 0; r < j.length; r += 4) d = l.indexOf(j.charAt(r)), f = l.indexOf(j.charAt(r + 1)), g = l.indexOf(j.charAt(r + 2)),
            e = l.indexOf(j.charAt(r + 3)), a = d << 18 | f << 12 | g << 6 | e, d = a >>> 16 & 255, f = a >>> 8 & 255, a &= 255, p[r / 4] = String.fromCharCode(d, f, a), 64 == e && (p[r / 4] = String.fromCharCode(d, f)), 64 == g && (p[r / 4] = String.fromCharCode(d));
          g = p.join("");
          return b ? k.decode(g) : g
        }
      },
      k = {
        encode: function(c) {
          c = c.replace(/[\u0080-\u07ff]/g, function(b) {
            b = b.charCodeAt(0);
            return String.fromCharCode(192 | b >> 6, 128 | b & 63)
          });
          return c = c.replace(/[\u0800-\uffff]/g, function(b) {
            b = b.charCodeAt(0);
            return String.fromCharCode(224 | b >> 12, 128 | b >> 6 & 63, 128 | b & 63)
          })
        },
        decode: function(c) {
          c =
            c.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(b) {
              b = (b.charCodeAt(0) & 15) << 12 | (b.charCodeAt(1) & 63) << 6 | b.charCodeAt(2) & 63;
              return String.fromCharCode(b)
            });
          return c = c.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(b) {
            b = (b.charCodeAt(0) & 31) << 6 | b.charCodeAt(1) & 63;
            return String.fromCharCode(b)
          })
        }
      }
  }(jwplayer.utils), function(f) {
    f.events = {
      COMPLETE: "COMPLETE",
      ERROR: "ERROR",
      API_READY: "jwplayerAPIReady",
      JWPLAYER_READY: "jwplayerReady",
      JWPLAYER_FULLSCREEN: "jwplayerFullscreen",
      JWPLAYER_RESIZE: "jwplayerResize",
      JWPLAYER_ERROR: "jwplayerError",
      JWPLAYER_SETUP_ERROR: "jwplayerSetupError",
      JWPLAYER_MEDIA_BEFOREPLAY: "jwplayerMediaBeforePlay",
      JWPLAYER_MEDIA_BEFORECOMPLETE: "jwplayerMediaBeforeComplete",
      JWPLAYER_COMPONENT_SHOW: "jwplayerComponentShow",
      JWPLAYER_COMPONENT_HIDE: "jwplayerComponentHide",
      JWPLAYER_MEDIA_BUFFER: "jwplayerMediaBuffer",
      JWPLAYER_MEDIA_BUFFER_FULL: "jwplayerMediaBufferFull",
      JWPLAYER_MEDIA_ERROR: "jwplayerMediaError",
      JWPLAYER_MEDIA_LOADED: "jwplayerMediaLoaded",
      JWPLAYER_MEDIA_COMPLETE: "jwplayerMediaComplete",
      JWPLAYER_MEDIA_SEEK: "jwplayerMediaSeek",
      JWPLAYER_MEDIA_TIME: "jwplayerMediaTime",
      JWPLAYER_MEDIA_VOLUME: "jwplayerMediaVolume",
      JWPLAYER_MEDIA_META: "jwplayerMediaMeta",
      JWPLAYER_MEDIA_MUTE: "jwplayerMediaMute",
      JWPLAYER_MEDIA_LEVELS: "jwplayerMediaLevels",
      JWPLAYER_MEDIA_LEVEL_CHANGED: "jwplayerMediaLevelChanged",
      JWPLAYER_CAPTIONS_CHANGED: "jwplayerCaptionsChanged",
      JWPLAYER_CAPTIONS_LIST: "jwplayerCaptionsList",
      JWPLAYER_CAPTIONS_LOADED: "jwplayerCaptionsLoaded",
      JWPLAYER_PLAYER_STATE: "jwplayerPlayerState",
      state: {
        BUFFERING: "BUFFERING",
        IDLE: "IDLE",
        PAUSED: "PAUSED",
        PLAYING: "PLAYING"
      },
      JWPLAYER_PLAYLIST_LOADED: "jwplayerPlaylistLoaded",
      JWPLAYER_PLAYLIST_ITEM: "jwplayerPlaylistItem",
      JWPLAYER_PLAYLIST_COMPLETE: "jwplayerPlaylistComplete",
      JWPLAYER_DISPLAY_CLICK: "jwplayerViewClick",
      JWPLAYER_VIEW_TAB_FOCUS: "jwplayerViewTabFocus",
      JWPLAYER_CONTROLS: "jwplayerViewControls",
      JWPLAYER_USER_ACTION: "jwplayerUserAction",
      JWPLAYER_INSTREAM_CLICK: "jwplayerInstreamClicked",
      JWPLAYER_INSTREAM_DESTROYED: "jwplayerInstreamDestroyed",
      JWPLAYER_AD_TIME: "jwplayerAdTime",
      JWPLAYER_AD_ERROR: "jwplayerAdError",
      JWPLAYER_AD_CLICK: "jwplayerAdClicked",
      JWPLAYER_AD_COMPLETE: "jwplayerAdComplete",
      JWPLAYER_AD_IMPRESSION: "jwplayerAdImpression",
      JWPLAYER_AD_COMPANIONS: "jwplayerAdCompanions",
      JWPLAYER_AD_SKIPPED: "jwplayerAdSkipped",
      JWPLAYER_AD_PLAY: "jwplayerAdPlay",
      JWPLAYER_AD_PAUSE: "jwplayerAdPause",
      JWPLAYER_AD_META: "jwplayerAdMeta",
      JWPLAYER_CAST_AVAILABLE: "jwplayerCastAvailable",
      JWPLAYER_CAST_SESSION: "jwplayerCastSession",
      JWPLAYER_CAST_AD_CHANGED: "jwplayerCastAdChanged"
    }
  }(jwplayer),
  function(f) {
    var c = f.utils;
    f.events.eventdispatcher = function(m, k) {
      function h(b, a, g) {
        if (b)
          for (var e = 0; e < b.length; e++) {
            var d = b[e];
            if (d) {
              null !== d.count && 0 === --d.count && delete b[e];
              try {
                d.listener(a)
              } catch (h) {
                c.log('Error handling "' + g + '" event listener [' + e + "]: " + h.toString(), d.listener, a)
              }
            }
          }
      }
      var b, d;
      this.resetEventListeners = function() {
        b = {};
        d = []
      };
      this.resetEventListeners();
      this.addEventListener = function(d, a, g) {
        try {
          c.exists(b[d]) || (b[d] = []), "string" == c.typeOf(a) && (a = (new Function("return " + a))()), b[d].push({
            listener: a,
            count: g || null
          })
        } catch (e) {
          c.log("error", e)
        }
        return !1
      };
      this.removeEventListener = function(d, a) {
        if (b[d]) {
          try {
            if (void 0 === a) {
              b[d] = [];
              return
            }
            for (var g = 0; g < b[d].length; g++)
              if (b[d][g].listener.toString() == a.toString()) {
                b[d].splice(g, 1);
                break
              }
          } catch (e) {
            c.log("error", e)
          }
          return !1
        }
      };
      this.addGlobalListener = function(b, a) {
        try {
          "string" == c.typeOf(b) && (b = (new Function("return " + b))()), d.push({
            listener: b,
            count: a || null
          })
        } catch (g) {
          c.log("error", g)
        }
        return !1
      };
      this.removeGlobalListener = function(b) {
        if (b) {
          try {
            for (var a = d.length; a--;) d[a].listener.toString() ==
              b.toString() && d.splice(a, 1)
          } catch (g) {
            c.log("error", g)
          }
          return !1
        }
      };
      this.sendEvent = function(n, a) {
        c.exists(a) || (a = {});
        c.extend(a, {
          id: m,
          version: f.version,
          type: n
        });
        k && c.log(n, a);
        h(b[n], a, n);
        h(d, a, n)
      }
    }
  }(window.jwplayer),
  function(f) {
    var c = {},
      m = {};
    f.plugins = function() {};
    f.plugins.loadPlugins = function(k, h) {
      m[k] = new f.plugins.pluginloader(new f.plugins.model(c), h);
      return m[k]
    };
    f.plugins.registerPlugin = function(k, h, b, d) {
      var n = f.utils.getPluginName(k);
      c[n] || (c[n] = new f.plugins.plugin(k));
      c[n].registerPlugin(k,
        h, b, d)
    }
  }(jwplayer),
  function(f) {
    f.plugins.model = function(c) {
      this.addPlugin = function(m) {
        var k = f.utils.getPluginName(m);
        c[k] || (c[k] = new f.plugins.plugin(m));
        return c[k]
      };
      this.getPlugins = function() {
        return c
      }
    }
  }(jwplayer),
  function(f) {
    var c = jwplayer.utils,
      m = jwplayer.events;
    f.pluginmodes = {
      FLASH: 0,
      JAVASCRIPT: 1,
      HYBRID: 2
    };
    f.plugin = function(k) {
      function h() {
        switch (c.getPluginPathType(k)) {
          case c.pluginPathType.ABSOLUTE:
            return k;
          case c.pluginPathType.RELATIVE:
            return c.getAbsolutePath(k, window.location.href)
        }
      }

      function b() {
        p =
          setTimeout(function() {
            n = c.loaderstatus.COMPLETE;
            j.sendEvent(m.COMPLETE)
          }, 1E3)
      }

      function d() {
        n = c.loaderstatus.ERROR;
        j.sendEvent(m.ERROR)
      }
      var n = c.loaderstatus.NEW,
        a, g, e, p, j = new m.eventdispatcher;
      c.extend(this, j);
      this.load = function() {
        if (n == c.loaderstatus.NEW)
          if (0 < k.lastIndexOf(".swf")) a = k, n = c.loaderstatus.COMPLETE, j.sendEvent(m.COMPLETE);
          else if (c.getPluginPathType(k) == c.pluginPathType.CDN) n = c.loaderstatus.COMPLETE, j.sendEvent(m.COMPLETE);
        else {
          n = c.loaderstatus.LOADING;
          var e = new c.scriptloader(h());
          e.addEventListener(m.COMPLETE,
            b);
          e.addEventListener(m.ERROR, d);
          e.load()
        }
      };
      this.registerPlugin = function(b, d, h, k) {
        p && (clearTimeout(p), p = void 0);
        e = d;
        h && k ? (a = k, g = h) : "string" == typeof h ? a = h : "function" == typeof h ? g = h : !h && !k && (a = b);
        n = c.loaderstatus.COMPLETE;
        j.sendEvent(m.COMPLETE)
      };
      this.getStatus = function() {
        return n
      };
      this.getPluginName = function() {
        return c.getPluginName(k)
      };
      this.getFlashPath = function() {
        if (a) switch (c.getPluginPathType(a)) {
          case c.pluginPathType.ABSOLUTE:
            return a;
          case c.pluginPathType.RELATIVE:
            return 0 < k.lastIndexOf(".swf") ?
              c.getAbsolutePath(a, window.location.href) : c.getAbsolutePath(a, h())
        }
        return null
      };
      this.getJS = function() {
        return g
      };
      this.getTarget = function() {
        return e
      };
      this.getPluginmode = function() {
        if ("undefined" != typeof a && "undefined" != typeof g) return f.pluginmodes.HYBRID;
        if ("undefined" != typeof a) return f.pluginmodes.FLASH;
        if ("undefined" != typeof g) return f.pluginmodes.JAVASCRIPT
      };
      this.getNewInstance = function(a, b, c) {
        return new g(a, b, c)
      };
      this.getURL = function() {
        return k
      }
    }
  }(jwplayer.plugins),
  function(f) {
    var c = f.utils,
      m =
      f.events,
      k = c.foreach;
    f.plugins.pluginloader = function(h, b) {
      function d() {
        e && l.sendEvent(m.ERROR, {
          message: p
        });
        g || (g = !0, a = c.loaderstatus.COMPLETE, l.sendEvent(m.COMPLETE))
      }

      function n() {
        j || d();
        if (!g && !e) {
          var a = 0,
            b = h.getPlugins();
          c.foreach(j, function(g) {
            g = c.getPluginName(g);
            var l = b[g];
            g = l.getJS();
            var h = l.getTarget(),
              l = l.getStatus();
            if (l == c.loaderstatus.LOADING || l == c.loaderstatus.NEW) a++;
            else if (g && (!h || parseFloat(h) > parseFloat(f.version))) e = !0, p = "Incompatible player version", d()
          });
          0 === a && d()
        }
      }
      var a = c.loaderstatus.NEW,
        g = !1,
        e = !1,
        p, j = b,
        l = new m.eventdispatcher;
      c.extend(this, l);
      this.setupPlugins = function(a, b, e) {
        var d = {
            length: 0,
            plugins: {}
          },
          g = 0,
          l = {},
          j = h.getPlugins();
        k(b.plugins, function(h, k) {
          var f = c.getPluginName(h),
            n = j[f],
            m = n.getFlashPath(),
            p = n.getJS(),
            I = n.getURL();
          m && (d.plugins[m] = c.extend({}, k), d.plugins[m].pluginmode = n.getPluginmode(), d.length++);
          try {
            if (p && b.plugins && b.plugins[I]) {
              var r = document.createElement("div");
              r.id = a.id + "_" + f;
              r.style.position = "absolute";
              r.style.top = 0;
              r.style.zIndex = g + 10;
              l[f] = n.getNewInstance(a,
                c.extend({}, b.plugins[I]), r);
              g++;
              a.onReady(e(l[f], r, !0));
              a.onResize(e(l[f], r))
            }
          } catch (P) {
            c.log("ERROR: Failed to load " + f + ".")
          }
        });
        a.plugins = l;
        return d
      };
      this.load = function() {
        if (!(c.exists(b) && "object" != c.typeOf(b))) {
          a = c.loaderstatus.LOADING;
          k(b, function(a) {
            c.exists(a) && (a = h.addPlugin(a), a.addEventListener(m.COMPLETE, n), a.addEventListener(m.ERROR, r))
          });
          var e = h.getPlugins();
          k(e, function(a, b) {
            b.load()
          })
        }
        n()
      };
      this.destroy = function() {
        l && (l.resetEventListeners(), l = null)
      };
      var r = this.pluginFailed = function() {
        e ||
          (e = !0, p = "File not found", d())
      };
      this.getStatus = function() {
        return a
      }
    }
  }(jwplayer),
  function(f) {
    f.parsers = {
      localName: function(c) {
        return c ? c.localName ? c.localName : c.baseName ? c.baseName : "" : ""
      },
      textContent: function(c) {
        return c ? c.textContent ? f.utils.trim(c.textContent) : c.text ? f.utils.trim(c.text) : "" : ""
      },
      getChildNode: function(c, f) {
        return c.childNodes[f]
      },
      numChildren: function(c) {
        return c.childNodes ? c.childNodes.length : 0
      }
    }
  }(jwplayer),
  function(f) {
    var c = f.parsers;
    (c.jwparser = function() {}).parseEntry = function(m,
      k) {
      for (var h = [], b = [], d = f.utils.xmlAttribute, n = 0; n < m.childNodes.length; n++) {
        var a = m.childNodes[n];
        if ("jwplayer" == a.prefix) {
          var g = c.localName(a);
          "source" == g ? (delete k.sources, h.push({
            file: d(a, "file"),
            "default": d(a, "default"),
            label: d(a, "label"),
            type: d(a, "type")
          })) : "track" == g ? (delete k.tracks, b.push({
            file: d(a, "file"),
            "default": d(a, "default"),
            kind: d(a, "kind"),
            label: d(a, "label")
          })) : (k[g] = f.utils.serialize(c.textContent(a)), "file" == g && k.sources && delete k.sources)
        }
        k.file || (k.file = k.link)
      }
      if (h.length) {
        k.sources = [];
        for (n = 0; n < h.length; n++) 0 < h[n].file.length && (h[n]["default"] = "true" == h[n]["default"] ? !0 : !1, h[n].label.length || delete h[n].label, k.sources.push(h[n]))
      }
      if (b.length) {
        k.tracks = [];
        for (n = 0; n < b.length; n++) 0 < b[n].file.length && (b[n]["default"] = "true" == b[n]["default"] ? !0 : !1, b[n].kind = !b[n].kind.length ? "captions" : b[n].kind, b[n].label.length || delete b[n].label, k.tracks.push(b[n]))
      }
      return k
    }
  }(jwplayer),
  function(f) {
    var c = jwplayer.utils,
      m = c.xmlAttribute,
      k = f.localName,
      h = f.textContent,
      b = f.numChildren,
      d = f.mediaparser =
      function() {};
    d.parseGroup = function(f, a) {
      var g, e, p = [];
      for (e = 0; e < b(f); e++)
        if (g = f.childNodes[e], "media" == g.prefix && k(g)) switch (k(g).toLowerCase()) {
          case "content":
            m(g, "duration") && (a.duration = c.seconds(m(g, "duration")));
            0 < b(g) && (a = d.parseGroup(g, a));
            m(g, "url") && (a.sources || (a.sources = []), a.sources.push({
              file: m(g, "url"),
              type: m(g, "type"),
              width: m(g, "width"),
              label: m(g, "label")
            }));
            break;
          case "title":
            a.title = h(g);
            break;
          case "description":
            a.description = h(g);
            break;
          case "guid":
            a.mediaid = h(g);
            break;
          case "thumbnail":
            a.image ||
              (a.image = m(g, "url"));
            break;
          case "group":
            d.parseGroup(g, a);
            break;
          case "subtitle":
            var j = {};
            j.file = m(g, "url");
            j.kind = "captions";
            if (0 < m(g, "lang").length) {
              var l = j;
              g = m(g, "lang");
              var r = {
                zh: "Chinese",
                nl: "Dutch",
                en: "English",
                fr: "French",
                de: "German",
                it: "Italian",
                ja: "Japanese",
                pt: "Portuguese",
                ru: "Russian",
                es: "Spanish"
              };
              g = r[g] ? r[g] : g;
              l.label = g
            }
            p.push(j)
        }
      a.hasOwnProperty("tracks") || (a.tracks = []);
      for (e = 0; e < p.length; e++) a.tracks.push(p[e]);
      return a
    }
  }(jwplayer.parsers),
  function(f) {
    function c(b) {
      for (var a = {}, c = 0; c <
        b.childNodes.length; c++) {
        var e = b.childNodes[c],
          h = d(e);
        if (h) switch (h.toLowerCase()) {
          case "enclosure":
            a.file = m.xmlAttribute(e, "url");
            break;
          case "title":
            a.title = k(e);
            break;
          case "guid":
            a.mediaid = k(e);
            break;
          case "pubdate":
            a.date = k(e);
            break;
          case "description":
            a.description = k(e);
            break;
          case "link":
            a.link = k(e);
            break;
          case "category":
            a.tags = a.tags ? a.tags + k(e) : k(e)
        }
      }
      a = f.mediaparser.parseGroup(b, a);
      a = f.jwparser.parseEntry(b, a);
      return new jwplayer.playlist.item(a)
    }
    var m = jwplayer.utils,
      k = f.textContent,
      h = f.getChildNode,
      b = f.numChildren,
      d = f.localName;
    f.rssparser = {};
    f.rssparser.parse = function(k) {
      for (var a = [], g = 0; g < b(k); g++) {
        var e = h(k, g);
        if ("channel" == d(e).toLowerCase())
          for (var f = 0; f < b(e); f++) {
            var j = h(e, f);
            "item" == d(j).toLowerCase() && a.push(c(j))
          }
      }
      return a
    }
  }(jwplayer.parsers),
  function(f) {
    f.playlist = function(c) {
      var m = [];
      if ("array" == f.utils.typeOf(c))
        for (var k = 0; k < c.length; k++) m.push(new f.playlist.item(c[k]));
      else m.push(new f.playlist.item(c));
      return m
    }
  }(jwplayer),
  function(f) {
    var c = f.item = function(m) {
      var k = jwplayer.utils,
        h = k.extend({}, c.defaults, m),
        b, d;
      h.tracks = m && k.exists(m.tracks) ? m.tracks : [];
      0 === h.sources.length && (h.sources = [new f.source(h)]);
      for (b = 0; b < h.sources.length; b++) d = h.sources[b]["default"], h.sources[b]["default"] = d ? "true" == d.toString() : !1, h.sources[b] = new f.source(h.sources[b]);
      if (h.captions && !k.exists(m.tracks)) {
        for (m = 0; m < h.captions.length; m++) h.tracks.push(h.captions[m]);
        delete h.captions
      }
      for (b = 0; b < h.tracks.length; b++) h.tracks[b] = new f.track(h.tracks[b]);
      return h
    };
    c.defaults = {
      description: "",
      image: "",
      mediaid: "",
      title: "",
      sources: [],
      tracks: []
    }
  }(jwplayer.playlist),
  function(f) {
    var c = jwplayer,
      m = c.utils,
      k = c.events,
      h = c.parsers;
    f.loader = function() {
      function b(b) {
        try {
          var c = b.responseXML.childNodes;
          b = "";
          for (var d = 0; d < c.length && !(b = c[d], 8 != b.nodeType); d++);
          "xml" == h.localName(b) && (b = b.nextSibling);
          if ("rss" != h.localName(b)) n("Not a valid RSS feed");
          else {
            var j = new f(h.rssparser.parse(b));
            a.sendEvent(k.JWPLAYER_PLAYLIST_LOADED, {
              playlist: j
            })
          }
        } catch (l) {
          n()
        }
      }

      function c(a) {
        n(a.match(/invalid/i) ? "Not a valid RSS feed" :
          "")
      }

      function n(b) {
        a.sendEvent(k.JWPLAYER_ERROR, {
          message: b ? b : "Error loading file"
        })
      }
      var a = new k.eventdispatcher;
      m.extend(this, a);
      this.load = function(a) {
        m.ajax(a, b, c)
      }
    }
  }(jwplayer.playlist),
  function(f) {
    var c = jwplayer.utils,
      m = {
        file: void 0,
        label: void 0,
        type: void 0,
        "default": void 0
      };
    f.source = function(f) {
      var h = c.extend({}, m);
      c.foreach(m, function(b) {
        c.exists(f[b]) && (h[b] = f[b], delete f[b])
      });
      h.type && 0 < h.type.indexOf("/") && (h.type = c.extensionmap.mimeType(h.type));
      "m3u8" == h.type && (h.type = "hls");
      "smil" == h.type &&
        (h.type = "rtmp");
      return h
    }
  }(jwplayer.playlist),
  function(f) {
    var c = jwplayer.utils,
      m = {
        file: void 0,
        label: void 0,
        kind: "captions",
        "default": !1
      };
    f.track = function(f) {
      var h = c.extend({}, m);
      f || (f = {});
      c.foreach(m, function(b) {
        c.exists(f[b]) && (h[b] = f[b], delete f[b])
      });
      return h
    }
  }(jwplayer.playlist),
  function(f) {
    var c = f.cast = {},
      m = f.utils;
    c.adprovider = function(k, h) {
      function b() {
        e = {
          message: p,
          position: 0,
          duration: -1
        }
      }

      function d(a, b) {
        var e = {
          command: a
        };
        void 0 !== b && (e.args = b);
        h.sendMessage(k, e, n, function(a) {
          c.error("message send error",
            a)
        })
      }

      function n() {}
      var a = new c.provider(k, h),
        g = m.extend(this, a),
        e, p = "Loading ad",
        j = 0;
      g.init = function() {
        a.init();
        b()
      };
      g.destroy = function() {
        a.destroy()
      };
      g.updateModel = function(d, g) {
        (d.tag || d.newstate || d.sequence || d.companions) && c.log("received ad change:", d);
        d.tag && (e.tag && d.tag !== e.tag) && (c.error("ad messages not received in order. new model:", d, "old model:", e), b());
        f.utils.extend(e, d);
        a.updateModel(d, g)
      };
      g.getAdModel = function() {
        var a = m.extend({}, e);
        a.message = 0 < e.duration ? this.getAdMessage() : p;
        return a
      };
      g.resetAdModel = function() {
        b()
      };
      g.getAdMessage = function() {
        var a = e.message.replace(/xx/gi, "" + Math.min(e.duration | 0, Math.ceil(e.duration - e.position)));
        e.podMessage && 1 < e.podcount && (a = e.podMessage.replace(/__AD_POD_CURRENT__/g, "" + e.sequence).replace(/__AD_POD_LENGTH__/g, "" + e.podcount) + a);
        return a
      };
      g.skipAd = function(a) {
        d("skipAd", {
          tag: a.tag
        })
      };
      g.clickAd = function(a) {
        j = 1 * new Date;
        d("clickAd", {
          tag: a.tag
        })
      };
      g.timeSinceClick = function() {
        return 1 * new Date - j
      }
    }
  }(window.jwplayer),
  function(f, c) {
    var m = c.cast,
      k = c.utils,
      h = c.events,
      b = h.state,
      d = {},
      n = f.chrome;
    m.NS = "urn:x-cast:com.longtailvideo.jwplayer";
    m.controller = function(a, g) {
      var e, p;

      function j(a, b) {
        a[b] && (a[b] = k.getAbsolutePath(a[b]))
      }

      function l(a) {
        a = a.availability === n.cast.ReceiverAvailability.AVAILABLE;
        L.available !== a && (L.available = a, t(h.JWPLAYER_CAST_AVAILABLE))
      }

      function r(a) {
        m.log("existing session", a);
        w || (J = a.session, J.addMessageListener(m.NS, x))
      }

      function x(b, e) {
        var d = JSON.parse(e);
        if (!d) throw "Message not proper JSON";
        if (d.reconcile) {
          J.removeMessageListener(m.NS,
            x);
          var l = d.diff,
            f = J;
          if (!l.id || !d.appid || !d.pageUrl) l.id = c().id, d.appid = M.appid, d.pageUrl = Q, J = w = null;
          l.id === a.id && (d.appid === M.appid && d.pageUrl === Q) && (w || (a.jwInstreamState() && a.jwInstreamDestroy(!0), v(f), g.sendEvent(h.JWPLAYER_PLAYER_STATE, {
            oldstate: l.oldstate,
            newstate: l.newstate
          })), H(d));
          J = null
        }
      }

      function u(a) {
        L.active = !!a;
        a = L;
        var b;
        b = w && w.receiver ? w.receiver.friendlyName : "";
        a.deviceName = b;
        t(h.JWPLAYER_CAST_SESSION, {})
      }

      function t(a) {
        var b = k.extend({}, L);
        g.sendEvent(a, b)
      }

      function q(a) {
        a.code !== n.cast.ErrorCode.CANCEL &&
          (m.log("Cast Session Error:", a, w), a.code === n.cast.ErrorCode.SESSION_ERROR && B())
      }

      function B() {
        w ? (z(), w.stop(F, G)) : F()
      }

      function G(a) {
        m.error("Cast Session Stop error:", a, w);
        F()
      }

      function v(d) {
        w = d;
        w.addMessageListener(m.NS, D);
        w.addUpdateListener(C);
        a.jwPause(!0);
        a.jwSetFullscreen(!1);
        N = g.getVideo();
        e = g.volume;
        p = g.mute;
        A = new m.provider(m.NS, w);
        A.init();
        g.setVideo(A);
        a.jwPlay = function(a) {
          !1 === a ? A.pause() : A.play()
        };
        a.jwPause = function(b) {
          a.jwPlay(!!b)
        };
        a.jwLoad = function(a) {
          "number" === k.typeOf(a) && g.setItem(a);
          A.load(a)
        };
        a.jwPlaylistItem = function(a) {
          "number" === k.typeOf(a) && g.setItem(a);
          A.playlistItem(a)
        };
        a.jwPlaylistNext = function() {
          a.jwPlaylistItem(g.item + 1)
        };
        a.jwPlaylistPrev = function() {
          a.jwPlaylistItem(g.item - 1)
        };
        a.jwSetVolume = function(a) {
          k.exists(a) && (a = Math.min(Math.max(0, a), 100) | 0, S(a) && (a = Math.max(0, Math.min(a / 100, 1)), w.setReceiverVolumeLevel(a, I, function(a) {
            m.error("set volume error", a);
            I()
          })))
        };
        a.jwSetMute = function(a) {
          k.exists(a) || (a = !K.mute);
          P(a) && w.setReceiverMuted(!!a, I, function(a) {
            m.error("set muted error",
              a);
            I()
          })
        };
        a.jwGetVolume = function() {
          return K.volume | 0
        };
        a.jwGetMute = function() {
          return !!K.mute
        };
        a.jwIsBeforePlay = function() {
          return !1
        };
        var l = a.jwSetCurrentCaptions;
        a.jwSetCurrentCaptions = function(a) {
          l(a)
        };
        a.jwSkipAd = function(a) {
          y && (y.skipAd(a), a = y.getAdModel(), a.complete = !0, g.sendEvent(h.JWPLAYER_CAST_AD_CHANGED, a))
        };
        a.jwClickAd = function(e) {
          if (y && 300 < y.timeSinceClick() && (y.clickAd(e), g.state !== b.PAUSED)) {
            var d = {
              tag: e.tag
            };
            e.sequence && (d.sequence = e.sequence);
            e.podcount && (d.podcount = e.podcount);
            c(a.id).dispatchEvent(h.JWPLAYER_AD_CLICK,
              d);
            f.open(e.clickthrough)
          }
        };
        a.jwPlayAd = a.jwPauseAd = a.jwSetControls = a.jwForceState = a.jwReleaseState = a.jwSetFullscreen = a.jwDetachMedia = a.jwAttachMedia = R;
        var j = c(a.id).plugins;
        j.vast && j.vast.jwPauseAd !== R && (T = {
          jwPlayAd: j.vast.jwPlayAd,
          jwPauseAd: j.vast.jwPauseAd
        }, j.vast.jwPlayAd = j.vast.jwPauseAd = R);
        I();
        u(!0);
        d !== J && A.setup(E(), g)
      }

      function C(a) {
        m.log("Cast Session status", a);
        a ? I() : (A.sendEvent(h.JWPLAYER_PLAYER_STATE, {
          oldstate: g.state,
          newstate: b.BUFFERING
        }), F())
      }

      function F() {
        w && (z(), w = null);
        if (N) {
          delete a.jwSkipAd;
          delete a.jwClickAd;
          a.initializeAPI();
          var d = c(a.id).plugins;
          d.vast && k.extend(d.vast, T);
          g.volume = e;
          g.mute = p;
          g.setVideo(N);
          g.duration = 0;
          A && (A.destroy(), A = null);
          y && (y.destroy(), y = null);
          g.state !== b.IDLE ? (g.state = b.IDLE, a.jwPlay(!0), a.jwSeek(g.position)) : N.sendEvent(h.JWPLAYER_PLAYER_STATE, {
            oldstate: b.BUFFERING,
            newstate: b.IDLE
          });
          N = null
        }
        u(!1)
      }

      function z() {
        w.removeUpdateListener(C);
        w.removeMessageListener(m.NS, D)
      }

      function D(a, b) {
        var c = JSON.parse(b);
        if (!c) throw "Message not proper JSON";
        H(c)
      }

      function H(b) {
        if ("state" ===
          b.type) {
          if (y && (b.diff.newstate || b.diff.position)) y.destroy(), y = null, g.setVideo(A), g.sendEvent(h.JWPLAYER_CAST_AD_CHANGED, {
            done: !0
          });
          A.updateModel(b.diff, b.type);
          b = b.diff;
          void 0 !== b.item && g.item !== b.item && g.setItem(b.item)
        } else if ("ad" === b.type) {
          null === y && (y = new m.adprovider(m.NS, w), y.init(), g.setVideo(y));
          y.updateModel(b.diff, b.type);
          var c = y.getAdModel();
          b.diff.clickthrough && (c.onClick = a.jwClickAd);
          b.diff.skipoffset && (c.onSkipAd = a.jwSkipAd);
          g.sendEvent(h.JWPLAYER_CAST_AD_CHANGED, c);
          b.diff.complete &&
            y.resetAdModel()
        } else "connection" === b.type ? !0 === b.closed && B() : m.error("received unhandled message", b.type, b)
      }

      function E() {
        var a = k.extend({}, g.config);
        a.cast = k.extend({
          pageUrl: Q
        }, M);
        for (var b = "base autostart controls fallback fullscreen width height mobilecontrols modes playlistlayout playlistposition playlistsize primary stretching sharing related ga skin logo listbar".split(" "), c = b.length; c--;) delete a[b[c]];
        b = a.plugins;
        delete a.plugins;
        for (var e in b)
          if (b.hasOwnProperty(e)) {
            var d = b[e];
            if (d.client &&
              (/[\.\/]/.test(d.client) && j(d, "client"), -1 < d.client.indexOf("vast"))) {
              c = a;
              d = k.extend({}, d);
              d.client = "vast";
              delete d.companiondiv;
              if (d.schedule) {
                var l = void 0;
                for (l in d.schedule) d.schedule.hasOwnProperty(l) && j(d.schedule[l].ad || d.schedule[l], "tag")
              }
              j(d, "tag");
              c.advertising = d
            }
          }
        g.position && (a.position = g.position);
        0 < g.item && (a.item = g.item);
        return a
      }

      function I() {
        if (w && w.receiver) {
          var a = w.receiver.volume;
          if (a) {
            var b = 100 * a.level | 0;
            P(!!a.muted);
            S(b)
          }
        }
      }

      function S(a) {
        var b = K.volume !== a;
        b && (K.volume = a, A.sendEvent(h.JWPLAYER_MEDIA_VOLUME, {
          volume: a
        }));
        return b
      }

      function P(a) {
        var b = K.mute !== a;
        b && (K.mute = a, A.sendEvent(h.JWPLAYER_MEDIA_MUTE, {
          mute: a
        }));
        return b
      }

      function R() {}
      var w = null,
        L = {
          available: !1,
          active: !1,
          deviceName: ""
        },
        K = {
          volume: null,
          mute: null
        },
        Q = f.location.href,
        M, A = null,
        y = null,
        N = null;
      e = g.volume;
      p = g.mute;
      var J = null,
        T = null;
      this.startCasting = function() {
        w || a.jwInstreamState() || n.cast.requestSession(v, q)
      };
      this.stopCasting = B;
      var O = k.extend({}, d, g.cast);
      j(O, "loadscreen");
      j(O, "endscreen");
      j(O, "logo");
      M = O;
      if (M.appid && (!f.cast || !f.cast.receiver) &&
        n) m.loader.addEventListener("availability", l), m.loader.addEventListener("session", r), m.loader.initialize()
    };
    m.log = function() {
      if (m.debug) {
        var a = Array.prototype.slice.call(arguments, 0);
        console.log.apply(console, a)
      }
    };
    m.error = function() {
      var a = Array.prototype.slice.call(arguments, 0);
      console.error.apply(console, a)
    }
  }(window, jwplayer),
  function(f, c) {
    function m() {
      c.cast && c.cast.isAvailable && !a.apiConfig ? (a.apiConfig = new c.cast.ApiConfig(new c.cast.SessionRequest(j), d, n, c.cast.AutoJoinPolicy.ORIGIN_SCOPED),
        c.cast.initialize(a.apiConfig, b, h)) : setTimeout(m, 1E3)
    }

    function k() {
      a.scriptLoader = null
    }

    function h() {
      a.apiConfig = null
    }

    function b() {}

    function d(b) {
      a.loader.sendEvent("session", {
        session: b
      });
      b.sendMessage(a.NS, {
        whoami: 1
      })
    }

    function n(b) {
      a.availability = b;
      a.loader.sendEvent("availability", {
        availability: b
      })
    }
    var a = f.cast,
      g = f.utils,
      e = f.events,
      p, j = "C7EF2AC5";
    a.loader = g.extend({
      initialize: function() {
        null !== a.availability ? a.loader.sendEvent("availability", {
          availability: a.availability
        }) : c && c.cast ? m() : p || (p = new g.scriptloader("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js"),
          p.addEventListener(e.ERROR, k), p.addEventListener(e.COMPLETE, m), p.load())
      }
    }, new e.eventdispatcher("cast.loader"));
    a.availability = null
  }(window.jwplayer, window.chrome || {}),
  function(f) {
    function c(b) {
      return function() {
        return b
      }
    }

    function m() {}
    var k = f.cast,
      h = f.utils,
      b = f.events,
      d = b.state;
    k.provider = function(f, a) {
      function g(b, c) {
        var d = {
          command: b
        };
        void 0 !== c && (d.args = c);
        a.sendMessage(f, d, m, function(a) {
          k.error("message send error", a)
        })
      }

      function e(a) {
        l.oldstate = l.newstate;
        l.newstate = a;
        p.sendEvent(b.JWPLAYER_PLAYER_STATE, {
          oldstate: l.oldstate,
          newstate: l.newstate
        })
      }
      var p = h.extend(this, new b.eventdispatcher("cast.provider")),
        j = -1,
        l = {
          newstate: d.IDLE,
          oldstate: d.IDLE,
          buffer: 0,
          position: 0,
          duration: -1,
          audioMode: !1
        };
      p.isCaster = !0;
      p.init = function() {};
      p.destroy = function() {
        clearTimeout(j);
        a = null
      };
      p.updateModel = function(a, c) {
        a.newstate && (l.newstate = a.newstate, l.oldstate = a.oldstate || l.oldstate, p.sendEvent(b.JWPLAYER_PLAYER_STATE, {
          oldstate: l.oldstate,
          newstate: l.newstate
        }));
        if ("ad" !== c) {
          if (void 0 !== a.position || void 0 !== a.duration) void 0 !==
            a.position && (l.position = a.position), void 0 !== a.duration && (l.duration = a.duration), p.sendEvent(b.JWPLAYER_MEDIA_TIME, {
              position: l.position,
              duration: l.duration
            });
          void 0 !== a.buffer && (l.buffer = a.buffer, p.sendEvent(b.JWPLAYER_MEDIA_BUFFER, {
            bufferPercent: l.buffer
          }))
        }
      };
      p.setup = function(a, b) {
        b.state && (l.newstate = b.state);
        void 0 !== b.buffer && (l.buffer = b.buffer);
        void 0 !== a.position && (l.position = a.position);
        void 0 !== a.duration && (l.duration = a.duration);
        e(d.BUFFERING);
        g("setup", a)
      };
      p.playlistItem = function(a) {
        e(d.BUFFERING);
        g("item", a)
      };
      p.load = function(a) {
        e(d.BUFFERING);
        g("load", a)
      };
      p.stop = function() {
        clearTimeout(j);
        j = setTimeout(function() {
          e(d.IDLE);
          g("stop")
        }, 0)
      };
      p.play = function() {
        g("play")
      };
      p.pause = function() {
        e(d.PAUSED);
        g("pause")
      };
      p.seek = function(a) {
        e(d.BUFFERING);
        p.sendEvent(b.JWPLAYER_MEDIA_SEEK, {
          position: l.position,
          offset: a
        });
        g("seek", a)
      };
      p.audioMode = function() {
        return l.audioMode
      };
      p.detachMedia = function() {
        k.error("detachMedia called while casting");
        return document.createElement("video")
      };
      p.attachMedia = function() {
        k.error("attachMedia called while casting")
      };
      p.volume = p.mute = p.setControls = p.setCurrentQuality = p.setContainer = p.getContainer = p.remove = p.resize = p.seekDrag = p.addCaptions = p.resetCaptions = p.setVisibility = p.fsCaptions = m;
      p.setFullScreen = p.getFullScreen = p.checkComplete = c(!1);
      p.getWidth = p.getHeight = p.getCurrentQuality = c(0);
      p.getQualityLevels = c(["Auto"])
    }
  }(window.jwplayer),
  function(f) {
    function c(a, b) {
      k.foreach(b, function(b, c) {
        var d = a[b];
        "function" == typeof d && d.call(a, c)
      })
    }

    function m(a, b, c) {
      var d = a.style;
      d.backgroundColor = "#000";
      d.color = "#FFF";
      d.width =
        k.styleDimension(c.width);
      d.height = k.styleDimension(c.height);
      d.display = "table";
      d.opacity = 1;
      c = document.createElement("p");
      d = c.style;
      d.verticalAlign = "middle";
      d.textAlign = "center";
      d.display = "table-cell";
      d.font = "15px/20px Arial, Helvetica, sans-serif";
      c.innerHTML = b.replace(":", ":\x3cbr\x3e");
      a.innerHTML = "";
      a.appendChild(c)
    }
    var k = f.utils,
      h = f.events,
      b = !0,
      d = !1,
      n = document,
      a = f.embed = function(g) {
        function e() {
          if (!z)
            if ("array" === k.typeOf(u.playlist) && 2 > u.playlist.length && (0 === u.playlist.length || !u.playlist[0].sources ||
                0 === u.playlist[0].sources.length)) l();
            else if (!F)
            if ("string" === k.typeOf(u.playlist)) C = new f.playlist.loader, C.addEventListener(h.JWPLAYER_PLAYLIST_LOADED, function(a) {
              u.playlist = a.playlist;
              F = d;
              e()
            }), C.addEventListener(h.JWPLAYER_ERROR, function(a) {
              F = d;
              l(a)
            }), F = b, C.load(u.playlist);
            else if (v.getStatus() == k.loaderstatus.COMPLETE) {
            for (var j = 0; j < u.modes.length; j++)
              if (u.modes[j].type && a[u.modes[j].type]) {
                var m = k.extend({}, u),
                  n = new a[u.modes[j].type](E, u.modes[j], m, v, g);
                if (n.supportsConfig()) return n.addEventListener(h.ERROR,
                  p), n.embed(), k.css("object.jwswf, .jwplayer:focus", {
                  outline: "none"
                }), k.css(".jw-tab-focus:focus", {
                  outline: "solid 2px #0B7EF4"
                }), c(g, m.events), g
              }
            var q;
            u.fallback ? (q = "No suitable players found and fallback enabled", D = setTimeout(function() {
              r(q, b)
            }, 10), k.log(q), new a.download(E, u, l)) : (q = "No suitable players found and fallback disabled", r(q, d), k.log(q), E.parentNode.replaceChild(H, E))
          }
        }

        function p(a) {
          x(B + a.message)
        }

        function j(a) {
          g.dispatchEvent(h.JWPLAYER_ERROR, {
            message: "Could not load plugin: " + a.message
          })
        }

        function l(a) {
          a && a.message ? x("Error loading playlist: " + a.message) : x(B + "No playable sources found")
        }

        function r(a, b) {
          D && (clearTimeout(D), D = null);
          D = setTimeout(function() {
            D = null;
            g.dispatchEvent(h.JWPLAYER_SETUP_ERROR, {
              message: a,
              fallback: b
            })
          }, 0)
        }

        function x(a) {
          z || (u.fallback ? (z = b, m(E, a, u), r(a, b)) : r(a, d))
        }
        var u = new a.config(g.config),
          t = u.width,
          q = u.height,
          B = "Error loading player: ",
          G = n.getElementById(g.id),
          v = f.plugins.loadPlugins(g.id, u.plugins),
          C, F = d,
          z = d,
          D = null,
          H = null;
        u.fallbackDiv && (H = u.fallbackDiv, delete u.fallbackDiv);
        u.id = g.id;
        u.aspectratio ? g.config.aspectratio = u.aspectratio : delete g.config.aspectratio;
        var E = n.createElement("div");
        E.id = G.id;
        E.style.width = 0 < t.toString().indexOf("%") ? t : t + "px";
        E.style.height = 0 < q.toString().indexOf("%") ? q : q + "px";
        G.parentNode.replaceChild(E, G);
        this.embed = function() {
          z || (v.addEventListener(h.COMPLETE, e), v.addEventListener(h.ERROR, j), v.load())
        };
        this.destroy = function() {
          v && (v.destroy(), v = null);
          C && (C.resetEventListeners(), C = null)
        };
        this.errorScreen = x;
        return this
      };
    f.embed.errorScreen = m
  }(jwplayer),
  function(f) {
    function c(b) {
      if (b.playlist)
        for (var c = 0; c < b.playlist.length; c++) b.playlist[c] = new h(b.playlist[c]);
      else {
        var f = {};
        k.foreach(h.defaults, function(a) {
          m(b, f, a)
        });
        f.sources || (b.levels ? (f.sources = b.levels, delete b.levels) : (c = {}, m(b, c, "file"), m(b, c, "type"), f.sources = c.file ? [c] : []));
        b.playlist = [new h(f)]
      }
    }

    function m(b, c, h) {
      k.exists(b[h]) && (c[h] = b[h], delete b[h])
    }
    var k = f.utils,
      h = f.playlist.item;
    (f.embed.config = function(b) {
      var d = {
        fallback: !0,
        height: 270,
        primary: "html5",
        width: 480,
        base: b.base ? b.base : k.getScriptPath("jwplayer.js"),
        aspectratio: ""
      };
      b = k.extend(d, f.defaults, b);
      var d = {
          type: "html5",
          src: b.base + "jwplayer.html5.js"
        },
        h = {
          type: "flash",
          src: b.base + "jwplayer.flash.swf"
        };
      b.modes = "flash" == b.primary ? [h, d] : [d, h];
      b.listbar && (b.playlistsize = b.listbar.size, b.playlistposition = b.listbar.position, b.playlistlayout = b.listbar.layout);
      b.flashplayer && (h.src = b.flashplayer);
      b.html5player && (d.src = b.html5player);
      c(b);
      h = b.aspectratio;
      if ("string" != typeof h || !k.exists(h)) d = 0;
      else {
        var a = h.indexOf(":"); - 1 == a ? d = 0 : (d =
          parseFloat(h.substr(0, a)), h = parseFloat(h.substr(a + 1)), d = 0 >= d || 0 >= h ? 0 : 100 * (h / d) + "%")
      } - 1 == b.width.toString().indexOf("%") ? delete b.aspectratio : d ? b.aspectratio = d : delete b.aspectratio;
      return b
    }).addConfig = function(b, d) {
      c(d);
      return k.extend(b, d)
    }
  }(jwplayer),
  function(f) {
    var c = f.utils,
      m = document;
    f.embed.download = function(f, h, b) {
      function d(a, b) {
        for (var d = m.querySelectorAll(a), e = 0; e < d.length; e++) c.foreach(b, function(a, b) {
          d[e].style[a] = b
        })
      }

      function n(a, b, c) {
        a = m.createElement(a);
        b && (a.className = "jwdownload" +
          b);
        c && c.appendChild(a);
        return a
      }
      var a = c.extend({}, h),
        g = a.width ? a.width : 480,
        e = a.height ? a.height : 320,
        p;
      h = h.logo ? h.logo : {
        prefix: c.repo(),
        file: "logo.png",
        margin: 10
      };
      var j, l, r, a = a.playlist,
        x, u = ["mp4", "aac", "mp3"];
      if (a && a.length) {
        x = a[0];
        p = x.sources;
        for (a = 0; a < p.length; a++) {
          var t = p[a],
            q = t.type ? t.type : c.extensionmap.extType(c.extension(t.file));
          t.file && c.foreach(u, function(a) {
            q == u[a] ? (j = t.file, l = x.image) : c.isYouTube(t.file) && (r = t.file)
          })
        }
        j ? (p = j, b = l, f && (a = n("a", "display", f), n("div", "icon", a), n("div", "logo",
            a), p && a.setAttribute("href", c.getAbsolutePath(p))), a = "#" + f.id + " .jwdownload", f.style.width = "", f.style.height = "", d(a + "display", {
            width: c.styleDimension(Math.max(320, g)),
            height: c.styleDimension(Math.max(180, e)),
            background: "black center no-repeat " + (b ? "url(" + b + ")" : ""),
            backgroundSize: "contain",
            position: "relative",
            border: "none",
            display: "block"
          }), d(a + "display div", {
            position: "absolute",
            width: "100%",
            height: "100%"
          }), d(a + "logo", {
            top: h.margin + "px",
            right: h.margin + "px",
            background: "top right no-repeat url(" + h.prefix +
              h.file + ")"
          }), d(a + "icon", {
            background: "center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgNJREFUeNrs28lqwkAYB/CZqNVDDj2r6FN41QeIy8Fe+gj6BL275Q08u9FbT8ZdwVfotSBYEPUkxFOoks4EKiJdaDuTjMn3wWBO0V/+sySR8SNSqVRKIR8qaXHkzlqS9jCfzzWcTCYp9hF5o+59sVjsiRzcegSckFzcjT+ruN80TeSlAjCAAXzdJSGPFXRpAAMYwACGZQkSdhG4WCzehMNhqV6vG6vVSrirKVEw66YoSqDb7cqlUilE8JjHd/y1MQefVzqdDmiaJpfLZWHgXMHn8F6vJ1cqlVAkEsGuAn83J4gAd2RZymQygX6/L1erVQt+9ZPWb+CDwcCC2zXGJaewl/DhcHhK3DVj+KfKZrMWvFarcYNLomAv4aPRSFZVlTlcSPA5fDweW/BoNIqFnKV53JvncjkLns/n/cLdS+92O7RYLLgsKfv9/t8XlDn4eDyiw+HA9Jyz2eyt0+kY2+3WFC5hluej0Ha7zQQq9PPwdDq1Et1sNsx/nFBgCqWJ8oAK1aUptNVqcYWewE4nahfU0YQnk4ntUEfGMIU2m01HoLaCKbTRaDgKtaVLk9tBYaBcE/6Artdr4RZ5TB6/dC+9iIe/WgAMYADDpAUJAxjAAAYwgGFZgoS/AtNNTF7Z2bL0BYPBV3Jw5xFwwWcYxgtBP5OkE8i9G7aWGOOCruvauwADALMLMEbKf4SdAAAAAElFTkSuQmCC)"
          })) :
          r ? (h = r, f = n("iframe", "", f), f.src = "http://www.youtube.com/embed/" + c.youTubeID(h), f.width = g, f.height = e, f.style.border = "none") : b()
      }
    }
  }(jwplayer),
  function(f) {
    var c = f.utils,
      m = f.events,
      k = {};
    (f.embed.flash = function(b, d, n, a, g) {
      function e(a, b, c) {
        var d = document.createElement("param");
        d.setAttribute("name", b);
        d.setAttribute("value", c);
        a.appendChild(d)
      }

      function p(a, b, c) {
        return function() {
          try {
            c && document.getElementById(g.id + "_wrapper").appendChild(b);
            var d = document.getElementById(g.id).getPluginConfig("display");
            "function" == typeof a.resize && a.resize(d.width, d.height);
            b.style.left = d.x;
            b.style.top = d.h
          } catch (e) {}
        }
      }

      function j(a) {
        if (!a) return {};
        var b = {},
          d = [];
        c.foreach(a, function(a, e) {
          var g = c.getPluginName(a);
          d.push(a);
          c.foreach(e, function(a, c) {
            b[g + "." + a] = c
          })
        });
        b.plugins = d.join(",");
        return b
      }
      var l = new f.events.eventdispatcher,
        r = c.flashVersion();
      c.extend(this, l);
      this.embed = function() {
        n.id = g.id;
        if (10 > r) return l.sendEvent(m.ERROR, {
          message: "Flash version must be 10.0 or greater"
        }), !1;
        var h, f, t = g.config.listbar,
          q = c.extend({},
            n);
        if (b.id + "_wrapper" == b.parentNode.id) h = document.getElementById(b.id + "_wrapper");
        else {
          h = document.createElement("div");
          f = document.createElement("div");
          f.style.display = "none";
          f.id = b.id + "_aspect";
          h.id = b.id + "_wrapper";
          h.style.position = "relative";
          h.style.display = "block";
          h.style.width = c.styleDimension(q.width);
          h.style.height = c.styleDimension(q.height);
          if (g.config.aspectratio) {
            var B = parseFloat(g.config.aspectratio);
            f.style.display = "block";
            f.style.marginTop = g.config.aspectratio;
            h.style.height = "auto";
            h.style.display =
              "inline-block";
            t && ("bottom" == t.position ? f.style.paddingBottom = t.size + "px" : "right" == t.position && (f.style.marginBottom = -1 * t.size * (B / 100) + "px"))
          }
          b.parentNode.replaceChild(h, b);
          h.appendChild(b);
          h.appendChild(f)
        }
        h = a.setupPlugins(g, q, p);
        0 < h.length ? c.extend(q, j(h.plugins)) : delete q.plugins;
        "undefined" != typeof q["dock.position"] && "false" == q["dock.position"].toString().toLowerCase() && (q.dock = q["dock.position"], delete q["dock.position"]);
        h = q.wmode ? q.wmode : q.height && 40 >= q.height ? "transparent" : "opaque";
        f = "height width modes events primary base fallback volume".split(" ");
        for (t = 0; t < f.length; t++) delete q[f[t]];
        f = c.getCookies();
        c.foreach(f, function(a, b) {
          "undefined" == typeof q[a] && (q[a] = b)
        });
        f = window.location.href.split("/");
        f.splice(f.length - 1, 1);
        f = f.join("/");
        q.base = f + "/";
        k[b.id] = q;
        c.isMSIE() ? (f = '\x3cobject classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" " width\x3d"100%" height\x3d"100%"id\x3d"' + b.id + '" name\x3d"' + b.id + '" tabindex\x3d0""\x3e', f += '\x3cparam name\x3d"movie" value\x3d"' + d.src + '"\x3e', f += '\x3cparam name\x3d"allowfullscreen" value\x3d"true"\x3e\x3cparam name\x3d"allowscriptaccess" value\x3d"always"\x3e',
          f += '\x3cparam name\x3d"seamlesstabbing" value\x3d"true"\x3e', f += '\x3cparam name\x3d"wmode" value\x3d"' + h + '"\x3e', f += '\x3cparam name\x3d"bgcolor" value\x3d"#000000"\x3e', f += "\x3c/object\x3e", b.outerHTML = f, h = document.getElementById(b.id)) : (f = document.createElement("object"), f.setAttribute("type", "application/x-shockwave-flash"), f.setAttribute("data", d.src), f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("bgcolor", "#000000"), f.setAttribute("id", b.id), f.setAttribute("name",
          b.id), f.className = "jwswf", e(f, "allowfullscreen", "true"), e(f, "allowscriptaccess", "always"), e(f, "seamlesstabbing", "true"), e(f, "wmode", h), b.parentNode.replaceChild(f, b), h = f);
        g.config.aspectratio && (h.style.position = "absolute");
        g.container = h;
        g.setPlayer(h, "flash")
      };
      this.supportsConfig = function() {
        if (r)
          if (n) {
            if ("string" == c.typeOf(n.playlist)) return !0;
            try {
              var a = n.playlist[0].sources;
              if ("undefined" == typeof a) return !0;
              for (var b = 0; b < a.length; b++)
                if (a[b].file && h(a[b].file, a[b].type)) return !0
            } catch (d) {}
          } else return !0;
        return !1
      }
    }).getVars = function(b) {
      return k[b]
    };
    var h = f.embed.flashCanPlay = function(b, d) {
      if (c.isYouTube(b) || c.isRtmp(b, d) || "hls" == d) return !0;
      var f = c.extensionmap[d ? d : c.extension(b)];
      return !f ? !1 : !!f.flash
    }
  }(jwplayer),
  function(f) {
    function c(b, c, h) {
      if (null !== navigator.userAgent.match(/BlackBerry/i)) return !1;
      if ("youtube" === c || m.isYouTube(b)) return !0;
      var a = m.extension(b);
      c = c || k.extType(a);
      if ("hls" === c)
        if (h) {
          h = m.isAndroidNative;
          if (h(2) || h(3) || h("4.0")) return !1;
          if (m.isAndroid()) return !0
        } else if (m.isAndroid()) return !1;
      if (m.isRtmp(b, c)) return !1;
      b = k[c] || k[a];
      if (!b || b.flash && !b.html5) return !1;
      var g;
      a: if (b = b.html5) {
          try {
            g = !!f.vid.canPlayType(b);
            break a
          } catch (e) {}
          g = !1
        } else g = !0;
      return g
    }
    var m = f.utils,
      k = m.extensionmap,
      h = f.events;
    f.embed.html5 = function(b, d, k, a, g) {
      function e(a, c, d) {
        return function() {
          try {
            var e = document.querySelector("#" + b.id + " .jwmain");
            d && e.appendChild(c);
            "function" == typeof a.resize && (a.resize(e.clientWidth, e.clientHeight), setTimeout(function() {
              a.resize(e.clientWidth, e.clientHeight)
            }, 400));
            c.left = e.style.left;
            c.top = e.style.top
          } catch (f) {}
        }
      }

      function p(a) {
        j.sendEvent(a.type, {
          message: "HTML5 player not found"
        })
      }
      var j = this,
        l = new h.eventdispatcher;
      m.extend(j, l);
      j.embed = function() {
        if (f.html5) {
          a.setupPlugins(g, k, e);
          b.innerHTML = "";
          var c = f.utils.extend({}, k);
          delete c.volume;
          c = new f.html5.player(c);
          g.container = document.getElementById(g.id);
          g.setPlayer(c, "html5")
        } else c = new m.scriptloader(d.src), c.addEventListener(h.ERROR, p), c.addEventListener(h.COMPLETE, j.embed), c.load()
      };
      j.supportsConfig = function() {
        if (f.vid.canPlayType) try {
          if ("string" ==
            m.typeOf(k.playlist)) return !0;
          for (var a = k.playlist[0].sources, b = 0; b < a.length; b++)
            if (c(a[b].file, a[b].type, k.androidhls)) return !0
        } catch (d) {}
        return !1
      }
    };
    f.embed.html5CanPlay = c
  }(jwplayer),
  function(f) {
    var c = f.embed,
      m = f.utils,
      k = /\.(js|swf)$/;
    f.embed = m.extend(function(h) {
      function b() {
        t = "Adobe SiteCatalyst Error: Could not find Media Module"
      }
      var d = m.repo(),
        n = m.extend({}, f.defaults),
        a = m.extend({}, n, h.config),
        g = h.config,
        e = a.plugins,
        p = a.analytics,
        j = d + "jwpsrv.js",
        l = d + "sharing.js",
        r = d + "related.js",
        x = d + "gapro.js",
        n = f.key ? f.key : n.key,
        u = (new f.utils.key(n)).edition(),
        t, e = e ? e : {};
      "ads" == u && a.advertising && (k.test(a.advertising.client) ? e[a.advertising.client] = a.advertising : e[d + a.advertising.client + ".js"] = a.advertising);
      delete g.advertising;
      g.key = n;
      a.analytics && k.test(a.analytics.client) && (j = a.analytics.client);
      delete g.analytics;
      p && !("ads" === u || "enterprise" === u) && delete p.enabled;
      if ("free" == u || !p || !1 !== p.enabled) e[j] = p ? p : {};
      delete e.sharing;
      delete e.related;
      switch (u) {
        case "ads":
        case "enterprise":
          if (g.sitecatalyst) try {
            window.s &&
              window.s.hasOwnProperty("Media") ? new f.embed.sitecatalyst(h) : b()
          } catch (q) {
            b()
          }
        case "premium":
          a.related && (k.test(a.related.client) && (r = a.related.client), e[r] = a.related), a.ga && (k.test(a.ga.client) && (x = a.ga.client), e[x] = a.ga);
        case "pro":
          a.sharing && (k.test(a.sharing.client) && (l = a.sharing.client), e[l] = a.sharing), a.skin && (g.skin = a.skin.replace(/^(beelden|bekle|five|glow|modieus|roundster|stormtrooper|vapor)$/i, m.repo() + "skins/$1.xml"))
      }
      g.plugins = e;
      h.config = g;
      h = new c(h);
      t && h.errorScreen(t);
      return h
    }, f.embed)
  }(jwplayer),
  function(f) {
    var c = jwplayer.utils;
    f.sitecatalyst = function(f) {
      function k(b) {
        a.debug && c.log(b)
      }

      function h(a) {
        a = a.split("/");
        a = a[a.length - 1];
        a = a.split("?");
        return a[0]
      }

      function b() {
        if (!l) {
          l = !0;
          var a = n.getPosition();
          k("stop: " + e + " : " + a);
          s.Media.stop(e, a)
        }
      }

      function d() {
        r || (b(), r = !0, k("close: " + e), s.Media.close(e), x = !0, j = 0)
      }
      var n = f,
        a = c.extend({}, n.config.sitecatalyst),
        g = {
          onPlay: function() {
            if (!x) {
              var a = n.getPosition();
              l = !1;
              k("play: " + e + " : " + a);
              s.Media.play(e, a)
            }
          },
          onPause: b,
          onBuffer: b,
          onIdle: d,
          onPlaylistItem: function(b) {
            try {
              x = !0;
              d();
              j = 0;
              var f;
              if (a.mediaName) f = a.mediaName;
              else {
                var g = n.getPlaylistItem(b.index);
                f = g.title ? g.title : g.file ? h(g.file) : g.sources && g.sources.length ? h(g.sources[0].file) : ""
              }
              e = f;
              p = a.playerName ? a.playerName : n.id
            } catch (l) {
              c.log(l)
            }
          },
          onTime: function() {
            if (x) {
              var a = n.getDuration();
              if (-1 == a) return;
              r = l = x = !1;
              k("open: " + e + " : " + a + " : " + p);
              s.Media.open(e, a, p);
              k("play: " + e + " : 0");
              s.Media.play(e, 0)
            }
            a = n.getPosition();
            if (3 <= Math.abs(a - j)) {
              var b = j;
              k("seek: " + b + " to " + a);
              k("stop: " + e + " : " + b);
              s.Media.stop(e, b);
              k("play: " +
                e + " : " + a);
              s.Media.play(e, a)
            }
            j = a
          },
          onComplete: d
        },
        e, p, j, l = !0,
        r = !0,
        x;
      c.foreach(g, function(a) {
        n[a](g[a])
      })
    }
  }(jwplayer.embed),
  function(f, c) {
    var m = [],
      k = f.utils,
      h = f.events,
      b = h.state,
      d = document,
      n = "getBuffer getCaptionsList getControls getCurrentCaptions getCurrentQuality getDuration getFullscreen getHeight getLockState getMute getPlaylistIndex getSafeRegion getPosition getQualityLevels getState getVolume getWidth isBeforeComplete isBeforePlay releaseState".split(" "),
      a = "playlistNext stop forceState playlistPrev seek setCurrentCaptions setControls setCurrentQuality setVolume".split(" "),
      g = {
        onBufferChange: h.JWPLAYER_MEDIA_BUFFER,
        onBufferFull: h.JWPLAYER_MEDIA_BUFFER_FULL,
        onError: h.JWPLAYER_ERROR,
        onSetupError: h.JWPLAYER_SETUP_ERROR,
        onFullscreen: h.JWPLAYER_FULLSCREEN,
        onMeta: h.JWPLAYER_MEDIA_META,
        onMute: h.JWPLAYER_MEDIA_MUTE,
        onPlaylist: h.JWPLAYER_PLAYLIST_LOADED,
        onPlaylistItem: h.JWPLAYER_PLAYLIST_ITEM,
        onPlaylistComplete: h.JWPLAYER_PLAYLIST_COMPLETE,
        onReady: h.API_READY,
        onResize: h.JWPLAYER_RESIZE,
        onComplete: h.JWPLAYER_MEDIA_COMPLETE,
        onSeek: h.JWPLAYER_MEDIA_SEEK,
        onTime: h.JWPLAYER_MEDIA_TIME,
        onVolume: h.JWPLAYER_MEDIA_VOLUME,
        onBeforePlay: h.JWPLAYER_MEDIA_BEFOREPLAY,
        onBeforeComplete: h.JWPLAYER_MEDIA_BEFORECOMPLETE,
        onDisplayClick: h.JWPLAYER_DISPLAY_CLICK,
        onControls: h.JWPLAYER_CONTROLS,
        onQualityLevels: h.JWPLAYER_MEDIA_LEVELS,
        onQualityChange: h.JWPLAYER_MEDIA_LEVEL_CHANGED,
        onCaptionsList: h.JWPLAYER_CAPTIONS_LIST,
        onCaptionsChange: h.JWPLAYER_CAPTIONS_CHANGED,
        onAdError: h.JWPLAYER_AD_ERROR,
        onAdClick: h.JWPLAYER_AD_CLICK,
        onAdImpression: h.JWPLAYER_AD_IMPRESSION,
        onAdTime: h.JWPLAYER_AD_TIME,
        onAdComplete: h.JWPLAYER_AD_COMPLETE,
        onAdCompanions: h.JWPLAYER_AD_COMPANIONS,
        onAdSkipped: h.JWPLAYER_AD_SKIPPED,
        onAdPlay: h.JWPLAYER_AD_PLAY,
        onAdPause: h.JWPLAYER_AD_PAUSE,
        onAdMeta: h.JWPLAYER_AD_META,
        onCast: h.JWPLAYER_CAST_SESSION
      },
      e = {
        onBuffer: b.BUFFERING,
        onPause: b.PAUSED,
        onPlay: b.PLAYING,
        onIdle: b.IDLE
      };
    f.api = function(m) {
      function j(a, b) {
        k.foreach(a, function(a, c) {
          q[a] = function(a) {
            return b(c, a)
          }
        })
      }

      function l(a, b) {
        var c = "jw" + b.charAt(0).toUpperCase() + b.slice(1);
        q[b] = function() {
          var b = t.apply(this, [c].concat(Array.prototype.slice.call(arguments,
            0)));
          return a ? q : b
        }
      }

      function r(a) {
        F = [];
        D && D.destroy && D.destroy();
        f.api.destroyPlayer(a.id)
      }

      function x(a, b) {
        try {
          a.jwAddEventListener(b, 'function(dat) { jwplayer("' + q.id + '").dispatchEvent("' + b + '", dat); }')
        } catch (c) {
          k.log("Could not add internal listener")
        }
      }

      function u(a, b) {
        B[a] || (B[a] = [], v && C && x(v, a));
        B[a].push(b);
        return q
      }

      function t() {
        if (C) {
          if (v) {
            var a = Array.prototype.slice.call(arguments, 0),
              b = a.shift();
            if ("function" === typeof v[b]) {
              switch (a.length) {
                case 6:
                  return v[b](a[0], a[1], a[2], a[3], a[4], a[5]);
                case 5:
                  return v[b](a[0], a[1], a[2], a[3], a[4]);
                case 4:
                  return v[b](a[0], a[1], a[2], a[3]);
                case 3:
                  return v[b](a[0], a[1], a[2]);
                case 2:
                  return v[b](a[0], a[1]);
                case 1:
                  return v[b](a[0])
              }
              return v[b]()
            }
          }
          return null
        }
        F.push(arguments)
      }
      var q = this,
        B = {},
        G = {},
        v, C = !1,
        F = [],
        z, D, H = {},
        E = {};
      q.container = m;
      q.id = m.id;
      q.setup = function(a) {
        if (f.embed) {
          var b = d.getElementById(q.id);
          b && (a.fallbackDiv = b);
          r(q);
          b = f(q.id);
          b.config = a;
          D = new f.embed(b);
          D.embed();
          return b
        }
        return q
      };
      q.getContainer = function() {
        return q.container
      };
      q.addButton =
        function(a, b, c, d) {
          try {
            E[d] = c, t("jwDockAddButton", a, b, "jwplayer('" + q.id + "').callback('" + d + "')", d)
          } catch (e) {
            k.log("Could not add dock button" + e.message)
          }
        };
      q.removeButton = function(a) {
        t("jwDockRemoveButton", a)
      };
      q.callback = function(a) {
        if (E[a]) E[a]()
      };
      q.getMeta = function() {
        return q.getItemMeta()
      };
      q.getPlaylist = function() {
        var a = t("jwGetPlaylist");
        "flash" == q.renderingMode && k.deepReplaceKeyName(a, ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]);
        return a
      };
      q.getPlaylistItem = function(a) {
        k.exists(a) ||
          (a = q.getPlaylistIndex());
        return q.getPlaylist()[a]
      };
      q.getRenderingMode = function() {
        return q.renderingMode
      };
      q.setFullscreen = function(a) {
        k.exists(a) ? t("jwSetFullscreen", a) : t("jwSetFullscreen", !t("jwGetFullscreen"));
        return q
      };
      q.setMute = function(a) {
        k.exists(a) ? t("jwSetMute", a) : t("jwSetMute", !t("jwGetMute"));
        return q
      };
      q.lock = function() {
        return q
      };
      q.unlock = function() {
        return q
      };
      q.load = function(a) {
        t("jwInstreamDestroy");
        f(q.id).plugins.googima && t("jwDestroyGoogima");
        t("jwLoad", a);
        return q
      };
      q.playlistItem = function(a) {
        t("jwPlaylistItem",
          parseInt(a, 10));
        return q
      };
      q.resize = function(a, b) {
        if ("flash" !== q.renderingMode) t("jwResize", a, b);
        else {
          var c = d.getElementById(q.id + "_wrapper"),
            e = d.getElementById(q.id + "_aspect");
          e && (e.style.display = "none");
          c && (c.style.display = "block", c.style.width = k.styleDimension(a), c.style.height = k.styleDimension(b))
        }
        return q
      };
      q.play = function(a) {
        if (a !== c) return t("jwPlay", a), q;
        a = q.getState();
        var d = z && z.getState();
        d ? d === b.IDLE || d === b.PLAYING || d === b.BUFFERING ? t("jwInstreamPause") : t("jwInstreamPlay") : a == b.PLAYING || a ==
          b.BUFFERING ? t("jwPause") : t("jwPlay");
        return q
      };
      q.pause = function(a) {
        a === c ? (a = q.getState(), a == b.PLAYING || a == b.BUFFERING ? t("jwPause") : t("jwPlay")) : t("jwPause", a);
        return q
      };
      q.createInstream = function() {
        return new f.api.instream(this, v)
      };
      q.setInstream = function(a) {
        return z = a
      };
      q.loadInstream = function(a, b) {
        z = q.setInstream(q.createInstream()).init(b);
        z.loadItem(a);
        return z
      };
      q.destroyPlayer = function() {
        t("jwPlayerDestroy")
      };
      q.playAd = function(a) {
        var b = f(q.id).plugins;
        b.vast ? b.vast.jwPlayAd(a) : t("jwPlayAd", a)
      };
      q.pauseAd = function() {
        var a = f(q.id).plugins;
        a.vast ? a.vast.jwPauseAd() : t("jwPauseAd")
      };
      j(e, function(a, b) {
        G[a] || (G[a] = [], u(h.JWPLAYER_PLAYER_STATE, function(b) {
          var c = b.newstate;
          b = b.oldstate;
          if (c == a) {
            var d = G[c];
            if (d)
              for (var e = 0; e < d.length; e++) {
                var f = d[e];
                "function" == typeof f && f.call(this, {
                  oldstate: b,
                  newstate: c
                })
              }
          }
        }));
        G[a].push(b);
        return q
      });
      j(g, u);
      k.foreach(n, function(a, b) {
        l(!1, b)
      });
      k.foreach(a, function(a, b) {
        l(!0, b)
      });
      q.remove = function() {
        if (!C) throw "Cannot call remove() before player is ready";
        r(this)
      };
      q.registerPlugin = function(a, b, c, d) {
        f.plugins.registerPlugin(a, b, c, d)
      };
      q.setPlayer = function(a, b) {
        v = a;
        q.renderingMode = b
      };
      q.detachMedia = function() {
        if ("html5" == q.renderingMode) return t("jwDetachMedia")
      };
      q.attachMedia = function(a) {
        if ("html5" == q.renderingMode) return t("jwAttachMedia", a)
      };
      q.removeEventListener = function(a, b) {
        var c = B[a];
        if (c)
          for (var d = c.length; d--;) c[d] === b && c.splice(d, 1)
      };
      q.dispatchEvent = function(a, b) {
        var c = B[a];
        if (c)
          for (var c = c.slice(0), d = k.translateEventResponse(a, b), e = 0; e < c.length; e++) {
            var f =
              c[e];
            if ("function" === typeof f) try {
              a === h.JWPLAYER_PLAYLIST_LOADED && k.deepReplaceKeyName(d.playlist, ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]), f.call(this, d)
            } catch (g) {
              k.log("There was an error calling back an event handler")
            }
          }
      };
      q.dispatchInstreamEvent = function(a) {
        z && z.dispatchEvent(a, arguments)
      };
      q.callInternal = t;
      q.playerReady = function(a) {
        C = !0;
        v || q.setPlayer(d.getElementById(a.id));
        q.container = d.getElementById(q.id);
        k.foreach(B, function(a) {
          x(v, a)
        });
        u(h.JWPLAYER_PLAYLIST_ITEM,
          function() {
            H = {}
          });
        u(h.JWPLAYER_MEDIA_META, function(a) {
          k.extend(H, a.metadata)
        });
        u(h.JWPLAYER_VIEW_TAB_FOCUS, function(a) {
          var b = q.getContainer();
          b.className = !0 === a.hasFocus ? b.className + " jw-tab-focus" : b.className.replace(/ *jw-tab-focus */g, " ")
        });
        for (q.dispatchEvent(h.API_READY); 0 < F.length;) t.apply(this, F.shift())
      };
      q.getItemMeta = function() {
        return H
      };
      return q
    };
    f.playerReady = function(a) {
      var b = f.api.playerById(a.id);
      b ? b.playerReady(a) : f.api.selectPlayer(a.id).playerReady(a)
    };
    f.api.selectPlayer = function(a) {
      var b;
      k.exists(a) || (a = 0);
      a.nodeType ? b = a : "string" == typeof a && (b = d.getElementById(a));
      return b ? (a = f.api.playerById(b.id)) ? a : f.api.addPlayer(new f.api(b)) : "number" == typeof a ? m[a] : null
    };
    f.api.playerById = function(a) {
      for (var b = 0; b < m.length; b++)
        if (m[b].id == a) return m[b];
      return null
    };
    f.api.addPlayer = function(a) {
      for (var b = 0; b < m.length; b++)
        if (m[b] == a) return a;
      m.push(a);
      return a
    };
    f.api.destroyPlayer = function(a) {
      var b, e, f;
      k.foreach(m, function(c, d) {
        d.id === a && (b = c, e = d)
      });
      if (b === c || e === c) return null;
      k.clearCss("#" + e.id);
      if (f = d.getElementById(e.id + ("flash" == e.renderingMode ? "_wrapper" : ""))) {
        "html5" === e.renderingMode && e.destroyPlayer();
        var h = d.createElement("div");
        h.id = e.id;
        f.parentNode.replaceChild(h, f)
      }
      m.splice(b, 1);
      return null
    }
  }(window.jwplayer),
  function(f) {
    var c = f.events,
      m = f.utils,
      k = c.state;
    f.api.instream = function(f, b) {
      function d(a, c) {
        e[a] || (e[a] = [], b.jwInstreamAddEventListener(a, 'function(dat) { jwplayer("' + f.id + '").dispatchInstreamEvent("' + a + '", dat); }'));
        e[a].push(c);
        return this
      }

      function n(a, b) {
        p[a] || (p[a] = [], d(c.JWPLAYER_PLAYER_STATE, function(b) {
          var c = b.newstate,
            d = b.oldstate;
          if (c == a) {
            var e = p[c];
            if (e)
              for (var f = 0; f < e.length; f++) {
                var g = e[f];
                "function" == typeof g && g.call(this, {
                  oldstate: d,
                  newstate: c,
                  type: b.type
                })
              }
          }
        }));
        p[a].push(b);
        return this
      }
      var a, g, e = {},
        p = {},
        j = this;
      j.type = "instream";
      j.init = function() {
        f.callInternal("jwInitInstream");
        return j
      };
      j.loadItem = function(b, c) {
        a = b;
        g = c || {};
        "array" == m.typeOf(b) ? f.callInternal("jwLoadArrayInstream", a, g) : f.callInternal("jwLoadItemInstream", a, g)
      };
      j.removeEvents = function() {
        e =
          p = {}
      };
      j.removeEventListener = function(a, b) {
        var c = e[a];
        if (c)
          for (var d = c.length; d--;) c[d] === b && c.splice(d, 1)
      };
      j.dispatchEvent = function(a, b) {
        var c = e[a];
        if (c)
          for (var c = c.slice(0), d = m.translateEventResponse(a, b[1]), f = 0; f < c.length; f++) {
            var g = c[f];
            "function" == typeof g && g.call(this, d)
          }
      };
      j.onError = function(a) {
        return d(c.JWPLAYER_ERROR, a)
      };
      j.onMediaError = function(a) {
        return d(c.JWPLAYER_MEDIA_ERROR, a)
      };
      j.onFullscreen = function(a) {
        return d(c.JWPLAYER_FULLSCREEN, a)
      };
      j.onMeta = function(a) {
        return d(c.JWPLAYER_MEDIA_META,
          a)
      };
      j.onMute = function(a) {
        return d(c.JWPLAYER_MEDIA_MUTE, a)
      };
      j.onComplete = function(a) {
        return d(c.JWPLAYER_MEDIA_COMPLETE, a)
      };
      j.onPlaylistComplete = function(a) {
        return d(c.JWPLAYER_PLAYLIST_COMPLETE, a)
      };
      j.onPlaylistItem = function(a) {
        return d(c.JWPLAYER_PLAYLIST_ITEM, a)
      };
      j.onTime = function(a) {
        return d(c.JWPLAYER_MEDIA_TIME, a)
      };
      j.onBuffer = function(a) {
        return n(k.BUFFERING, a)
      };
      j.onPause = function(a) {
        return n(k.PAUSED, a)
      };
      j.onPlay = function(a) {
        return n(k.PLAYING, a)
      };
      j.onIdle = function(a) {
        return n(k.IDLE, a)
      };
      j.onClick =
        function(a) {
          return d(c.JWPLAYER_INSTREAM_CLICK, a)
        };
      j.onInstreamDestroyed = function(a) {
        return d(c.JWPLAYER_INSTREAM_DESTROYED, a)
      };
      j.onAdSkipped = function(a) {
        return d(c.JWPLAYER_AD_SKIPPED, a)
      };
      j.play = function(a) {
        b.jwInstreamPlay(a)
      };
      j.pause = function(a) {
        b.jwInstreamPause(a)
      };
      j.hide = function() {
        f.callInternal("jwInstreamHide")
      };
      j.destroy = function() {
        j.removeEvents();
        f.callInternal("jwInstreamDestroy")
      };
      j.setText = function(a) {
        b.jwInstreamSetText(a ? a : "")
      };
      j.getState = function() {
        return b.jwInstreamState()
      };
      j.setClick =
        function(a) {
          b.jwInstreamClick && b.jwInstreamClick(a)
        }
    }
  }(window.jwplayer),
  function(f) {
    var c = f.api,
      m = c.selectPlayer;
    c.selectPlayer = function(c) {
      return (c = m(c)) ? c : {
        registerPlugin: function(c, b, d) {
          f.plugins.registerPlugin(c, b, d)
        }
      }
    }
  }(jwplayer));
