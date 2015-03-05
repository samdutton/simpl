(function(g) {
  g.html5 = {};
  g.html5.version = "6.9.4858";
  g = g.utils.css;
  g(".jwplayer ".slice(0, -1) + " div span a img ul li video".split(" ").join(", .jwplayer ") + ", .jwclick", {
    margin: 0,
    padding: 0,
    border: 0,
    color: "#000000",
    "font-size": "100%",
    font: "inherit",
    "vertical-align": "baseline",
    "background-color": "transparent",
    "text-align": "left",
    direction: "ltr",
    "-webkit-tap-highlight-color": "rgba(255, 255, 255, 0)"
  });
  g(".jwplayer ul", {
    "list-style": "none"
  })
})(jwplayer);
(function(g) {
  var k = document;
  g.parseDimension = function(b) {
    return "string" == typeof b ? "" === b ? 0 : -1 < b.lastIndexOf("%") ? b : parseInt(b.replace("px", ""), 10) : b
  };
  g.timeFormat = function(b) {
    if (0 < b) {
      var c = Math.floor(b / 3600),
        d = Math.floor((b - 3600 * c) / 60);
      b = Math.floor(b % 60);
      return (c ? c + ":" : "") + (10 > d ? "0" : "") + d + ":" + (10 > b ? "0" : "") + b
    }
    return "00:00"
  };
  g.bounds = function(b) {
    var c = {
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      top: 0,
      bottom: 0
    };
    if (!b || !k.body.contains(b)) return c;
    if (b.getBoundingClientRect) {
      b = b.getBoundingClientRect(b);
      var d = window.pageYOffset,
        h = window.pageXOffset;
      if (!b.width && !b.height && !b.left && !b.top) return c;
      c.left = b.left + h;
      c.right = b.right + h;
      c.top = b.top + d;
      c.bottom = b.bottom + d;
      c.width = b.right - b.left;
      c.height = b.bottom - b.top
    } else {
      c.width = b.offsetWidth | 0;
      c.height = b.offsetHeight | 0;
      do c.left += b.offsetLeft | 0, c.top += b.offsetTop | 0; while (b = b.offsetParent);
      c.right = c.left + c.width;
      c.bottom = c.top + c.height
    }
    return c
  };
  g.empty = function(b) {
    if (b)
      for (; 0 < b.childElementCount;) b.removeChild(b.children[0])
  }
})(jwplayer.utils);
(function(g) {
  var k = g.stretching = {
    NONE: "none",
    FILL: "fill",
    UNIFORM: "uniform",
    EXACTFIT: "exactfit"
  };
  g.scale = function(b, c, d, h, a) {
    var e = "";
    c = c || 1;
    d = d || 1;
    h |= 0;
    a |= 0;
    if (1 !== c || 1 !== d) e = "scale(" + c + ", " + d + ")";
    if (h || a) e = "translate(" + h + "px, " + a + "px)";
    g.transform(b, e)
  };
  g.stretch = function(b, c, d, h, a, e) {
    if (!c || !d || !h || !a || !e) return !1;
    b = b || k.UNIFORM;
    var f = 2 * Math.ceil(d / 2) / a,
      C = 2 * Math.ceil(h / 2) / e,
      n = "video" === c.tagName.toLowerCase(),
      q = !1,
      v = "jw" + b.toLowerCase();
    switch (b.toLowerCase()) {
      case k.FILL:
        f > C ? C = f : f = C;
        q = !0;
        break;
      case k.NONE:
        f = C = 1;
      case k.EXACTFIT:
        q = !0;
        break;
      default:
        f > C ? 0.95 < a * C / d ? (q = !0, v = "jwexactfit") : (a *= C, e *= C) : 0.95 < e * f / h ? (q = !0, v = "jwexactfit") : (a *= f, e *= f), q && (f = 2 * Math.ceil(d / 2) / a, C = 2 * Math.ceil(h / 2) / e)
    }
    n ? (b = {
      left: "",
      right: "",
      width: "",
      height: ""
    }, q ? (d < a && (b.left = b.right = Math.ceil((d - a) / 2)), h < e && (b.top = b.bottom = Math.ceil((h - e) / 2)), b.width = a, b.height = e, g.scale(c, f, C, 0, 0)) : (q = !1, g.transform(c)), g.css.style(c, b)) : c.className = c.className.replace(/\s*jw(none|exactfit|uniform|fill)/g, "") + " " + v;
    return q
  }
})(jwplayer.utils);
(function(g) {
  g.dfxp = function() {
    var k = jwplayer.utils.seconds;
    this.parse = function(b) {
      var c = [{
        begin: 0,
        text: ""
      }];
      b = b.replace(/^\s+/, "").replace(/\s+$/, "");
      var d = b.split("\x3c/p\x3e"),
        h = b.split("\x3c/tt:p\x3e"),
        a = [];
      for (b = 0; b < d.length; b++) 0 <= d[b].indexOf("\x3cp") && (d[b] = d[b].substr(d[b].indexOf("\x3cp") + 2).replace(/^\s+/, "").replace(/\s+$/, ""), a.push(d[b]));
      for (b = 0; b < h.length; b++) 0 <= h[b].indexOf("\x3ctt:p") && (h[b] = h[b].substr(h[b].indexOf("\x3ctt:p") + 5).replace(/^\s+/, "").replace(/\s+$/, ""), a.push(h[b]));
      d = a;
      for (b = 0; b < d.length; b++) {
        h = d[b];
        a = {};
        try {
          var e = h.indexOf('begin\x3d"'),
            h = h.substr(e + 7),
            e = h.indexOf('" end\x3d"');
          a.begin = k(h.substr(0, e));
          h = h.substr(e + 7);
          e = h.indexOf('"');
          a.end = k(h.substr(0, e));
          e = h.indexOf('"\x3e');
          h = h.substr(e + 2);
          a.text = h
        } catch (f) {}
        h = a;
        h.text && (c.push(h), h.end && (c.push({
          begin: h.end,
          text: ""
        }), delete h.end))
      }
      if (1 < c.length) return c;
      throw {
        message: "Invalid DFXP file:"
      };
    }
  }
})(jwplayer.parsers);
(function(g) {
  g.srt = function() {
    var k = jwplayer.utils,
      b = k.seconds;
    this.parse = function(c, d) {
      var h = d ? [] : [{
        begin: 0,
        text: ""
      }];
      c = k.trim(c);
      var a = c.split("\r\n\r\n");
      1 == a.length && (a = c.split("\n\n"));
      for (var e = 0; e < a.length; e++)
        if ("WEBVTT" != a[e]) {
          var f, g = a[e];
          f = {};
          var n = g.split("\r\n");
          1 == n.length && (n = g.split("\n"));
          try {
            g = 1;
            0 < n[0].indexOf(" --\x3e ") && (g = 0);
            var q = n[g].indexOf(" --\x3e ");
            0 < q && (f.begin = b(n[g].substr(0, q)), f.end = b(n[g].substr(q + 5)));
            if (n[g + 1]) {
              f.text = n[g + 1];
              for (g += 2; g < n.length; g++) f.text += "\x3cbr/\x3e" +
                n[g]
            }
          } catch (v) {}
          f.text && (h.push(f), f.end && !d && (h.push({
            begin: f.end,
            text: ""
          }), delete f.end))
        }
      if (1 < h.length) return h;
      throw {
        message: "Invalid SRT file"
      };
    }
  }
})(jwplayer.parsers);
(function(g) {
  var k = g.utils,
    b = g.events,
    c = b.state,
    d = !0,
    h = !1;
  g.html5.video = function(a, e) {
    function f(a, b) {
      t && Q.sendEvent(a, b)
    }

    function g() {}

    function n(d) {
      v(d);
      t && (E == c.PLAYING && !H) && (w = (10 * a.currentTime | 0) / 10, f(b.JWPLAYER_MEDIA_TIME, {
        position: w,
        duration: I
      }))
    }

    function q(c) {
      t && (y || (y = d, r()), "loadedmetadata" == c.type && (a.muted && (a.muted = h, a.muted = d), f(b.JWPLAYER_MEDIA_META, {
        duration: a.duration,
        height: a.videoHeight,
        width: a.videoWidth
      })))
    }

    function v() {
      y && (0 < F && !W) && (j ? setTimeout(function() {
          0 < F && ea(F)
        }, 200) :
        ea(F))
    }

    function r() {
      K || (K = d, f(b.JWPLAYER_MEDIA_BUFFER_FULL))
    }

    function m(b) {
      t && !H && (a.paused ? a.currentTime == a.duration && 3 < a.duration || ha() : (!k.isFF() || !("play" == b.type && E == c.BUFFERING)) && p(c.PLAYING))
    }

    function l() {
      t && (H || p(c.BUFFERING))
    }

    function B(a) {
      var b;
      if ("array" == k.typeOf(a) && 0 < a.length) {
        b = [];
        for (var c = 0; c < a.length; c++) {
          var d = a[c],
            f = {};
          f.label = d.label && d.label ? d.label ? d.label : 0 : c;
          b[c] = f
        }
      }
      return b
    }

    function z(b, d) {
      K = y = h;
      u = R[T];
      p(c.BUFFERING);
      J = setInterval(G, 100);
      F = 0;
      var f = a.src !== u.file;
      f ? (I = d ?
        d : -1, a.src = u.file, a.load()) : 0 === b && (a.currentTime = 0);
      var e = k.isMobile();
      e && (f || a.load());
      w = a.currentTime;
      e && r();
      k.isIOS() && Q.getFullScreen() && (a.controls = !0);
      0 < b && ea(b)
    }

    function p(a) {
      if (!(a == c.PAUSED && E == c.IDLE) && !H && E != a) {
        var d = E;
        E = a;
        f(b.JWPLAYER_PLAYER_STATE, {
          oldstate: d,
          newstate: a
        })
      }
    }

    function G() {
      if (t) {
        var c;
        c = !a.duration || 0 === a.buffered.length ? 0 : a.buffered.end(a.buffered.length - 1) / a.duration;
        c != U && (U = c, f(b.JWPLAYER_MEDIA_BUFFER, {
          bufferPercent: Math.round(100 * U)
        }));
        1 <= c && clearInterval(J)
      }
    }

    function x(a) {
      f("fullscreenchange", {
        target: a.target,
        jwstate: Z
      })
    }
    e = e || "";
    var j = k.isMSIE(),
      A = {
        abort: g,
        canplay: q,
        canplaythrough: g,
        durationchange: function() {
          if (t) {
            var b = (10 * a.duration | 0) / 10;
            I != b && (I = b);
            W && (0 < F && b > F) && ea(F);
            n()
          }
        },
        emptied: g,
        ended: function() {
          t && E != c.IDLE && (T = -1, aa = d, f(b.JWPLAYER_MEDIA_BEFORECOMPLETE), t && (p(c.IDLE), aa = h, f(b.JWPLAYER_MEDIA_COMPLETE)))
        },
        error: function() {
          t && (k.log("Error playing media: %o", a.error), f(b.JWPLAYER_MEDIA_ERROR, {
            message: "Error loading media: File could not be played"
          }), p(c.IDLE))
        },
        loadeddata: g,
        loadedmetadata: q,
        loadstart: g,
        pause: m,
        play: m,
        playing: m,
        progress: v,
        ratechange: g,
        readystatechange: g,
        seeked: function() {
          !H && E != c.PAUSED && p(c.PLAYING)
        },
        seeking: j ? l : g,
        stalled: g,
        suspend: g,
        timeupdate: n,
        volumechange: function() {
          f(b.JWPLAYER_MEDIA_VOLUME, {
            volume: Math.round(100 * a.volume)
          });
          f(b.JWPLAYER_MEDIA_MUTE, {
            mute: a.muted
          })
        },
        waiting: l,
        webkitbeginfullscreen: function(b) {
          Z = !0;
          x(b);
          k.isIOS() && (a.controls = h)
        },
        webkitendfullscreen: function(b) {
          Z = !1;
          x(b);
          k.isIOS() && (a.controls = h)
        }
      },
      s, u, I, w, y, K, F = 0,
      H = h,
      E = c.IDLE,
      M, J = -1,
      U = -1,
      t = h,
      R, T = -1,
      W = k.isAndroidNative(),
      Y = k.isIOS(7),
      fa = [],
      aa = h,
      Z = null,
      Q = k.extend(this, new b.eventdispatcher(e));
    Q.load = function(a) {
      if (t) {
        R = a.sources;
        0 > T && (T = 0);
        if (R)
          for (var c = k.getCookies().qualityLabel, d = 0; d < R.length; d++)
            if (R[d]["default"] && (T = d), c && R[d].label == c) {
              T = d;
              break
            }(c = B(R)) && Q.sendEvent(b.JWPLAYER_MEDIA_LEVELS, {
          levels: c,
          currentQuality: T
        });
        z(a.starttime || 0, a.duration)
      }
    };
    Q.stop = function() {
      t && (a.removeAttribute("src"), j || a.load(), T = -1, clearInterval(J), p(c.IDLE))
    };
    Q.destroy = function() {
      clearInterval(J)
    };
    Q.play =
      function() {
        t && !H && a.play()
      };
    var ha = Q.pause = function() {
      t && (a.pause(), p(c.PAUSED))
    };
    Q.seekDrag = function(b) {
      t && ((H = b) ? a.pause() : a.play())
    };
    var ea = Q.seek = function(c) {
        t && (!H && 0 === F && f(b.JWPLAYER_MEDIA_SEEK, {
          position: w,
          offset: c
        }), y ? (F = 0, a.currentTime = c) : F = c)
      },
      Pa = Q.volume = function(b) {
        k.exists(b) && (a.volume = Math.min(Math.max(0, b / 100), 1), M = 100 * a.volume)
      };
    Q.mute = function(b) {
      k.exists(b) || (b = !a.muted);
      b ? (M = 100 * a.volume, a.muted = d) : (Pa(M), a.muted = h)
    };
    Q.addCaptions = function(b) {
      if (k.isIOS() && a.addTextTrack) {
        var c =
          window.TextTrackCue;
        k.foreach(b, function(b, d) {
          if (d.data) {
            var f = a.addTextTrack(d.kind, d.label);
            k.foreach(d.data, function(a, b) {
              1 == a % 2 && f.addCue(new c(b.begin, d.data[parseInt(a) + 1].begin, b.text))
            });
            fa.push(f);
            f.mode = "hidden"
          }
        })
      }
    };
    Q.resetCaptions = function() {};
    Q.fsCaptions = function(b) {
      if (k.isIOS() && a.addTextTrack) {
        var c = null;
        k.foreach(fa, function(a, d) {
          !b && "showing" == d.mode && (c = parseInt(a));
          b || (d.mode = "hidden")
        });
        if (!b) return c
      }
    };
    this.checkComplete = function() {
      return aa
    };
    Q.detachMedia = function() {
      t = h;
      return a
    };
    Q.attachMedia = function(a) {
      t = d;
      a || (y = h);
      aa && (p(c.IDLE), f(b.JWPLAYER_MEDIA_COMPLETE), aa = h)
    };
    Q.setContainer = function(b) {
      s = b;
      b.appendChild(a)
    };
    Q.getContainer = function() {
      return s
    };
    Q.remove = function() {
      a && (a.removeAttribute("src"), j || a.load());
      clearInterval(J);
      T = -1;
      s === a.parentNode && s.removeChild(a)
    };
    Q.setVisibility = function(a) {
      a || W ? k.css.style(s, {
        visibility: "visible",
        opacity: 1
      }) : k.css.style(s, {
        visibility: "",
        opacity: 0
      })
    };
    Q.resize = function(b, c, d) {
      k.stretch(d, a, b, c, a.videoWidth, a.videoHeight)
    };
    Q.setControls =
      function(b) {
        a.controls = !!b
      };
    Q.setFullScreen = function(b) {
      if (b = !!b) {
        try {
          var c = a.webkitEnterFullscreen || a.webkitEnterFullScreen;
          c && c.apply(a)
        } catch (d) {
          return !1
        }
        return Q.getFullScreen()
      }(c = a.webkitExitFullscreen || a.webkitExitFullScreen) && c.apply(a);
      return b
    };
    Q.getFullScreen = function() {
      return Z || a.webkitDisplayingFullscreen
    };
    Q.audioMode = function() {
      if (!R) return h;
      var a = R[0].type;
      return "aac" == a || "mp3" == a || "vorbis" == a
    };
    Q.setCurrentQuality = function(c) {
      if (T != c && (c = parseInt(c, 10), 0 <= c && R && R.length > c)) {
        T = c;
        k.saveCookie("qualityLabel",
          R[c].label);
        f(b.JWPLAYER_MEDIA_LEVEL_CHANGED, {
          currentQuality: c,
          levels: B(R)
        });
        c = (10 * a.currentTime | 0) / 10;
        var d = (10 * a.duration | 0) / 10;
        0 >= d && (d = I);
        z(c, d)
      }
    };
    Q.getCurrentQuality = function() {
      return T
    };
    Q.getQualityLevels = function() {
      return B(R)
    };
    a || (a = document.createElement("video"));
    k.foreach(A, function(b, c) {
      a.addEventListener(b, c, h)
    });
    Y || (a.controls = d, a.controls = h);
    a.setAttribute("x-webkit-airplay", "allow");
    t = d
  }
})(jwplayer);
(function(g, k) {
  function b(a) {
    return function() {
      return a
    }
  }

  function c() {}
  var d = g.jwplayer,
    h = d.utils,
    a = d.events,
    e = a.state,
    f = new h.scriptloader(g.location.protocol + "//www.youtube.com/iframe_api");
  g.onYouTubeIframeAPIReady = function() {
    f = null
  };
  d.html5.youtube = function(C) {
    function n(a) {
      g.YT && g.YT.loaded ? (I = g.YT, v(a)) : setTimeout(n, 100)
    }

    function q() {}

    function v() {
      var a;
      if (a = !!I) a = y.parentNode, a || (E || (d(C).onReady(v), E = !0), a = null), a = !!a;
      a && M && M.apply(u)
    }

    function r(b) {
      var c = {
        oldstate: F,
        newstate: b
      };
      F = b;
      b === e.IDLE ?
        clearInterval(J) : (J = setInterval(m, 250), b === e.PLAYING ? h.isMobile() && h.css("#" + C + " .jwcontrols", {
          display: ""
        }) : b === e.BUFFERING && l());
      u.sendEvent(a.JWPLAYER_PLAYER_STATE, c)
    }

    function m() {
      if (w && w.getPlayerState) {
        var b = w.getPlayerState();
        null !== b && (void 0 !== b && b !== U) && (U = b, p({
          data: b
        }));
        var c = I.PlayerState;
        b === c.PLAYING ? (l(), b = {
          position: (10 * w.getCurrentTime() | 0) / 10,
          duration: w.getDuration()
        }, u.sendEvent(a.JWPLAYER_MEDIA_TIME, b)) : b === c.BUFFERING && l()
      }
    }

    function l() {
      var b = 0;
      w && w.getVideoLoadedFraction && (b = Math.round(100 *
        w.getVideoLoadedFraction()));
      H !== b && (H = b, u.sendEvent(a.JWPLAYER_MEDIA_BUFFER, {
        bufferPercent: b
      }))
    }

    function B(a, b) {
      if (!a) throw "invalid Youtube ID";
      if (!y.parentNode) throw "Youtube iFrame removed from DOM";
      var c = {
        height: "100%",
        width: "100%",
        videoId: a,
        playerVars: h.extend({
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 0,
          playsinline: 1,
          origin: location.protocol + "//" + location.hostname
        }, b),
        events: {
          onReady: z,
          onStateChange: p,
          onPlaybackQualityChange: G,
          onError: x
        }
      };
      u.setVisibility(!0);
      w = new I.Player(y, c);
      y =
        w.getIframe();
      M = null;
      j()
    }

    function z() {
      r(e.IDLE)
    }

    function p(b) {
      var c = I.PlayerState;
      switch (b.data) {
        case c.UNSTARTED:
          r(e.IDLE);
          break;
        case c.ENDED:
          F != e.IDLE && (t = !0, u.sendEvent(a.JWPLAYER_MEDIA_BEFORECOMPLETE, void 0), r(e.IDLE), t = !1, u.sendEvent(a.JWPLAYER_MEDIA_COMPLETE, void 0));
          break;
        case c.PLAYING:
          r(e.PLAYING);
          break;
        case c.PAUSED:
          r(e.PAUSED);
          break;
        case c.BUFFERING:
          r(e.BUFFERING);
          break;
        case c.CUED:
          r(e.PAUSED)
      }
    }

    function G(a) {
      a.target.playVideo()
    }

    function x(b) {
      u.sendEvent(a.JWPLAYER_MEDIA_ERROR, {
        message: "Youtube Player Error: " +
          b.data
      })
    }

    function j() {
      h.isMobile() && (u.setVisibility(!0), h.css("#" + C + " .jwcontrols", {
        display: "none"
      }))
    }

    function A() {
      clearInterval(J);
      if (w && w.stopVideo) try {
        w.stopVideo(), w.clearVideo()
      } catch (a) {
        console.error("Error stopping YT", a)
      }
    }

    function s(a) {
      var b = h.youTubeID(a.sources[0].file);
      a.image || (a.image = "http://i.ytimg.com/vi/" + b + "/0.jpg");
      u.setVisibility(!0);
      if (I)
        if (w)
          if (w.getPlayerState)
            if (w.getVideoData().video_id !== b) {
              w.loadVideoById(b);
              a = w.getPlayerState();
              var c = I.PlayerState;
              (a === c.UNSTARTED || a ===
                c.CUED) && j()
            } else 0 < w.getCurrentTime() && w.seekTo(0);
      else console.error(C, "YT player API is not available");
      else B(b, {
        autoplay: 1
      });
      else M = function() {
        B(b)
      }, v()
    }
    var u = h.extend(this, new a.eventdispatcher("html5.youtube")),
      I = g.YT,
      w = null,
      y = k.createElement("div"),
      K, F = e.IDLE,
      H = -1,
      E = !1,
      M = null,
      J = -1,
      U = -1,
      t = !1;
    !I && f && (f.addEventListener(a.COMPLETE, n), f.addEventListener(a.ERROR, q), f.load());
    y.id = C + "_youtube";
    u.init = function(a) {
      s(a)
    };
    u.destroy = function() {
      K === y.parentNode && K.removeChild(y);
      clearInterval(J);
      u = I =
        w = y = null
    };
    u.getElement = function() {
      return y
    };
    u.load = function(a) {
      r(e.BUFFERING);
      s(a);
      w.playVideo && w.playVideo()
    };
    u.stop = function() {
      A();
      r(e.IDLE)
    };
    u.play = function() {
      w.playVideo()
    };
    u.pause = function() {
      w.pauseVideo()
    };
    u.seekDrag = c;
    u.seek = function(a) {
      w.seekTo(a)
    };
    u.volume = function(a) {
      w && w.setVolume(a)
    };
    u.mute = function(a) {
      w && a && w.setVolume(0)
    };
    u.detachMedia = function() {
      return k.createElement("video")
    };
    u.attachMedia = function() {
      t && (r(e.IDLE), u.sendEvent(a.JWPLAYER_MEDIA_COMPLETE, void 0), t = !1)
    };
    u.setContainer =
      function(a) {
        K = a;
        a.appendChild(y);
        u.setVisibility(!0)
      };
    u.getContainer = function() {
      return K
    };
    u.remove = function() {
      A();
      h.css.style(y, {
        display: "none"
      })
    };
    u.setVisibility = function(a) {
      a ? (h.css.style(y, {
        display: "block"
      }), h.css.style(K, {
        visibility: "visible",
        opacity: 1
      })) : h.isMobile() || h.css.style(K, {
        opacity: 0
      })
    };
    u.resize = function(a, b, c) {
      h.stretch(c, y, a, b, y.clientWidth, y.clientHeight)
    };
    u.setFullScreen = u.getFullScreen = b(!1);
    this.checkComplete = function() {
      return t
    };
    u.getCurrentQuality = function() {
      var a = w.getPlaybackQuality();
      return w.getAvailableQualityLevels().indexOf(a)
    };
    u.getQualityLevels = function() {
      for (var a = [], b = w.getAvailableQualityLevels(), c = b.length; c--;) a.push({
        label: b[c]
      });
      return a
    };
    u.setCurrentQuality = c;
    u.setControls = c;
    u.audioMode = b(!1)
  }
})(window, document);
(function(g) {
  var k = g.utils,
    b = k.css,
    c = g.events,
    d = 80,
    h = 30;
  g.html5.adskipbutton = function(a, e, f, g) {
    function n(a) {
      0 > G || (a = f.replace(/xx/gi, Math.ceil(G - a)), r(a))
    }

    function q(a, b) {
      if ("number" == k.typeOf(A)) G = A;
      else if ("%" == A.slice(-1)) {
        var c = parseFloat(A.slice(0, -1));
        b && !isNaN(c) && (G = b * c / 100)
      } else "string" == k.typeOf(A) ? G = k.seconds(A) : isNaN(A) || (G = A)
    }

    function v() {
      x && w.sendEvent(c.JWPLAYER_AD_SKIPPED)
    }

    function r(a) {
      a = a || g;
      var b = p.getContext("2d");
      b.clearRect(0, 0, d, h);
      l(b, 0, 0, d, h, 5, !0, !1, !1);
      l(b, 0, 0, d, h, 5, !1, !0, !1);
      b.fillStyle = "#979797";
      b.globalAlpha = 1;
      var c = p.height / 2,
        f = p.width / 2;
      b.textAlign = "center";
      b.font = "Bold 12px Sans-Serif";
      a === g && (f -= s.width, b.drawImage(s, p.width - (p.width - b.measureText(g).width) / 2 - 4, (h - s.height) / 2));
      b.fillText(a, f, c + 4)
    }

    function m(a) {
      a = a || g;
      var b = p.getContext("2d");
      b.clearRect(0, 0, d, h);
      l(b, 0, 0, d, h, 5, !0, !1, !0);
      l(b, 0, 0, d, h, 5, !1, !0, !0);
      b.fillStyle = "#FFFFFF";
      b.globalAlpha = 1;
      var c = p.height / 2,
        f = p.width / 2;
      b.textAlign = "center";
      b.font = "Bold 12px Sans-Serif";
      a === g && (f -= s.width, b.drawImage(u,
        p.width - (p.width - b.measureText(g).width) / 2 - 4, (h - s.height) / 2));
      b.fillText(a, f, c + 4)
    }

    function l(a, b, c, d, f, e, m, h, j) {
      "undefined" == typeof h && (h = !0);
      "undefined" === typeof e && (e = 5);
      a.beginPath();
      a.moveTo(b + e, c);
      a.lineTo(b + d - e, c);
      a.quadraticCurveTo(b + d, c, b + d, c + e);
      a.lineTo(b + d, c + f - e);
      a.quadraticCurveTo(b + d, c + f, b + d - e, c + f);
      a.lineTo(b + e, c + f);
      a.quadraticCurveTo(b, c + f, b, c + f - e);
      a.lineTo(b, c + e);
      a.quadraticCurveTo(b, c, b + e, c);
      a.closePath();
      h && (a.strokeStyle = "white", a.globalAlpha = j ? 1 : 0.25, a.stroke());
      m && (a.fillStyle =
        "#000000", a.globalAlpha = 0.5, a.fill())
    }

    function B(a, b) {
      var c = document.createElement(a);
      b && (c.className = b);
      return c
    }
    var z, p, G = -1,
      x = !1,
      j, A = 0,
      s, u, I = !1,
      w = k.extend(this, new c.eventdispatcher);
    w.updateSkipTime = function(a, c) {
      q(a, c);
      0 <= G && (b.style(z, {
        visibility: j ? "visible" : "hidden"
      }), 0 < G - a ? (n(a), x && (x = !1, z.style.cursor = "default")) : x || (x || (x = !0, z.style.cursor = "pointer"), I ? m() : r()))
    };
    this.reset = function(a) {
      x = !1;
      A = a;
      q(0, 0);
      n(0)
    };
    w.show = function() {
      j = !0;
      0 < G && b.style(z, {
        visibility: "visible"
      })
    };
    w.hide = function() {
      j = !1;
      b.style(z, {
        visibility: "hidden"
      })
    };
    this.element = function() {
      return z
    };
    s = new Image;
    s.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAICAYAAAArzdW1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ODkzMWI3Ny04YjE5LTQzYzMtOGM2Ni0wYzdkODNmZTllNDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDI0OTcxRkE0OEM2MTFFM0I4MTREM0ZBQTFCNDE3NTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDI0OTcxRjk0OEM2MTFFM0I4MTREM0ZBQTFCNDE3NTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDA5ZGQxNDktNzdkMi00M2E3LWJjYWYtOTRjZmM2MWNkZDI0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4OTMxYjc3LThiMTktNDNjMy04YzY2LTBjN2Q4M2ZlOWU0NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqAZXX0AAABYSURBVHjafI2BCcAwCAQ/kr3ScRwjW+g2SSezCi0kYHpwKLy8JCLDbWaGTM+MAFzuVNXhNiTQsh+PS9QhZ7o9JuFMeUVNwjsamDma4K+3oy1cqX/hxyPAAAQwNKV27g9PAAAAAElFTkSuQmCC";
    s.className = "jwskipimage jwskipout";
    u = new Image;
    u.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAICAYAAAArzdW1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ODkzMWI3Ny04YjE5LTQzYzMtOGM2Ni0wYzdkODNmZTllNDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDI0OTcxRkU0OEM2MTFFM0I4MTREM0ZBQTFCNDE3NTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDI0OTcxRkQ0OEM2MTFFM0I4MTREM0ZBQTFCNDE3NTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDA5ZGQxNDktNzdkMi00M2E3LWJjYWYtOTRjZmM2MWNkZDI0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4OTMxYjc3LThiMTktNDNjMy04YzY2LTBjN2Q4M2ZlOWU0NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvgIj/QAAABYSURBVHjadI6BCcAgDAS/0jmyih2tm2lHSRZJX6hQQ3w4FP49LKraSHV3ZLDzAuAi3cwaqUhSfvft+EweznHneUdTzPGRmp5hEJFhAo3LaCnjn7blzCvAAH9YOSCL5RZKAAAAAElFTkSuQmCC";
    u.className = "jwskipimage jwskipover";
    z = B("div", "jwskip");
    z.id = a + "_skipcontainer";
    p = B("canvas");
    z.appendChild(p);
    w.width = p.width = d;
    w.height = p.height = h;
    z.appendChild(u);
    z.appendChild(s);
    b.style(z, {
      visibility: "hidden",
      bottom: e
    });
    z.addEventListener("mouseover", function() {
      I = !0;
      x && m()
    });
    z.addEventListener("mouseout", function() {
      I = !1;
      x && r()
    });
    k.isMobile() ? (new k.touch(z)).addEventListener(k.touchEvents.TAP, v) : z.addEventListener("click", v)
  };
  b(".jwskip", {
    position: "absolute",
    "float": "right",
    display: "inline-block",
    width: d,
    height: h,
    right: 10
  });
  b(".jwskipimage", {
    position: "relative",
    display: "none"
  })
})(window.jwplayer);
(function(g) {
  var k = g.utils,
    b = g.events,
    c = b.state,
    d = g.parsers,
    h = k.css,
    a = "playing",
    e = document;
  g.html5.captions = function(f, h) {
    function n(a) {
      k.log("CAPTIONS(" + a + ")")
    }

    function q(a) {
      (E = a.fullscreen) ? (v(), setTimeout(v, 500)) : B(!0)
    }

    function v() {
      var a = j.offsetHeight,
        b = j.offsetWidth;
      0 !== a && 0 !== b && u.resize(b, Math.round(0.94 * a))
    }

    function r(a, b) {
      k.ajax(a, function(a) {
        var c = a.responseXML ? a.responseXML.firstChild : null;
        K++;
        if (c) {
          "xml" == d.localName(c) && (c = c.nextSibling);
          for (; c.nodeType == c.COMMENT_NODE;) c = c.nextSibling
        }
        c =
          c && "tt" == d.localName(c) ? new g.parsers.dfxp : new g.parsers.srt;
        try {
          var f = c.parse(a.responseText);
          w < y.length && (y[b].data = f);
          B(!1)
        } catch (e) {
          n(e.message + ": " + y[b].file)
        }
        K == y.length && (0 < F && (p(F), F = -1), l())
      }, m, !0)
    }

    function m(a) {
      K++;
      n(a);
      K == y.length && (0 < F && (p(F), F = -1), l())
    }

    function l() {
      for (var a = [], c = 0; c < y.length; c++) a.push(y[c]);
      M.sendEvent(b.JWPLAYER_CAPTIONS_LOADED, {
        captionData: a
      })
    }

    function B(b) {
      y.length ? I == a && 0 < H ? (u.show(), E ? q({
        fullscreen: !0
      }) : (z(), b && setTimeout(z, 500))) : u.hide() : u.hide()
    }

    function z() {
      u.resize()
    }

    function p(a) {
      0 < a ? (w = a - 1, H = a | 0, w >= y.length || (y[w].data ? u.populate(y[w].data) : K == y.length ? (n("file not loaded: " + y[w].file), 0 !== H && G(b.JWPLAYER_CAPTIONS_CHANGED, y, 0), H = 0) : F = a, B(!1))) : (H = 0, B(!1))
    }

    function G(a, b, c) {
      M.sendEvent(a, {
        type: a,
        tracks: b,
        track: c
      })
    }

    function x() {
      for (var a = [{
          label: "Off"
        }], b = 0; b < y.length; b++) a.push({
        label: y[b].label
      });
      return a
    }
    var j, A = {
        back: !0,
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily: "Arial,sans-serif",
        fontOpacity: 100,
        backgroundColor: "#000",
        backgroundOpacity: 100,
        edgeStyle: null,
        windowColor: "#FFFFFF",
        windowOpacity: 0
      },
      s = {
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "none"
      },
      u, I, w, y = [],
      K = 0,
      F = -1,
      H = 0,
      E = !1,
      M = new b.eventdispatcher;
    k.extend(this, M);
    this.element = function() {
      return j
    };
    this.getCaptionsList = function() {
      return x()
    };
    this.getCurrentCaptions = function() {
      return H
    };
    this.setCurrentCaptions = function(a) {
      0 <= a && (H != a && a <= y.length) && (p(a), a = x(), k.saveCookie("captionLabel", a[H].label), G(b.JWPLAYER_CAPTIONS_CHANGED, a, H))
    };
    j = e.createElement("div");
    j.id = f.id + "_caption";
    j.className = "jwcaptions";
    f.jwAddEventListener(b.JWPLAYER_PLAYER_STATE,
      function(b) {
        switch (b.newstate) {
          case c.IDLE:
            I = "idle";
            B(!1);
            break;
          case c.PLAYING:
            I = a, B(!1)
        }
      });
    f.jwAddEventListener(b.JWPLAYER_PLAYLIST_ITEM, function() {
      w = 0;
      y = [];
      u.update(0);
      K = 0;
      for (var a = f.jwGetPlaylist()[f.jwGetPlaylistIndex()].tracks, c = [], d = 0, e = "", h = 0, e = "", d = 0; d < a.length; d++) e = a[d].kind.toLowerCase(), ("captions" == e || "subtitles" == e) && c.push(a[d]);
      for (d = H = 0; d < c.length; d++)
        if (e = c[d].file) c[d].label || (c[d].label = d.toString()), y.push(c[d]), r(y[d].file, d);
      for (d = 0; d < y.length; d++)
        if (y[d]["default"]) {
          h = d + 1;
          break
        }
      if (e = k.getCookies().captionLabel) {
        a = x();
        for (d = 0; d < a.length; d++)
          if (e == a[d].label) {
            h = d;
            break
          }
      }
      0 < h && p(h);
      B(!1);
      G(b.JWPLAYER_CAPTIONS_LIST, x(), H)
    });
    f.jwAddEventListener(b.JWPLAYER_MEDIA_ERROR, n);
    f.jwAddEventListener(b.JWPLAYER_ERROR, n);
    f.jwAddEventListener(b.JWPLAYER_READY, function() {
      k.foreach(A, function(a, b) {
        h && (void 0 !== h[a] ? b = h[a] : void 0 !== h[a.toLowerCase()] && (b = h[a.toLowerCase()]));
        s[a] = b
      });
      u = new g.html5.captions.renderer(s, j);
      B(!1)
    });
    f.jwAddEventListener(b.JWPLAYER_MEDIA_TIME, function(a) {
      u.update(a.position)
    });
    f.jwAddEventListener(b.JWPLAYER_FULLSCREEN, q);
    f.jwAddEventListener(b.JWPLAYER_RESIZE, function() {
      B(!1)
    })
  };
  h(".jwcaptions", {
    position: "absolute",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  })
})(jwplayer);
(function(g) {
  var k = g.utils,
    b = k.css.style;
  g.html5.captions.renderer = function(c, d) {
    function h(c) {
      c = c || "";
      l = "hidden";
      b(n, {
        visibility: l
      });
      v.innerHTML = c;
      c.length && (l = "visible", setTimeout(a, 16))
    }

    function a() {
      if ("visible" === l) {
        var a = n.clientWidth,
          d = Math.pow(a / 400, 0.6),
          f = c.fontSize * d;
        b(v, {
          maxWidth: a + "px",
          fontSize: Math.round(f) + "px",
          lineHeight: Math.round(1.4 * f) + "px",
          padding: Math.round(1 * d) + "px " + Math.round(8 * d) + "px"
        });
        c.windowOpacity && b(q, {
          padding: Math.round(5 * d) + "px",
          borderRadius: Math.round(5 * d) + "px"
        });
        b(n, {
          visibility: l
        })
      }
    }

    function e() {
      for (var a = -1, b = 0; b < g.length; b++)
        if (g[b].begin <= m && (b == g.length - 1 || g[b + 1].begin >= m)) {
          a = b;
          break
        } - 1 == a ? h("") : a != r && (r = a, h(g[b].text))
    }

    function f(a, b, c) {
      c = k.hexToRgba("#000000", c);
      "dropshadow" === a ? b.textShadow = "0 2px 1px " + c : "raised" === a ? b.textShadow = "0 0 5px " + c + ", 0 1px 5px " + c + ", 0 2px 5px " + c : "depressed" === a ? b.textShadow = "0 -2px 1px " + c : "uniform" === a && (b.textShadow = "-2px 0 1px " + c + ",2px 0 1px " + c + ",0 -2px 1px " + c + ",0 2px 1px " + c + ",-1px 1px 1px " + c + ",1px 1px 1px " + c + ",1px -1px 1px " +
        c + ",1px 1px 1px " + c)
    }
    var g, n, q, v, r, m, l = "visible",
      B = -1;
    this.hide = function() {
      clearInterval(B);
      b(n, {
        display: "none"
      })
    };
    this.populate = function(a) {
      r = -1;
      g = a;
      e()
    };
    this.resize = function() {
      a()
    };
    this.show = function() {
      b(n, {
        display: "block"
      });
      a();
      clearInterval(B);
      B = setInterval(a, 250)
    };
    this.update = function(a) {
      m = a;
      g && e()
    };
    var z = c.fontOpacity,
      p = c.windowOpacity,
      G = c.edgeStyle,
      x = c.backgroundColor,
      j = {
        display: "inline-block"
      },
      A = {
        color: k.hexToRgba(k.rgbHex(c.color), z),
        display: "inline-block",
        fontFamily: c.fontFamily,
        fontStyle: c.fontStyle,
        fontWeight: c.fontWeight,
        textAlign: "center",
        textDecoration: c.textDecoration,
        wordWrap: "break-word"
      };
    p && (j.backgroundColor = k.hexToRgba(k.rgbHex(c.windowColor), p));
    f(G, A, z);
    c.back ? A.backgroundColor = k.hexToRgba(k.rgbHex(x), c.backgroundOpacity) : null === G && f("uniform", A);
    n = document.createElement("div");
    q = document.createElement("div");
    v = document.createElement("span");
    b(n, {
      display: "block",
      height: "auto",
      position: "absolute",
      bottom: "20px",
      textAlign: "center",
      width: "100%"
    });
    b(q, j);
    b(v, A);
    q.appendChild(v);
    n.appendChild(q);
    d.appendChild(n)
  }
})(jwplayer);
(function(g) {
  function k(a) {
    return a ? parseInt(a.width, 10) + "px " + parseInt(a.height, 10) + "px" : "0 0"
  }
  var b = g.html5,
    c = g.utils,
    d = g.events,
    h = d.state,
    a = c.css,
    e = c.transitionStyle,
    f = c.isMobile(),
    C = c.isAndroid(4, !0),
    n = "button",
    q = "text",
    v = "slider",
    r = "none",
    m = "100%",
    l = !1,
    B = !0,
    z = null,
    p = "",
    G = {
      display: r
    },
    x = {
      display: "block"
    },
    j = {
      display: p
    },
    A = "array",
    s = l,
    u = window,
    I = document;
  b.controlbar = function(e, y) {
    function K(a, b, c) {
      return {
        name: a,
        type: b,
        className: c
      }
    }

    function F(b) {
      a.block(X);
      if (b.duration == Number.POSITIVE_INFINITY ||
        !b.duration && c.isSafari() && !f) S.setText(e.jwGetPlaylist()[e.jwGetPlaylistIndex()].title || "Live broadcast");
      else {
        var d;
        D.elapsed && (d = c.timeFormat(b.position), D.elapsed.innerHTML = d);
        D.duration && (d = c.timeFormat(b.duration), D.duration.innerHTML = d);
        0 < b.duration ? N(b.position / b.duration) : N(0);
        ra = b.duration;
        sa || S.setText()
      }
    }

    function H() {
      var a = e.jwGetMute();
      Da = e.jwGetVolume() / 100;
      ha("mute", a || 0 === Da);
      ua(a ? 0 : Da)
    }

    function E() {
      a.style([D.hd, D.cc], G);
      a.style(D.cast, s ? j : G);
      Ia();
      va()
    }

    function M(a) {
      Ea = a.currentQuality |
        0;
      D.hd && (D.hd.querySelector("button").className = 2 === ja.length && 0 === Ea ? "off" : p);
      ka && 0 <= Ea && ka.setActive(a.currentQuality)
    }

    function J(a) {
      ga && (Ja = a.track | 0, D.cc && (D.cc.querySelector("button").className = 2 === ga.length && 0 === Ja ? "off" : p), la && 0 <= Ja && la.setActive(a.track))
    }

    function U(b) {
      if (D.cast) {
        s = b.available;
        a.style(D.cast, b.available ? j : G);
        var c = D.cast.className.replace(/\s*jwcancast/, "");
        b.available && (c += " jwcancast");
        D.cast.className = c
      }
      t(b)
    }

    function t(a) {
      ma = a;
      D.cast && (D.cast.querySelector("button").className =
        a.active ? p : "off");
      va()
    }

    function R() {
      pa = c.extend({}, ba, ca.getComponentSettings("controlbar"), y);
      Ka = L("background").height;
      var b = qa ? 0 : pa.margin;
      a.style(P, {
        height: Ka,
        bottom: b,
        left: b,
        right: b,
        "max-width": qa ? p : pa.maxwidth
      });
      a(T(".jwtext"), {
        font: pa.fontsize + "px/" + L("background").height + "px " + pa.font,
        color: pa.fontcolor,
        "font-weight": pa.fontweight
      });
      a(T(".jwoverlay"), {
        bottom: Ka
      })
    }

    function T(a) {
      return "#" + X + (a ? " " + a : p)
    }

    function W() {
      return I.createElement("span")
    }

    function Y(b, d, e, f, h) {
      var m = W(),
        g = L(b);
      f = f ? " left center" :
        " center";
      var j = k(g);
      m.className = "jw" + b;
      m.innerHTML = "\x26nbsp;";
      if (g && g.src) return e = e ? {
        background: "url('" + g.src + "') repeat-x " + f,
        "background-size": j,
        height: h ? g.height : p
      } : {
        background: "url('" + g.src + "') no-repeat" + f,
        "background-size": j,
        width: g.width,
        height: h ? g.height : p
      }, m.skin = g, a(T((h ? ".jwvertical " : p) + ".jw" + b), c.extend(e, d)), D[b] = m
    }

    function fa(b, c, d, e) {
      c && c.src && (a(b, {
        width: c.width,
        background: "url(" + c.src + ") no-repeat center",
        "background-size": k(c)
      }), d.src && !f && a(b + ":hover," + b + ".off:hover", {
        background: "url(" +
          d.src + ") no-repeat center",
        "background-size": k(d)
      }), e && e.src && a(b + ".off", {
        background: "url(" + e.src + ") no-repeat center",
        "background-size": k(e)
      }))
    }

    function aa(a) {
      return function(b) {
        wb[a] && (wb[a](), f && S.sendEvent(d.JWPLAYER_USER_ACTION));
        b.preventDefault && b.preventDefault()
      }
    }

    function Z(a) {
      c.foreach(mb, function(b, c) {
        b != a && ("cc" == b && $(), "hd" == b && V(), c.hide())
      })
    }

    function Q() {
      !qa && !sa && (a.block(X), ta.show(), za("volume", ta), Z("volume"))
    }

    function ha(a, b) {
      c.exists(b) || (b = !nb[a]);
      D[a] && (D[a].className = "jw" +
        a + (b ? " jwtoggle jwtoggling" : " jwtoggling"), setTimeout(function() {
          D[a].className = D[a].className.replace(" jwtoggling", p)
        }, 100));
      nb[a] = b
    }

    function ea() {
      ja && 2 < ja.length && (ob && (clearTimeout(ob), ob = void 0), a.block(X), ka.show(), za("hd", ka), Z("hd"))
    }

    function Pa() {
      ga && 2 < ga.length && (pb && (clearTimeout(pb), pb = void 0), a.block(X), la.show(), za("cc", la), Z("cc"))
    }

    function ab(a) {
      0 <= a && a < ja.length && (e.jwSetCurrentQuality(a), V(), ka.hide())
    }

    function Oa(a) {
      0 <= a && a < ga.length && (e.jwSetCurrentCaptions(a), $(), la.hide())
    }

    function ya() {
      2 ==
        ga.length && Oa((Ja + 1) % 2)
    }

    function Ca() {
      2 == ja.length && ab((Ea + 1) % 2)
    }

    function Ha(a) {
      a.preventDefault();
      I.onselectstart = function() {
        return l
      }
    }

    function bb(a) {
      cb();
      wa = a;
      u.addEventListener("mouseup", La, l)
    }

    function cb() {
      u.removeEventListener("mouseup", La);
      wa = z
    }

    function Ma() {
      D.timeRail.className = "jwrail";
      e.jwGetState() != h.IDLE && (e.jwSeekDrag(B), bb("time"), O(), S.sendEvent(d.JWPLAYER_USER_ACTION))
    }

    function qb(a) {
      if (wa) {
        var b = D[wa].querySelector(".jwrail"),
          b = c.bounds(b),
          b = a.x / b.width;
        100 < b && (b = 100);
        a.type == c.touchEvents.DRAG_END ?
          (e.jwSeekDrag(l), D.timeRail.className = "jwrail", cb(), db.time(b), xa()) : (N(b), 500 < currentTime - rb && (rb = currentTime, db.time(b)));
        S.sendEvent(d.JWPLAYER_USER_ACTION)
      }
    }

    function Ta(a) {
      var b = D.time.querySelector(".jwrail"),
        b = c.bounds(b);
      a = a.x / b.width;
      100 < a && (a = 100);
      e.jwGetState() != h.IDLE && (db.time(a), S.sendEvent(d.JWPLAYER_USER_ACTION))
    }

    function Ua(a) {
      return function(b) {
        b.button || (D[a + "Rail"].className = "jwrail", "time" === a ? e.jwGetState() != h.IDLE && (e.jwSeekDrag(B), bb(a)) : bb(a))
      }
    }

    function La(a) {
      if (wa && !a.button) {
        var b =
          D[wa].querySelector(".jwrail"),
          d = c.bounds(b),
          b = wa,
          d = D[b].vertical ? (d.bottom - a.pageY) / d.height : (a.pageX - d.left) / d.width;
        "mouseup" == a.type ? ("time" == b && e.jwSeekDrag(l), D[b + "Rail"].className = "jwrail", cb(), db[b.replace("H", p)](d)) : ("time" == wa ? N(d) : ua(d), 500 < currentTime - rb && (rb = currentTime, db[wa.replace("H", p)](d)));
        return !1
      }
    }

    function O(b) {
      b && na.apply(this, arguments);
      oa && (ra && !qa && !f) && (a.block(X), oa.show(), za("time", oa))
    }

    function xa() {
      u.removeEventListener("mousemove", La);
      oa && oa.hide()
    }

    function na(a) {
      Fa =
        c.bounds(P);
      if ((Qa = c.bounds(eb)) && 0 !== Qa.width) a = a.pageX ? a.pageX - Qa.left : a.x, oa.positionX(Math.round(a)), vb(ra * a / Qa.width)
    }

    function fb() {
      c.foreach(gb, function(b, c) {
        var d = {};
        "%" === c.position.toString().slice(-1) ? d.left = c.position : 0 < ra ? (d.left = (100 * c.position / ra).toFixed(2) + "%", d.display = null) : (d.left = 0, d.display = "none");
        a.style(c.element, d)
      })
    }

    function Va() {
      pb = setTimeout(la.hide, 500)
    }

    function Aa() {
      ob = setTimeout(ka.hide, 500)
    }

    function Wa(b, c, d, e) {
      if (!f) {
        var h = b.element();
        c.appendChild(h);
        c.addEventListener("mousemove",
          d, l);
        e ? c.addEventListener("mouseout", e, l) : c.addEventListener("mouseout", b.hide, l);
        a.style(h, {
          left: "50%"
        })
      }
    }

    function ia(a, b, e, h) {
      if (f) {
        var m = a.element();
        b.appendChild(m);
        (new c.touch(b)).addEventListener(c.touchEvents.TAP, function() {
          var b = e;
          "cc" == h ? (2 == ga.length && (b = ya), hb ? ($(), a.hide()) : (hb = setTimeout(function() {
            a.hide();
            hb = void 0
          }, 4E3), b()), S.sendEvent(d.JWPLAYER_USER_ACTION)) : "hd" == h && (2 == ja.length && (b = Ca), ib ? (V(), a.hide()) : (ib = setTimeout(function() {
            a.hide();
            ib = void 0
          }, 4E3), b()), S.sendEvent(d.JWPLAYER_USER_ACTION))
        })
      }
    }

    function Xa(d) {
      var e = W();
      e.className = "jwgroup jw" + d;
      Ga[d] = e;
      if (Ba[d]) {
        var e = Ba[d],
          h = Ga[d];
        if (e && 0 < e.elements.length)
          for (var g = 0; g < e.elements.length; g++) {
            var j;
            a: {
              j = e.elements[g];
              var B = d;
              switch (j.type) {
                case q:
                  B = void 0;
                  j = j.name;
                  var B = {},
                    s = L(("alt" == j ? "elapsed" : j) + "Background");
                  if (s.src) {
                    var t = W();
                    t.id = X + "_" + j;
                    "elapsed" == j || "duration" == j ? (t.className = "jwtext jw" + j + " jwhidden", Ra.push(t)) : t.className = "jwtext jw" + j;
                    B.background = "url(" + s.src + ") repeat-x center";
                    B["background-size"] = k(L("background"));
                    a.style(t,
                      B);
                    t.innerHTML = "alt" != j ? "00:00" : p;
                    B = D[j] = t
                  } else B = null;
                  j = B;
                  break a;
                case n:
                  if ("blank" != j.name) {
                    j = j.name;
                    s = B;
                    if (!L(j + "Button").src || f && ("mute" == j || 0 === j.indexOf("volume")) || C && /hd|cc/.test(j)) j = z;
                    else {
                      var B = W(),
                        t = W(),
                        F = void 0,
                        F = Ya,
                        y = Y(F.name);
                      y || (y = W(), y.className = "jwblankDivider");
                      F.className && (y.className += " " + F.className);
                      F = y;
                      y = I.createElement("button");
                      B.style += " display:inline-block";
                      B.className = "jw" + j + " jwbuttoncontainer";
                      "left" == s ? (B.appendChild(t), B.appendChild(F)) : (B.appendChild(F), B.appendChild(t));
                      f ? "hd" != j && "cc" != j && (new c.touch(y)).addEventListener(c.touchEvents.TAP, aa(j)) : y.addEventListener("click", aa(j), l);
                      y.innerHTML = "\x26nbsp;";
                      y.tabIndex = -1;
                      t.appendChild(y);
                      s = L(j + "Button");
                      t = L(j + "ButtonOver");
                      F = L(j + "ButtonOff");
                      fa(T(".jw" + j + " button"), s, t, F);
                      (s = Cb[j]) && fa(T(".jw" + j + ".jwtoggle button"), L(s + "Button"), L(s + "ButtonOver"));
                      j = D[j] = B
                    }
                    break a
                  }
                  break;
                case v:
                  B = void 0;
                  F = j.name;
                  if (f && 0 === F.indexOf("volume")) B = void 0;
                  else {
                    j = W();
                    var t = "volume" == F,
                      K = F + ("time" == F ? "Slider" : p) + "Cap",
                      s = t ? "Top" : "Left",
                      B =
                      t ? "Bottom" : "Right",
                      y = Y(K + s, z, l, l, t),
                      A = Y(K + B, z, l, l, t),
                      H;
                    H = F;
                    var u = t,
                      w = s,
                      x = B,
                      E = W(),
                      R = ["Rail", "Buffer", "Progress"],
                      U = void 0,
                      Q = void 0;
                    E.className = "jwrail";
                    for (var J = 0; J < R.length; J++) {
                      var Q = "time" == H ? "Slider" : p,
                        M = H + Q + R[J],
                        P = Y(M, z, !u, 0 === H.indexOf("volume"), u),
                        S = Y(M + "Cap" + w, z, l, l, u),
                        Z = Y(M + "Cap" + x, z, l, l, u),
                        ea = L(M + "Cap" + w),
                        ha = L(M + "Cap" + x);
                      if (P) {
                        var V = W();
                        V.className = "jwrailgroup " + R[J];
                        S && V.appendChild(S);
                        V.appendChild(P);
                        Z && (V.appendChild(Z), Z.className += " jwcap" + (u ? "Bottom" : "Right"));
                        a(T(".jwrailgroup." +
                          R[J]), {
                          "min-width": u ? p : ea.width + ha.width
                        });
                        V.capSize = u ? ea.height + ha.height : ea.width + ha.width;
                        a(T("." + P.className), {
                          left: u ? p : ea.width,
                          right: u ? p : ha.width,
                          top: u ? ea.height : p,
                          bottom: u ? ha.height : p,
                          height: u ? "auto" : p
                        });
                        2 == J && (U = V);
                        2 == J && !u ? (P = W(), P.className = "jwprogressOverflow", P.appendChild(V), D[M] = P, E.appendChild(P)) : (D[M] = V, E.appendChild(V))
                      }
                    }
                    if (w = Y(H + Q + "Thumb", z, l, l, u)) a(T("." + w.className), {
                      opacity: "time" == H ? 0 : 1,
                      "margin-top": u ? w.skin.height / -2 : p
                    }), w.className += " jwthumb", (u && U ? U : E).appendChild(w);
                    f ?
                      (u = new c.touch(E), u.addEventListener(c.touchEvents.DRAG_START, Ma), u.addEventListener(c.touchEvents.DRAG, qb), u.addEventListener(c.touchEvents.DRAG_END, qb), u.addEventListener(c.touchEvents.TAP, Ta)) : (U = H, "volume" == U && !u && (U += "H"), E.addEventListener("mousedown", Ua(U), l));
                    "time" == H && !f && (E.addEventListener("mousemove", O, l), E.addEventListener("mouseout", xa, l));
                    H = D[H + "Rail"] = E;
                    E = L(K + s);
                    K = L(K + s);
                    j.className = "jwslider jw" + F;
                    y && j.appendChild(y);
                    j.appendChild(H);
                    A && (t && (A.className += " jwcapBottom"), j.appendChild(A));
                    a(T(".jw" + F + " .jwrail"), {
                      left: t ? p : E.width,
                      right: t ? p : K.width,
                      top: t ? E.height : p,
                      bottom: t ? K.height : p,
                      width: t ? m : p,
                      height: t ? "auto" : p
                    });
                    D[F] = j;
                    j.vertical = t;
                    "time" == F ? (oa = new b.overlay(X + "_timetooltip", ca), jb = new b.thumbs(X + "_thumb"), kb = I.createElement("div"), kb.className = "jwoverlaytext", sb = I.createElement("div"), B = jb.element(), sb.appendChild(B), sb.appendChild(kb), oa.setContents(sb), eb = H, vb(0), B = oa.element(), H.appendChild(B), D.timeSliderRail || a.style(D.time, G), D.timeSliderThumb && a.style(D.timeSliderThumb, {
                      "margin-left": L("timeSliderThumb").width / -2
                    }), B = L("timeSliderCue"), s = {
                      "z-index": 1
                    }, B && B.src ? (Y("timeSliderCue"), s["margin-left"] = B.width / -2) : s.display = r, a(T(".jwtimeSliderCue"), s), Na(0), N(0), N(0), Na(0)) : 0 === F.indexOf("volume") && (F = j, y = "volume" + (t ? p : "H"), A = t ? "vertical" : "horizontal", a(T(".jw" + y + ".jw" + A), {
                      width: L(y + "Rail", t).width + (t ? 0 : L(y + "Cap" + s).width + L(y + "RailCap" + s).width + L(y + "RailCap" + B).width + L(y + "Cap" + B).width),
                      height: t ? L(y + "Cap" + s).height + L(y + "Rail").height + L(y + "RailCap" + s).height + L(y + "RailCap" +
                        B).height + L(y + "Cap" + B).height : p
                    }), F.className += " jw" + A);
                    B = j
                  }
                  j = B;
                  break a
              }
              j = void 0
            }
            j && ("volume" == e.elements[g].name && j.vertical ? (ta = new b.overlay(X + "_volumeOverlay", ca), ta.setContents(j)) : h.appendChild(j))
          }
      }
    }

    function va() {
      clearTimeout(xb);
      xb = setTimeout(S.redraw, 0)
    }

    function Ia() {
      !tb && 1 < e.jwGetPlaylist().length && (!I.querySelector("#" + e.id + " .jwplaylist") || e.jwGetFullscreen()) ? (a.style(D.next, j), a.style(D.prev, j)) : (a.style(D.next, G), a.style(D.prev, G))
    }

    function za(a, b) {
      Fa || (Fa = c.bounds(P));
      b.constrainX(Fa, !0)
    }

    function Na(b) {
      D.timeSliderBuffer && (b = Math.min(Math.max(0, b), 1), a.style(D.timeSliderBuffer, {
        width: (100 * b).toFixed(1) + "%",
        opacity: 0 < b ? 1 : 0
      }))
    }

    function Sa(b, c) {
      if (D[b]) {
        var d = D[b].vertical,
          e = b + ("time" === b ? "Slider" : p),
          f = 100 * Math.min(Math.max(0, c), 1) + "%",
          j = D[e + "Progress"],
          e = D[e + "Thumb"],
          h;
        j && (h = {}, d ? (h.height = f, h.bottom = 0) : h.width = f, "volume" !== b && (h.opacity = 0 < c || wa ? 1 : 0), a.style(j, h));
        e && (h = {}, d ? h.top = 0 : h.left = f, a.style(e, h))
      }
    }

    function ua(a) {
      Sa("volume", a);
      Sa("volumeH", a)
    }

    function N(a) {
      Sa("time", a)
    }

    function L(a) {
      var b = "controlbar",
        c = a;
      0 === a.indexOf("volume") && (0 === a.indexOf("volumeH") ? c = a.replace("volumeH", "volume") : b = "tooltip");
      return (a = ca.getSkinElement(b, c)) ? a : {
        width: 0,
        height: 0,
        src: p,
        image: void 0,
        ready: l
      }
    }

    function $() {
      clearTimeout(hb);
      hb = void 0
    }

    function V() {
      clearTimeout(ib);
      ib = void 0
    }

    function da(a) {
      a = (new g.parsers.srt).parse(a.responseText, !0);
      if (c.typeOf(a) !== A) return lb("Invalid data");
      S.addCues(a)
    }

    function lb(a) {
      c.log("Cues failed to load: " + a)
    }
    var ca, Ya = K("divider", "divider"),
      ba = {
        margin: 8,
        maxwidth: 800,
        font: "Arial,sans-serif",
        fontsize: 11,
        fontcolor: 15658734,
        fontweight: "bold",
        layout: {
          left: {
            position: "left",
            elements: [K("play", n), K("prev", n), K("next", n), K("elapsed", q)]
          },
          center: {
            position: "center",
            elements: [K("time", v), K("alt", q)]
          },
          right: {
            position: "right",
            elements: [K("duration", q), K("hd", n), K("cc", n), K("mute", n), K("volume", v), K("volumeH", v), K("cast", n), K("fullscreen", n)]
          }
        }
      },
      pa, Ba, D, Ka, P, X, ra, ja, Ea, ga, Ja, Da, ma = {},
      ta, Fa, eb, Qa, oa, sb, jb, kb, ob, ib, ka, pb, hb, la, xb, Za = -1,
      qa = l,
      sa = l,
      tb = l,
      ub = l,
      wa = z,
      rb =
      0,
      gb = [],
      $a, Cb = {
        play: "pause",
        mute: "unmute",
        fullscreen: "normalscreen"
      },
      nb = {
        play: l,
        mute: l,
        fullscreen: l
      },
      wb = {
        play: function() {
          nb.play ? e.jwPause() : e.jwPlay()
        },
        mute: function() {
          var a = !nb.mute;
          e.jwSetMute(a);
          !a && 0 === Da && e.jwSetVolume(20);
          H()
        },
        fullscreen: function() {
          e.jwSetFullscreen()
        },
        next: function() {
          e.jwPlaylistNext()
        },
        prev: function() {
          e.jwPlaylistPrev()
        },
        hd: Ca,
        cc: ya,
        cast: function() {
          ma.active ? e.jwStopCasting() : e.jwStartCasting()
        }
      },
      db = {
        time: function(a) {
          $a ? (a = $a.position, a = "%" === a.toString().slice(-1) ? ra * parseFloat(a.slice(0, -1)) / 100 : parseFloat(a)) : a *= ra;
          e.jwSeek(a)
        },
        volume: function(a) {
          ua(a);
          0.1 > a && (a = 0);
          0.9 < a && (a = 1);
          e.jwSetVolume(100 * a)
        }
      },
      mb = {},
      Ra = [],
      S = c.extend(this, new d.eventdispatcher),
      vb, yb, Db = function(b) {
        a.style(oa.element(), {
          width: b
        });
        za("time", oa)
      };
    vb = function(b) {
      var d = jb.updateTimeline(b, Db);
      if ($a) {
        if ((b = $a.text) && b !== yb) yb = b, a.style(oa.element(), {
          width: 32 < b.length ? 160 : p
        })
      } else b = c.timeFormat(b), d || a.style(oa.element(), {
        width: p
      });
      kb.innerHTML !== b && (kb.innerHTML = b);
      za("time", oa)
    };
    S.setText = function(b) {
      a.block(X);
      var c = D.alt,
        d = D.time;
      D.timeSliderRail ? a.style(d, b ? G : x) : a.style(d, G);
      c && (a.style(c, b ? x : G), c.innerHTML = b || p);
      va()
    };
    var Ga = {};
    S.redraw = function(b) {
      a.block(X);
      b && S.visible && S.show(B);
      R();
      var d = top !== window.self && c.isMSIE();
      b = ma.active;
      a.style(D.fullscreen, {
        display: qa || b || ub || d ? r : p
      });
      a.style(D.volumeH, {
        display: qa || sa ? "block" : r
      });
      d = pa.maxwidth | 0;
      !qa && d && P.parentNode && c.isIE() && (P.parentNode.clientWidth > d + (pa.margin | 0) ? a.style(P, {
        width: d
      }) : a.style(P, {
        width: p
      }));
      ta && a.style(ta.element(), {
        display: !qa && !sa ?
          "block" : r
      });
      a.style(D.hd, {
        display: !qa && !b && !sa && ja && 1 < ja.length && ka ? p : r
      });
      a.style(D.cc, {
        display: !qa && !b && !sa && ga && 1 < ga.length && la ? p : r
      });
      fb();
      a.unblock(X);
      S.visible && (b = L("capLeft"), d = L("capRight"), b = {
        left: Math.round(c.parseDimension(Ga.left.offsetWidth) + b.width),
        right: Math.round(c.parseDimension(Ga.right.offsetWidth) + d.width)
      }, a.style(Ga.center, b))
    };
    S.audioMode = function(a) {
      void 0 !== a && a !== qa && (qa = !!a, va());
      return qa
    };
    S.instreamMode = function(a) {
      void 0 !== a && a !== sa && (sa = !!a);
      return sa
    };
    S.adMode = function(b) {
      if (void 0 !==
        b && b !== tb) {
        tb = !!b;
        if (b) {
          var c = Ra,
            d = c.indexOf(D.elapsed); - 1 < d && c.splice(d, 1);
          c = Ra;
          d = c.indexOf(D.duration); - 1 < d && c.splice(d, 1)
        } else c = Ra, d = D.elapsed, -1 === c.indexOf(d) && c.push(d), c = Ra, d = D.duration, -1 === c.indexOf(d) && c.push(d);
        a.style([D.cast, D.elapsed, D.duration], b ? G : j);
        Ia()
      }
      return tb
    };
    S.hideFullscreen = function(a) {
      void 0 !== a && a !== ub && (ub = !!a, va());
      return ub
    };
    S.element = function() {
      return P
    };
    S.margin = function() {
      return parseInt(pa.margin, 10)
    };
    S.height = function() {
      return Ka
    };
    S.show = function(b) {
      if (!S.visible ||
        b) S.visible = !0, a.style(P, {
        display: "inline-block"
      }), Fa = c.bounds(P), P && D.alt && (P.parentNode && 320 <= P.parentNode.clientWidth ? a.style(Ra, j) : a.style(Ra, G)), a.block(X), H(), va(), clearTimeout(Za), Za = -1, Za = setTimeout(function() {
        a.style(P, {
          opacity: 1
        })
      }, 0)
    };
    S.showTemp = function() {
      this.visible || (P.style.opacity = 0, P.style.display = "inline-block")
    };
    S.hideTemp = function() {
      this.visible || (P.style.display = r)
    };
    S.addCues = function(a) {
      c.foreach(a, function(a, b) {
        if (b.text) {
          var c = b.begin,
            d = b.text;
          if (/^[\d\.]+%?$/.test(c.toString())) {
            var e =
              Y("timeSliderCue"),
              f = D.timeSliderRail,
              j = {
                position: c,
                text: d,
                element: e
              };
            e && f && (f.appendChild(e), e.addEventListener("mouseover", function() {
              $a = j
            }, !1), e.addEventListener("mouseout", function() {
              $a = z
            }, !1), gb.push(j))
          }
          fb()
        }
      })
    };
    S.hide = function() {
      S.visible && (S.visible = !1, a.style(P, {
        opacity: 0
      }), clearTimeout(Za), Za = -1, Za = setTimeout(function() {
        a.style(P, {
          display: r
        })
      }, 250))
    };
    D = {};
    X = e.id + "_controlbar";
    ra = 0;
    P = W();
    P.id = X;
    P.className = "jwcontrolbar";
    ca = e.skin;
    Ba = ca.getComponentLayout("controlbar");
    Ba || (Ba = ba.layout);
    c.clearCss(T());
    a.block(X + "build");
    R();
    var zb = Y("capLeft"),
      Ab = Y("capRight"),
      Bb = Y("background", {
        position: "absolute",
        left: L("capLeft").width,
        right: L("capRight").width,
        "background-repeat": "repeat-x"
      }, B);
    Bb && P.appendChild(Bb);
    zb && P.appendChild(zb);
    Xa("left");
    Xa("center");
    Xa("right");
    P.appendChild(Ga.left);
    P.appendChild(Ga.center);
    P.appendChild(Ga.right);
    D.hd && (ka = new b.menu("hd", X + "_hd", ca, ab), f ? ia(ka, D.hd, ea, "hd") : Wa(ka, D.hd, ea, Aa), mb.hd = ka);
    D.cc && (la = new b.menu("cc", X + "_cc", ca, Oa), f ? ia(la, D.cc, Pa, "cc") :
      Wa(la, D.cc, Pa, Va), mb.cc = la);
    D.mute && (D.volume && D.volume.vertical) && (ta = new b.overlay(X + "_volumeoverlay", ca), ta.setContents(D.volume), Wa(ta, D.mute, Q), mb.volume = ta);
    a.style(Ga.right, {
      right: L("capRight").width
    });
    Ab && P.appendChild(Ab);
    a.unblock(X + "build");
    e.jwAddEventListener(d.JWPLAYER_MEDIA_TIME, F);
    e.jwAddEventListener(d.JWPLAYER_PLAYER_STATE, function(b) {
      switch (b.newstate) {
        case h.BUFFERING:
        case h.PLAYING:
          D.timeSliderThumb && a.style(D.timeSliderThumb, {
            opacity: 1
          });
          ha("play", B);
          break;
        case h.PAUSED:
          wa ||
            ha("play", l);
          break;
        case h.IDLE:
          ha("play", l), D.timeSliderThumb && a.style(D.timeSliderThumb, {
            opacity: 0
          }), D.timeRail && (D.timeRail.className = "jwrail"), Na(0), F({
            position: 0,
            duration: 0
          })
      }
    });
    e.jwAddEventListener(d.JWPLAYER_PLAYLIST_ITEM, function(a) {
      if (!sa) {
        a = e.jwGetPlaylist()[a.index].tracks;
        var b = l,
          d = D.timeSliderRail;
        c.foreach(gb, function(a, b) {
          d.removeChild(b.element)
        });
        gb.length = 0;
        if (c.typeOf(a) == A && !f)
          for (var j = 0; j < a.length; j++)
            if (!b && (a[j].file && a[j].kind && "thumbnails" == a[j].kind.toLowerCase()) && (jb.load(a[j].file),
                b = B), a[j].file && a[j].kind && "chapters" == a[j].kind.toLowerCase()) {
              var h = a[j].file;
              h ? c.ajax(h, da, lb, B) : gb.length = 0
            }
        b || jb.load()
      }
    });
    e.jwAddEventListener(d.JWPLAYER_MEDIA_MUTE, H);
    e.jwAddEventListener(d.JWPLAYER_MEDIA_VOLUME, H);
    e.jwAddEventListener(d.JWPLAYER_MEDIA_BUFFER, function(a) {
      Na(a.bufferPercent / 100)
    });
    e.jwAddEventListener(d.JWPLAYER_FULLSCREEN, function(a) {
      ha("fullscreen", a.fullscreen);
      Ia();
      S.visible && S.show(B)
    });
    e.jwAddEventListener(d.JWPLAYER_PLAYLIST_LOADED, E);
    e.jwAddEventListener(d.JWPLAYER_MEDIA_LEVELS,
      function(b) {
        ja = b.levels;
        if (!sa && ja && 1 < ja.length && ka) {
          a.style(D.hd, j);
          ka.clearOptions();
          for (var c = 0; c < ja.length; c++) ka.addOption(ja[c].label, c);
          M(b)
        } else a.style(D.hd, G);
        va()
      });
    e.jwAddEventListener(d.JWPLAYER_MEDIA_LEVEL_CHANGED, M);
    e.jwAddEventListener(d.JWPLAYER_CAPTIONS_LIST, function(b) {
      ga = b.tracks;
      if (!sa && ga && 1 < ga.length && la) {
        a.style(D.cc, j);
        la.clearOptions();
        for (var c = 0; c < ga.length; c++) la.addOption(ga[c].label, c);
        J(b)
      } else a.style(D.cc, G);
      va()
    });
    e.jwAddEventListener(d.JWPLAYER_CAPTIONS_CHANGED,
      J);
    e.jwAddEventListener(d.JWPLAYER_RESIZE, function() {
      Fa = c.bounds(P);
      0 < Fa.width && S.show(B)
    });
    e.jwAddEventListener(d.JWPLAYER_CAST_AVAILABLE, U);
    e.jwAddEventListener(d.JWPLAYER_CAST_SESSION, t);
    f || (P.addEventListener("mouseover", function() {
      u.addEventListener("mousedown", Ha, l)
    }, !1), P.addEventListener("mouseout", function() {
      u.removeEventListener("mousedown", Ha);
      I.onselectstart = null
    }, !1));
    setTimeout(H, 0);
    E();
    S.visible = !1;
    U({
      available: s
    })
  };
  a("span.jwcontrolbar", {
    position: "absolute",
    margin: "auto",
    opacity: 0,
    display: r
  });
  a("span.jwcontrolbar span", {
    height: m
  });
  c.dragStyle("span.jwcontrolbar span", r);
  a("span.jwcontrolbar .jwgroup", {
    display: "inline"
  });
  a("span.jwcontrolbar span, span.jwcontrolbar .jwgroup button,span.jwcontrolbar .jwleft", {
    position: "relative",
    "float": "left"
  });
  a("span.jwcontrolbar .jwright", {
    position: "relative",
    "float": "right"
  });
  a("span.jwcontrolbar .jwcenter", {
    position: "absolute"
  });
  a("span.jwcontrolbar buttoncontainer,span.jwcontrolbar button", {
    display: "inline-block",
    height: m,
    border: r,
    cursor: "pointer"
  });
  a("span.jwcontrolbar .jwcapRight,span.jwcontrolbar .jwtimeSliderCapRight,span.jwcontrolbar .jwvolumeCapRight", {
    right: 0,
    position: "absolute"
  });
  a("span.jwcontrolbar .jwcapBottom", {
    bottom: 0,
    position: "absolute"
  });
  a("span.jwcontrolbar .jwtime", {
    position: "absolute",
    height: m,
    width: m,
    left: 0
  });
  a("span.jwcontrolbar .jwthumb", {
    position: "absolute",
    height: m,
    cursor: "pointer"
  });
  a("span.jwcontrolbar .jwrail", {
    position: "absolute",
    cursor: "pointer"
  });
  a("span.jwcontrolbar .jwrailgroup", {
    position: "absolute",
    width: m
  });
  a("span.jwcontrolbar .jwrailgroup span", {
    position: "absolute"
  });
  a("span.jwcontrolbar .jwdivider+.jwdivider", {
    display: r
  });
  a("span.jwcontrolbar .jwtext", {
    padding: "0 5px",
    "text-align": "center"
  });
  a("span.jwcontrolbar .jwcast", {
    display: r
  });
  a("span.jwcontrolbar .jwcast.jwcancast", {
    display: "block"
  });
  a("span.jwcontrolbar .jwalt", {
    display: r,
    overflow: "hidden"
  });
  a("span.jwcontrolbar .jwalt", {
    position: "absolute",
    left: 0,
    right: 0,
    "text-align": "left"
  }, B);
  a("span.jwcontrolbar .jwoverlaytext", {
    padding: 3,
    "text-align": "center"
  });
  a("span.jwcontrolbar .jwvertical *", {
    display: "block"
  });
  a("span.jwcontrolbar .jwvertical .jwvolumeProgress", {
    height: "auto"
  }, B);
  a("span.jwcontrolbar .jwprogressOverflow", {
    position: "absolute",
    overflow: "hidden"
  });
  e("span.jwcontrolbar", "opacity .25s, background .25s, visibility .25s");
  e("span.jwcontrolbar button", "opacity .25s, background .25s, visibility .25s");
  e("span.jwcontrolbar .jwtoggling", r)
})(window.jwplayer);
(function(g) {
  var k = g.utils,
    b = g.events,
    c = b.state,
    d = g.playlist,
    h = !0,
    a = !1;
  g.html5.controller = function(e, f) {
    function C() {
      return e.getVideo()
    }

    function n(a) {
      y.sendEvent(a.type, a)
    }

    function q(a) {
      r(h);
      switch (k.typeOf(a)) {
        case "string":
          var c = new d.loader;
          c.addEventListener(b.JWPLAYER_PLAYLIST_LOADED, function(a) {
            q(a.playlist)
          });
          c.addEventListener(b.JWPLAYER_ERROR, function(a) {
            q([]);
            a.message = "Could not load playlist: " + a.message;
            n(a)
          });
          c.load(a);
          break;
        case "object":
        case "array":
          e.setPlaylist(new g.playlist(a));
          break;
        case "number":
          e.setItem(a)
      }
    }

    function v(d) {
      k.exists(d) || (d = h);
      if (!d) return m();
      try {
        0 <= j && (q(j), j = -1);
        if (!A && (A = h, y.sendEvent(b.JWPLAYER_MEDIA_BEFOREPLAY), A = a, I)) {
          I = a;
          s = null;
          return
        }
        if (e.state == c.IDLE) {
          if (0 === e.playlist.length) return a;
          C().load(e.playlist[e.item])
        } else e.state == c.PAUSED && C().play();
        return h
      } catch (f) {
        y.sendEvent(b.JWPLAYER_ERROR, f), s = null
      }
      return a
    }

    function r(d) {
      s = null;
      try {
        return e.state != c.IDLE ? C().stop() : d || (u = h), A && (I = h), h
      } catch (f) {
        y.sendEvent(b.JWPLAYER_ERROR, f)
      }
      return a
    }

    function m(d) {
      s =
        null;
      k.exists(d) || (d = h);
      if (!d) return v();
      try {
        switch (e.state) {
          case c.PLAYING:
          case c.BUFFERING:
            C().pause();
            break;
          default:
            A && (I = h)
        }
        return h
      } catch (f) {
        y.sendEvent(b.JWPLAYER_ERROR, f)
      }
      return a
    }

    function l(a) {
      k.css.block(e.id + "_next");
      q(a);
      v();
      k.css.unblock(e.id + "_next")
    }

    function B() {
      l(e.item + 1)
    }

    function z() {
      e.state == c.IDLE && (u ? u = a : (s = z, e.repeat ? B() : e.item == e.playlist.length - 1 ? (j = 0, r(h), setTimeout(function() {
        y.sendEvent(b.JWPLAYER_PLAYLIST_COMPLETE)
      }, 0)) : B()))
    }

    function p(a) {
      return function() {
        x ? G(a, arguments) :
          w.push({
            method: a,
            arguments: arguments
          })
      }
    }

    function G(a, b) {
      var c = [],
        d;
      for (d = 0; d < b.length; d++) c.push(b[d]);
      a.apply(this, c)
    }
    var x = a,
      j = -1,
      A = a,
      s, u = a,
      I, w = [],
      y = k.extend(this, new b.eventdispatcher(e.id, e.config.debug));
    this.play = p(v);
    this.pause = p(m);
    this.seek = p(function(a) {
      e.state != c.PLAYING && v(h);
      C().seek(a)
    });
    this.stop = function() {
      u = h;
      p(r)()
    };
    this.load = p(q);
    this.next = p(B);
    this.prev = p(function() {
      l(e.item - 1)
    });
    this.item = p(l);
    this.setVolume = p(e.setVolume);
    this.setMute = p(e.setMute);
    this.setFullscreen = p(function(a) {
      f.fullscreen(a)
    });
    this.detachMedia = function() {
      try {
        return e.getVideo().detachMedia()
      } catch (a) {
        return null
      }
    };
    this.attachMedia = function(a) {
      try {
        e.getVideo().attachMedia(a), "function" == typeof s && s()
      } catch (b) {
        return null
      }
    };
    this.setCurrentQuality = p(function(a) {
      C().setCurrentQuality(a)
    });
    this.getCurrentQuality = function() {
      return C() ? C().getCurrentQuality() : -1
    };
    this.getQualityLevels = function() {
      return C() ? C().getQualityLevels() : null
    };
    this.setCurrentCaptions = p(function(a) {
      f.setCurrentCaptions(a)
    });
    this.getCurrentCaptions = function() {
      return f.getCurrentCaptions()
    };
    this.getCaptionsList = function() {
      return f.getCaptionsList()
    };
    this.checkBeforePlay = function() {
      return A
    };
    this.playerReady = function(a) {
      if (!x) {
        f.completeSetup();
        y.sendEvent(a.type, a);
        g.utils.exists(g.playerReady) && g.playerReady(a);
        e.addGlobalListener(n);
        f.addGlobalListener(n);
        y.sendEvent(g.events.JWPLAYER_PLAYLIST_LOADED, {
          playlist: g(e.id).getPlaylist()
        });
        y.sendEvent(g.events.JWPLAYER_PLAYLIST_ITEM, {
          index: e.item
        });
        q();
        e.autostart && !k.isMobile() && v();
        for (x = h; 0 < w.length;) a = w.shift(), G(a.method, a.arguments)
      }
    };
    e.addEventListener(b.JWPLAYER_MEDIA_BUFFER_FULL, function() {
      C().play()
    });
    e.addEventListener(b.JWPLAYER_MEDIA_COMPLETE, function() {
      setTimeout(z, 25)
    });
    e.addEventListener(b.JWPLAYER_MEDIA_ERROR, function(a) {
      a = k.extend({}, a);
      a.type = b.JWPLAYER_ERROR;
      y.sendEvent(a.type, a)
    })
  }
})(jwplayer);
(function(g) {
  g.html5.defaultskin = function() {
    return g.utils.parseXML('\x3c?xml version\x3d"1.0" ?\x3e\x3cskin author\x3d"JW Player" name\x3d"Six" target\x3d"6.7" version\x3d"3.0"\x3e\x3ccomponents\x3e\x3ccomponent name\x3d"controlbar"\x3e\x3csettings\x3e\x3csetting name\x3d"margin" value\x3d"10"/\x3e\x3csetting name\x3d"maxwidth" value\x3d"800"/\x3e\x3csetting name\x3d"fontsize" value\x3d"11"/\x3e\x3csetting name\x3d"fontweight" value\x3d"normal"/\x3e\x3csetting name\x3d"fontcase" value\x3d"normal"/\x3e\x3csetting name\x3d"fontcolor" value\x3d"0xd2d2d2"/\x3e\x3c/settings\x3e\x3celements\x3e\x3celement name\x3d"background" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAYAAADtlXTHAAAANklEQVR4AWMUFRW/x2RiYqLI9O3bNwam////MzAxAAGcAImBWf9RuRAxnFyEUQgDCLKATLCDAFb+JfgLDLOxAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAeCAYAAAARgF8NAAAAr0lEQVR4AWNhAAJRUXEFIFUOxNZAzMOABFiAkkpAeh0fH5+IgoKCKBsQoCgA4lJeXl5ReXl5qb9//zJ8+/aNAV2Btbi4uOifP39gYhgKeFiBAEjjUAAFlCn4/5+gCf9pbwVhNwxhKxAm/KdDZA16E778/v37DwsLKwsuBUdfvXopISUlLYpLQc+vX78snz17yigqKibAAgQoCuTlFe4+fPggCKio9OnTJzZAMW5kBQAEFD9DdqDrQQAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"capRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAeCAYAAAARgF8NAAAArklEQVR4Ad2TMQrCQBBF/y5rYykEa++QxibRK3gr0dt4BPUSLiTbKMYUSlgt3IFxyogJsRHFB6/7/A+7jIqiYYZnvLgV56IzcRyPUOMuOOcGVVWNAcxUmk4ZNZRS0Fojz/O9936lkmTCaICIgrV2Z9CCMaYHoK/RQWfAMHcEAP7QxPsNAP/BBDN/+7N+uoEoEIBba0NRHM8A1i8vSUJZni4hhAOAZdPxXsWNuBCzB0E+V9jBVxF8AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"playButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAQAAACcJxZuAAAAtElEQVR4AWOgLRgFnAyiDPwMzMRrkHuwuCSdQZ14Tbpv9v/cf2UN8ZoMHu5/uP/l/h9EazK4sx8Cn+7/RpQmg+v74RBo11eCmgwu7keFd/d/wavJ4PR+THhj/6f9N1ZODWTgxKLhyH7scMvK3iCsGvbtx4Tz1oZn4HTSjv2ocObakAy8nt60HwGnrA3KIBisa/dD4IS1/lDFBJLGiv0r9ves9YUpJpz4Ji72hiomNXnTH4wCAAxXpSnKMgKaAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"playButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAQAAACcJxZuAAAAtElEQVR4AWOgLRgFPAwyDCIMLMRr0Hhws6SLwYR4TTZv/v/8f+UZ8ZocHv5/+P/l/x9Ea3K48x8Cn/7/RpQmh+v/4RBo11eCmhwu/keFd/9/wavJ4fR/THjj/6f/Nx5OzWHgwaLhyH/scMuj3lysGvb9x4Tznod343TSjv+ocObzkG68nt70HwGnPA/qJhisa/9D4ITn/lDFBJLGiv8r/vc894UpJpz4Jt7yhiomNXnTH4wCAHC8wQF60KqlAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"pauseButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAQAAACcJxZuAAAAYElEQVR4AWOgNRgFPAwqDAZAqAJkofPhgBFJg8r/2VDBVIY7GHwoYEG24RmchcnHpoHhDxDj4WNq+I0m+ZvqGn6hSf6iuoafaJI/SbaB7hroHw9f/sBZ6HzSkzdtwSgAADNtJoABsotOAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"pauseButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAQAAACcJxZuAAAAWklEQVR4AWOgNRgFAgwGDA5AaABkofOxAoP/UMBggMGHAxZkG57BWeh87BoY/gAxHj6mht9okr+pruEXmuQvqmv4iSb5k2Qb6K6B/vHw4Q+chc4nPXnTFowCADYgMi8+iyldAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"prevButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAeCAQAAACLBYanAAAAmElEQVR4AWMYMDAKeBgkgBgGmBn4GUQZONEVqfzfz6ACV6Bekv5gMYMcuiKDR/sZDGAKrqz5sf/lfgZdDEW39jPYQxR82/94/y0gZDDAUHR+f3rpjZWf99/efx4CsSk6sj+pbMvKI/vhEJuiXWDrQjNmr921HwyxKVoPd3hAxsS16/evx+JwleUoQeCbMRkRBIQDk/5gFAAAvD5I9xunLg8AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"prevButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAeCAQAAACLBYanAAAAmUlEQVR4AWMYMDAKBBgUgBgGWBhEGGQYeNAVGfz/z2AAV2BS0vXgJoMGuiKHR/8ZHGAKrjz78f/lfwYbDEW3/jOEQBR8+//4/y0gZHDAUHT+f/qcGw8//7/9/zwEYlN05H/S3C2PjvyHQ2yKdoGtC+2e/XzXfzDEpmg93OEB3ROfr/+/HovDDZajBIFv9+RbDBpEByb9wSgAAHeuVc8xgA8jAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"nextButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAQAAABgMj2kAAAAlUlEQVR4AWOgAxgFnAyiDPwMzHA+D4MEEKMAuQeLS9IZ1OHKVP7vZ1BBVaL7cv+P/VfWwJUZPNrPYICqxODW/lv7H+//BlNmfwtTyfn9EHh7/+f9N1aml57HVHJkPwJuWZlUdgRTya79EDh7bWgGyKJdGEp01+9fv3/i2oAMmHPXYyiRm7zYNwPZ08vBniYcdDQHowAA/MZI93f1cSkAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"nextButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAQAAABgMj2kAAAAlUlEQVR4AWOgAxgFPAwyDCIMLHC+AIMCEKMAjQc3S7oYTODKDP7/ZzBAVWLz8v+P/1eewZU5PPrP4ICqxOHW/1v/H///BlMWcgtTyfn/EHj7/+f/Nx6mzzmPqeTIfwTc8ihp7hFMJbv+Q+Ds56HdIIt2YSixWf9//f+JzwO6Yc5dj6FEY/It325kTy8He5pw0NEcjAIAWP9Vz4mR7dgAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"elapsedBackground" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAeCAYAAAAPSW++AAAAD0lEQVQoU2NgGAWjYKQAAALuAAGL6/H9AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"durationBackground" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAeCAYAAAAPSW++AAAAD0lEQVQoU2NgGAWjYKQAAALuAAGL6/H9AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"timeSliderCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAeCAYAAADpYKT6AAAAFElEQVR42mP4//8/AwwzjHIGhgMAcFgNAkNCQTAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"timeSliderCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAeCAYAAADpYKT6AAAAFElEQVR42mP4//8/AwwzjHIGhgMAcFgNAkNCQTAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"timeSliderRail" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAYAAADtlXTHAAAALklEQVQI12NgIBmIior/ZxIVFWNgAgI4wcjAxMgI4zIyMkJYYMUM////5yXJCgBxnwX/1bpOMAAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"timeSliderRailCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAnUlEQVR42t3NSwrCMBSF4TsQBHHaaklJKRTalKZJ+lAXoTPBDTlyUYprKo6PN4F2D3rgm/yQG/rfRdHuwp5smsNdCImiKKFUAx/OaSpR1xpNYwKK4/2rLBXa1s1CnIxxsLZbhGhtD+eGBSWJePt7fX9YUFXVVylzdN2IYTgGBGCVZfmDQWuDcTyB/ACsOdz8Kf7jQ/P8C7ZhW/rlfQGDz0pa/ncctQAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"timeSliderRailCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAn0lEQVR42t3MTwqCQBTH8bcIgmirJYoiCOowzh8ds0PULjpRqw5VdCZr/WueMJfwC5/NezOP1lcUHWbv5V0o1LYSVVUjTXP4xYM4KTWYEB2ybFlcSSmLoK4F4vj4JmN6BFpbHs5krUNgzMDDLw3DCQHfTZL0Q85NYH0/Is9LNI240Tie0XUaRVGyJ4AN+Rs//qKUuQPYEgdg7+2WF2voDzqVSl5A2koAAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"timeSliderBuffer" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAYAAADtlXTHAAAAKElEQVQI12NgIA/IyMj9Z2JhYWFgAgIGJkZGRhDBwMDEwMAI5TKQDwCHIAF/C8ws/gAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"timeSliderBufferCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAY0lEQVR42uXJyxGAIAxFUfrgI5CgzajdqlWxQffxaeiCzJyZ5MYMNtb6zTl/OhfuP2BZQ4h1mpLEmOWPCMd3pESSM2vE0YiKdBqJuDEXUT0yzydIp7GUZYMKAhr7Y4cLHjPGvMB5JcRMsOVwAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"timeSliderBufferCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAYElEQVQoz+WLyxGAIAwF6YM/CdqMlCtdcRHvMSIw9sCb2ctuIsQaU8pUpfQppT6mdC6QtZ6McYUPUpMhIHkP9EYOuUmASAOOV5OIkQYAWLvc6Mf3HuNOncKkIW8mT7HOHpUUJcPzmTX0AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"timeSliderProgress" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAQAAABHnLxMAAAAH0lEQVQI12NgIAT+/2e6x8D0k4HpOxj9AJM/CWpjAACWQgi68LWdTgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"timeSliderProgressCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAQAAABOdxw2AAAARUlEQVQYV2NkgANG+jP/+zJkMtgCmf99vi38KPQTJPpq6xsvqIKznxh4ocwjCOaebQyeUOZmX4YFDEJQw9b4QQ2DAfoyAVkTEmC7RwxJAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"timeSliderProgressCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAQAAABOdxw2AAAASklEQVQYV8XLIRKAMAxE0R4QbhrXoQqJxWJxCGZqaKs/m1yi+80TSUqzRmNjCd48jMoqXnhvEU+iTzyImrgT+UFG1exv1q2YY95+oTIxx/xENX8AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"timeSliderThumb" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAQAAACP8FaaAAABMElEQVR4AeWSv0rzYBjFfy1NlU5RKC3dCjqZDwRXEapOuuik+BfbNLdUeg86pHSrm1Z3G3w7VAdbB+sNFFKIZ1FCjTjL95wQOOd3IC/vE/6vSZEmQ5Z5KUtGLhWjshYLbHCIKx2wLmcp/cJzOFTb/vtoGk7D8bDtc4GjNP2J/+ENzFv0FBnpORpHA4OnVBWwKFANTD96jKkfBYYqRVFyVC5bCr/pqsWmKDZHd8Okwv2IY1HyuL0wqRCE1EUp/lR4mFAT1XNym/iJ7pBTCpBnp5l4yGaLXVFsVqh1zCzuGGoiNuQoUcG7NjPYU1oSxVKrzDZuw+++BtPe5Oal4eOypdQWRVfNoswa+5xTl87YkysrjW3DpsQyDquSw5KcjXB83TlFeYoU9LbltO7ff5i/Mh+pOuncDFLYKwAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"timeSliderCue" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAcUlEQVQ4y2NgGAWjYBTgBaKi4llAfASKs0jWbGNj96S1tf03CIPYJBkCsrW6uu53bm7+fxAGsUFiJBmQlpbxOzMz5z8Ig9hAsaMkecHIyORJUlLq78TElN8gNlAsm9RwyAbZCsSHgDhzNFmNglGAHwAAo/gvURVBmFAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"hdButtonOff" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAYAAADQBxWhAAABf0lEQVR42u2VvUoDQRSFA0awMIVCsv+z/1oE8yOE9MYmtb2P4AspSOyECFZqtU9gbZvK6CNoNZ6zMMuSQpxdEAJbHC737pz59mbmblpSyn9XA22gDXRLod2uMYfWkKwh+uc60LVtO9J1RWXBn4N1oNL3QxkEEcwuzYybOWMh07QJ4xqK/ryuBQ3DWEZRoowdx3FfhAgkI3NVp7IsO5xMpnPDsFae59NHvzaURgWlWpblPEOSkbmqQzfQK2DT8fj0HB0rrz40jlOqgA4Go1m/f3LJWIYC8uQ4nkSX94vF3S5qX8qrDU2SlCqgOMMrAK4Zy1B27nlCIj4i34G+lbcC9ChXuSNeFEbmpZe5RZdv+BU4ZjM8V159aJoe5yp3JIS/eaZcv7dcPhzghc6Qr3DZlLc6FOelRoTn9OvI4DKxw2rQXs/84KzRyLPhTSSQGzIyV2OBdYzIYz4rgKxjn88/Q4fD0QUNNT6BBL5zH50Pfhvahzo1RH+7+WtroA10O6E/bVCWtAEB8p4AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"hdButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAQAAAB6Dt0qAAABPUlEQVR4Ae2SsUrDUBiF/0EFfYK8Rl4g5BUUHGILRWghUHAQHJzaUcjSgB1EtCApliDoUApSKggZRFSUQsVAawspElz1OunxhwtZcm0Ht9LzQfLByVluLs145lkkjXQyyPwTg3uNv0tFKzuR+MAkIlF2eJyKPhBjRBMZYyBIp1SMEV6nMgIZlIoZQkJuIw7RiMll36XN5e31k0AkramYdiGhQjPsohlSgT13GTy8WXurR0mrmt5BQla+ZJ/mS2SxF8+GT7joLRRvvmWrnAaQULbi1R4rHmXZi/VhAO9laev6R7bKaQcSsv3+Lfw+2ey548B/t/Yz3pVs1dMWJORW4xaqfEzsfEwrO2te5ytpFVPjHJJntPnZ5jc708M9muwS1c/Ra8LHNGrKK6FlnENRxyQOPjcc0v5z/Wc68/wCXWlzVKUYIC4AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"ccButtonOff" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAYAAADQBxWhAAABzUlEQVR42u1Uu0oDQRQVTCMopMjmtZvdJPswKCQbC6tYCEqMBDUGrf2NCDF+gmXEyiZWiTb+gMTGxtrGwmh8IOKjUoLjueNGfCBk10rYC4eZOey5Z+7M3O1zww033Og5BCGQA9oAcw6uz9kxbYfDIpMk2TGg58Z2TJmixFg0GueIRBQWDIZ5BX5/kIli5AcfCIS6PIH0nLdlGoupLB7XmCxHyegymTSXa7UdoVBYHBVFqQEDMjozzfRCvd7w5fNzKfD74ElHevumEHKEQiJD4nmYz4JvwWirWt30YiO36fTYNKotgj8Hv1GprPvAP1obtm+qqjqBhC/l8toAkh18uqs7rK8ZY/0Yj8AT90o80LG09k01TQe48Bnw4O6asqzw5DjGXVR2Qt9iPLb4Dh07NnGvqhq0jkwNQvehTCYSI0tIeIWqtq1jfAA/bhiJFcxvcPzVUmlVwPwJVZLWvqmuD3MgGYlbGHPN5qE3m52JYU0PifhTGEwRn8lMaFjvYVNdrXNT7BjGX1tGkvgL/dYyxMv0vTNTahH02ocY1cBEpTbgeL8z41eeNKSn6+jZNJUyiyT4y28Q+gvK07MpWsEDDAJDzsH1nj433HDjX8YbqHFYmhICTLsAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"ccButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAQAAAB6Dt0qAAABWElEQVR4AWMY5mAUsDJIMBgy2DE44IR2QHkJoDoMINHQ/eTbl//44JNvDd1AzRjA8N63p/+f4IVP/9/7BrQZA9g9/H+fIHz4H+hsDOBw6z8EnvqZsJ6vznDCkke3/h/9Hr2ap9Z08oqnMFkGByxaL/+HwMiVafNufFl+hWvmiR+BC/IX3/yy4Bz/nJN/wbLYtZ75D4In/3GV7n56/v+1/zd/H/rGkHPgJYh94/fp/2B57FqP/AfBg/84SlY/O/L/8P+JLze/Z8je8PrI/0P/Jrza+Rcsj13r3v8guO9/+LKEhZu+9lzmn7zrl++c9BWbv7WfE5iy/S9YHrvWbf8hcP+P0FVsVSo9y57s+L/vm/9ytiqtvhVANlgWq1a79f8hcDPQR9eBAbIHyN7y/yyQfQnEhkCskWM4/9uq/4TgfKxJQiK6e/a3pf/xwZlfo4AJkZLkP6zBKAAAGMt/2TouFxQAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"muteButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAQAAACY0sZTAAABZ0lEQVR4AWMYjGAUMDEwMzCSpoUxju+kDQMXAW1AaRYGdiCGsFjchd/OWmELFMGrhd1a4UUTAy+QzXLSdKMhA1+Z/tuF0qIMTLjdz9tp+27ly/0M4kBbWGdqv1/gJcMgdLz6YAA2u9gYhBgkGGR2pH3ZfWf/1f0Mshdsk8UZBDYlXMthEJhqfbuVgQ9Tk9D//SD4dv/F/eeBkEHuaNjjegYBT/k78xiEOcWuLWIQxtQkcWI/MmSQYhC/shioUPjUAhB5cgFWTQf3I0MGaQ6JwyBNIofBmsAkpvN27UeGDPI349dXMghEKu2byyAsKLZ/IYMQzoBoTNm4e8v+LcCA2GBoKsQgcDFjcRqDwBr7dU0MfLiDnCfaavHKdaAgZ2ZgXWd4cZ6eJIPQ5YYZXgzseCNXQ35GPSRyt+lVaTLwTTA9NJdTmIGJ2GTEzMCSKPZifoklpj14jTDj6jJj4CI5nYOzxkCCUQAAMVp+znQAUSsAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"muteButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAQAAACY0sZTAAABfUlEQVR4AWMYjGAUsDJwMLCQpoXRTnZZIoM0AzMBZQzcDCIMXEAWC5Dk0tZ6fK0uFyiCBzAziCh5Xd7PoAJkc64I7QxhUPWLf/yQ3xjoTByAjUExrvzB+5f/GewYOBn4cgOf3ddxYNDftH1OCza7BBgMGBwYfCas/fjnzv+r/xn8NiXYGTJoTZ25ZymDTn7W8UMMapiaDP6Dwdv/F/+fB0KGgJXtF3YyaGp7XLrLYMhqce4hgyGmJocT/5EhgxuD7ZknDEYMJgcfMBgzGB8AkZiaDv5HhgzuLPa7nwBNN90N1gQmMZ236z8yZAjcN3H+JgZNM+8tQOdxWm17yGCAMyBSV6//s+X/lv8Mvv2BChoM2hsXd89n0GnKn7+PQRV3kCvYlsx6v+4/gy0DOwNvU8SJO1LWDAb791bUMgjji1xhMc/u3QzKoMid6hPtxaCakrbzDqsBAytxyYgZmFQ5bfXu3Q1Lx7QHrxHykgWRDFJAA0gCLAzsQC0DCUYBAC3AlmbNhvr6AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"unmuteButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAQAAACY0sZTAAAAiklEQVR4AWMYWWAUMDKwMLADMUla2K0VnjUx8BKvhYmBt83m3cp3+xnEiFHOxiDEIMEgsz3l6+5H++/sB7KJAEL/94Pgu/1X918GQuI0SZzcjwSJ1XRgPxIk1nnb9iNBoCYSAqI6ZdXOtfvXAjWREuQ84VZzVi4DBjmJkassN7GegZe8ZDQSwSgAAJ/LQok1XVtuAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"unmuteButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAQAAACY0sZTAAAAjUlEQVR4AWMYWWAUMDJwM4gwcJGihZlBRMnr0l4GZeK1sDEoxpQ+eP/uP4MVMcoFGAwYHBh8+ld/+vPo/53/QDYRwOA/GLz7f/X/ZSAkTpPDyf9IkFhNB/4jQWKdt+0/EgRqIiEgElct/7P2/1qgJlKCXMG6eNL7Zf8ZLEmLXGFhj5bdDMrkJaORCEYBAOZEUGMjl+JZAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"castButtonOff" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAQAAAC8EZeQAAABOElEQVQoz2NgYGDgYJBgUMALJYBqgEDiP0EAVAoECv//vyIAgaZCFL74z2CBw1qLFyBZsELp//+f/meQY8AOFMCyYIX8J9ovnmIQwa3wIVghO4MogzzMX9gV3gMrFPl0++aWhUmc0gycDEzYFd4CKxT9/uLe/2f/H1zq9GPgZ2DGpvAaWCEfg1Zc9PptF//e+r40h0EAw1SgwksQE7/cOzFfz6Ep/9Tncz8mRDJwYyo8B7X61ZX/d16VRTVknP198JGKEtCtQgyyiHD8//80WCGvoO6M6Ud/H3vj7HZo5Yn/c9oZJJ9uRo3A42CFwq8Pergv6jv6f/l6d697vzddZlDcmHrr/xEUCIprsf//jx1j07z7aN9HLu2Xlw/+lpVl4GWQwkw9HAxiwFjhBQa7GDAERIAk1qAHAOge4gtynPL2AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"castButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAABy0lEQVQ4y2NggAAOIJYAYgUKsATUHDCQENnz/z+lGGooGCiABESXPaAIQ12KbOB9kKAFiV61AOmD6oUbKA129tJ7IEE5BtKAApJeuIH8ApNPtAvPOHsKyBYhy8Ald+EGsgOxKBDLo8cUSQYuug03UER406fbggtubuEtX5jEyM4pDRTjBGImUgwUXngLbqCo8LbvL4SX3v8vvPrFf6GlDy9xp3b6gYIBiJmJNnDBDbiBfECsxeGeEC3Qunmb8Lyrf4UX3/nOW7U0ByguQIRLIQbOv4bkwi1f7gEjZT6Lkr4Dd1JLvvDMC5+F51z+wZM9MRIoz02UgXOvoHj5FSgMgN5+xRleFsUd35ghPPfyb6EpJx4xS6sqQcNUCIhlsaVDsIFzLsEN5GXkFdTlK503XXjmud9CM869YTV0dhOYeGSl8OyL//kqFrUD1UgKrXy6GV+2E551AW6gsNDa1wfZTD3c+aqW9AnPOv9foGn9ejYTdy/hFY9/C3bvvgxUo8jXtDFVGJi9gJbixLC8LAayQWjGmWMMLGyawssePhKeeuIjIwe3tvDaV5eFZ5z+zSwmB/IqLxBLEVPagAgxaA7hhSZyMWjsi0DZRCd2ANcuONhZFnJlAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"fullscreenButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAQAAACC7ibdAAAA5ElEQVR4Ae3KsUrzYBhH8RPIFAJ5O3/ig5COgVyHW7N09x7aXSrESafuHeLi0A6iGEX+Y3edLMqnpe7egfbFMZCMXfo762GH9gIijIx8W0rcMQ9tU/3oL9KOGXdYLOuNfOS0CrGLyVr/fZ1zMht9a6VXqV6JjFa9efmiZ43PDoqnCqMh8BGS4IjpT8vTMYY7NiIaooHhsNnovqRPTA9HSOCjwT6ro+Jy8qV3PZT0aJUt9VavdadbnY9IaJUv9KiF5jqZYIQd87V80/rfAEdAq/RKvht9VEPrmmNS8m0ZRkTAzuz9AlNJVl+tEWchAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"fullscreenButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAQAAACC7ibdAAAA5klEQVR4Ae3MIUzDUACE4b8VlU1FaQWEBPlQna+oxqHm0dTicShQcyWZwSBWEgohEIKcB8UKAZbhcZXHmsw1eZUz+357OdZow8HHkJItSwiwcodmUWuFpO852s2nzUJtZFh5mPNyrq+23nE4Lv4007templIsYon1ZtedXKzkz/XGDocXBw8QiICBqPq9JJ9ogODT4d/aIgw4+KhYkBAzBbe6qLD/NR7+UX5q089VsRYpVN9NHPd605nBSFWWaknlZroqMTg9Yyv1TZqto+JcLBKrtR2q+96aHCxCkjIlqUYfBzWZuMfAHJlDLF+xFEAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"normalscreenButton" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAQAAACC7ibdAAAA50lEQVR4Ae3KsU6DUBhA4QMNAtsNFcJLyKBx8mXYmNxkculDuJG4OOOmcbr/QNS1xKaJqxJjTJpUk84KuHW4d+nY76yHvV1zxlx8AiZYeJeHBKgmX14wte1qXZ1l98VG/8iyJMQo+ZJVvdGddPohx8co7eRThvWmQOFa5ncZWtSnRwQ4GEVvMvQh62oW2+YDItK+BIW3PTt4KJJxiPrVyJnF39Wv/EdkmQlOsqd6IUOkGLmou+JVv0ifdfabfKVbaXVTt0KCUfhczmWur4rj7LFCYTRhelte5yiC8xgPbHuIj4sztrdbfxJjV3K8mZ7yAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"normalscreenButtonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAQAAACC7ibdAAAA7ElEQVR4Ae3Sr07DUBzF8e+daKaaiaYNAoH8uc43pK+AmsHimETxDAQBQZVkCQhAUFMBewkUCG4W/ib4haTykCYzmFszuc+xX3lYtw3HAEdEQsqQHvGekWKz6qFh3Jfbl9+Znta/WmrekBFU/GjRLvWuN11UJASVXh/yetVxjRH1xM/qNm+3D0lxBOVP6vaiTz8xBgSNyCkpKTBiHP84YoyiC8gZETSY2LfXCjlBjnRretk26kZJUISd1I+679YbJ7NqoTvd6Ly9FQVB2ay51pX262x65jGChoyPmoMKI901YujLMxKi1TnXa+MPEjlkhvYbWGMAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAeCAYAAADpYKT6AAAAFElEQVR42mP4//8/AwwzjHIGhgMAcFgNAkNCQTAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAeCAYAAADpYKT6AAAAFElEQVR42mP4//8/AwwzjHIGhgMAcFgNAkNCQTAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeRail" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAeCAYAAABaKIzgAAAASElEQVRYCe3BsQ3AMAwDQRIW4Cqlkf031AZKVkg6An8nAQCAH3zOPQpQe28lqJcS1FpLCcpWhJKsBGVbCaq7lcAzcwkAAHz0AE0SB2llBfTtAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"volumeRailCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAeCAYAAAALvL+DAAAAeElEQVR42tWKQQqDMBBFB3cFt9oQQ0wniW51b5f2ti30ZLX1AN+ZQA/hhwfz/zw6eZrmmoWn8NUyCh9jLJzzoLY1L2sd+v6GEBikmh7MCTHmYvyYI1LKBeo69/Y+SBkKtCz3SaztPxKAal0fs5ry2Emjo3ARajpNDtqHL/b2HUUVAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"volumeRailCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAeCAYAAAALvL+DAAAAeUlEQVQYV9WKOw7CMBBEV3RItAmWYzlmbUMLfSjDbUHiZASFfpj1LTLSW+18RLarrjt+yZPUFoQQ4ZwHgw+5SEqKcTzB+4C+dy/JuUK1wAouVimlwlDNtvgxOMOIMWEYwrsFZtgu03S/Cp/Vmnl+3ADshOdA9s1sSn8goC/6ib5oHgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeProgress" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAeCAQAAADwIURrAAAALElEQVRIx2NgGAWjYBSMRMD4/z/1DWW5TQOXsnwdMoZ+GyouHQWjYBSMTAAAnO8GxIQ7mhMAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeProgressCapLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAeCAQAAAChtXcIAAAANUlEQVQY02NkgAJGOjH+9zEkAxm/JrzJ/wYSufTxLx9Y6shHBghj10SGPKji9RMYkhjp6EIAcaIN1SJ2FnYAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeProgressCapRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAeCAQAAAChtXcIAAAANklEQVQYV2NgoCP4//F/H5hx5/+z/78mABnn/5//f+kzkHHkPxCCGLv+A+FEIGP9p/UgFXQFAHkZGwN2fDIsAAAAAElFTkSuQmCC"/\x3e\x3c/elements\x3e\x3c/component\x3e\x3ccomponent name\x3d"display"\x3e\x3csettings\x3e\x3csetting name\x3d"bufferrotation" value\x3d"90"/\x3e\x3csetting name\x3d"bufferinterval" value\x3d"125"/\x3e\x3csetting name\x3d"fontcase" value\x3d"normal"/\x3e\x3csetting name\x3d"fontcolor" value\x3d"0xffffff"/\x3e\x3csetting name\x3d"fontsize" value\x3d"11"/\x3e\x3csetting name\x3d"fontweight" value\x3d"normal"/\x3e\x3c/settings\x3e\x3celements\x3e\x3celement name\x3d"background" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAA0CAYAAACQGfi1AAAAYklEQVR4Ae2VwQ2AMAwD/cgKVRbJuAyH+mOBfMMQyBKCuwWsxoaLtfKQkaiqtAZ0t5yEzMSMOUCa15+IAGZqgO+AFTFTSmZFnyyZv+kfjEYH+ABlIhz7Cx4n4GROtPd5ycgNe0AqrojABCoAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"backgroundOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAA0CAYAAACQGfi1AAAAY0lEQVR4Ae2VsQ2AQAwDXWSFF91Pkf1rxkAZIm0YAllCcF7Aiu3/i7WOU0ZFZm6rQXfLaiCzYkbuC+b1EWHATM3iHbAiZkrJrIiSP/ObQjQ6gAcg8w/AsV/w2AEmE1HVVTLqBmJaKtrlUvCnAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAA0CAYAAACHO2h8AAAA4UlEQVR4Ae2XwUoDMRRFT17GTscIMoWOqwF1WUSFIv6Autf/X5TuxG6FBkOeHfAHpk+GLnI+4HBzLzyI44/l8uoBeAVugJqRuIMA4L1t24+u685DCGci4hhJBdwPkr7vL3POLsaIqnKM6G2xaJuUksPAILquqtlMFayiuYhzYDMJIygi+2qonloi0CkTldXK/NOXXVYrZRs6UgyUjsrxL6d28sP2b4n0xJ62z1nVHbCutolx/4MRH8LFt6o+Nc28tqTyq9Xd5273RUrpVsSL915gvNCt188MbLebR+Dl2K/oL+WmRveI4jXNAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capLeftOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAA0CAYAAACHO2h8AAAA5ElEQVR4Ae2XMU7DQBBF346sIDAUDoqprNBCm4Im3IPcAE7EEbgId6BF6akQjheZGTYSF7DXQi7mSdM+zf4vjbSBP1arqy2wA26BUwZSJAHAY1VVT3VdX5RluZDEYBGwPUqaprlUVYkxYmaMEe2Wy+q873shgwK4KYrFiRnkis5EgkCeScjHRQNaw2xuG4HNYiNvzeufPmxvzcPOz8jIwDPy4++n9t8P22Qb2cye1qqahhAkt7W3GLvvKep/+Uyo/igYY0fW6+vXtv16/kgcDl2nagkYOmGzuePIfv9+DzyM/Yr+AujSfWZZzzLnAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAA0CAYAAACHO2h8AAAA20lEQVR4Ae2XQUrEQBBFX4e29QJDVgFv4Cb7wSt4Ps8wLtw5B3A97mfmAFlkkbaZMpAynkBiBRGpd4Ci6j/4UGGzqR9ZjgBn4AV4A4ht29YsZJomzTnXXdfd9X2/A55iKYWlhJmU0nXTNAl4mIedwnZ7/4wBkcvH8Xh6jaqYiDFdAbcRFAtVFQJwU7ESPuh7zPrX3wj0T2zk1lz/+mG7NQ/bnpFixDPy8veq/dViW20j/W+drTOAmK2JXEbgbDrt628bhqEA+x+dpjMiMuY8lFLed8DB+orugQPAJ8i7bEsKl1PuAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capRightOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAA0CAYAAACHO2h8AAAA2UlEQVR4Ae3XwUkEMRTG8X8eIaLgwYXF0xRgKYsVWIIVrR1sI3uwANkSvMxhDhOzRoZ5pgOZSZiDvF8Bjy/vgwdx+/3jO8tdgQtwAs4A7nB4/mShuYgx5r7v4zAMR+DNp5RYyjknIYTbrutugNcy7ENYQVUpoZimSXa7h3vgxatSxfsQgCcPdZNEnAB3QiM26G/V9bdPBLp9ImvN6t9y2daaLbtiR0ol25Edfzu1mx62Zon0v91sVZ2Bq1Ap5+8f4FL1tLkYC+C06mla5CLGcUzp6wicm31FfwHzmG90m7lXIAAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"bufferIcon" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAABGElEQVR4Ae3Rr0pEQRSA8Zl1b1uDQTAt4j8QES1qURZvEf8lfYJVsfoAisYFq9mgyfUFVptgMtk3CAaD6DN8HoYbFhk9w9x0Yc6XDsv8LrNj0vgnTZo05LzzyR7m/wxafQC+sDHQENkv6DsG2uFV2i62nDc+2C82SybVwqAX+tIzxlOdzBUEPTnosTy0wgM9lryQpS7pVwutetAiN3RZU481mJYaf0PX9KR7rALNMCtNaVC3PLTALXesYpSGlatFVDFonnNOmfQeGKHFOqNhUIcr6cwLtdiVNkIgy6WDLrxQ7qBNrApJy0J1mCu2CY6k4qKMCbJFM/TPHvzeASfS8cBvtbhXazvosPzzN2lL4/GQXoISlKAqQz+eXnU2Tp6C2QAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"bufferIconOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAABGElEQVR4Ae3Rr0pEQRSA8Zl1b1uDQTAt4j8QES1qURZvEf8lfYJVsfoAisYFq9mgyfUFVptgMtk3CAaD6DN8HoYbFhk9w9x0Yc6XDsv8LrNj0vgnTZo05LzzyR7m/wxafQC+sDHQENkv6DsG2uFV2i62nDc+2C82SybVwqAX+tIzxlOdzBUEPTnosTy0wgM9lryQpS7pVwutetAiN3RZU481mJYaf0PX9KR7rALNMCtNaVC3PLTALXesYpSGlatFVDFonnNOmfQeGKHFOqNhUIcr6cwLtdiVNkIgy6WDLrxQ7qBNrApJy0J1mCu2CY6k4qKMCbJFM/TPHvzeASfS8cBvtbhXazvosPzzN2lL4/GQXoISlKAqQz+eXnU2Tp6C2QAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"errorIcon" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAAB3ElEQVR42u2Tv0sCYRzGv5WFJIVgkEVLSy1ObWGDUE0OgdRYtBZC/QENFv0DDTW0FEYJGkgEBUZCEFxYlJpnEMSpUxpBNAkiT++rlb+uvNOpuOcz3Pt+j3vgeN8PkRYtWv5Z2qmb0d58kXl7ZXuFzM3W6E3jybfUW+8E6ZupaaXB3ZNnPGPnlAbZruF02ebTuRRSSOds89TVaE0bWYJiEhIjiaBIFjZpKKaF1TSePknDuUamRmo6dKPRzCNKRDO6UepQW9NCAxseCXHGlHvKzZ8SNjw0wN6oSqfFIWXvwSE72YsrKWtxkEHdsQ/5hRjuCpCNbMVVDEdXNKzmGhhnlqT8DYrwoq+1lJ9ZIqNyu0aERAhXn/Cir3UIQoJGlJpndm2KuPyGF5V2IlxbyszTmybi7xcowYvK9/H3/sn65hXsEnBeBi8q3wuKzGN2PeQCKIcff+Xkoa55zK4zMYCTCubcs+7KSQBn3DzdL3Ytrt3iuIpXRvXsFs516vnFruuMH8oI/Whewa4gDmsY8435aqfBH81jdoWzXtTi8Dm8cvOwrHkFu/zwyJDBi+yc/aCMecyuUH4f6rjOTy9Xm9cXiRxgTyX7iESor7LIQENk5XdYFVb2lYG0aNHyF/MB+x5LQiE6gt8AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"errorIconOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAAB3ElEQVR42u2Tv0sCYRzGv5WFJIVgkEVLSy1ObWGDUE0OgdRYtBZC/QENFv0DDTW0FEYJGkgEBUZCEFxYlJpnEMSpUxpBNAkiT++rlb+uvNOpuOcz3Pt+j3vgeN8PkRYtWv5Z2qmb0d58kXl7ZXuFzM3W6E3jybfUW+8E6ZupaaXB3ZNnPGPnlAbZruF02ebTuRRSSOds89TVaE0bWYJiEhIjiaBIFjZpKKaF1TSePknDuUamRmo6dKPRzCNKRDO6UepQW9NCAxseCXHGlHvKzZ8SNjw0wN6oSqfFIWXvwSE72YsrKWtxkEHdsQ/5hRjuCpCNbMVVDEdXNKzmGhhnlqT8DYrwoq+1lJ9ZIqNyu0aERAhXn/Cir3UIQoJGlJpndm2KuPyGF5V2IlxbyszTmybi7xcowYvK9/H3/sn65hXsEnBeBi8q3wuKzGN2PeQCKIcff+Xkoa55zK4zMYCTCubcs+7KSQBn3DzdL3Ytrt3iuIpXRvXsFs516vnFruuMH8oI/Whewa4gDmsY8435aqfBH81jdoWzXtTi8Dm8cvOwrHkFu/zwyJDBi+yc/aCMecyuUH4f6rjOTy9Xm9cXiRxgTyX7iESor7LIQENk5XdYFVb2lYG0aNHyF/MB+x5LQiE6gt8AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"playIcon" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAABHUlEQVR4Ae2Vu0oDQRRAB2xSWVmmtQncLzFREUUsnW/wJ0SCWgQV8TUQBBEsjlgIFoJFCsFCCT5QgwZFtPGtncUWIcTZnd2pAnNOf2Bn5t5VgUCge8mpPtWrevxD+cbi1KTq948VXvjlbMM/Jk2aPPPjHZM7Ip88Y3JLy0e+M8fkmnYfMsbkkk7v+Uodkzr/2+AzVUxOsXvDh3NMToj3inenmByT7AVviTGp4WadV85XK0WVs4SOcHd3rVyyhg5xc91M6NhPOyDZFTOuEw97n3iXzZh2uv497C6YUe38ILFQMSM61Yjs0Om8Gdaph3abdmfNkM60RrZoWTaDOvNi2yRyxpQsETcKVapMm6JHJCI/tzTgEfH4QXYxgUDgD+1pwmmFlV3oAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"playIconOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAABHklEQVR4Ae2VvUpDQRBGt7BMaekD5AEsU0zvL6KI76CdL6FDUItgIYJNEERIoVgIFoKFhWChBBNRYwwZRBv/tfostgghuXf37lSBPac/cHd35ppIJDK45MyIGTZDRk2+UVteNaP6WOEVf7hu62PUQgsv+FXHqAnrszJGD+go+AmO0R26bQfGqI5en/CdOUZV9LeBr0wxukKy9/j0jtEl0r3Fh1eMLuC2hndnjM7hZxVvuHksLZpcQugM/h42i0uJoVP4uSMLnPppJ3C7LfPsPOxjpLslc+x1/UdIdlNm2ftBHqC/JZnhTCNSQa8bMs2Zh3Yf3a7JFAetkT10LMokBy+2XVhZJgIjlkIZZazIuCJiya/Xx9QR/Q8yEokMFv9/Ax7UXjl24wAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"replayIcon" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAADOElEQVR4Ae2VUWhbVRjH/0nqdk0m0eTGITVZNsmiZCLTlooNPoWlbk27lzmGSIeyh7YgFSYaGO2yDZk4GMi65kG9d6kkbfCuyf1bqZmmlsYxCK51KwxkrpM4qBRla18cIngvw0qgN7ea1/z+L4fDn4/vO+c730G9NGjQQIALj8CKumn+afjIQWyDHRbUxTO/8w/Ojux9Bc0Q6gn27B3eoRZM5Zm2l7EVm/5bMAsEiPAjiFiFun7hXa5MjJ7Y1gI3mjYaxA5vZzSdmJeWlfvqz/xHFd7jr5+fP+rYgU0wpQlibE8peV+9yyVWeJuLVapwleU4tsCEh9B8sn8lt8SbBprJvHUEXrOMmuCVj61o9h81fXEhEY/GHAf09QOVlaF3N4fgNDsjCzxnBn7jDU3T2TfexE64IeC5G9Q1lz/7/vY2iBs5aHtndCm/wAXmUtvb8ShsD/pogdf46bm2CJ7Qr16THY87t0Iwzsf77ch1/sBCdmcYjrVuaZ4813UAPjwMC3SXsztS+ujqWTxp1E9CV8ct9Sq/56EeOGGpemtb1t6a9bXdq7nbvKV2dRjlJKaOl1lm+gICsME47x1jsu5LHYeIdfEXpCu8wsE43KiFezCu+woS/FiX4KxSYon7YhBQC2FfTPfNKghiXUIldYYzdLfChlpYxRbd952KkEGgr9Uii3z6JbNAnhbd941hoOBF5RIv8WC3SWmbuzt130XD0vyfSFOc4gfvwIVauD48qvs+Njxs8URikpOckmtevw2Br2Tdd9Lw+oVIR15VeZl91Q1Z3UXOvp7LVJlXI4YNaYHvdHKCE7ye3fXvE6l2OHaFr43rntNJ+IxHrj0czeQVFjifCrbDCRuqi3IG2+dTBSrM5MNR2GuOkcMD48xymotZrcAAXBBghQ0C3Aj09Sxmp5nlOA8PwAOLyWDrPZbhGL/kMufkkff2xx5rferFQ/vPx+fkZW13jBn2D8KrOc1H7av9ci7NNIu8yVX+xT95T1sVqe/J+dffhldzYUPD/4U9Q8lR9TNWa5RDyeej8BhkY/Qd7Y72Jk5Jw4qkSuqwckrqTbTuhc/44zb/IEOagtpK/N8fdoMGDf4G6kd7103/csoAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"replayIconOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA0CAQAAABI31KIAAADTElEQVR4Ae2VX2xTZRjGH1iBzDMrU6lxLdOFhLJ/CepwTWCJiUSTDTdilikxJmAo2GlJ9I7EsCgkw6jRG5ALtZNJy7QDiwxK0dZllSypssqatCHIMKdzM4uEnUUrtj2P57uAULNzOtltf8/Nl3OevHnf73u/70WJxVKiRAWqcD/KsGjsvyScb6EBZizFoth4nX9zJNn6KtZCwhLcNU9NcpJasPw3o80vogbl/y/YUkiwoRHNcMsUSvMGlX/6zz3SCiuWLzSIGXVbnN5gXJ7566b6K29J5ix///PwMWk9ylGUZVj93M5o6qZ6g9OUeY0TBZI5x9ggKlGEFbDvP6Jkp3lFR8PX93yEOpQXy6a2L6Bo9suaTv/2tv/ZPdLey7ylWKZnYEULLFhWbG+q3/f8waSmiPLKB3gSVkh4OkmhsdyHkZoO2Bay0eYtzulcggl+PVXTiYdggmBjgpf42XjzDqwRRy+OAo/eVwNJP5+675Pj/JkhZW0XVt7uFvvQePte1ONezSFclo4d0fjFH7FOr9Ol9l1X1Yv8idt6Ybmj6SRUofL2XSt76Zm57DVeVdt36eVkO3o2xhi9k9gAE/TzXn88LXxHz8KGeWkMyaMc5T4/rDDCus8vfCEZjZgXx0gmyijb3JBghNTmFr6RDByYl5ZofpjDfKANJhhR9mCr8P2QR4tOoG/zYYa57vligVa1Ct93uoEcJzLneZ4vvIEKGHFPx+vCd0K3tMZP5SCDfNeLKhjx8HvHhO8T3c22vRMc4hCDaTQZFGdC07m08O3XPX5p8+6AeooX2F3QkAUsgaW79wJPMaBu3g1Jr9XqD6ZO8iTHlYY7rkhBmJUNXZdmhedgCvX6w8C8yenLDTLE+JS9ExaY/lOUxd4ZnwpxkL7cJifMhs/Ids8Av2SEE4pWYBOqIKEMJlTAiqbu3gklov0d4HYPqo2H03LUugI+HucZznAs/fFXW92VbWu2bnvzsH8sPcMz2h8fXzuNWs1Z/KntOtKX9dLLMK9wjnlmOautwhTf+nIvf446zYUFPf5P7OxJ9atfsFD97Ek97kS1TjZ64+gxpyt4QD6U8age9VDmgOwKbnChXn9wFxuQDrRocmir1ai4y+lfokSJfwEhAcqxd5L4JgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3c/elements\x3e\x3c/component\x3e\x3ccomponent name\x3d"dock"\x3e\x3csettings\x3e\x3csetting name\x3d"iconalpha" value\x3d"1"/\x3e\x3csetting name\x3d"iconalphaactive" value\x3d"1"/\x3e\x3csetting name\x3d"iconalphaover" value\x3d"1"/\x3e\x3c/settings\x3e\x3celements\x3e\x3celement name\x3d"button" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAgCAYAAABpRpp6AAAAxklEQVR4Ae2YsQ3CMBBF7+yIximQSERSMgYNI1AxJgswAaMkLREpEnQ2Z6Chooqwpf+k65+evhtzXW8LIjrp7fUcpcmod9U7v2Sbpjm2bVtaa5kSRERC13V13/ePIpatqk05zzOHEChFWImOKnyIwk7EMyXMJyTrOUOZAeGlKd4byUtYCZjEN9gwCuPRYRKYBCbx18JLJ0bh3IQJk/gFHh0Ko3BWwqOID8YYpoTx3ofoap0r18y0WymspCo7DLf7NE2X7L5bnyz7UgI6sO7WAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"buttonOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAgCAYAAABpRpp6AAAAzklEQVR4Ae2YMU7FMBAFx04osQvyRQIX4nfcgRZOAxW3oMqRkhKbBkWyjVfiCiD7a0dKPxq9dZHxdLq9Al6AB8DRJl/ACryOwPM8z0/LsvhhGCwNklLK27bd7fv+LcLnabrxx3HYUgotYoyx4liFH0XYpZQtDfMb0orrSGeo8L8Il9Jd4dL5JFRYN6xHp5PQSegkLuwd/uPEWrg3YXQSenRaWAtfVOGYUs62QsPkiriK8Brj571z3ot0q7IxhgB8iPBbCMHU7wxcN/679f0HQzRYj4Eg/3AAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"buttonActive" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAgCAYAAABpRpp6AAAAwUlEQVR4Ae2YsQ3CMBBFD8e0CVESUcFMpGMKapgAKvagymKWiF3RxMe/IUDn6J70I5dPX98u4odhvyWiG3JCdqSTiEzI3eNz7fv+0nVdW1WVI4VkEEI4IB8RHjXLCg6II4TPXmbgADOTZhwQV0+F4ekPmDBzcQ2zTcKEC9+wXTqbhE3CJrGyd5jpp1jDxb0SNgm7dNawNbyqhudlydkBUkwG4irCU0rzsa6bVqt0BinFN44vEX7EGDfIiHOj/Hfr8wvCZ0/Xf6TpeQAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"divider" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAgCAYAAAA1zNleAAAAD0lEQVQoU2NgGAWjADcAAAIgAAEeEYatAAAAAElFTkSuQmCC"/\x3e\x3c/elements\x3e\x3c/component\x3e\x3ccomponent name\x3d"playlist"\x3e\x3csettings\x3e\x3csetting name\x3d"backgroundcolor" value\x3d"0x3c3c3e"/\x3e\x3csetting name\x3d"fontcolor" value\x3d"0x848489"/\x3e\x3csetting name\x3d"fontsize" value\x3d"11"/\x3e\x3csetting name\x3d"fontweight" value\x3d"normal"/\x3e\x3csetting name\x3d"activecolor" value\x3d"0xb2b2b6"/\x3e\x3csetting name\x3d"overcolor" value\x3d"0xb2b2b6"/\x3e\x3csetting name\x3d"titlecolor" value\x3d"0xb9b9be"/\x3e\x3csetting name\x3d"titlesize" value\x3d"12"/\x3e\x3csetting name\x3d"titleweight" value\x3d"bold"/\x3e\x3csetting name\x3d"titleactivecolor" value\x3d"0xececf4"/\x3e\x3csetting name\x3d"titleovercolor" value\x3d"0xececf4"/\x3e\x3c/settings\x3e\x3celements\x3e\x3celement name\x3d"item" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABMAQMAAAASt2oTAAAAA1BMVEU8PD44mUV6AAAAFklEQVR4AWMYMmAUjIJRMApGwSgYBQAHuAABIqNCjAAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"itemActive" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABMAQMAAAASt2oTAAAAA1BMVEUvLzHXqQRQAAAAFklEQVR4AWMYMmAUjIJRMApGwSgYBQAHuAABIqNCjAAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"itemImage" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA2CAMAAAAPkWzgAAAAk1BMVEU0NDcVFRcWFhgXFxknJyozMzYyMjUlJSgrKy4jIyYZGRssLC8YGBobGx0kJCcuLjAiIiQaGhwjIyUpKSwkJCYaGh0nJykiIiUgICIwMDMqKi0cHB8lJScdHSAtLTAuLjEdHR8VFRgxMTQvLzIvLzEoKCsZGRwqKiwbGx4gICMoKCofHyImJigmJikhISMeHiAhISRWJqoOAAAA/klEQVR4Ae3VNYLDMBQG4X8kme2QwwzLfP/TbeO0qfQ6zQW+coRxQqYl4HEJSEACEvA8NQamRkCoF40kNUxMgC3gc0lrtiZAB1BKuSOPDIzcXroB0EtL3hQXuIHLNboDC+aRgRnQ6GUAjtBEBmrgdcwA/OCyuMATraOvBiB3HBQTOJ8KZp5QwwXoA3xFBdrVjpPnHVgBfQfjqMChZSoAugDMwCsqUMFeAHwEwMFnXKDkshGAz5YAEOIC2fpbAqhUAMDG4AcO3HUAahkAHYykOQATC6Bsf7M7UNotswLwmR2wAviTHVAAHA2BMXCWIaDC7642wIMSkIAEJCABxv0D1B4Kmtm5dvAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"divider" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAABCAIAAAAkUWeUAAAAEUlEQVR42mPQ1zccRaOIzggAmuR1T+nadMkAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"sliderRail" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAABCAYAAADErm6rAAAAHklEQVQI12NgIABERcX/Kymp/FdWVkXBIDGQHCH9AAmVCvfMHD66AAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"sliderCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAKCAYAAACuaZ5oAAAAEUlEQVQoU2NgGAWjYBQMfQAAA8oAAZphnjsAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"sliderCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAKCAYAAACuaZ5oAAAAEUlEQVQoU2NgGAWjYBQMfQAAA8oAAZphnjsAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"sliderRailCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAECAYAAACUY/8YAAAAX0lEQVR42q2P4QqAIAyEewktLUy3pKevVwvpAdZO+q9Qgw+OO25jQ88YM2blUAp4dW71epfvyuXcLCGsFWh4yD4fsHY6vV8kRpKUGFQND9kfHxQsJNqEOYOq4Wl2t/oPXdoiX8vd60IAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"sliderRailCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAECAYAAACUY/8YAAAAXElEQVQY02NgIADExCQ+KSmp/FdWVkXBIDGg3BcGSoG0tMxGWVl5DAtAYiA5ii2wsbE1ALr0A8hAkKtBGMQGiYHkKLbg////TK6uboYg1wIN/QzCIDZIDCRHSD8AB2YrZ5n2CLAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"sliderThumb" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAABCAAAAADhxTF3AAAAAnRSTlMA/1uRIrUAAAAUSURBVHjaY/oPA49unT+yaz2cCwAcKhapymVMMwAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"sliderThumbCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAECAQAAAA+ajeTAAAAMElEQVQI12NgwACPPt76f/7/kf+7/q//yEAMeNQH19DHQBy41Xf+/ZH3u4hVjh8AAJAYGojU8tLHAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"sliderThumbCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAECAQAAAA+ajeTAAAANUlEQVQI12NgoAbY2rf+49KPs/uIVH54wrH/h/7v+L/y//QJRGm4/PHa/7NALdv+L/6MKQsAZV8ZczFGWjAAAAAASUVORK5CYII\x3d"/\x3e\x3c/elements\x3e\x3c/component\x3e\x3ccomponent name\x3d"tooltip"\x3e\x3csettings\x3e\x3csetting name\x3d"fontcase" value\x3d"normal"/\x3e\x3csetting name\x3d"fontcolor" value\x3d"0xacacac"/\x3e\x3csetting name\x3d"fontsize" value\x3d"11"/\x3e\x3csetting name\x3d"fontweight" value\x3d"normal"/\x3e\x3csetting name\x3d"activecolor" value\x3d"0xffffff"/\x3e\x3csetting name\x3d"overcolor" value\x3d"0xffffff"/\x3e\x3c/settings\x3e\x3celements\x3e\x3celement name\x3d"background" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAACCAYAAABsfz2XAAAAEUlEQVR4AWOwtnV8RgomWQMAWvcm6W7AcF8AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"arrow" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAADCAYAAACnI+4yAAAAEklEQVR42mP4//8/AymYgeYaABssa5WUTzsyAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAECAYAAAC6Jt6KAAAAHUlEQVR42mMUFRU/wUACYHR1935GkgZrW0faagAAqHQGCWgiU9QAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"capBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAECAYAAAC6Jt6KAAAAGElEQVR42mOwtnV8RgpmoL0GUVHxE6RgAO7IRsl4Cw8cAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"capLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAACCAYAAACUn8ZgAAAAFklEQVR42mMQFRU/YW3r+AwbZsAnCQBUPRWHq8l/fAAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"capRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAACCAYAAACUn8ZgAAAAFklEQVR42mOwtnV8hg2LioqfYMAnCQBwXRWHw2Rr1wAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"capTopLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAPklEQVR4XmMQFRVnBeIiIN4FxCeQMQOQU6ijq3/VycXjiau79zNkDJLcZWvv9MTGzumZta0jCgZJnkAXhPEBnhkmTDF7/FAAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"capTopRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAPklEQVR42mMQFRU/gYZ3A3ERELMyuLp7P0PGTi4eT3R09a8CJbMYrG0dnyFjGzunZ7b2Tk+AkrswJGEYZAUA8XwmRnLnEVMAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"capBottomLeft" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAMUlEQVR4AWMQFRU/YW3r+AwbBknusrSye4JLslBdQ/uqpbX9E2ySrEBcBMS7QVYgYwAWViWcql/T2AAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"capBottomRight" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAANUlEQVR42mOwtnV8hg2LioqfYMAmYWll9wQouQtD0tLa/om6hvZVoGQ2A0g7Gt4NxEVAzAoAZzolltlSH50AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"menuOption" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAYAAADkIz3lAAAAcklEQVQoz2NgGLFAVFRcDoh3AfFnKC2HVaGYmMQeSUnp/7Kycv9BNJB/AJeJn+XlFf8rKir/V1BQ+g/k/8SqEGjKPhkZuf/Kyqr/QTSQfwirQm9vX3WQYqCVX0G0p6e3BlaF////ZwJiLiDmgdJMwzr2ANEWKw6VGUzBAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"menuOptionOver" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAYAAADkIz3lAAAAcklEQVQoz2NgGLFAVFRcDoh3AfFnKC2HVaGYmMQeSUnp/7Kycv9BNJB/AJeJn+XlFf8rKir/V1BQ+g/k/8SqEGjKPhkZuf/Kyqr/QTSQfwirQm9vX3WQYqCVX0G0p6e3BlaF////ZwJiLiDmgdJMwzr2ANEWKw6VGUzBAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"menuOptionActive" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAQAAABOKvVuAAAAdElEQVR4AWOgJ5BhcGQIBWIZhJCsW+6jS7+/P7rklssgBxN0un/59f+n/1//f3SVwQUmGPrs+6P/IPj8N0M4TNBl/+Vr/0Hw4FUGN5igkm3ursvnf+y6bJ/LoAwTZGZQY/BgCANiNSCbASHMwcANxMy09DcAxqMsxkMxUYIAAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAFCAYAAAB1j90SAAAAE0lEQVR42mP4//8/AzmYYQRoBADgm9EvDrkmuwAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAFCAYAAAB1j90SAAAAE0lEQVR42mP4//8/AzmYYQRoBADgm9EvDrkmuwAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeRailCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAECAYAAAC+0w63AAAAXklEQVR42n2NWwqAIBRE3YSmJT4KafW1tZAWMN2RPkSojwPDPO5VAFSP1lMRDqG+UJexN4524bJ2hvehQU2P2efQGHs6tyCEhBhzg5oes7+PlcWUVuS8Nah5QLK77z7Bcm/CZuJM1AAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeRailCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAECAYAAAC+0w63AAAAWklEQVQI12NgQAJiYhKfVFXV/6upaaBgkBhQ7gsDLiAtLbNRXl4RQyNIDCSHU6ONja0B0OQPIIUgW0AYxAaJgeRwavz//z+Tq6ubIch0oOLPIAxig8RAcshqARVfK+sjJ8UzAAAAAElFTkSuQmCC"/\x3e\x3celement name\x3d"volumeRail" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAA0CAYAAAC6qQkaAAAAXklEQVR42mP5//8/AwyIiUn85+bmZmBkZGRABiA1X79+ZXj16gVcgoUBDaBrwiWGoZFYMCg0MpKnkZFxCPlxVONw0MjIyDgaOCM7AdC7lBuNjtGiY1TjqMbRwooijQBUhw3jnmCdzgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeProgress" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAA0CAAAAACfwlbGAAAAAnRSTlMA/1uRIrUAAAAmSURBVHgBY/gPBPdunT+yaw2IBeY+BHHXwbmPQNz1w5w7yh3lAgBeJpPWLirUWgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeProgressCapTop" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAECAQAAAAU2sY8AAAANElEQVQI12NgIA5s7Vv/cenH2X1YpA5POPb/0P8d/1f+nz4BQ/Lyx2v/zwKlt/1f/BkmBgDJshlzy7m4BgAAAABJRU5ErkJggg\x3d\x3d"/\x3e\x3celement name\x3d"volumeProgressCapBottom" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAECAQAAAAU2sY8AAAAL0lEQVQI12NggIJHH2/9P///yP9d/9d/ZkAHjybCJScyYIJbE85/OvJp1wQG4gAADBkams/Cpm0AAAAASUVORK5CYII\x3d"/\x3e\x3celement name\x3d"volumeThumb" src\x3d"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAQAAACMnYaxAAAA/klEQVR4AYXQoW7CUBjF8f9IYWkgq2l2k8llrmJBTOBxsyQlJENs4236CDhEywNUIEGh12WZuYDC4W9A3B2zhTVLds8VJ+fnPv5/FzQIaHGptNQaWn4ooM0DA56VgVpbi1hEk2vSvNjbozu6vc0LUi1NCQFXDBflwW/9p7L1B78oGRJJCOnN8o3/OMvGz3J6EiLStdX0K2tLKiFm8n6qY3XiVYL5C98cLxL90dLWcWkZSYjpZ0Uds4K+hIg7nqblOU1LxlojCDF0GWfz1a5ylVvtsrmoi5EQ0OGGhEdNE2WslmjpSND5VAy3mu6VRM1o0fm+Dx8SEWOUWC3UIvoCCFqphCwr/x8AAAAASUVORK5CYII\x3d"/\x3e\x3c/elements\x3e\x3c/component\x3e\x3c/components\x3e\x3c/skin\x3e')
  }
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = g.events,
    d = c.state,
    h = b.css,
    a = b.isMobile(),
    e = document,
    f = ".jwpreview",
    C = !0,
    n = !1;
  k.display = function(g, v) {
    function r(e) {
      if (fa && (g.jwGetControls() || g.jwGetState() == d.PLAYING)) fa(e);
      else if ((!a || !g.jwGetControls()) && Y.sendEvent(c.JWPLAYER_DISPLAY_CLICK), g.jwGetControls()) {
        var f = (new Date).getTime();
        aa && 500 > f - aa ? (g.jwSetFullscreen(), aa = void 0) : aa = (new Date).getTime();
        var j = b.bounds(A.parentNode.querySelector(".jwcontrolbar")),
          h = b.bounds(A),
          f = j.left - 10 - h.left,
          B = j.left +
          30 - h.left,
          m = h.bottom - 40,
          l = h.bottom,
          s = j.right - 30 - h.left,
          j = j.right + 10 - h.left;
        if (a && !(e.x >= f && e.x <= B && e.y >= m && e.y <= l)) {
          if (e.x >= s && e.x <= j && e.y >= m && e.y <= l) {
            g.jwSetFullscreen();
            return
          }
          Y.sendEvent(c.JWPLAYER_DISPLAY_CLICK);
          if (J) return
        }
        switch (g.jwGetState()) {
          case d.PLAYING:
          case d.BUFFERING:
            g.jwPause();
            break;
          default:
            g.jwPlay()
        }
      }
    }

    function m(a, b) {
      W.showicons && (a || b ? (t.setRotation("buffer" == a ? parseInt(W.bufferrotation, 10) : 0, parseInt(W.bufferinterval, 10)), t.setIcon(a), t.setText(b)) : t.hide())
    }

    function l(a) {
      w !=
        a ? (w && j(f, n), (w = a) ? (a = new Image, a.addEventListener("load", p, n), a.src = w) : (h("#" + A.id + " " + f, {
          "background-image": ""
        }), j(f, n), y = K = 0)) : w && !J && j(f, C);
      z(g.jwGetState())
    }

    function B(a) {
      clearTimeout(Z);
      Z = setTimeout(function() {
        z(a.newstate)
      }, 100)
    }

    function z(a) {
      a = R ? R : g ? g.jwGetState() : d.IDLE;
      if (a != T) switch (T = a, t && t.setRotation(0), a) {
        case d.IDLE:
          !E && !M && (w && !F && j(f, C), a = !0, g._model && !1 === g._model.config.displaytitle && (a = !1), m("play", I && a ? I.title : ""));
          break;
        case d.BUFFERING:
          E = n;
          H.error && H.error.setText();
          M = n;
          m("buffer");
          break;
        case d.PLAYING:
          m();
          break;
        case d.PAUSED:
          m("play")
      }
    }

    function p() {
      y = this.width;
      K = this.height;
      z(g.jwGetState());
      x();
      w && h("#" + A.id + " " + f, {
        "background-image": "url(" + w + ")"
      })
    }

    function G(a) {
      E = C;
      m("error", a.message)
    }

    function x() {
      0 < A.clientWidth * A.clientHeight && b.stretch(g.jwGetStretching(), s, A.clientWidth, A.clientHeight, y, K)
    }

    function j(a, b) {
      h("#" + A.id + " " + a, {
        opacity: b ? 1 : 0,
        visibility: b ? "visible" : "hidden"
      })
    }
    var A, s, u, I, w, y, K, F = n,
      H = {},
      E = n,
      M = n,
      J, U, t, R, T, W = b.extend({
        showicons: C,
        bufferrotation: 45,
        bufferinterval: 100,
        fontcolor: "#ccc",
        overcolor: "#fff",
        fontsize: 15,
        fontweight: ""
      }, g.skin.getComponentSettings("display"), v),
      Y = new c.eventdispatcher,
      fa, aa;
    b.extend(this, Y);
    this.clickHandler = r;
    var Z;
    this.forceState = function(a) {
      R = a;
      z(a);
      this.show()
    };
    this.releaseState = function(a) {
      R = null;
      z(a);
      this.show()
    };
    this.hidePreview = function(a) {
      F = a;
      j(f, !a);
      a && (J = !0)
    };
    this.setHiding = function() {
      J = !0
    };
    this.element = function() {
      return A
    };
    this.redraw = x;
    this.show = function(a) {
      if (t && (a || (R ? R : g ? g.jwGetState() : d.IDLE) != d.PLAYING)) clearTimeout(U),
        U = void 0, A.style.display = "block", t.show(), J = !1
    };
    this.hide = function() {
      t && (t.hide(), J = !0)
    };
    this.setAlternateClickHandler = function(a) {
      fa = a
    };
    this.revertAlternateClickHandler = function() {
      fa = void 0
    };
    A = e.createElement("div");
    A.id = g.id + "_display";
    A.className = "jwdisplay";
    s = e.createElement("div");
    s.className = "jwpreview jw" + g.jwGetStretching();
    A.appendChild(s);
    g.jwAddEventListener(c.JWPLAYER_PLAYER_STATE, B);
    g.jwAddEventListener(c.JWPLAYER_PLAYLIST_ITEM, function() {
      E = n;
      H.error && H.error.setText();
      var a = (I = g.jwGetPlaylist()[g.jwGetPlaylistIndex()]) ?
        I.image : "";
      T = void 0;
      l(a)
    });
    g.jwAddEventListener(c.JWPLAYER_PLAYLIST_COMPLETE, function() {
      M = C;
      m("replay");
      var a = g.jwGetPlaylist()[0];
      l(a.image)
    });
    g.jwAddEventListener(c.JWPLAYER_MEDIA_ERROR, G);
    g.jwAddEventListener(c.JWPLAYER_ERROR, G);
    a ? (u = new b.touch(A), u.addEventListener(b.touchEvents.TAP, r)) : A.addEventListener("click", r, n);
    u = {
      font: W.fontweight + " " + W.fontsize + "px/" + (parseInt(W.fontsize, 10) + 3) + "px Arial, Helvetica, sans-serif",
      color: W.fontcolor
    };
    t = new k.displayicon(A.id + "_button", g, u, {
      color: W.overcolor
    });
    A.appendChild(t.element());
    B({
      newstate: d.IDLE
    })
  };
  h(".jwdisplay", {
    position: "absolute",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  });
  h(".jwdisplay .jwpreview", {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "no-repeat center",
    overflow: "hidden",
    opacity: 0
  });
  b.transitionStyle(".jwdisplay, .jwdisplay *", "opacity .25s, color .25s")
})(jwplayer);
(function(g) {
  var k = g.utils,
    b = k.css,
    c = document,
    d = "none",
    h = "100%";
  g.html5.displayicon = function(a, e, f, C) {
    function n(a, b, d, e) {
      var f = c.createElement("div");
      f.className = a;
      b && b.appendChild(f);
      z && q(f, a, "." + a, d, e);
      return f
    }

    function q(a, c, d, f, j) {
      var h = v(c);
      "replayIcon" == c && !h.src && (h = v("playIcon"));
      h.src ? (f = k.extend({}, f), 0 < c.indexOf("Icon") && (w = h.width | 0), f.width = h.width, f["background-image"] = "url(" + h.src + ")", f["background-size"] = h.width + "px " + h.height + "px", f["float"] = "none", j = k.extend({}, j), h.overSrc && (j["background-image"] =
        "url(" + h.overSrc + ")"), k.isMobile() || b("#" + e.id + " .jwdisplay:hover " + d, j), b.style(z, {
        display: "table"
      })) : b.style(z, {
        display: "none"
      });
      f && b.style(a, f);
      I = h
    }

    function v(a) {
      var b = B.getSkinElement("display", a);
      a = B.getSkinElement("display", a + "Over");
      return b ? (b.overSrc = a && a.src ? a.src : "", b) : {
        src: "",
        overSrc: "",
        width: 0,
        height: 0
      }
    }

    function r() {
      var a = j || 0 === w;
      b.style(A, {
        display: A.innerHTML && a ? "" : d
      });
      K = a ? 30 : 0;
      m()
    }

    function m() {
      clearTimeout(y);
      0 < K-- && (y = setTimeout(m, 33));
      var a = "px " + h,
        c = Math.ceil(Math.max(I.width, k.bounds(z).width -
          x.width - G.width)),
        a = {
          "background-size": [G.width + a, c + a, x.width + a].join(", ")
        };
      z.parentNode && (a.left = 1 == z.parentNode.clientWidth % 2 ? "0.5px" : "");
      b.style(z, a)
    }

    function l() {
      E = (E + H) % 360;
      k.rotate(s, E)
    }
    var B = e.skin,
      z, p, G, x, j, A, s, u = {},
      I, w = 0,
      y = -1,
      K = 0;
    this.element = function() {
      return z
    };
    this.setText = function(a) {
      var b = A.style;
      A.innerHTML = a ? a.replace(":", ":\x3cbr\x3e") : "";
      b.height = "0";
      b.display = "block";
      if (a)
        for (; 2 < Math.floor(A.scrollHeight / c.defaultView.getComputedStyle(A, null).lineHeight.replace("px", ""));) A.innerHTML =
          A.innerHTML.replace(/(.*) .*$/, "$1...");
      b.height = "";
      b.display = "";
      r()
    };
    this.setIcon = function(a) {
      var b = u[a];
      b || (b = n("jwicon"), b.id = z.id + "_" + a);
      q(b, a + "Icon", "#" + b.id);
      z.contains(s) ? z.replaceChild(b, s) : z.appendChild(b);
      s = b
    };
    var F, H = 0,
      E;
    this.setRotation = function(a, b) {
      clearInterval(F);
      E = 0;
      H = a | 0;
      0 === H ? l() : F = setInterval(l, b)
    };
    var M = this.hide = function() {
      z.style.opacity = 0
    };
    this.show = function() {
      z.style.opacity = 1
    };
    z = n("jwdisplayIcon");
    z.id = a;
    p = v("background");
    G = v("capLeft");
    x = v("capRight");
    j = 0 < G.width * x.width;
    var J = {
      "background-image": "url(" + G.src + "), url(" + p.src + "), url(" + x.src + ")",
      "background-position": "left,center,right",
      "background-repeat": "no-repeat",
      padding: "0 " + x.width + "px 0 " + G.width + "px",
      height: p.height,
      "margin-top": p.height / -2
    };
    b("#" + a, J);
    k.isMobile() || (p.overSrc && (J["background-image"] = "url(" + G.overSrc + "), url(" + p.overSrc + "), url(" + x.overSrc + ")"), b(".jw-tab-focus #" + a + ", #" + e.id + " .jwdisplay:hover " + ("#" + a), J));
    A = n("jwtext", z, f, C);
    s = n("jwicon", z);
    e.jwAddEventListener(g.events.JWPLAYER_RESIZE,
      m);
    M();
    r()
  };
  b(".jwplayer .jwdisplayIcon", {
    display: "table",
    cursor: "pointer",
    position: "relative",
    "margin-left": "auto",
    "margin-right": "auto",
    top: "50%",
    "float": "none"
  });
  b(".jwplayer .jwdisplayIcon div", {
    position: "relative",
    display: "table-cell",
    "vertical-align": "middle",
    "background-repeat": "no-repeat",
    "background-position": "center"
  });
  b(".jwplayer .jwdisplayIcon div", {
    "vertical-align": "middle"
  }, !0);
  b(".jwplayer .jwdisplayIcon .jwtext", {
    color: "#fff",
    padding: "0 1px",
    "max-width": "300px",
    "overflow-y": "hidden",
    "text-align": "center",
    "-webkit-user-select": d,
    "-moz-user-select": d,
    "-ms-user-select": d,
    "user-select": d
  })
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = b.css,
    d = b.bounds,
    h = ".jwdockbuttons",
    a = document,
    e = "none",
    f = "block";
  k.dock = function(g, n) {
    function q(a) {
      return !a || !a.src ? {} : {
        background: "url(" + a.src + ") center",
        "background-size": a.width + "px " + a.height + "px"
      }
    }

    function v(a, d) {
      var e = l(a);
      c(r("." + a), b.extend(q(e), {
        width: e.width
      }));
      return m("div", a, d)
    }

    function r(a) {
      return "#" + p + " " + (a ? a : "")
    }

    function m(b, c, d) {
      b = a.createElement(b);
      c && (b.className = c);
      d && d.appendChild(b);
      return b
    }

    function l(a) {
      return (a = G.getSkinElement("dock",
        a)) ? a : {
        width: 0,
        height: 0,
        src: ""
      }
    }

    function B() {
      c(h + " .capLeft, " + h + " .capRight", {
        display: x ? f : e
      })
    }
    var z = b.extend({}, {
        iconalpha: 0.75,
        iconalphaactive: 0.5,
        iconalphaover: 1,
        margin: 8
      }, n),
      p = g.id + "_dock",
      G = g.skin,
      x = 0,
      j = {},
      A = {},
      s, u, I, w = this;
    w.redraw = function() {
      d(s)
    };
    w.element = function() {
      return s
    };
    w.offset = function(a) {
      c(r(), {
        "margin-left": a
      })
    };
    w.hide = function() {
      w.visible && (w.visible = !1, s.style.opacity = 0, clearTimeout(I), I = setTimeout(function() {
        s.style.display = e
      }, 250))
    };
    w.showTemp = function() {
      w.visible || (s.style.opacity =
        0, s.style.display = f)
    };
    w.hideTemp = function() {
      w.visible || (s.style.display = e)
    };
    w.show = function() {
      !w.visible && x && (w.visible = !0, s.style.display = f, clearTimeout(I), I = setTimeout(function() {
        s.style.opacity = 1
      }, 0))
    };
    w.addButton = function(a, e, f, h) {
      if (!j[h]) {
        var g = m("div", "divider", u),
          l = m("div", "button", u),
          y = m("div", null, l);
        y.id = p + "_" + h;
        y.innerHTML = "\x26nbsp;";
        c("#" + y.id, {
          "background-image": a
        });
        "string" == typeof f && (f = new Function(f));
        b.isMobile() ? (new b.touch(l)).addEventListener(b.touchEvents.TAP, function(a) {
            f(a)
          }) :
          l.addEventListener("click", function(a) {
            f(a);
            a.preventDefault()
          });
        j[h] = {
          element: l,
          label: e,
          divider: g,
          icon: y
        };
        if (e) {
          var n = new k.overlay(y.id + "_tooltip", G, !0);
          a = m("div");
          a.id = y.id + "_label";
          a.innerHTML = e;
          c("#" + a.id, {
            padding: 3
          });
          n.setContents(a);
          if (!b.isMobile()) {
            var z;
            l.addEventListener("mouseover", function() {
              clearTimeout(z);
              var a = A[h],
                e, f;
              e = d(j[h].icon);
              a.offsetX(0);
              f = d(s);
              c("#" + a.element().id, {
                left: e.left - f.left + e.width / 2
              });
              e = d(a.element());
              f.left > e.left && a.offsetX(f.left - e.left + 8);
              n.show();
              b.foreach(A,
                function(a, b) {
                  a != h && b.hide()
                })
            }, !1);
            l.addEventListener("mouseout", function() {
              z = setTimeout(n.hide, 100)
            }, !1);
            s.appendChild(n.element());
            A[h] = n
          }
        }
        x++;
        B()
      }
    };
    w.removeButton = function(a) {
      if (j[a]) {
        u.removeChild(j[a].element);
        u.removeChild(j[a].divider);
        var b = document.getElementById("" + p + "_" + a + "_tooltip");
        b && s.removeChild(b);
        delete j[a];
        x--;
        B()
      }
    };
    w.numButtons = function() {
      return x
    };
    w.visible = !1;
    s = m("div", "jwdock");
    u = m("div", "jwdockbuttons");
    s.appendChild(u);
    s.id = p;
    var y = l("button"),
      K = l("buttonOver"),
      F = l("buttonActive");
    y && (c(r(), {
      height: y.height,
      padding: z.margin
    }), c(h, {
      height: y.height
    }), c(r("div.button"), b.extend(q(y), {
      width: y.width,
      cursor: "pointer",
      border: e
    })), c(r("div.button:hover"), q(K)), c(r("div.button:active"), q(F)), c(r("div.button\x3ediv"), {
      opacity: z.iconalpha
    }), c(r("div.button:hover\x3ediv"), {
      opacity: z.iconalphaover
    }), c(r("div.button:active\x3ediv"), {
      opacity: z.iconalphaactive
    }), c(r(".jwoverlay"), {
      top: z.margin + y.height
    }), v("capLeft", u), v("capRight", u), v("divider"));
    setTimeout(function() {
      d(s)
    })
  };
  c(".jwdock", {
    opacity: 0,
    display: e
  });
  c(".jwdock \x3e *", {
    height: "100%",
    "float": "left"
  });
  c(".jwdock \x3e .jwoverlay", {
    height: "auto",
    "float": e,
    "z-index": 99
  });
  c(h + " div.button", {
    position: "relative"
  });
  c(h + " \x3e *", {
    height: "100%",
    "float": "left"
  });
  c(h + " .divider", {
    display: e
  });
  c(h + " div.button ~ .divider", {
    display: f
  });
  c(h + " .capLeft, " + h + " .capRight", {
    display: e
  });
  c(h + " .capRight", {
    "float": "right"
  });
  c(h + " div.button \x3e div", {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 5,
    position: "absolute",
    "background-position": "center",
    "background-repeat": "no-repeat"
  });
  b.transitionStyle(".jwdock", "background .25s, opacity .25s");
  b.transitionStyle(".jwdock .jwoverlay", "opacity .25s");
  b.transitionStyle(h + " div.button div", "opacity .25s")
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = g.events,
    d = c.state,
    h = g.playlist;
  k.instream = function(a, e, f, g) {
    function n(b) {
      B(b.type, b);
      J && a.jwInstreamDestroy(!1, t)
    }

    function q(a) {
      B(a.type, a);
      m()
    }

    function v(a) {
      B(a.type, a)
    }

    function r() {
      E && E.releaseState(t.jwGetState());
      F.play()
    }

    function m() {
      if (x && j + 1 < x.length) {
        j++;
        var d = x[j];
        G = new h.item(d);
        J.setPlaylist([d]);
        var e;
        A && (e = A[j]);
        s = b.extend(p, e);
        F.load(J.playlist[0]);
        u.reset(s.skipoffset || -1);
        U = setTimeout(function() {
          B(c.JWPLAYER_PLAYLIST_ITEM, {
            index: j
          }, !0)
        }, 0)
      } else U =
        setTimeout(function() {
          B(c.JWPLAYER_PLAYLIST_COMPLETE, {}, !0);
          a.jwInstreamDestroy(!0, t)
        }, 0)
    }

    function l(a) {
      a.width && a.height && (E && E.releaseState(t.jwGetState()), f.resizeMedia())
    }

    function B(a, b) {
      b = b || {};
      p.tag && !b.tag && (b.tag = p.tag);
      t.sendEvent(a, b)
    }

    function z() {
      H && H.redraw();
      E && E.redraw()
    }
    var p = {
        controlbarseekable: "never",
        controlbarpausable: !0,
        controlbarstoppable: !0,
        loadingmessage: "Loading ad",
        playlistclickable: !0,
        skipoffset: null,
        tag: null
      },
      G, x, j = 0,
      A, s = {
        controlbarseekable: "never",
        controlbarpausable: !1,
        controlbarstoppable: !1
      },
      u, I, w, y, K, F, H, E, M, J, U = -1,
      t = b.extend(this, new c.eventdispatcher);
    a.jwAddEventListener(c.JWPLAYER_RESIZE, z);
    a.jwAddEventListener(c.JWPLAYER_FULLSCREEN, function(a) {
      z();
      !a.fullscreen && b.isIPad() && (J.state === d.PAUSED ? E.show(!0) : J.state === d.PLAYING && E.hide())
    });
    t.init = function() {
      I = g.detachMedia();
      F = new k.video(I, "instream");
      F.addGlobalListener(v);
      F.addEventListener(c.JWPLAYER_MEDIA_META, l);
      F.addEventListener(c.JWPLAYER_MEDIA_COMPLETE, m);
      F.addEventListener(c.JWPLAYER_MEDIA_BUFFER_FULL,
        r);
      F.addEventListener(c.JWPLAYER_MEDIA_ERROR, n);
      F.addEventListener(c.JWPLAYER_MEDIA_TIME, function(a) {
        u && u.updateSkipTime(a.position, a.duration)
      });
      F.attachMedia();
      F.mute(e.mute);
      F.volume(e.volume);
      J = new k.model({}, F);
      J.setVolume(e.volume);
      J.setMute(e.mute);
      K = e.playlist[e.item];
      w = I.currentTime;
      y = g.checkBeforePlay() || 0 === w ? d.PLAYING : a.jwGetState() === d.IDLE || e.getVideo().checkComplete() ? d.IDLE : d.PLAYING;
      y == d.PLAYING && I.pause();
      E = new k.display(t);
      E.forceState(d.BUFFERING);
      M = document.createElement("div");
      M.id = t.id + "_instream_container";
      M.appendChild(E.element());
      H = new k.controlbar(t);
      H.instreamMode(!0);
      M.appendChild(H.element());
      a.jwGetControls() ? (H.show(), E.show()) : (H.hide(), E.hide());
      f.setupInstream(M, H, E, J);
      z();
      t.jwInstreamSetText(p.loadingmessage)
    };
    t.load = function(e, g) {
      if (b.isAndroid(2.3)) n({
        type: c.JWPLAYER_ERROR,
        message: "Error loading instream: Cannot play instream on Android 2.3"
      });
      else {
        B(c.JWPLAYER_PLAYLIST_ITEM, {
          index: j
        }, !0);
        var m = 10 + b.bounds(M.parentNode).bottom - b.bounds(H.element()).top;
        "array" === b.typeOf(e) && (g && (A = g, g = g[j]), x = e, e = x[j]);
        s = b.extend(p, g);
        G = new h.item(e);
        J.setPlaylist([e]);
        u = new k.adskipbutton(a.id, m, s.skipMessage, s.skipText);
        u.addEventListener(c.JWPLAYER_AD_SKIPPED, q);
        u.reset(s.skipoffset || -1);
        a.jwGetControls() ? u.show() : u.hide();
        m = u.element();
        M.appendChild(m);
        J.addEventListener(c.JWPLAYER_ERROR, n);
        E.setAlternateClickHandler(function(b) {
          b = b || {};
          b.hasControls = !!a.jwGetControls();
          B(c.JWPLAYER_INSTREAM_CLICK, b);
          b.hasControls && (J.state === d.PAUSED ? t.jwInstreamPlay() : t.jwInstreamPause())
        });
        b.isMSIE() && I.parentElement.addEventListener("click", E.clickHandler);
        f.addEventListener(c.JWPLAYER_AD_SKIPPED, q);
        F.load(J.playlist[0])
      }
    };
    t.jwInstreamDestroy = function(a) {
      if (J) {
        clearTimeout(U);
        U = -1;
        F.detachMedia();
        g.attachMedia();
        if (y !== d.IDLE) {
          var j = b.extend({}, K);
          j.starttime = w;
          e.getVideo().load(j)
        } else e.getVideo().stop();
        t.resetEventListeners();
        F.resetEventListeners();
        J.resetEventListeners();
        if (H) try {
          H.element().parentNode.removeChild(H.element())
        } catch (h) {}
        E && (I && I.parentElement && I.parentElement.removeEventListener("click",
          E.clickHandler), E.revertAlternateClickHandler());
        B(c.JWPLAYER_INSTREAM_DESTROYED, {
          reason: a ? "complete" : "destroyed"
        }, !0);
        y == d.PLAYING && I.play();
        f.destroyInstream(F.audioMode());
        J = null
      }
    };
    t.jwInstreamAddEventListener = function(a, b) {
      t.addEventListener(a, b)
    };
    t.jwInstreamRemoveEventListener = function(a, b) {
      t.removeEventListener(a, b)
    };
    t.jwInstreamPlay = function() {
      F.play(!0);
      e.state = d.PLAYING;
      E.show()
    };
    t.jwInstreamPause = function() {
      F.pause(!0);
      e.state = d.PAUSED;
      a.jwGetControls() && E.show()
    };
    t.jwInstreamSeek = function(a) {
      F.seek(a)
    };
    t.jwInstreamSetText = function(a) {
      H.setText(a)
    };
    t.jwInstreamState = function() {
      return e.state
    };
    t.setControls = function(a) {
      a ? u.show() : u.hide()
    };
    t.jwPlay = function() {
      "true" == s.controlbarpausable.toString().toLowerCase() && t.jwInstreamPlay()
    };
    t.jwPause = function() {
      "true" == s.controlbarpausable.toString().toLowerCase() && t.jwInstreamPause()
    };
    t.jwStop = function() {
      "true" == s.controlbarstoppable.toString().toLowerCase() && (a.jwInstreamDestroy(!1, t), a.jwStop())
    };
    t.jwSeek = function(a) {
      switch (s.controlbarseekable.toLowerCase()) {
        case "always":
          t.jwInstreamSeek(a);
          break;
        case "backwards":
          J.position > a && t.jwInstreamSeek(a)
      }
    };
    t.jwSeekDrag = function(a) {
      J.seekDrag(a)
    };
    t.jwGetPosition = function() {};
    t.jwGetDuration = function() {};
    t.jwGetWidth = a.jwGetWidth;
    t.jwGetHeight = a.jwGetHeight;
    t.jwGetFullscreen = a.jwGetFullscreen;
    t.jwSetFullscreen = a.jwSetFullscreen;
    t.jwGetVolume = function() {
      return e.volume
    };
    t.jwSetVolume = function(b) {
      J.setVolume(b);
      a.jwSetVolume(b)
    };
    t.jwGetMute = function() {
      return e.mute
    };
    t.jwSetMute = function(b) {
      J.setMute(b);
      a.jwSetMute(b)
    };
    t.jwGetState = function() {
      return !J ?
        d.IDLE : J.state
    };
    t.jwGetPlaylist = function() {
      return [G]
    };
    t.jwGetPlaylistIndex = function() {
      return 0
    };
    t.jwGetStretching = function() {
      return e.config.stretching
    };
    t.jwAddEventListener = function(a, b) {
      t.addEventListener(a, b)
    };
    t.jwRemoveEventListener = function(a, b) {
      t.removeEventListener(a, b)
    };
    t.jwSetCurrentQuality = function() {};
    t.jwGetQualityLevels = function() {
      return []
    };
    t.jwGetControls = function() {
      return a.jwGetControls()
    };
    t.skin = a.skin;
    t.id = a.id + "_instream";
    return t
  }
})(window.jwplayer);
(function(g) {
  var k = g.utils,
    b = k.css,
    c = g.events.state,
    d = g.html5.logo = function(h, a) {
      function e(a) {
        k.exists(a) && a.stopPropagation && a.stopPropagation();
        if (!r || !n.link) f.jwGetState() == c.IDLE || f.jwGetState() == c.PAUSED ? f.jwPlay() : f.jwPause();
        r && n.link && (f.jwPause(), f.jwSetFullscreen(!1), window.open(n.link, n.linktarget))
      }
      var f = h,
        C = f.id + "_logo",
        n, q, v = d.defaults,
        r = !1;
      this.resize = function() {};
      this.element = function() {
        return q
      };
      this.offset = function(a) {
        b("#" + C + " ", {
          "margin-bottom": a
        })
      };
      this.position = function() {
        return n.position
      };
      this.margin = function() {
        return parseInt(n.margin)
      };
      this.hide = function(a) {
        if (n.hide || a) r = !1, q.style.visibility = "hidden", q.style.opacity = 0
      };
      this.show = function() {
        r = !0;
        q.style.visibility = "visible";
        q.style.opacity = 1
      };
      var m = "o";
      f.edition && (m = f.edition(), m = "pro" == m ? "p" : "premium" == m ? "r" : "ads" == m ? "a" : "free" == m ? "f" : "o");
      if ("o" == m || "f" == m) v.link = "http://www.longtailvideo.com/jwpabout/?a\x3dl\x26v\x3d" + g.version + "\x26m\x3dh\x26e\x3d" + m;
      n = k.extend({}, v, a);
      n.hide = "true" == n.hide.toString();
      q = document.createElement("img");
      q.className = "jwlogo";
      q.id = C;
      if (n.file) {
        var v = /(\w+)-(\w+)/.exec(n.position),
          m = {},
          l = n.margin;
        3 == v.length ? (m[v[1]] = l, m[v[2]] = l) : m.top = m.right = l;
        b("#" + C + " ", m);
        q.src = (n.prefix ? n.prefix : "") + n.file;
        k.isMobile() ? (new k.touch(q)).addEventListener(k.touchEvents.TAP, e) : q.onclick = e
      } else q.style.display = "none";
      return this
    };
  d.defaults = {
    prefix: k.repo(),
    file: "logo.png",
    linktarget: "_top",
    margin: 8,
    hide: !1,
    position: "top-right"
  };
  b(".jwlogo", {
    cursor: "pointer",
    position: "absolute",
    "z-index": 100,
    opacity: 0
  });
  k.transitionStyle(".jwlogo",
    "visibility .25s, opacity .25s")
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = b.css;
  k.menu = function(d, h, a, e) {
    function f(a) {
      return !a || !a.src ? {} : {
        background: "url(" + a.src + ") no-repeat left",
        "background-size": a.width + "px " + a.height + "px"
      }
    }

    function g(a, b) {
      return function() {
        B(a);
        v && v(b)
      }
    }

    function n(a, b) {
      var c = document.createElement("div");
      a && (c.className = a);
      b && b.appendChild(c);
      return c
    }

    function q(b) {
      return (b = a.getSkinElement("tooltip", b)) ? b : {
        width: 0,
        height: 0,
        src: void 0
      }
    }
    var v = e,
      r = new k.overlay(h + "_overlay", a);
    e = b.extend({
      fontcase: void 0,
      fontcolor: "#cccccc",
      fontsize: 11,
      fontweight: void 0,
      activecolor: "#ffffff",
      overcolor: "#ffffff"
    }, a.getComponentSettings("tooltip"));
    var m, l = [];
    this.element = function() {
      return r.element()
    };
    this.addOption = function(a, c) {
      var d = n("jwoption", m);
      d.id = h + "_option_" + c;
      d.innerHTML = a;
      b.isMobile() ? (new b.touch(d)).addEventListener(b.touchEvents.TAP, g(l.length, c)) : d.addEventListener("click", g(l.length, c));
      l.push(d)
    };
    this.clearOptions = function() {
      for (; 0 < l.length;) m.removeChild(l.pop())
    };
    var B = this.setActive = function(a) {
      for (var b = 0; b < l.length; b++) {
        var c =
          l[b];
        c.className = c.className.replace(" active", "");
        b == a && (c.className += " active")
      }
    };
    this.show = r.show;
    this.hide = r.hide;
    this.offsetX = r.offsetX;
    this.positionX = r.positionX;
    this.constrainX = r.constrainX;
    m = n("jwmenu");
    m.id = h;
    var z = q("menuTop" + d);
    d = q("menuOption");
    var p = q("menuOptionOver"),
      G = q("menuOptionActive");
    if (z && z.image) {
      var x = new Image;
      x.src = z.src;
      x.width = z.width;
      x.height = z.height;
      m.appendChild(x)
    }
    d && (z = "#" + h + " .jwoption", c(z, b.extend(f(d), {
      height: d.height,
      color: e.fontcolor,
      "padding-left": d.width,
      font: e.fontweight + " " + e.fontsize + "px Arial,Helvetica,sans-serif",
      "line-height": d.height,
      "text-transform": "upper" == e.fontcase ? "uppercase" : void 0
    })), c(z + ":hover", b.extend(f(p), {
      color: e.overcolor
    })), c(z + ".active", b.extend(f(G), {
      color: e.activecolor
    })));
    r.setContents(m)
  };
  c("." + "jwmenu jwoption".replace(/ /g, " ."), {
    cursor: "pointer",
    "white-space": "nowrap",
    position: "relative"
  })
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = g.events;
  k.model = function(d, h) {
    function a(a) {
      var b = r[a.type];
      if (b && b.length) {
        for (var c = !1, d = 0; d < b.length; d++) {
          var f = b[d].split("-\x3e"),
            h = f[0],
            f = f[1] || h;
          e[f] !== a[h] && (e[f] = a[h], c = !0)
        }
        c && e.sendEvent(a.type, a)
      } else e.sendEvent(a.type, a)
    }
    var e = this,
      f, C = {
        html5: h || new k.video(null, "default")
      },
      n = b.getCookies(),
      q = {
        controlbar: {},
        display: {}
      },
      v = {
        autostart: !1,
        controls: !0,
        fullscreen: !1,
        height: 320,
        mobilecontrols: !1,
        mute: !1,
        playlist: [],
        playlistposition: "none",
        playlistsize: 180,
        playlistlayout: "extended",
        repeat: !1,
        stretching: b.stretching.UNIFORM,
        width: 480,
        volume: 90
      },
      r = {};
    r[c.JWPLAYER_MEDIA_MUTE] = ["mute"];
    r[c.JWPLAYER_MEDIA_VOLUME] = ["volume"];
    r[c.JWPLAYER_PLAYER_STATE] = ["newstate-\x3estate"];
    r[c.JWPLAYER_MEDIA_BUFFER] = ["bufferPercent-\x3ebuffer"];
    r[c.JWPLAYER_MEDIA_TIME] = ["position", "duration"];
    e.setVideo = function(b) {
      if (b !== f) {
        if (f) {
          f.removeGlobalListener(a);
          var c = f.getContainer();
          c && (f.remove(), b.setContainer(c))
        }
        f = b;
        f.volume(e.volume);
        f.mute(e.mute);
        f.addGlobalListener(a)
      }
    };
    e.destroy = function() {
      f && (f.removeGlobalListener(a), f.destroy())
    };
    e.getVideo = function() {
      return f
    };
    e.seekDrag = function(a) {
      f.seekDrag(a)
    };
    e.setFullscreen = function(a) {
      a = !!a;
      a != e.fullscreen && (e.fullscreen = a, e.sendEvent(c.JWPLAYER_FULLSCREEN, {
        fullscreen: a
      }))
    };
    e.setPlaylist = function(a) {
      e.playlist = b.filterPlaylist(a, !1, e.androidhls);
      0 === e.playlist.length ? e.sendEvent(c.JWPLAYER_ERROR, {
        message: "Error loading playlist: No playable sources found"
      }) : (e.sendEvent(c.JWPLAYER_PLAYLIST_LOADED, {
          playlist: g(e.id).getPlaylist()
        }),
        e.item = -1, e.setItem(0))
    };
    e.setItem = function(a) {
      var d = !1;
      a == e.playlist.length || -1 > a ? (a = 0, d = !0) : a = -1 == a || a > e.playlist.length ? e.playlist.length - 1 : a;
      if (d || a !== e.item) {
        e.item = a;
        e.sendEvent(c.JWPLAYER_PLAYLIST_ITEM, {
          index: e.item
        });
        d = e.playlist[a];
        a = C.html5;
        if (e.playlist.length) {
          var f = d.sources[0];
          if ("youtube" === f.type || b.isYouTube(f.file)) a = C.youtube, a || (a = C.youtube = new k.youtube(e.id))
        }
        e.setVideo(a);
        a.init && a.init(d)
      }
    };
    e.setVolume = function(d) {
      e.mute && 0 < d && e.setMute(!1);
      d = Math.round(d);
      e.mute || b.saveCookie("volume",
        d);
      a({
        type: c.JWPLAYER_MEDIA_VOLUME,
        volume: d
      });
      f.volume(d)
    };
    e.setMute = function(d) {
      b.exists(d) || (d = !e.mute);
      b.saveCookie("mute", d);
      a({
        type: c.JWPLAYER_MEDIA_MUTE,
        mute: d
      });
      f.mute(d)
    };
    e.componentConfig = function(a) {
      return q[a]
    };
    b.extend(e, new c.eventdispatcher);
    var m = e,
      l = b.extend({}, v, n, d);
    b.foreach(l, function(a, c) {
      l[a] = b.serialize(c)
    });
    m.config = l;
    b.extend(e, {
      id: d.id,
      state: c.state.IDLE,
      duration: -1,
      position: 0,
      buffer: 0
    }, e.config);
    e.playlist = [];
    e.setItem(0)
  }
})(jwplayer);
(function(g) {
  var k = g.utils,
    b = k.css,
    c = k.transitionStyle,
    d = "top",
    h = "bottom",
    a = "right",
    e = "left",
    f = document,
    C = {
      fontcase: void 0,
      fontcolor: "#ffffff",
      fontsize: 12,
      fontweight: void 0,
      activecolor: "#ffffff",
      overcolor: "#ffffff"
    };
  g.html5.overlay = function(c, g, v) {
    function r(a) {
      return "#" + G + (a ? " ." + a : "")
    }

    function m(a, b) {
      var c = f.createElement("div");
      a && (c.className = a);
      b && b.appendChild(c);
      return c
    }

    function l(a, c) {
      var d;
      d = (d = x.getSkinElement("tooltip", a)) ? d : {
        width: 0,
        height: 0,
        src: "",
        image: void 0,
        ready: !1
      };
      var e = m(c, A);
      b.style(e, B(d));
      return [e, d]
    }

    function B(a) {
      return {
        background: "url(" + a.src + ") center",
        "background-size": a.width + "px " + a.height + "px"
      }
    }

    function z(c, f) {
      f || (f = "");
      var g = l("cap" + c + f, "jwborder jw" + c + (f ? f : "")),
        m = g[0],
        g = g[1],
        s = k.extend(B(g), {
          width: c == e || f == e || c == a || f == a ? g.width : void 0,
          height: c == d || f == d || c == h || f == h ? g.height : void 0
        });
      s[c] = c == h && !j || c == d && j ? u.height : 0;
      f && (s[f] = 0);
      b.style(m, s);
      m = {};
      s = {};
      g = {
        left: g.width,
        right: g.width,
        top: (j ? u.height : 0) + g.height,
        bottom: (j ? 0 : u.height) + g.height
      };
      f && (m[f] = g[f], m[c] =
        0, s[c] = g[c], s[f] = 0, b(r("jw" + c), m), b(r("jw" + f), s), w[c] = g[c], w[f] = g[f])
    }
    var p = this,
      G = c,
      x = g,
      j = v,
      A, s, u, I;
    c = k.extend({}, C, x.getComponentSettings("tooltip"));
    var w = {};
    p.element = function() {
      return A
    };
    p.setContents = function(a) {
      k.empty(s);
      s.appendChild(a)
    };
    p.positionX = function(a) {
      b.style(A, {
        left: Math.round(a)
      })
    };
    p.constrainX = function(a, c) {
      if (p.showing && 0 !== a.width && p.offsetX(0)) {
        c && b.unblock();
        var d = k.bounds(A);
        0 !== d.width && (d.right > a.right ? p.offsetX(a.right - d.right) : d.left < a.left && p.offsetX(a.left - d.left))
      }
    };
    p.offsetX = function(a) {
      a = Math.round(a);
      var c = A.clientWidth;
      0 !== c && (b.style(A, {
        "margin-left": Math.round(-c / 2) + a
      }), b.style(I, {
        "margin-left": Math.round(-u.width / 2) - a
      }));
      return c
    };
    p.borderWidth = function() {
      return w.left
    };
    p.show = function() {
      p.showing = !0;
      b.style(A, {
        opacity: 1,
        visibility: "visible"
      })
    };
    p.hide = function() {
      p.showing = !1;
      b.style(A, {
        opacity: 0,
        visibility: "hidden"
      })
    };
    A = m(".jwoverlay".replace(".", ""));
    A.id = G;
    g = l("arrow", "jwarrow");
    I = g[0];
    u = g[1];
    b.style(I, {
      position: "absolute",
      bottom: j ? void 0 : 0,
      top: j ? 0 : void 0,
      width: u.width,
      height: u.height,
      left: "50%"
    });
    z(d, e);
    z(h, e);
    z(d, a);
    z(h, a);
    z(e);
    z(a);
    z(d);
    z(h);
    g = l("background", "jwback");
    b.style(g[0], {
      left: w.left,
      right: w.right,
      top: w.top,
      bottom: w.bottom
    });
    s = m("jwcontents", A);
    b(r("jwcontents") + " *", {
      color: c.fontcolor,
      font: c.fontweight + " " + c.fontsize + "px Arial,Helvetica,sans-serif",
      "text-transform": "upper" == c.fontcase ? "uppercase" : void 0
    });
    j && k.transform(r("jwarrow"), "rotate(180deg)");
    b.style(A, {
      padding: w.top + 1 + "px " + w.right + "px " + (w.bottom + 1) + "px " + w.left + "px"
    });
    p.showing = !1
  };
  b(".jwoverlay", {
    position: "absolute",
    visibility: "hidden",
    opacity: 0
  });
  b(".jwoverlay .jwcontents", {
    position: "relative",
    "z-index": 1
  });
  b(".jwoverlay .jwborder", {
    position: "absolute",
    "background-size": "100% 100%"
  }, !0);
  b(".jwoverlay .jwback", {
    position: "absolute",
    "background-size": "100% 100%"
  });
  c(".jwoverlay", "opacity .25s, visibility .25s")
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = g.utils;
  k.player = function(c) {
    function d() {
      for (var a = C.playlist, b = [], c = 0; c < a.length; c++) b.push(h(a[c]));
      return b
    }

    function h(a) {
      var c = {
        description: a.description,
        file: a.file,
        image: a.image,
        mediaid: a.mediaid,
        title: a.title
      };
      b.foreach(a, function(a, b) {
        c[a] = b
      });
      c.sources = [];
      c.tracks = [];
      0 < a.sources.length && b.foreach(a.sources, function(a, b) {
        c.sources.push({
          file: b.file,
          type: b.type ? b.type : void 0,
          label: b.label,
          "default": b["default"] ? !0 : !1
        })
      });
      0 < a.tracks.length && b.foreach(a.tracks, function(a,
        b) {
        c.tracks.push({
          file: b.file,
          kind: b.kind ? b.kind : void 0,
          label: b.label,
          "default": b["default"] ? !0 : !1
        })
      });
      !a.file && 0 < a.sources.length && (c.file = a.sources[0].file);
      return c
    }

    function a() {
      f.jwPlay = q.play;
      f.jwPause = q.pause;
      f.jwStop = q.stop;
      f.jwSeek = q.seek;
      f.jwSetVolume = q.setVolume;
      f.jwSetMute = q.setMute;
      f.jwLoad = function(a) {
        q.load(a)
      };
      f.jwPlaylistNext = q.next;
      f.jwPlaylistPrev = q.prev;
      f.jwPlaylistItem = q.item;
      f.jwSetFullscreen = q.setFullscreen;
      f.jwResize = n.resize;
      f.jwSeekDrag = C.seekDrag;
      f.jwGetQualityLevels = q.getQualityLevels;
      f.jwGetCurrentQuality = q.getCurrentQuality;
      f.jwSetCurrentQuality = q.setCurrentQuality;
      f.jwGetCaptionsList = q.getCaptionsList;
      f.jwGetCurrentCaptions = q.getCurrentCaptions;
      f.jwSetCurrentCaptions = q.setCurrentCaptions;
      f.jwGetSafeRegion = n.getSafeRegion;
      f.jwForceState = n.forceState;
      f.jwReleaseState = n.releaseState;
      f.jwGetPlaylistIndex = e("item");
      f.jwGetPosition = e("position");
      f.jwGetDuration = e("duration");
      f.jwGetBuffer = e("buffer");
      f.jwGetWidth = e("width");
      f.jwGetHeight = e("height");
      f.jwGetFullscreen = e("fullscreen");
      f.jwGetVolume = e("volume");
      f.jwGetMute = e("mute");
      f.jwGetState = e("state");
      f.jwGetStretching = e("stretching");
      f.jwGetPlaylist = d;
      f.jwGetControls = e("controls");
      f.jwDetachMedia = q.detachMedia;
      f.jwAttachMedia = q.attachMedia;
      f.jwPlayAd = function(a) {
        var b = g(f.id).plugins;
        b.vast && b.vast.jwPlayAd(a)
      };
      f.jwPauseAd = function() {
        var a = g(f.id).plugins;
        a.googima && a.googima.jwPauseAd()
      };
      f.jwDestroyGoogima = function() {
        var a = g(f.id).plugins;
        a.googima && a.googima.jwDestroyGoogima()
      };
      f.jwInitInstream = function() {
        f.jwInstreamDestroy();
        r = new k.instream(f, C, n, q);
        r.init()
      };
      f.jwLoadItemInstream = function(a, b) {
        if (!r) throw "Instream player undefined";
        r.load(a, b)
      };
      f.jwLoadArrayInstream = function(a, b) {
        if (!r) throw "Instream player undefined";
        r.load(a, b)
      };
      f.jwSetControls = function(a) {
        n.setControls(a);
        r && r.setControls(a)
      };
      f.jwInstreamPlay = function() {
        r && r.jwInstreamPlay()
      };
      f.jwInstreamPause = function() {
        r && r.jwInstreamPause()
      };
      f.jwInstreamState = function() {
        return r ? r.jwInstreamState() : ""
      };
      f.jwInstreamDestroy = function(a, b) {
        if (b = b || r) b.jwInstreamDestroy(a ||
          !1), b === r && (r = void 0)
      };
      f.jwInstreamAddEventListener = function(a, b) {
        r && r.jwInstreamAddEventListener(a, b)
      };
      f.jwInstreamRemoveEventListener = function(a, b) {
        r && r.jwInstreamRemoveEventListener(a, b)
      };
      f.jwPlayerDestroy = function() {
        n && n.destroy();
        C && C.destroy();
        v && v.resetEventListeners()
      };
      f.jwInstreamSetText = function(a) {
        r && r.jwInstreamSetText(a)
      };
      f.jwIsBeforePlay = function() {
        return q.checkBeforePlay()
      };
      f.jwIsBeforeComplete = function() {
        return C.getVideo().checkComplete()
      };
      f.jwSetCues = n.addCues;
      f.jwAddEventListener =
        q.addEventListener;
      f.jwRemoveEventListener = q.removeEventListener;
      f.jwDockAddButton = n.addButton;
      f.jwDockRemoveButton = n.removeButton
    }

    function e(a) {
      return function() {
        return C[a]
      }
    }
    var f = this,
      C, n, q, v, r;
    C = new k.model(c);
    f.id = C.id;
    f._model = C;
    b.css.block(f.id);
    n = new k.view(f, C);
    q = new k.controller(C, n);
    a();
    f.initializeAPI = a;
    v = new k.setup(C, n);
    v.addEventListener(g.events.JWPLAYER_READY, function(a) {
      q.playerReady(a);
      b.css.unblock(f.id)
    });
    v.addEventListener(g.events.JWPLAYER_ERROR, function(a) {
      b.log("There was a problem setting up the player: ",
        a);
      b.css.unblock(f.id)
    });
    v.start()
  }
})(window.jwplayer);
(function(g) {
  var k = {
      size: 180,
      backgroundcolor: "#333333",
      fontcolor: "#999999",
      overcolor: "#CCCCCC",
      activecolor: "#CCCCCC",
      titlecolor: "#CCCCCC",
      titleovercolor: "#FFFFFF",
      titleactivecolor: "#FFFFFF",
      fontweight: "normal",
      titleweight: "normal",
      fontsize: 11,
      titlesize: 13
    },
    b = jwplayer.events,
    c = jwplayer.utils,
    d = c.css,
    h = c.isMobile(),
    a = document;
  g.playlistcomponent = function(e, f) {
    function C(a) {
      return "#" + l.id + (a ? " ." + a : "")
    }

    function n(b, c) {
      var d = a.createElement(b);
      c && (d.className = c);
      return d
    }

    function q(a) {
      return function() {
        x =
          a;
        v.jwPlaylistItem(a);
        v.jwPlay(!0)
      }
    }
    var v = e,
      r = v.skin,
      m = c.extend({}, k, v.skin.getComponentSettings("playlist"), f),
      l, B, z, p, G = -1,
      x, j, A = 76,
      s = {
        background: void 0,
        divider: void 0,
        item: void 0,
        itemOver: void 0,
        itemImage: void 0,
        itemActive: void 0
      },
      u, I = this;
    I.element = function() {
      return l
    };
    I.redraw = function() {
      j && j.redraw()
    };
    I.show = function() {
      c.show(l)
    };
    I.hide = function() {
      c.hide(l)
    };
    l = n("div", "jwplaylist");
    l.id = v.id + "_jwplayer_playlistcomponent";
    u = "basic" == v._model.playlistlayout;
    B = n("div", "jwlistcontainer");
    l.appendChild(B);
    c.foreach(s, function(a) {
      s[a] = r.getSkinElement("playlist", a)
    });
    u && (A = 32);
    s.divider && (A += s.divider.height);
    var w = 0,
      y = 0,
      K = 0;
    c.clearCss(C());
    d(C(), {
      "background-color": m.backgroundcolor
    });
    d(C("jwlist"), {
      "background-image": s.background ? " url(" + s.background.src + ")" : ""
    });
    d(C("jwlist *"), {
      color: m.fontcolor,
      font: m.fontweight + " " + m.fontsize + "px Arial, Helvetica, sans-serif"
    });
    s.itemImage ? (w = (A - s.itemImage.height) / 2 + "px ", y = s.itemImage.width, K = s.itemImage.height) : (y = 4 * A / 3, K = A);
    s.divider && d(C("jwplaylistdivider"), {
      "background-image": "url(" + s.divider.src + ")",
      "background-size": "100% " + s.divider.height + "px",
      width: "100%",
      height: s.divider.height
    });
    d(C("jwplaylistimg"), {
      height: K,
      width: y,
      margin: w ? w + "0 " + w + w : "0 5px 0 0"
    });
    d(C("jwlist li"), {
      "background-image": s.item ? "url(" + s.item.src + ")" : "",
      height: A,
      overflow: "hidden",
      "background-size": "100% " + A + "px",
      cursor: "pointer"
    });
    w = {
      overflow: "hidden"
    };
    "" !== m.activecolor && (w.color = m.activecolor);
    s.itemActive && (w["background-image"] = "url(" + s.itemActive.src + ")");
    d(C("jwlist li.active"),
      w);
    d(C("jwlist li.active .jwtitle"), {
      color: m.titleactivecolor
    });
    d(C("jwlist li.active .jwdescription"), {
      color: m.activecolor
    });
    w = {
      overflow: "hidden"
    };
    "" !== m.overcolor && (w.color = m.overcolor);
    s.itemOver && (w["background-image"] = "url(" + s.itemOver.src + ")");
    h || (d(C("jwlist li:hover"), w), d(C("jwlist li:hover .jwtitle"), {
      color: m.titleovercolor
    }), d(C("jwlist li:hover .jwdescription"), {
      color: m.overcolor
    }));
    d(C("jwtextwrapper"), {
      height: A,
      position: "relative"
    });
    d(C("jwtitle"), {
      overflow: "hidden",
      display: "inline-block",
      height: u ? A : 20,
      color: m.titlecolor,
      "font-size": m.titlesize,
      "font-weight": m.titleweight,
      "margin-top": u ? "0 10px" : 10,
      "margin-left": 10,
      "margin-right": 10,
      "line-height": u ? A : 20
    });
    d(C("jwdescription"), {
      display: "block",
      "font-size": m.fontsize,
      "line-height": 18,
      "margin-left": 10,
      "margin-right": 10,
      overflow: "hidden",
      height: 36,
      position: "relative"
    });
    v.jwAddEventListener(b.JWPLAYER_PLAYLIST_LOADED, function() {
      B.innerHTML = "";
      for (var a = v.jwGetPlaylist(), b = [], e = 0; e < a.length; e++) a[e]["ova.hidden"] || b.push(a[e]);
      if (z = b) {
        a =
          n("ul", "jwlist");
        a.id = l.id + "_ul" + Math.round(1E7 * Math.random());
        p = a;
        for (a = 0; a < z.length; a++) {
          var f = a,
            b = z[f],
            e = n("li", "jwitem"),
            k = void 0;
          e.id = p.id + "_item_" + f;
          0 < f ? (k = n("div", "jwplaylistdivider"), e.appendChild(k)) : (f = s.divider ? s.divider.height : 0, e.style.height = A - f + "px", e.style["background-size"] = "100% " + (A - f) + "px");
          f = n("div", "jwplaylistimg jwfill");
          k = void 0;
          b["playlist.image"] && s.itemImage ? k = b["playlist.image"] : b.image && s.itemImage ? k = b.image : s.itemImage && (k = s.itemImage.src);
          k && !u && (d("#" + e.id + " .jwplaylistimg", {
            "background-image": k
          }), e.appendChild(f));
          f = n("div", "jwtextwrapper");
          k = n("span", "jwtitle");
          k.innerHTML = b && b.title ? b.title : "";
          f.appendChild(k);
          b.description && !u && (k = n("span", "jwdescription"), k.innerHTML = b.description, f.appendChild(k));
          e.appendChild(f);
          b = e;
          h ? (new c.touch(b)).addEventListener(c.touchEvents.TAP, q(a)) : b.onclick = q(a);
          p.appendChild(b)
        }
        G = v.jwGetPlaylistIndex();
        B.appendChild(p);
        j = new g.playlistslider(l.id + "_slider", v.skin, l, p)
      }
    });
    v.jwAddEventListener(b.JWPLAYER_PLAYLIST_ITEM, function(b) {
      0 <=
        G && (a.getElementById(p.id + "_item_" + G).className = "jwitem", G = b.index);
      a.getElementById(p.id + "_item_" + b.index).className = "jwitem active";
      b = v.jwGetPlaylistIndex();
      b != x && (x = -1, j && j.visible() && j.thumbPosition(b / (v.jwGetPlaylist().length - 1)))
    });
    v.jwAddEventListener(b.JWPLAYER_RESIZE, function() {
      I.redraw()
    });
    return this
  };
  d(".jwplaylist", {
    position: "absolute",
    width: "100%",
    height: "100%"
  });
  c.dragStyle(".jwplaylist", "none");
  d(".jwplaylist .jwplaylistimg", {
    position: "relative",
    width: "100%",
    "float": "left",
    margin: "0 5px 0 0",
    background: "#000",
    overflow: "hidden"
  });
  d(".jwplaylist .jwlist", {
    position: "absolute",
    width: "100%",
    "list-style": "none",
    margin: 0,
    padding: 0,
    overflow: "hidden"
  });
  d(".jwplaylist .jwlistcontainer", {
    position: "absolute",
    overflow: "hidden",
    width: "100%",
    height: "100%"
  });
  d(".jwplaylist .jwlist li", {
    width: "100%"
  });
  d(".jwplaylist .jwtextwrapper", {
    overflow: "hidden"
  });
  d(".jwplaylist .jwplaylistdivider", {
    position: "absolute"
  });
  h && c.transitionStyle(".jwplaylist .jwlist", "top .35s")
})(jwplayer.html5);
(function(g) {
  function k() {
    var a = [],
      b;
    for (b = 0; b < arguments.length; b++) a.push(".jwplaylist ." + arguments[b]);
    return a.join(",")
  }
  var b = jwplayer.utils,
    c = b.touchEvents,
    d = b.css,
    h = document,
    a = window;
  g.playlistslider = function(e, f, g, k) {
    function q(a) {
      return "#" + A.id + (a ? " ." + a : "")
    }

    function v(a, b, c, e) {
      var f = h.createElement("div");
      a && (f.className = a, b && d(q(a), {
        "background-image": b.src ? b.src : void 0,
        "background-repeat": e ? "repeat-y" : "no-repeat",
        height: e ? void 0 : b.height
      }));
      c && c.appendChild(f);
      return f
    }

    function r(a) {
      return (a =
        x.getSkinElement("playlist", a)) ? a : {
        width: 0,
        height: 0,
        src: void 0
      }
    }

    function m(b) {
      if (F) return b = b ? b : a.event, fa(w - (b.detail ? -1 * b.detail : b.wheelDelta / 40) / 10), b.stopPropagation && b.stopPropagation(), b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.cancelBubble = !0, b.cancel = !0, !1
    }

    function l(b) {
      0 == b.button && (I = !0);
      h.onselectstart = function() {
        return !1
      };
      a.addEventListener("mousemove", z, !1);
      a.addEventListener("mouseup", G, !1)
    }

    function B(a) {
      fa(w - 2 * a.deltaY / j.clientHeight)
    }

    function z(a) {
      if (I || "click" == a.type) {
        var c =
          b.bounds(s),
          d = u.clientHeight / 2;
        fa((a.pageY - c.top - d) / (c.height - d - d))
      }
    }

    function p(a) {
      return function(b) {
        0 < b.button || (fa(w + 0.05 * a), y = setTimeout(function() {
          K = setInterval(function() {
            fa(w + 0.05 * a)
          }, 50)
        }, 500))
      }
    }

    function G() {
      I = !1;
      a.removeEventListener("mousemove", z);
      a.removeEventListener("mouseup", G);
      h.onselectstart = void 0;
      clearTimeout(y);
      clearInterval(K)
    }
    var x = f,
      j = k,
      A, s, u, I, w = 0,
      y, K;
    f = b.isMobile();
    var F = !0,
      H, E, M, J, U, t, R, T, W;
    this.element = function() {
      return A
    };
    this.visible = function() {
      return F
    };
    var Y = this.redraw =
      function() {
        clearTimeout(W);
        W = setTimeout(function() {
          if (j && j.clientHeight) {
            var a = j.parentNode.clientHeight / j.clientHeight;
            0 > a && (a = 0);
            1 < a ? F = !1 : (F = !0, d(q("jwthumb"), {
              height: Math.max(s.clientHeight * a, U.height + t.height)
            }));
            d(q(), {
              visibility: F ? "visible" : "hidden"
            });
            j && (j.style.width = F ? j.parentElement.clientWidth - M.width + "px" : "")
          } else W = setTimeout(Y, 10)
        }, 0)
      },
      fa = this.thumbPosition = function(a) {
        isNaN(a) && (a = 0);
        w = Math.max(0, Math.min(1, a));
        d(q("jwthumb"), {
          top: R + (s.clientHeight - u.clientHeight) * w
        });
        k && (k.style.top =
          Math.min(0, A.clientHeight - k.scrollHeight) * w + "px")
      };
    A = v("jwslider", null, g);
    A.id = e;
    e = new b.touch(j);
    f ? e.addEventListener(c.DRAG, B) : (A.addEventListener("mousedown", l, !1), A.addEventListener("click", z, !1));
    H = r("sliderCapTop");
    E = r("sliderCapBottom");
    M = r("sliderRail");
    e = r("sliderRailCapTop");
    g = r("sliderRailCapBottom");
    J = r("sliderThumb");
    U = r("sliderThumbCapTop");
    t = r("sliderThumbCapBottom");
    R = H.height;
    T = E.height;
    d(q(), {
      width: M.width
    });
    d(q("jwrail"), {
      top: R,
      bottom: T
    });
    d(q("jwthumb"), {
      top: R
    });
    H = v("jwslidertop",
      H, A);
    E = v("jwsliderbottom", E, A);
    s = v("jwrail", null, A);
    u = v("jwthumb", null, A);
    f || (H.addEventListener("mousedown", p(-1), !1), E.addEventListener("mousedown", p(1), !1));
    v("jwrailtop", e, s);
    v("jwrailback", M, s, !0);
    v("jwrailbottom", g, s);
    d(q("jwrailback"), {
      top: e.height,
      bottom: g.height
    });
    v("jwthumbtop", U, u);
    v("jwthumbback", J, u, !0);
    v("jwthumbbottom", t, u);
    d(q("jwthumbback"), {
      top: U.height,
      bottom: t.height
    });
    Y();
    j && !f && (j.addEventListener("mousewheel", m, !1), j.addEventListener("DOMMouseScroll", m, !1));
    return this
  };
  d(k("jwslider"), {
    position: "absolute",
    height: "100%",
    visibility: "hidden",
    right: 0,
    top: 0,
    cursor: "pointer",
    "z-index": 1,
    overflow: "hidden"
  });
  d(k("jwslider") + " *", {
    position: "absolute",
    width: "100%",
    "background-position": "center",
    "background-size": "100% 100%",
    overflow: "hidden"
  });
  d(k("jwslidertop", "jwrailtop", "jwthumbtop"), {
    top: 0
  });
  d(k("jwsliderbottom", "jwrailbottom", "jwthumbbottom"), {
    bottom: 0
  })
})(jwplayer.html5);
(function(g) {
  var k = jwplayer.utils,
    b = k.css,
    c = document,
    d = "none";
  g.rightclick = function(b, a) {
    function e(a) {
      var b = c.createElement("div");
      b.className = a.replace(".", "");
      return b
    }

    function f() {
      q || (v.style.display = d)
    }
    var C, n = k.extend({
        aboutlink: "http://www.longtailvideo.com/jwpabout/?a\x3dr\x26v\x3d" + g.version + "\x26m\x3dh\x26e\x3do",
        abouttext: "About JW Player " + g.version + "..."
      }, a),
      q = !1,
      v, r;
    this.element = function() {
      return v
    };
    this.destroy = function() {
      c.removeEventListener("mousedown", f, !1)
    };
    C = c.getElementById(b.id);
    v = e(".jwclick");
    v.id = b.id + "_menu";
    v.style.display = d;
    C.oncontextmenu = function(a) {
      if (!q) {
        null == a && (a = window.event);
        var b = null != a.target ? a.target : a.srcElement,
          c = k.bounds(C),
          b = k.bounds(b);
        v.style.display = d;
        v.style.left = (a.offsetX ? a.offsetX : a.layerX) + b.left - c.left + "px";
        v.style.top = (a.offsetY ? a.offsetY : a.layerY) + b.top - c.top + "px";
        v.style.display = "block";
        a.preventDefault()
      }
    };
    v.onmouseover = function() {
      q = !0
    };
    v.onmouseout = function() {
      q = !1
    };
    c.addEventListener("mousedown", f, !1);
    r = e(".jwclick_item");
    r.innerHTML =
      n.abouttext;
    r.onclick = function() {
      window.top.location = n.aboutlink
    };
    v.appendChild(r);
    C.appendChild(v)
  };
  b(".jwclick", {
    "background-color": "#FFF",
    "-webkit-border-radius": 5,
    "-moz-border-radius": 5,
    "border-radius": 5,
    height: "auto",
    border: "1px solid #bcbcbc",
    "font-family": '"MS Sans Serif", "Geneva", sans-serif',
    "font-size": 10,
    width: 320,
    "-webkit-box-shadow": "5px 5px 7px rgba(0,0,0,.10), 0 1px 0 rgba(255,255,255,.3) inset",
    "-moz-box-shadow": "5px 5px 7px rgba(0,0,0,.10), 0 1px 0 rgba(255,255,255,.3) inset",
    "box-shadow": "5px 5px 7px rgba(0,0,0,.10), 0 1px 0 rgba(255,255,255,.3) inset",
    position: "absolute",
    "z-index": 999
  }, !0);
  b(".jwclick div", {
    padding: "8px 21px",
    margin: "0px",
    "background-color": "#FFF",
    border: "none",
    "font-family": '"MS Sans Serif", "Geneva", sans-serif',
    "font-size": 10,
    color: "inherit"
  }, !0);
  b(".jwclick_item", {
    padding: "8px 21px",
    "text-align": "left",
    cursor: "pointer"
  }, !0);
  b(".jwclick_item:hover", {
    "background-color": "#595959",
    color: "#FFF"
  }, !0);
  b(".jwclick_item a", {
    "text-decoration": d,
    color: "#000"
  }, !0);
  b(".jwclick hr", {
    width: "100%",
    padding: 0,
    margin: 0,
    border: "1px #e9e9e9 solid"
  }, !0)
})(jwplayer.html5);
(function(g) {
  var k = g.html5,
    b = g.utils,
    c = g.events,
    d = 2,
    h = 4;
  k.setup = function(a, e) {
    function f() {
      for (var a = 0; a < G.length; a++) {
        var b = G[a],
          c;
        a: {
          if (c = b.depends) {
            c = c.toString().split(",");
            for (var d = 0; d < c.length; d++)
              if (!m[c[d]]) {
                c = !1;
                break a
              }
          }
          c = !0
        }
        if (c) {
          G.splice(a, 1);
          try {
            b.method(), f()
          } catch (e) {
            v(e.message)
          }
          return
        }
      }
      0 < G.length && !z && setTimeout(f, 500)
    }

    function C() {
      m[d] = !0
    }

    function n(a) {
      v("Error loading skin: " + a)
    }

    function q() {
      p && (p.onload = null, p = p.onerror = null);
      clearTimeout(x);
      m[h] = !0
    }

    function v(a) {
      z = !0;
      B.sendEvent(c.JWPLAYER_ERROR, {
        message: a
      });
      r.setupError(a)
    }
    var r = e,
      m = {},
      l, B = new c.eventdispatcher,
      z = !1,
      p, G = [{
        name: 1,
        method: function() {
          a.edition && "invalid" == a.edition() ? v("Error setting up player: Invalid license key") : m[1] = !0
        },
        depends: !1
      }, {
        name: d,
        method: function() {
          l = new k.skin;
          l.load(a.config.skin, C, n)
        },
        depends: 1
      }, {
        name: 3,
        method: function() {
          var c = b.typeOf(a.config.playlist);
          "array" === c ? (c = new g.playlist(a.config.playlist), a.setPlaylist(c), 0 === a.playlist.length || 0 === a.playlist[0].sources.length ? v("Error loading playlist: No playable sources found") :
            m[3] = !0) : v("Playlist type not supported: " + c)
        },
        depends: 1
      }, {
        name: h,
        method: function() {
          var b = a.playlist[a.item].image;
          b ? (p = new Image, p.onload = q, p.onerror = q, p.src = b, clearTimeout(x), x = setTimeout(q, 500)) : q()
        },
        depends: 3
      }, {
        name: 5,
        method: function() {
          r.setup(l);
          m[5] = !0
        },
        depends: h + "," + d
      }, {
        name: 6,
        method: function() {
          m[6] = !0
        },
        depends: "5,3"
      }, {
        name: 7,
        method: function() {
          B.sendEvent(c.JWPLAYER_READY);
          m[7] = !0
        },
        depends: 6
      }],
      x = -1;
    b.extend(this, B);
    this.start = f
  }
})(jwplayer);
(function(g) {
  g.skin = function() {
    var k = {},
      b = !1;
    this.load = function(c, d, h) {
      new g.skinloader(c, function(a) {
        b = !0;
        k = a;
        "function" == typeof d && d()
      }, function(a) {
        "function" == typeof h && h(a)
      })
    };
    this.getSkinElement = function(c, d) {
      c = c.toLowerCase();
      d = d.toLowerCase();
      if (b) try {
        return k[c].elements[d]
      } catch (g) {
        jwplayer.utils.log("No such skin component / element: ", [c, d])
      }
      return null
    };
    this.getComponentSettings = function(c) {
      c = c.toLowerCase();
      return b && k && k[c] ? k[c].settings : null
    };
    this.getComponentLayout = function(c) {
      c = c.toLowerCase();
      if (b) {
        var d = k[c].layout;
        if (d && (d.left || d.right || d.center)) return k[c].layout
      }
      return null
    }
  }
})(jwplayer.html5);
(function(g) {
  var k = jwplayer.utils,
    b = k.foreach,
    c = "Skin formatting error";
  g.skinloader = function(d, h, a) {
    function e(a) {
      r = a;
      k.ajax(k.getAbsolutePath(p), function(a) {
        try {
          k.exists(a.responseXML) && C(a.responseXML)
        } catch (b) {
          l(c)
        }
      }, function(a) {
        l(a)
      })
    }

    function f(a, b) {
      return a ? a.getElementsByTagName(b) : null
    }

    function C(a) {
      var b = f(a, "skin")[0];
      a = f(b, "component");
      var c = b.getAttribute("target"),
        b = parseFloat(b.getAttribute("pixelratio"));
      0 < b && (j = b);
      (!c || parseFloat(c) > parseFloat(jwplayer.version)) && l("Incompatible player version");
      if (0 === a.length) m(r);
      else
        for (c = 0; c < a.length; c++) {
          var d = v(a[c].getAttribute("name")),
            b = {
              settings: {},
              elements: {},
              layout: {}
            },
            e = f(f(a[c], "elements")[0], "element");
          r[d] = b;
          for (var g = 0; g < e.length; g++) q(e[g], d);
          if ((d = f(a[c], "settings")[0]) && 0 < d.childNodes.length) {
            d = f(d, "setting");
            for (e = 0; e < d.length; e++) {
              var g = d[e].getAttribute("name"),
                h = d[e].getAttribute("value");
              /color$/.test(g) && (h = k.stringToColor(h));
              b.settings[v(g)] = h
            }
          }
          if ((d = f(a[c], "layout")[0]) && 0 < d.childNodes.length) {
            d = f(d, "group");
            for (e = 0; e < d.length; e++) {
              h =
                d[e];
              g = {
                elements: []
              };
              b.layout[v(h.getAttribute("position"))] = g;
              for (var p = 0; p < h.attributes.length; p++) {
                var z = h.attributes[p];
                g[z.name] = z.value
              }
              h = f(h, "*");
              for (p = 0; p < h.length; p++) {
                z = h[p];
                g.elements.push({
                  type: z.tagName
                });
                for (var x = 0; x < z.attributes.length; x++) {
                  var C = z.attributes[x];
                  g.elements[p][v(C.name)] = C.value
                }
                k.exists(g.elements[p].name) || (g.elements[p].name = z.tagName)
              }
            }
          }
          B = !1;
          n()
        }
    }

    function n() {
      clearInterval(z);
      G || (z = setInterval(function() {
        var a = !0;
        b(r, function(c, d) {
          "properties" != c && b(d.elements,
            function(b) {
              (r[v(c)] ? r[v(c)].elements[v(b)] : null).ready || (a = !1)
            })
        });
        a && !B && (clearInterval(z), m(r))
      }, 100))
    }

    function q(a, b) {
      b = v(b);
      var c = new Image,
        d = v(a.getAttribute("name")),
        e = a.getAttribute("src");
      if (0 !== e.indexOf("data:image/png;base64,")) var f = k.getAbsolutePath(p),
        e = [f.substr(0, f.lastIndexOf("/")), b, e].join("/");
      r[b].elements[d] = {
        height: 0,
        width: 0,
        src: "",
        ready: !1,
        image: c
      };
      c.onload = function() {
        var a = b,
          e = r[v(a)] ? r[v(a)].elements[v(d)] : null;
        e ? (e.height = Math.round(c.height / j * x), e.width = Math.round(c.width /
          j * x), e.src = c.src, e.ready = !0, n()) : k.log("Loaded an image for a missing element: " + a + "." + d)
      };
      c.onerror = function() {
        G = !0;
        n();
        l("Skin image not found: " + this.src)
      };
      c.src = e
    }

    function v(a) {
      return a ? a.toLowerCase() : ""
    }
    var r = {},
      m = h,
      l = a,
      B = !0,
      z, p = d,
      G = !1,
      x = (jwplayer.utils.isMobile(), 1),
      j = 1;
    "string" != typeof p || "" === p ? C(g.defaultskin()) : "xml" != k.extension(p) ? l("Skin not a valid file type") : new g.skinloader("", e, l)
  }
})(jwplayer.html5);
(function(g) {
  var k = g.utils,
    b = g.events,
    c = k.css;
  g.html5.thumbs = function(d) {
    function h(b) {
      q = null;
      try {
        b = (new g.parsers.srt).parse(b.responseText, !0)
      } catch (c) {
        a(c.message);
        return
      }
      if ("array" !== k.typeOf(b)) return a("Invalid data");
      C = b
    }

    function a(a) {
      q = null;
      k.log("Thumbnails could not be loaded: " + a)
    }

    function e(a, b, d) {
      a.onload = null;
      b.width || (b.width = a.width, b.height = a.height);
      b["background-image"] = a.src;
      c.style(f, b);
      d && d(b.width)
    }
    var f, C, n, q, v, r = {},
      m, l = new b.eventdispatcher;
    k.extend(this, l);
    f = document.createElement("div");
    f.id = d;
    this.load = function(b) {
      c.style(f, {
        display: "none"
      });
      q && (q.onload = null, q.onreadystatechange = null, q.onerror = null, q.abort && q.abort(), q = null);
      m && (m.onload = null);
      b ? (n = b.split("?")[0].split("/").slice(0, -1).join("/"), q = k.ajax(b, h, a, !0)) : (C = v = m = null, r = {})
    };
    this.element = function() {
      return f
    };
    this.updateTimeline = function(b, c) {
      if (C) {
        for (var d = 0; d < C.length && b > C[d].end;) d++;
        d === C.length && d--;
        d = C[d].text;
        a: {
          var f = d;
          if (f && f !== v) {
            v = f;
            0 > f.indexOf("://") && (f = n ? n + "/" + f : f);
            var g = {
              display: "block",
              margin: "0 auto",
              "background-position": "0 0",
              width: 0,
              height: 0
            };
            if (0 < f.indexOf("#xywh")) try {
              var h = /(.+)\#xywh=(\d+),(\d+),(\d+),(\d+)/.exec(f),
                f = h[1];
              g["background-position"] = -1 * h[2] + "px " + -1 * h[3] + "px";
              g.width = h[4];
              g.height = h[5]
            } catch (k) {
              a("Could not parse thumbnail");
              break a
            }
            var l = r[f];
            l ? e(l, g, c) : (l = new Image, l.onload = function() {
              e(l, g, c)
            }, r[f] = l, l.src = f);
            m && (m.onload = null);
            m = l
          }
        }
        return d
      }
    }
  }
})(jwplayer);
(function(g) {
  var k = g.jwplayer,
    b = k.html5,
    c = k.utils,
    d = k.events,
    h = d.state,
    a = c.css,
    e = c.bounds,
    f = c.isMobile(),
    C = c.isIPad(),
    n = c.isIPod(),
    q = document,
    v = "aspectMode",
    r = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"],
    m = !0,
    l = !m,
    B = l,
    z = "hidden",
    p = "none",
    G = "block";
  b.view = function(x, j) {
    function A(a) {
      a = c.between(j.position + a, 0, this.getDuration());
      this.seek(a)
    }

    function s(a) {
      a = c.between(this.getVolume() + a, 0, 100);
      this.setVolume(a)
    }

    function u(a) {
      var b;
      b = a.ctrlKey || a.metaKey ? !1 :
        j.controls ? !0 : !1;
      if (!b) return !0;
      N.adMode() || (Q(), M());
      b = k(x.id);
      switch (a.keyCode) {
        case 27:
          b.setFullscreen(l);
          break;
        case 13:
        case 32:
          b.play();
          break;
        case 37:
          N.adMode() || A.call(b, -5);
          break;
        case 39:
          N.adMode() || A.call(b, 5);
          break;
        case 38:
          s.call(b, 10);
          break;
        case 40:
          s.call(b, -10);
          break;
        case 77:
          b.setMute();
          break;
        case 70:
          b.setFullscreen();
          break;
        default:
          if (48 <= a.keyCode && 59 >= a.keyCode) {
            var c = (a.keyCode - 48) / 10 * b.getDuration();
            b.seek(c)
          }
      }
      if (/13|32|37|38|39|40/.test(a.keyCode)) return a.preventDefault(), !1
    }

    function I() {
      var a = !Da;
      Da = !1;
      a && ma.sendEvent(d.JWPLAYER_VIEW_TAB_FOCUS, {
        hasFocus: !0
      });
      N.adMode() || (Q(), M())
    }

    function w() {
      Da = !1;
      ma.sendEvent(d.JWPLAYER_VIEW_TAB_FOCUS, {
        hasFocus: !1
      })
    }

    function y() {
      var a = e(O),
        b = Math.round(a.width),
        c = Math.round(a.height);
      if (q.body.contains(O)) {
        if (b && c && (b !== Xa || c !== va)) Xa = b, va = c, L && L.redraw(), clearTimeout(X), X = setTimeout(aa, 50), ma.sendEvent(d.JWPLAYER_RESIZE, {
          width: b,
          height: c
        })
      } else g.removeEventListener("resize", y), f && g.removeEventListener("orientationchange", y);
      return a
    }

    function K(a) {
      a &&
        (a.element().addEventListener("mousemove", U, l), a.element().addEventListener("mouseout", t, l))
    }

    function F() {}

    function H() {
      clearTimeout(Aa);
      Aa = setTimeout(ya, 10)
    }

    function E(a, b) {
      var c = q.createElement(a);
      b && (c.className = b);
      return c
    }

    function M() {
      clearTimeout(Aa);
      Aa = setTimeout(ya, Wa)
    }

    function J() {
      clearTimeout(Aa);
      if (x.jwGetState() == h.PAUSED || x.jwGetState() == h.PLAYING) Ca(), ra || (Aa = setTimeout(ya, Wa))
    }

    function U() {
      clearTimeout(Aa);
      ra = m
    }

    function t() {
      ra = l
    }

    function R(a) {
      ma.sendEvent(a.type, a)
    }

    function T(a) {
      if (a.done) W();
      else {
        if (!a.complete) {
          N.adMode() || (N.instreamMode(!0), N.adMode(!0), N.show(!0));
          N.setText(a.message);
          var b = a.onClick;
          void 0 !== b && L.setAlternateClickHandler(function() {
            b(a)
          });
          void 0 !== a.onSkipAd && $ && $.setSkipoffset(a, a.onSkipAd)
        }
        $ && $.adChanged(a)
      }
    }

    function W() {
      N.setText("");
      N.adMode(!1);
      N.instreamMode(!1);
      N.show(!0);
      $ && $.adsEnded();
      L.revertAlternateClickHandler()
    }

    function Y(b, d, e) {
      var f = O.className,
        g, h, k = x.id + "_view";
      a.block(k);
      if (e = !!e) f = f.replace(/\s*aspectMode/, ""), O.className !== f && (O.className = f),
        a.style(O, {
          display: G
        }, e);
      c.exists(b) && c.exists(d) && (j.width = b, j.height = d);
      e = {
        width: b
      }; - 1 == f.indexOf(v) && (e.height = d);
      a.style(O, e, !0);
      L && L.redraw();
      N && N.redraw(m);
      da && (da.offset(N && 0 <= da.position().indexOf("bottom") ? N.height() + N.margin() : 0), setTimeout(function() {
        V && V.offset("top-left" == da.position() ? da.element().clientWidth + da.margin() : 0)
      }, 500));
      fa(d);
      g = j.playlistsize;
      h = j.playlistposition;
      if (Ya && g && ("right" == h || "bottom" == h)) Ya.redraw(), f = {
          display: G
        }, e = {}, f[h] = 0, e[h] = g, "right" == h ? f.width = g : f.height =
        g, a.style(Va, f), a.style(xa, e);
      aa(b, d);
      a.unblock(k)
    }

    function fa(a) {
      var b = e(O);
      ba = 0 < a.toString().indexOf("%") || 0 === b.height ? l : "bottom" == j.playlistposition ? b.height <= 40 + j.playlistsize : 40 >= b.height;
      N && (ba ? (N.audioMode(m), Ca(), L.hidePreview(m), L && L.hide(), Ha(l)) : (N.audioMode(l), Ta(x.jwGetState())));
      da && ba && ab();
      O.style.backgroundColor = ba ? "transparent" : "#000"
    }

    function aa(a, b) {
      if (!a || isNaN(Number(a))) {
        if (!ia) return;
        a = ia.clientWidth
      }
      if (!b || isNaN(Number(b))) {
        if (!ia) return;
        b = ia.clientHeight
      }
      j.getVideo().resize(a,
        b, j.stretching) && (clearTimeout(X), X = setTimeout(aa, 250))
    }

    function Z(b) {
      if (b.target === O || O.contains(b.target)) {
        void 0 !== b.jwstate ? b = b.jwstate : Ja ? (b = q.currentFullScreenElement || q.webkitCurrentFullScreenElement || q.mozFullScreenElement || q.msFullscreenElement, b = !!(b && b.id === x.id)) : b = j.getVideo().getFullScreen();
        var c = O.className.replace(/\s*jwfullscreen/, ""),
          d = {};
        b ? (c += " jwfullscreen", d["overflow-y"] = z) : d["overflow-y"] = "";
        O.className = c;
        a.style(q.body, d);
        N && N.redraw();
        L && L.redraw();
        V && V.redraw();
        aa();
        j.setFullscreen(b);
        b ? (clearTimeout(X), X = setTimeout(aa, 200)) : C && x.jwGetState() == h.PAUSED && setTimeout(Oa, 500)
      }
    }

    function Q() {
      (!n || ba) && N && j.controls && N.show()
    }

    function ha() {
      D !== m && N && (!ba && !j.getVideo().audioMode()) && N.hide()
    }

    function ea() {
      V && (!ba && j.controls) && V.show()
    }

    function Pa() {
      V && (!Ka && !j.getVideo().audioMode()) && V.hide()
    }

    function ab() {
      da && (!j.getVideo().audioMode() || ba) && da.hide(ba)
    }

    function Oa() {
      L && j.controls && !ba && (!n || x.jwGetState() == h.IDLE) && L.show();
      (!f || !j.fullscreen) && j.getVideo().setControls(l)
    }

    function ya() {
      clearTimeout(Aa);
      if (D !== m) {
        Ba = l;
        var a = x.jwGetState();
        (!j.controls || a != h.PAUSED) && ha();
        j.controls || Pa();
        a != h.IDLE && a != h.PAUSED && (Pa(), ab())
      }
    }

    function Ca() {
      if (D !== l) {
        Ba = m;
        if ((j.controls || ba) && !(n && ja == h.PAUSED)) Q(), ea();
        lb.hide && da && !ba && da.show()
      }
    }

    function Ha(a) {
      a = a && !ba;
      j.getVideo().setVisibility(a)
    }

    function bb() {
      Ka = m;
      ta(l);
      j.controls && ea()
    }

    function cb() {}

    function Ma(a) {
      Ka = l;
      clearTimeout(eb);
      eb = setTimeout(function() {
        Ta(a.newstate)
      }, 100)
    }

    function qb() {
      ha()
    }

    function Ta(b) {
      ja = b;
      if (j.getVideo().isCaster) L && (L.show(),
        L.hidePreview(l)), a.style(ia, {
        visibility: z,
        opacity: 0
      }), N && (N.show(), N.hideFullscreen(m));
      else {
        switch (b) {
          case h.PLAYING:
            D = j.getVideo().isCaster !== m ? null : m;
            (ua ? Sa : j).getVideo().audioMode() ? (Ha(l), L.hidePreview(ba), L.setHiding(m), N && (Ca(), N.hideFullscreen(m)), ea()) : (Ha(m), aa(), L.hidePreview(m), N && N.hideFullscreen(l));
            break;
          case h.IDLE:
            Ha(l);
            ba || (L.hidePreview(l), Oa(), ea(), N && N.hideFullscreen(l));
            break;
          case h.BUFFERING:
            Oa();
            ya();
            f && Ha(m);
            break;
          case h.PAUSED:
            Oa(), Ca()
        }
        da && !ba && da.show()
      }
    }

    function Ua(a) {
      return "#" +
        x.id + (a ? " ." + a : "")
    }

    function La(b, c) {
      a(b, {
        display: c ? G : p
      })
    }
    var O, xa, na, fb, Va, Aa = -1,
      Wa = f ? 4E3 : 2E3,
      ia, Xa, va, Ia, za, Na, Sa, ua = l,
      N, L, $, V, da, lb = c.extend({}, j.componentConfig("logo")),
      ca, Ya, ba, pa = l,
      Ba = l,
      D = null,
      Ka, P, X = -1,
      ra = l,
      ja, Ea, ga, Ja = !1,
      Da = !1,
      ma = c.extend(this, new d.eventdispatcher);
    this.getCurrentCaptions = function() {
      return ca.getCurrentCaptions()
    };
    this.setCurrentCaptions = function(a) {
      ca.setCurrentCaptions(a)
    };
    this.getCaptionsList = function() {
      return ca.getCaptionsList()
    };
    this.setup = function(e) {
      if (!pa) {
        x.skin =
          e;
        xa = E("span", "jwmain");
        xa.id = x.id + "_view";
        ia = E("span", "jwvideo");
        ia.id = x.id + "_media";
        na = E("span", "jwcontrols");
        Ia = E("span", "jwinstream");
        Va = E("span", "jwplaylistcontainer");
        fb = E("span", "jwaspect");
        e = j.height;
        var t = j.componentConfig("controlbar"),
          s = j.componentConfig("display");
        fa(e);
        ca = new b.captions(x, j.captions);
        ca.addEventListener(d.JWPLAYER_CAPTIONS_LIST, R);
        ca.addEventListener(d.JWPLAYER_CAPTIONS_CHANGED, R);
        ca.addEventListener(d.JWPLAYER_CAPTIONS_LOADED, F);
        na.appendChild(ca.element());
        L = new b.display(x,
          s);
        L.addEventListener(d.JWPLAYER_DISPLAY_CLICK, function(a) {
          R(a);
          f ? Ba ? ya() : Ca() : Ma({
            newstate: x.jwGetState()
          });
          Ba && M()
        });
        ba && L.hidePreview(m);
        na.appendChild(L.element());
        da = new b.logo(x, lb);
        na.appendChild(da.element());
        V = new b.dock(x, j.componentConfig("dock"));
        na.appendChild(V.element());
        x.edition && !f ? P = new b.rightclick(x, {
          abouttext: j.abouttext,
          aboutlink: j.aboutlink
        }) : f || (P = new b.rightclick(x, {}));
        j.playlistsize && (j.playlistposition && j.playlistposition != p) && (Ya = new b.playlistcomponent(x, {}), Va.appendChild(Ya.element()));
        N = new b.controlbar(x, t);
        N.addEventListener(d.JWPLAYER_USER_ACTION, M);
        na.appendChild(N.element());
        n && ha();
        B && ma.forceControls(m);
        xa.appendChild(ia);
        xa.appendChild(na);
        xa.appendChild(Ia);
        O.appendChild(xa);
        O.appendChild(fb);
        O.appendChild(Va);
        j.getVideo().setContainer(ia);
        j.addEventListener("fullscreenchange", Z);
        for (e = r.length; e--;) q.addEventListener(r[e], Z, l);
        g.removeEventListener("resize", y);
        g.addEventListener("resize", y, l);
        f && (g.removeEventListener("orientationchange", y), g.addEventListener("orientationchange",
          y, l));
        k(x.id).onAdPlay(function() {
          N.adMode(!0);
          Ta(h.PLAYING)
        });
        k(x.id).onAdSkipped(function() {
          N.adMode(!1)
        });
        k(x.id).onAdComplete(function() {
          N.adMode(!1)
        });
        x.jwAddEventListener(d.JWPLAYER_PLAYER_READY, cb);
        x.jwAddEventListener(d.JWPLAYER_PLAYER_STATE, Ma);
        x.jwAddEventListener(d.JWPLAYER_MEDIA_ERROR, qb);
        x.jwAddEventListener(d.JWPLAYER_PLAYLIST_COMPLETE, bb);
        x.jwAddEventListener(d.JWPLAYER_CAST_AVAILABLE, function(a) {
          a.available ? (ma.forceControls(m), B = m) : ma.releaseControls()
        });
        x.jwAddEventListener(d.JWPLAYER_CAST_SESSION,
          function(b) {
            $ || ($ = new k.html5.castDisplay(x.id), $.statusDelegate = function(a) {
              $.setState(a.newstate)
            });
            b.active ? (a.style(ca.element(), {
              display: "none"
            }), ma.forceControls(m), $.setState("connecting").setName(b.deviceName).show(), x.jwAddEventListener(d.JWPLAYER_PLAYER_STATE, $.statusDelegate), x.jwAddEventListener(d.JWPLAYER_CAST_AD_CHANGED, T)) : (x.jwRemoveEventListener(d.JWPLAYER_PLAYER_STATE, $.statusDelegate), x.jwRemoveEventListener(d.JWPLAYER_CAST_AD_CHANGED, T), $.hide(), N.adMode() && W(), a.style(ca.element(), {
              display: null
            }), Ma({
              newstate: x.jwGetState()
            }), y())
          });
        Ma({
          newstate: h.IDLE
        });
        f || (na.addEventListener("mouseout", H, l), na.addEventListener("mousemove", J, l), c.isMSIE() && (ia.addEventListener("mousemove", J, l), ia.addEventListener("click", L.clickHandler)));
        K(N);
        K(V);
        K(da);
        a("#" + O.id + "." + v + " .jwaspect", {
          "margin-top": j.aspectratio,
          display: G
        });
        e = c.exists(j.aspectratio) ? parseFloat(j.aspectratio) : 100;
        t = j.playlistsize;
        a("#" + O.id + ".playlist-right .jwaspect", {
          "margin-bottom": -1 * t * (e / 100) + "px"
        });
        a("#" + O.id + ".playlist-right .jwplaylistcontainer", {
          width: t + "px",
          right: 0,
          top: 0,
          height: "100%"
        });
        a("#" + O.id + ".playlist-bottom .jwaspect", {
          "padding-bottom": t + "px"
        });
        a("#" + O.id + ".playlist-bottom .jwplaylistcontainer", {
          width: "100%",
          height: t + "px",
          bottom: 0
        });
        a("#" + O.id + ".playlist-right .jwmain", {
          right: t + "px"
        });
        a("#" + O.id + ".playlist-bottom .jwmain", {
          bottom: t + "px"
        });
        setTimeout(function() {
          Y(j.width, j.height)
        }, 0)
      }
    };
    var ta = this.fullscreen = function(a) {
      c.exists(a) || (a = !j.fullscreen);
      a = !!a;
      if ((!a || !(ua ? Sa : j).getVideo().audioMode()) && a !== j.fullscreen) a ? Ea && Ea.apply(O) :
        ga && ga.apply(q), Ja ? Z({
          type: "fullscreenrequest",
          target: O,
          jwstate: a
        }) : j.getVideo().setFullScreen(a)
    };
    this.resize = function(a, b) {
      Y(a, b, m);
      y()
    };
    this.resizeMedia = aa;
    var Fa = this.completeSetup = function() {
        a.style(O, {
          opacity: 1
        });
        g.onbeforeunload = function() {
          j.getVideo().isCaster || x.jwStop()
        }
      },
      eb;
    this.setupInstream = function(b, c, d, e) {
      a.unblock();
      La(Ua("jwinstream"), m);
      La(Ua("jwcontrols"), l);
      Ia.appendChild(b);
      za = c;
      Na = d;
      Sa = e;
      Ma({
        newstate: h.PLAYING
      });
      ua = m
    };
    this.destroyInstream = function() {
      a.unblock();
      La(Ua("jwinstream"),
        l);
      La(Ua("jwcontrols"), m);
      Ia.innerHTML = "";
      ua = l
    };
    this.setupError = function(a) {
      pa = m;
      k.embed.errorScreen(O, a, j);
      Fa()
    };
    this.addButton = function(a, b, c, d) {
      V && (V.addButton(a, b, c, d), x.jwGetState() == h.IDLE && ea())
    };
    this.removeButton = function(a) {
      V && V.removeButton(a)
    };
    this.setControls = function(a) {
      var b = j.controls,
        c = !!a;
      j.controls = c;
      c != b && (ua ? a ? (za.show(), Na.show()) : (za.hide(), Na.hide()) : c ? Ma({
        newstate: x.jwGetState()
      }) : (ya(), L && L.hide()), ma.sendEvent(d.JWPLAYER_CONTROLS, {
        controls: c
      }))
    };
    this.forceControls = function(a) {
      D = !!a;
      a ? Ca() : ya()
    };
    this.releaseControls = function() {
      D = null;
      Ta(x.jwGetState())
    };
    this.addCues = function(a) {
      N && N.addCues(a)
    };
    this.forceState = function(a) {
      L.forceState(a)
    };
    this.releaseState = function() {
      L.releaseState(x.jwGetState())
    };
    this.getSafeRegion = function() {
      var a = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
      if (!j.controls) return a;
      N.showTemp();
      V.showTemp();
      var b = e(xa),
        c = b.top,
        d = ua ? e(q.getElementById(x.id + "_instream_controlbar")) : e(N.element()),
        f = ua ? l : 0 < V.numButtons(),
        g = 0 === da.position().indexOf("top"),
        h = e(da.element());
      f && (f = e(V.element()), a.y = Math.max(0, f.bottom - c));
      g && (a.y = Math.max(a.y, h.bottom - c));
      a.width = b.width;
      a.height = d.height ? (g ? d.top : h.top) - c - a.y : b.height - a.y;
      N.hideTemp();
      V.hideTemp();
      return a
    };
    this.destroy = function() {
      g.removeEventListener("resize", y);
      g.removeEventListener("orientationchange", y);
      for (var a = r.length; a--;) q.removeEventListener(r[a], Z, l);
      j.removeEventListener("fullscreenchange", Z);
      O.removeEventListener("keydown", u, l);
      P && P.destroy();
      $ && (x.jwRemoveEventListener(d.JWPLAYER_PLAYER_STATE, $.statusDelegate),
        $.destroy(), $ = null);
      na && (na.removeEventListener("mousemove", J), na.removeEventListener("mouseout", H));
      ia && (ia.removeEventListener("mousemove", J), ia.removeEventListener("click", L.clickHandler))
    };
    O = E("div", "jwplayer playlist-" + j.playlistposition);
    O.id = x.id;
    O.tabIndex = 0;
    O.onmousedown = function() {
      Da = !0;
      ma.sendEvent(d.JWPLAYER_VIEW_TAB_FOCUS, {
        hasFocus: !1
      })
    };
    O.onfocusin = I;
    O.addEventListener("focus", I);
    O.onfocusout = w;
    O.addEventListener("blur", w);
    O.addEventListener("keydown", u);
    Ea = O.requestFullscreen || O.requestFullScreen ||
      O.webkitRequestFullscreen || O.webkitRequestFullScreen || O.webkitEnterFullscreen || O.webkitEnterFullScreen || O.mozRequestFullScreen || O.msRequestFullscreen;
    ga = q.exitFullscreen || q.cancelFullScreen || q.webkitExitFullscreen || q.webkitCancelFullScreen || q.mozCancelFullScreen || q.msExitFullscreen;
    Ja = Ea && ga;
    j.aspectratio && (a.style(O, {
      display: "inline-block"
    }), O.className = O.className.replace("jwplayer", "jwplayer " + v));
    Y(j.width, j.height);
    var Qa = q.getElementById(x.id);
    Qa.parentNode.replaceChild(O, Qa)
  };
  a(".jwplayer", {
    position: "relative",
    display: "block",
    opacity: 0,
    "min-height": 0,
    "-webkit-transition": "opacity .25s ease",
    "-moz-transition": "opacity .25s ease",
    "-o-transition": "opacity .25s ease"
  });
  a(".jwmain", {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    "-webkit-transition": "opacity .25s ease",
    "-moz-transition": "opacity .25s ease",
    "-o-transition": "opacity .25s ease"
  });
  a(".jwvideo, .jwcontrols", {
    position: "absolute",
    height: "100%",
    width: "100%",
    "-webkit-transition": "opacity .25s ease",
    "-moz-transition": "opacity .25s ease",
    "-o-transition": "opacity .25s ease"
  });
  a(".jwvideo", {
    overflow: z,
    visibility: z,
    opacity: 0,
    cursor: "pointer"
  });
  a(".jwvideo video", {
    background: "transparent",
    height: "100%",
    width: "100%",
    position: "absolute",
    margin: "auto",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0
  });
  a(".jwplaylistcontainer", {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: p
  });
  a(".jwinstream", {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "none"
  });
  a(".jwaspect", {
    display: "none"
  });
  a(".jwplayer." + v, {
    height: "auto"
  });
  a(".jwplayer.jwfullscreen", {
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    "z-index": 1E3,
    margin: 0,
    position: "fixed"
  }, m);
  a(".jwplayer.jwfullscreen .jwmain", {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, m);
  a(".jwplayer.jwfullscreen .jwplaylistcontainer", {
    display: p
  }, m);
  a(".jwplayer .jwuniform", {
    "background-size": "contain !important"
  });
  a(".jwplayer .jwfill", {
    "background-size": "cover !important",
    "background-position": "center"
  });
  a(".jwplayer .jwexactfit", {
    "background-size": "100% 100% !important"
  })
})(window);
(function(g, k) {
  function b(a) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA" + q[a]
  }

  function c(a, b) {
    var c = k.createElement(a);
    b && d(c, b);
    return c
  }

  function d(a, b) {
    b.join || (b = [b]);
    for (var c = 0; c < b.length; c++) b[c] && (b[c] = "jwcast-" + b[c]);
    a.className = b.join(" ")
  }

  function h(a, b) {
    b.join || (b = [b]);
    for (var c = 0; c < b.length; c++) a.appendChild(b[c])
  }
  var a = g.utils,
    e = g.html5,
    f = g.events,
    C = f.state,
    n = a.css,
    q = {
      wheel: "DgAAAA4CAYAAACohjseAAACiUlEQVR42u3aP2sTYRzAcZ87Md6mhE5GhRqli0NC22yNKO1iaStSY+ggdKggal6BDXRoUuwbEG1LpE4B30LAxEGbKYgO7SVoUhJD04hOusRv4ZlCwP5LevfDgw9kCnzD5Z4/95xqtVqideNLTQzjKV4gCxtNtNwaqBBGCg3UkcYz3EUIV+F1W6AHj7CFb1hAEIbbb1GFByjjAyZgSvkPXkMGW7gt7SETwQ8swpL0FFV4jjpuShsmTiOFz7gobRxUWEceXokDfQKf0CdxJhNFFT6JU7Ur2MUtiXNRhXdYlDrZnkERZyUGerCNcanLpYfISV0PGtjEpNTAGyjBkBq4ggWpWxYmGghIDRzEDgypgTG8lbyrtoZ5yYFZ3JccWMKg5MCfGJAcuHf5/ge6xwX8lnyLDmCn/SEzJChwCKX2YSIqKDCKbPtAHxcUGAdNOhBPkBYUmAZNOhDXUYMSEKdQBU06EAp1BAUEBnWLgg4EXmJJQOASXnVa0YdRcfma0NAN4U6BCpu44+LASd2g0BYIPEbexYHvdQOfOwdaqLh063AcFVj73bq3XBRnoYiZ/b58ySDposAkMlD/DNT8aGLUBXGjaMJ/0Beg9/Dd4etEH2qIHOUVdgHnHRh3DgUkjnoIIYUNh0V6sYHXUIcO1Eyso4BLDoi7jC94A/O4DgIZWEYdYycYN4YalmF04yjXNJpIwOrxOJdAE9PdPoznRxZFTPUgbgI2svD38jjlLMrI61DjmFcFU/iICmZhnMSB2DOYg41tJBGAOuSPFkASZdiYg8cpR5pHsIIGqkgjjghC6Eef1o8QIphHGlU0sIYRGE4/lB7DKnL4il/Yu/5gFzZyWEUMwzC7sXUv2l9q1CPRZSGkLwAAAABJRU5ErkJggg\x3d\x3d",
      display: "UAAAAC4AQMAAACo6KcpAAAABlBMVEV6enp6enqEWMsmAAAAAXRSTlMAQObYZgAAAEdJREFUeF7t2bEJACAMRcGAg7j/Fo6VTkvbIKSRe/XBH+DHLlaHK0qN7yAIgiAIgiAIgiAIgiAIgiAIgiAIgg0PZHfzbuUjPCPnO5qQcE/AAAAAAElFTkSuQmCC",
      pause: "CoAAAA2CAQAAAAb3sMwAAAAMElEQVR4Ae3MMQEAMAzDsIY/6AxB9/aRfyvt7GX2Ph8UCoVCoVAo9AiFQqFQKBQKfdYvoctOjDeGAAAAAElFTkSuQmCC",
      play: "DYAAAA2BAMAAAB+a3fuAAAAFVBMVEX///////////////////////////9nSIHRAAAABnRSTlMAP79AwMFfxd6iAAAAX0lEQVR4Xn3JQQGAABAEoaliFiPYYftHMMHBl55uQw455JBDDjnkkEMOOeSQQw455JBDDjnkkEMOOeSQQ+5O3HffW6hQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKgfWHsiYI6VycIAAAAASUVORK5CYII\x3d",
      replay: "DQAAAA8CAYAAAApK5mGAAADkklEQVRoBd3BW2iVBRwA8P/cWHMsv9QilLCITLCU0khpST6JCEXrQbKMCgrKFwsfZq/LMnRRIdkFvBQUvmShgg9iV02zB7FScyWlqNHNqbCJ7PKLkFHp952dnZ3tfOv3ixgGSLAVt8b/ARIX9WADJsVIhsR/daIV42MkQiJdO5ZjdIwkSBR2Ek+gJkYCJIpzEE2Rd0gMzB7MibxCojRbcEtUGsZgJu7HYixVuh6sx6QYLrgSD+Fd/GhodKIV42Ko4B68h07Dpx3NGB3lgnnYpbJOYFoMBm7ANpW3D3NjMPAgzqqsn7EIVVEqVGOtymrHMtTGYKAeWxSvB3vxIh7ANIzFNUpzAa0YF4OFWuxUnFNYjkmRAomB6cX7uDHKAdX4QP/asRRXRAFIFO8TzI5yQov+bcO1UQQk+ncITVFumIce2XqxHFVRJCSy/YolqIlyQwOOy9aNR2KAkLhcJ1agIYYKVsvWi6eiBEj8owfrMDEGAVVYiMcjDa7HBdlejhIhcdF2TI9BQiP2uOgsro5LYa1sX6M2SoQ6zItBwmRsdrnn498wDuel68aMqDBMQZd0v6Mu+mCJbBsiJ7BdtkXRB7ul68HNkRNolO3D+BvGoke6HZEz+Fa6c6gJNMn2WOQMmmW7K/CSbBMiZ3CbbM8EPpKuLXIIo3BWujcCh6TbEjmFr6TbGfhDulcip7BJugOBbulaIqfwlnRHQ7bnIqewVrpjgU7pVkZOYaN0hwOnpFsfOYWt0u0LfCnd55FT+EG6zYEN0p1BdeQMEnRLtzKwTLZZkTO4V7bFgTtka4mcwTrZrgtU47R0P6E6cgINOCfdkeiDjbItipzAs7K1Rh/Mle0gaqLC0IBTsk2PPhiFI7ItiwrDKtl2xaXwqGwdmBoVgrvRJdv8uBRq0CbbISQxzDARJ2TbG1kwX2GfoT6GCa7CN7J1Y0YUgk0K+wJjY4hhAg4o7LXoD8bjuMIOY1oMETTiuMIOoj6KgTvRobDzaEZtlAnq8QK6FHYGU2IgcB+69e97LEJNlAh1eBrH9K8DjVEKPIxuxTmJVZiFmugHajEHa/Cb4nRiQQwGmtBpYM7hU7yNFjSjGSuwDrvRYWD+RGOUA25Hm8rZj8lRThiDd9Br+PTgVdTFUMFcfGfo7cHMGA4YhYXYr/x2YQGqohIwG2vwi9Idw2pMjzzBVCzBm/gYR3EaXbiA02jDDryOJ3FTlNFfAO8ENqnn13UAAAAASUVORK5CYII\x3d"
    },
    v = !1,
    r = 316 / 176;
  e.castDisplay = function(l) {
    function m() {
      if (E) {
        var a = E.element();
        a.parentNode && a.parentNode.removeChild(a);
        E.resetEventListeners();
        E = null
      }
    }

    function q() {
      J && (J.parentNode && J.parentNode.removeChild(J), J = null)
    }

    function p() {
      M && (M.parentNode && M.parentNode.removeChild(M), M = null)
    }
    v || (n(".jwplayer .jwcast-display", {
        display: "none",
        position: "absolute",
        width: "100%",
        height: "100%",
        "background-repeat": "no-repeat",
        "background-size": "auto",
        "background-position": "50% 50%",
        "background-image": b("display")
      }),
      n(".jwplayer .jwcast-label", {
        position: "absolute",
        left: 10,
        right: 10,
        bottom: "50%",
        "margin-bottom": 100,
        "text-align": "center"
      }), n(".jwplayer .jwcast-label span", {
        "font-family": '"Karbon", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
        "font-size": 20,
        "font-weight": 300,
        color: "#7a7a7a"
      }), n(".jwplayer span.jwcast-name", {
        color: "#ccc"
      }), n(".jwcast-button", {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0,
        "background-repeat": "no-repeat",
        "background-size": "auto",
        "background-position": "50% 50%"
      }), n(".jwcast-wheel", {
        "background-image": b("wheel")
      }), n(".jwcast-pause", {
        "background-image": b("pause")
      }), n(".jwcast-play", {
        "background-image": b("play")
      }), n(".jwcast-replay", {
        "background-image": b("replay")
      }), n(".jwcast-paused .jwcast-play", {
        opacity: 1
      }), n(".jwcast-playing .jwcast-pause", {
        opacity: 1
      }), n(".jwcast-idle .jwcast-replay", {
        opacity: 1
      }), a.cssKeyframes("spin", "from {transform: rotate(0deg);} to {transform: rotate(360deg);}"), n(".jwcast-connecting .jwcast-wheel, .jwcast-buffering .jwcast-wheel", {
        opacity: 1,
        "-webkit-animation": "spin 1.5s linear infinite",
        animation: "spin 1.5s linear infinite"
      }), n(".jwcast-companion", {
        position: "absolute",
        "background-position": "50% 50%",
        "background-size": "316px 176px",
        "background-repeat": "no-repeat",
        top: 0,
        left: 0,
        right: 0,
        bottom: 4
      }), n(".jwplayer .jwcast-click-label", {
        "font-family": '"Karbon", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
        "font-size": 14,
        "font-weight": 300,
        "text-align": "center",
        position: "absolute",
        left: 10,
        right: 10,
        top: "50%",
        color: "#ccc",
        "margin-top": 100
      }), n(".jwcast-paused .jwcast-click-label", {
        color: "#7a7a7a"
      }), v = !0);
    var G = k.getElementById(l + "_display_button"),
      x = c("div", "display"),
      j = c("div", ["pause", "button"]),
      A = c("div", ["play", "button"]),
      s = c("div", ["replay", "button"]),
      u = c("div", ["wheel", "button"]),
      I = c("div", "label"),
      w = c("span"),
      y = c("span", "name"),
      K = "#" + l + "_display.jwdisplay",
      F = -1,
      H = null,
      E = null,
      M = null,
      J = null;
    h(x, [u, j, A, s, I]);
    h(I, [w, y]);
    G.parentNode.insertBefore(x, G);
    this.statusDelegate = null;
    this.setName = function(a) {
      y.innerText = a || "Google Cast";
      return this
    };
    this.setState = function(a) {
      var b = "Casting on ";
      if (null === H)
        if ("connecting" === a) b = "Connecting to ";
        else if (a !== C.IDLE) {
        var c = g(l).getPlaylistItem().title || "";
        c && (b = b.replace("on", c + " on"))
      }
      w.innerText = b;
      clearTimeout(F);
      a === C.IDLE && (F = setTimeout(function() {
        d(x, ["display", "idle"])
      }, 3E3), a = "");
      d(x, ["display", (a || "").toLowerCase()]);
      return this
    };
    this.show = function() {
      n(K + " .jwpreview", {
        "background-size": "316px 176px !important",
        opacity: 0.6,
        "margin-top": -2
      });
      n(K + " .jwdisplayIcon", {
        display: "none !important"
      });
      n.style(x, {
        display: "block"
      });
      return this
    };
    this.hide = function() {
      a.clearCss(K + " .jwpreview");
      n(K + " .jwdisplayIcon", {
        display: ""
      });
      n.style(x, {
        display: "none"
      });
      return this
    };
    this.setSkipoffset = function(b, c) {
      if (null === E) {
        var d = k.getElementById(l + "_controlbar"),
          g = 10 + a.bounds(x).bottom - a.bounds(d).top;
        E = new e.adskipbutton(l, g | 0, b.skipMessage, b.skipText);
        E.addEventListener(f.JWPLAYER_AD_SKIPPED, function() {
          c(b)
        });
        E.reset(b.skipoffset || -1);
        E.show();
        d.parentNode.insertBefore(E.element(), d)
      } else E.reset(b.skipoffset || -1)
    };
    this.setCompanions = function(a) {
      var b, d, e, f = Number.MAX_VALUE,
        g = null;
      for (d = a.length; d--;)
        if (b = a[d], b.width && b.height && b.source) switch (b.type) {
          case "html":
          case "iframe":
          case "application/x-shockwave-flash":
            break;
          default:
            e = Math.abs(b.width / b.height - r), e < f && (f = e, 0.75 > e && (g = b))
        }(a = g) ? (null === M && (M = c("div", "companion"), h(x, M)), a.width / a.height > r ? (b = 316, d = a.height * b / a.width) : (d = 176, b = a.width * d / a.height), n.style(M, {
          "background-image": a.source,
          "background-size": b + "px " + d + "px"
        })) : p()
    };
    this.adChanged = function(a) {
      if (a.complete) E && E.reset(-1), H = null;
      else {
        E && (void 0 === a.skipoffset ? m() : (a.position || a.duration) && E.updateSkipTime(a.position | 0, a.duration | 0));
        var b = a.tag + a.sequence;
        b !== H && (n(K + " .jwpreview", {
          opacity: 0
        }), a.companions ? this.setCompanions(a.companions) : p(), a.clickthrough ? null === J && (J = c("div", "click-label"), J.innerText = "Click here to learn more \x3e", h(x, J)) : q(), H = b, this.setState(a.newstate))
      }
    };
    this.adsEnded = function() {
      m();
      p();
      q();
      n(K +
        " .jwpreview", {
          opacity: 0.6
        });
      H = null
    };
    this.destroy = function() {
      this.hide();
      x.parentNode && x.parentNode.removeChild(x)
    }
  };
  var m = ".jwcast button";
  n(m, {
    opacity: 1
  });
  n(m + ":hover", {
    opacity: 0.75
  });
  m += ".off";
  n(m, {
    opacity: 0.75
  });
  n(m + ":hover", {
    opacity: 1
  })
})(jwplayer, document);
(function(g) {
  var k = jwplayer.utils.extend,
    b = g.logo;
  b.defaults.prefix = "";
  b.defaults.file = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAyCAMAAACkjD/XAAACnVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJCQkSEhIAAAAaGhoAAAAiIiIrKysAAAAxMTEAAAA4ODg+Pj4AAABEREQAAABJSUkAAABOTk5TU1NXV1dcXFxiYmJmZmZqamptbW1xcXF0dHR3d3d9fX2AgICHh4eKioqMjIyOjo6QkJCSkpKUlJSWlpaYmJidnZ2enp6ioqKjo6OlpaWmpqanp6epqamqqqqurq6vr6+wsLCxsbG0tLS1tbW2tra3t7e6urq7u7u8vLy9vb2+vr6/v7/AwMDCwsLFxcXFxcXHx8fIyMjJycnKysrNzc3Ozs7Ozs7Pz8/Pz8/Q0NDR0dHR0dHS0tLU1NTV1dXW1tbW1tbW1tbX19fX19fa2trb29vb29vc3Nzc3Nzf39/f39/f39/f39/g4ODh4eHj4+Pj4+Pk5OTk5OTk5OTk5OTl5eXn5+fn5+fn5+fn5+fn5+fo6Ojo6Ojq6urq6urq6urr6+vr6+vr6+vt7e3t7e3t7e3t7e3u7u7u7u7v7+/v7+/w8PDw8PDw8PDw8PDy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL09PT09PT09PT09PT09PT09PT09PT29vb29vb29vb29vb29vb29vb29vb29vb39/f39/f39/f39/f39/f4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr6+vr6+vr8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////9kpi5JAAAA33RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhYWFxcYGBgZGRoaGhsbHBwdHR4eHx8gISIiIyQmJicoKSoqKywtLi4uMDEyMjM0NTU2Njc5Ojo7Ozw9Pj5AQUJCQ0ZGSElKSktMTU5PUFFRUlRVVlZXWFpbXV5eX2BhYmVmZ2hpamtsbW5vcHFyc3R2d3h5enx9fn+BgoKDhIWGiYmKi4yNjo+QkZKTlJWWl5eYmZqbnJ2enp+goaKkpaamp6ipqqusra6vsLKzs7W2t7i5uru8vb6/wMHCwsPExcbHyMnJysvMVK8y+QAAB5FJREFUeNrFmP2f3EQdx8kmm2yy2WQzmZkjl3bJ2Rb12mtp8SiKiBUUxVKFVisIihV62CKCIoK0UvVK1bP07mitBeVJUVso0Duw1Xo9ET0f6JN47bV3u9+/xe83kyzr0+vlL7t8Xq9ubpLpvHfm+7i54P+UVkBp2gWdFpGNYtFA+NtALpYcxzZ1rSM0TSvgv5xse0wwu1joxDYLulE0dKTTSLcqfOvMQ1WzoHXAtCadsGXqBCsUnWDxNBzmlq51wLSuz0LmOcTWClZFfA1ghLUbrUwbdq396kAvK5s6HoFdlb8FuLONB66RlGnD5S8BwKkNoVMsFEw3XIOj97hmoX2updP5kml7jgLp/Ec8yzBKntwDMCnwa7TPtUrkWLrliW2gtC+0TdNhvdMAu1hJ19plYNcP0LGKiJp/HJTeEI5V8sjJ4PZ2mTp1rb7Pf5C5JbvCN0Cuha7jpE5WX9oeU6us8YlTUH8grFQC+QzkWuKVvdTJXuWO0Z5Nk2tNkWNdzgLed+4tdNWrkpPBI20ytVYwK+LrQLpPcHk3vIVm1ZCcDD7jt8fUGmYNoeLpJzKW+1vQYSjJyc72ZKbWSOqqhpn+99r/rn99WDDLbJViHZbJirkWtJDkZPArbhta2jFg7LdKV1ID9aWaz5CTzTD0pvB2aypB9xYPKtaUXEC7bKKjeA1dHyJTU+xbFgY/RiAKP2lYsm28RaJmAtfTs6c4xP9g0gycUqKpeDGLegZPl3MqTL6oWCdl9EIrOol20/U6zyzgVJzpeV6l7Dhl18VP1/N8v1r1vQoNSziH1nPKKMdBChbAiprheygfL65tZmxazguYXDoL8BcyqlhRb0W/M3Wy412YRTUd7SKEFIKzIBQ8DBhHewgSjkLB7GwS54wxwcoORqYQ+QyhFGA9VIYxnfCKq2VtE3k3wTB1taLx+FVCNTRyxnU4YQ/8WEY9M7PvkvJHsEsAam5srRRwH0YBhml14Zv7pRz62+LAD/jWE0vHINU6OUGXyc0Mt5GiLW/+6blV8eO4tY8B6t3qvBsZOnUy+HJgFaiuMELfhQ6RrAe4JZGvwxcFPLx69YZDZ1ciOrB03ayEd52vr0x6/zokhbxs+p5o7Oc3kfrkxFOrV392d+NWFaeaXvK652Cw+xTAo9cS5ar0vKcfy9BrgNRfMVN0SOh+gPfWtgN8L7kM6pcI2FSrJUtm7kc0KxlF2xcHd/1xWxxvmv1QLB9/5cJobDiKIxklcmI4ShJ5eJ/qOTSqU6/BBC4JN6boQSAN71Doi1Mnm+B0Rjlavgabo/GZ2V/LL8FRSehkkfzzYIouoqXf31jz3de7kq5DB6JP1a+vSUQnOXrRoujpn2XogumJpwCeBfhDV4qeAdK1QwqdOhkMqdAyyyk6HoHR3tmD4/UlI/DDBNFxHK1tDBDaNrHODU7KDzTW16Lr6nccHZGxHNt3Jao/RrSU8pPTeX+JPYj4NpAGkxsg16FoWP1xP5Bu8UwdYxSXJXRyJ0zeCtsegdsm4QsLBBwcHf3l+fF5hHbscnDh1LeSaGwvModnTl7ChVRuNiblxIkjR6bq+9+R9RzkO7cBadWCdZBroDaq/jgDqHMLMYtSr8jkpwl9aaOxF9bdDHsb9T5Ev/rkk6N398SIDj3X5zfDzi1bDpxdHNWWwcOchS27funeR+EOyTI0RcyKLIM20VPzyOObeh4LJsZ/hYnaRpgRsTwG9TPzLz5XhyOSDlzykDEKLsEYl08cG0W9eW+U4B1eZZmtY7J13PXCeHeg0MrPjlH8yLiJ/mYtfqIFvQVNTaez/cMrfwHHpJC7APZH0csAP5ARokPPwXyIoEjKaOnM7UIIOfKKrJEJvEAguhZHUY1sHb3vH1tCxyS0OvGtAL+/iMubQOlMXyKfA6U8i+I0PqWyecA3AmyVEmPhczxEdBUbOKwCsHsAtfNUDyZNdiNcLQld8cTYgQHScjExjNPvOf9RSsrZtt3uB3f2s0Dku35MyiY6z6LYjbMdx+HvO7pd11/egBtCvh7mFvs+P70Rl8L0yU8r7WROyXb5b77Dxemv+I7L82wmxoeY53U9+/K8HE1ZvBq4eGQfh1SNa0Keo5tZVCXwXs7KluUwIZjrMsrHTsB95f4B50JwztGURtHywsBjvGphtIUiFeb9Kn4pjzHXUOhmlXPI3Ug/5QH6BjS1uWpRRdLNku3YWPNw4RKVSSqfpKLq3k3bIZXMvFha+NjQqXqlhYxKa9EgFJGVqKCrqD2ZloJrql7Qgq4vw9DKfn0ahp73B+ln3hPQY/xKJEO1CC2P6T49UOP/fD+R5qphSBvAslttQb8YZr1os7/5ry0P8VDNoZK6T8pnZpdW4bb9ZWPQ2NPtlhxf/A5yPUApt+0/MP2uqy5nLkaKLyZycuOKCp13u9mWXXasol4staAPYyprN1p5CvkR1nD5pxz9jQDPu1Pvbii3yklQmr2U/LtDUr9Fngelp0NqwDsmirPtoLRWJdxOiQrp9Yr8XGiTk3XyxF2eFuw3+ju5aRJl1Yu+f+LMM1eiexc6/lK0QuWpYhkd3XT+UsfOXhd2WKpO6W/TO3BUO8H/BB7RwuB6W7b7AAAAAElFTkSuQmCC";
  g.logo =
    function(c, d) {
      "free" == c.edition() ? d = null : (b.defaults.file = "", b.defaults.prefix = "");
      k(this, new b(c, d))
    }
})(jwplayer.html5);
(function(g) {
  var k = g.html5,
    b = k.model;
  k.model = function(c, d) {
    var h = new g.utils.key(c.key),
      a = new b(c, d),
      e = a.componentConfig;
    a.edition = function() {
      return h.edition()
    };
    a.componentConfig = function(b) {
      return "logo" == b ? a.logo : e(b)
    };
    return a
  }
})(jwplayer);
(function(g) {
  var k = g.html5,
    b = k.player;
  k.player = function(c) {
    c = new b(c);
    var d;
    d = c._model.edition();
    if ("enterprise" === d || "ads" === d) d = new g.cast.controller(c, c._model), c.jwStartCasting = d.startCasting, c.jwStopCasting = d.stopCasting;
    return c
  };
  b.prototype.edition = function() {
    return this._model.edition()
  }
})(jwplayer);
(function(g) {
  var k = jwplayer.utils.extend,
    b = g.rightclick;
  g.rightclick = function(c, d) {
    if ("free" == c.edition()) d.aboutlink = "http://www.longtailvideo.com/jwpabout/?a\x3dr\x26v\x3d" + g.version + "\x26m\x3dh\x26e\x3df", delete d.abouttext;
    else {
      if (!d.aboutlink) {
        var h = "http://www.longtailvideo.com/jwpabout/?a\x3dr\x26v\x3d" + g.version + "\x26m\x3dh\x26e\x3d",
          a = c.edition();
        d.aboutlink = h + ("pro" == a ? "p" : "premium" == a ? "r" : "enterprise" == a ? "e" : "ads" == a ? "a" : "f")
      }
      d.abouttext ? d.abouttext += " ..." : (h = c.edition(), h = h.charAt(0).toUpperCase() +
        h.substr(1), d.abouttext = "About JW Player " + g.version + " (" + h + " edition)")
    }
    k(this, new b(c, d))
  }
})(jwplayer.html5);
(function(g) {
  var k = g.view;
  g.view = function(b, c) {
    var d = new k(b, c),
      g = d.setup,
      a = c.edition();
    d.setup = function(a) {
      g(a)
    };
    "invalid" == a && d.setupError("Error setting up player: Invalid license key");
    return d
  }
})(window.jwplayer.html5);
