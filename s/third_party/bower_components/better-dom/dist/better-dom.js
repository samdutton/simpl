/**
 * @overview better-dom: Live extension playground
 * @version 2.1.4 Sun, 22 Mar 2015 19:22:57 GMT
 * @copyright 2013-2015 Maksim Chemerisuk
 * @license MIT
 * @see https://github.com/chemerisuk/better-dom
 */
(function() {
    "use strict";var SLICE$0 = Array.prototype.slice;
    function $NullElement() {}

    function $Element(node) {
        if (this instanceof $Element) {
            if (node) {
                // use a generated property to store a reference
                // to the wrapper for circular object binding
                node["__2001004__"] = this;

                this[0] = node;
                this._ = {
                    "handler2001004": [],
                    "watcher2001004": {},
                    "extension2001004": [],
                    "context2001004": {}
                };
            }
        } else if (node) {
            // create a wrapper only once for each native element
            return node["__2001004__"] || new $Element(node);
        } else {
            return new $NullElement();
        }
    }

    function $Document(node) {
        // use documentElement for a $Document wrapper
        return $Element.call(this, node.documentElement);
    }

    $Element.prototype = {
        toString: function() {
            return "<" + this[0].tagName.toLowerCase() + ">";
        },
        version: "2.1.4"
    };

    $NullElement.prototype = new $Element();
    $NullElement.prototype.toString = function()  {return ""};

    $Document.prototype = new $Element();
    $Document.prototype.toString = function()  {return "#document"};

    var WINDOW = window;
    var DOCUMENT = document;
    var HTML = DOCUMENT.documentElement;

    var CUSTOM_EVENT_TYPE = "dataavailable";
    var RETURN_THIS = function() { return this };
    var RETURN_TRUE = function()  {return true};
    var RETURN_FALSE = function()  {return false};
    var VENDOR_PREFIXES = ["Webkit", "O", "Moz", "ms"];

    var userAgent = WINDOW.navigator.userAgent;
    var jscriptVersion = WINDOW.ScriptEngineMajorVersion;

    var JSCRIPT_VERSION = jscriptVersion && jscriptVersion();
    var LEGACY_ANDROID = ~userAgent.indexOf("Android") && userAgent.indexOf("Chrome") < 0;
    var WEBKIT_PREFIX = WINDOW.WebKitAnimationEvent ? "-webkit-" : "";

    var DOM = new $Document(DOCUMENT);

    var util$index$$arrayProto = Array.prototype;

    var util$index$$every = util$index$$arrayProto.every;
    var util$index$$each = util$index$$arrayProto.forEach;
    var util$index$$filter = util$index$$arrayProto.filter;
    var util$index$$map = util$index$$arrayProto.map;
    var util$index$$slice = util$index$$arrayProto.slice;
    var util$index$$isArray = Array.isArray;
    var util$index$$keys = Object.keys;

    function util$index$$computeStyle(node) {
        if (JSCRIPT_VERSION < 9) {
            return node.currentStyle;
        } else {
            return node.ownerDocument.defaultView.getComputedStyle(node);
        }
    }

    function util$index$$injectElement(node) {
        if (node && node.nodeType === 1) {
            return node.ownerDocument.getElementsByTagName("head")[0].appendChild(node);
        }
    }

    function util$index$$safeCall(context, fn, arg1, arg2) {
        if (typeof fn === "string") fn = context[fn];

        try {
            return fn.call(context, arg1, arg2);
        } catch (err) {
            WINDOW.setTimeout(function()  { throw err }, 1);

            return false;
        }
    }

    function util$index$$register(mixins, factory, defaultFactory) {
        var proto = defaultFactory ? $Element.prototype : $Document.prototype;

        if (factory == null) {
            factory = function(methodName, strategy)  {return strategy};
        }

        util$index$$keys(mixins).forEach(function(methodName)  {
            var args = [methodName].concat(mixins[methodName]);

            proto[methodName] = factory.apply(null, args);

            if (defaultFactory) {
                $NullElement.prototype[methodName] = defaultFactory.apply(null, args);
            }
        });
    }
    function MethodError(methodName, args) {var type = arguments[2];if(type === void 0)type = "$Element";
        var url = "http://chemerisuk.github.io/better-dom/" + type + ".html#" + methodName,
            line = "invalid call `" + type + (type === "DOM" ? "." : "#") + methodName + "(";

        line += util$index$$map.call(args, String).join(", ") + ")`. ";

        this.message = line + "Check " + url + " to verify the arguments";
    }

    MethodError.prototype = new TypeError();

    function StaticMethodError(methodName, args) {
        MethodError.call(this, methodName, args, "DOM");
    }

    StaticMethodError.prototype = new TypeError();

    function DocumentTypeError(methodName, args) {
        MethodError.call(this, methodName, args, "$Document");
    }

    DocumentTypeError.prototype = new TypeError();

    var // operator type / priority object
        global$emmet$$operators = {"(": 1,")": 2,"^": 3,">": 4,"+": 5,"*": 6,"`": 7,"[": 8,".": 8,"#": 8},
        global$emmet$$reParse = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
        global$emmet$$reAttr = /\s*([\w\-]+)(?:=((?:`([^`]*)`)|[^\s]*))?/g,
        global$emmet$$reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
        global$emmet$$reDot = /\./g,
        global$emmet$$reDollar = /\$/g,
        global$emmet$$tagCache = {"": ""},
        global$emmet$$normalizeAttrs = function(_, name, value, rawValue)  {
            // try to detemnie which kind of quotes to use
            var quote = value && value.indexOf("\"") >= 0 ? "'" : "\"";

            if (typeof rawValue === "string") {
                // grab unquoted value for smart quotes
                value = rawValue;
            } else if (typeof value !== "string") {
                // handle boolean attributes by using name as value
                value = name;
            }
            // always wrap attribute values with quotes even they don't exist
            return " " + name + "=" + quote + value + quote;
        },
        global$emmet$$injectTerm = function(term, end)  {return function(html)  {
            // find index of where to inject the term
            var index = end ? html.lastIndexOf("<") : html.indexOf(">");
            // inject the term into the HTML string
            return html.slice(0, index) + term + html.slice(index);
        }},
        global$emmet$$makeTerm = function(tag)  {
            return global$emmet$$tagCache[tag] || (global$emmet$$tagCache[tag] = "<" + tag + "></" + tag + ">");
        },
        global$emmet$$makeIndexedTerm = function(n, term)  {
            var result = Array(n), i;

            for (i = 0; i < n; ++i) {
                result[i] = term.replace(global$emmet$$reIndex, function(expr, fmt, sign, base)  {
                    var index = (sign ? n - i - 1 : i) + (base ? +base : 1);
                    // handle zero-padded index values, like $$$ etc.
                    return (fmt + index).slice(-fmt.length).replace(global$emmet$$reDollar, "0");
                });
            }

            return result;
        },
        global$emmet$$reUnsafe = /[&<>"']/g,
        // http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
        global$emmet$$safeSymbol = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"};

    // populate empty tag names with result
    "area base br col hr img input link meta param command keygen source".split(" ").forEach(function(tag)  {
        global$emmet$$tagCache[tag] = "<" + tag + ">";
    });

    DOM.emmet = function(template, varMap) {var $D$0;var $D$1;var $D$2;
        if (typeof template !== "string") throw new StaticMethodError("emmet", arguments);

        if (varMap) template = DOM.format(template, varMap);

        if (template in global$emmet$$tagCache) {return global$emmet$$tagCache[template];}

        // transform template string into RPN

        var stack = [], output = [];

        $D$2 = (template.match(global$emmet$$reParse));$D$0 = 0;$D$1 = $D$2.length;for (var str ;$D$0 < $D$1;){str = ($D$2[$D$0++]);
            var op = str[0];
            var priority = global$emmet$$operators[op];

            if (priority) {
                if (str !== "(") {
                    // for ^ operator need to skip > str.length times
                    for (var i = 0, n = (op === "^" ? str.length : 1); i < n; ++i) {
                        while (stack[0] !== op && global$emmet$$operators[stack[0]] >= priority) {
                            var head = stack.shift();

                            output.push(head);
                            // for ^ operator stop shifting when the first > is found
                            if (op === "^" && head === ">") break;
                        }
                    }
                }

                if (str === ")") {
                    stack.shift(); // remove "(" symbol from stack
                } else {
                    // handle values inside of `...` and [...] sections
                    if (op === "[" || op === "`") {
                        output.push(str.slice(1, -1));
                    }
                    // handle multiple classes, e.g. a.one.two
                    if (op === ".") {
                        output.push(str.slice(1).replace(global$emmet$$reDot, " "));
                    }

                    stack.unshift(op);
                }
            } else {
                output.push(str);
            }
        };$D$0 = $D$1 = $D$2 = void 0;

        output = output.concat(stack);

        // transform RPN into html nodes

        stack = [];

        $D$0 = 0;$D$1 = output.length;for (var str$0 ;$D$0 < $D$1;){str$0 = (output[$D$0++]);
            if (str$0 in global$emmet$$operators) {
                var value = stack.shift();
                var node = stack.shift();

                if (typeof node === "string") {
                    node = [ global$emmet$$makeTerm(node) ];
                }

                switch(str$0) {
                case ".":
                    value = global$emmet$$injectTerm(" class=\"" + value + "\"");
                    break;

                case "#":
                    value = global$emmet$$injectTerm(" id=\"" + value + "\"");
                    break;

                case "[":
                    value = global$emmet$$injectTerm(value.replace(global$emmet$$reAttr, global$emmet$$normalizeAttrs));
                    break;

                case "*":
                    node = global$emmet$$makeIndexedTerm(+value, node.join(""));
                    break;

                case "`":
                    stack.unshift(node);
                    // escape unsafe HTML symbols
                    node = [ value.replace(global$emmet$$reUnsafe, function(ch)  {return global$emmet$$safeSymbol[ch]}) ];
                    break;

                default: value = typeof value === "string" ? global$emmet$$makeTerm(value) : value.join("");

                    if (str$0 === ">") {
                        value = global$emmet$$injectTerm(value, true);
                    } else {
                        node.push(value);
                    }
                }

                str$0 = typeof value === "function" ? node.map(value) : node;
            }

            stack.unshift(str$0);
        };$D$0 = $D$1 = void 0;

        if (output.length === 1) {
            // handle single tag case
            output = global$emmet$$makeTerm(stack[0]);
        } else {
            output = stack[0].join("");
        }

        return output;
    };

    var global$emmet$$default = global$emmet$$tagCache;

    util$index$$register({
        create: "",
        createAll: "All"

    }, function(methodName, all)  {return function(value, varMap) {
        var doc = this[0].ownerDocument,
            sandbox = this._["sandbox2001004"];

        if (!sandbox) {
            sandbox = doc.createElement("div");
            this._["sandbox2001004"] = sandbox;
        }

        var nodes, el;

        if (value && value in global$emmet$$default) {
            nodes = doc.createElement(value);

            if (all) nodes = [ new $Element(nodes) ];
        } else {
            value = value.trim();

            if (value[0] === "<" && value[value.length - 1] === ">") {
                value = varMap ? DOM.format(value, varMap) : value;
            } else {
                value = DOM.emmet(value, varMap);
            }

            sandbox.innerHTML = value; // parse input HTML string

            for (nodes = all ? [] : null; el = sandbox.firstChild; ) {
                sandbox.removeChild(el); // detach element from the sandbox

                if (el.nodeType === 1) {
                    if (all) {
                        nodes.push(new $Element(el));
                    } else {
                        nodes = el;

                        break; // stop early, because need only the first element
                    }
                }
            }
        }

        return all ? nodes : $Element(nodes);
    }});

    // Helper for css selectors

    var util$selectormatcher$$rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        util$selectormatcher$$propName = VENDOR_PREFIXES.concat(null)
            .map(function(p)  {return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector"})
            .reduceRight(function(propName, p)  {return propName || p in HTML && p}, null);

    var util$selectormatcher$$default = function(selector, context) {
        if (typeof selector !== "string") return null;

        var quick = util$selectormatcher$$rquickIs.exec(selector);

        if (quick) {
            // Quick matching is inspired by jQuery:
            //   0  1    2   3          4
            // [ _, tag, id, attribute, class ]
            if (quick[1]) quick[1] = quick[1].toLowerCase();
            if (quick[3]) quick[3] = quick[3].split("=");
            if (quick[4]) quick[4] = " " + quick[4] + " ";
        }

        return function(node) {var $D$3;var $D$4;
            var result, found;
            if (!quick && !util$selectormatcher$$propName) {
                found = (context || node.ownerDocument).querySelectorAll(selector);
            }

            for (; node && node.nodeType === 1; node = node.parentNode) {
                if (quick) {
                    result = (
                        (!quick[1] || node.nodeName.toLowerCase() === quick[1]) &&
                        (!quick[2] || node.id === quick[2]) &&
                        (!quick[3] || (quick[3][1] ? node.getAttribute(quick[3][0]) === quick[3][1] : node.hasAttribute(quick[3][0]))) &&
                        (!quick[4] || (" " + node.className + " ").indexOf(quick[4]) >= 0)
                    );
                } else {
                    if (util$selectormatcher$$propName) {
                        result = node[util$selectormatcher$$propName](selector);
                    } else {
                        $D$3 = 0;$D$4 = found.length;for (var n ;$D$3 < $D$4;){n = (found[$D$3++]);
                            if (n === node) return n;
                        };$D$3 = $D$4 = void 0;
                    }
                }

                if (result || !context || node === context) break;
            }

            return result && node;
        };
    };

    var util$extensionhandler$$rePrivateFunction = /^(?:on|do)[A-Z]/;

    var util$extensionhandler$$default = function(selector, condition, mixins, index)  {
        var ctr = mixins.hasOwnProperty("constructor") && mixins.constructor,
            matcher = util$selectormatcher$$default(selector);

        return function(node, mock)  {
            var el = $Element(node);
            // skip previously invoked or mismatched elements
            if (~el._["extension2001004"].indexOf(index) || !matcher(node)) return;
            // mark extension as invoked
            el._["extension2001004"].push(index);

            if (mock === true || condition(el) !== false) {
                // apply all private/public members to the element's interface
                var privateFunctions = Object.keys(mixins).filter(function(prop)  {
                    var value = mixins[prop];
                    // TODO: private functions are deprecated, remove this line later
                    if (util$extensionhandler$$rePrivateFunction.exec(prop)) {
                        // preserve context for private functions
                        el[prop] = function()  {return value.apply(el, arguments)};

                        return !mock;
                    }

                    if (prop !== "constructor") {
                        el[prop] = value;

                        return !mock && prop[0] === "_";
                    }
                });

                // invoke constructor if it exists
                // make a safe call so live extensions can't break each other
                if (ctr) util$index$$safeCall(el, ctr);
                // remove event handlers from element's interface
                privateFunctions.forEach(function(prop)  { delete el[prop] });
            }
        };
    };

    // Inspired by trick discovered by Daniel Buchner:
    // https://github.com/csuwldcat/SelectorListener

    var document$extend$$cssText;

    if (JSCRIPT_VERSION < 10) {
        var document$extend$$legacyScripts = util$index$$filter.call(DOCUMENT.scripts, function(el)  {return el.src.indexOf("better-dom-legacy.js") >= 0});

        if (document$extend$$legacyScripts.length < 1) {
            throw new Error("In order to use live extensions in IE < 10 you have to include extra files. See https://github.com/chemerisuk/better-dom#notes-about-old-ies for details.");
        }

        document$extend$$cssText = "-ms-behavior:url(" + document$extend$$legacyScripts[0].src.replace(".js", ".htc") + ") !important";
    } else {
        document$extend$$cssText = WEBKIT_PREFIX + "animation-name:DOM2001004 !important;";
        document$extend$$cssText += WEBKIT_PREFIX + "animation-duration:1ms !important";
    }

    util$index$$register({
        extend: function(selector, condition, definition) {var this$0 = this;
            if (arguments.length === 1) {
                // handle case when $Document protytype is extended
                return util$index$$register(selector);
            } else if (selector === "*") {
                // handle case when $Element protytype is extended
                return util$index$$register(condition, null, function()  {return RETURN_THIS});
            }

            if (arguments.length === 2) {
                definition = condition;
                condition = true;
            }

            if (typeof condition === "boolean") condition = condition ? RETURN_TRUE : RETURN_FALSE;
            if (typeof definition === "function") definition = {constructor: definition};

            if (!definition || typeof definition !== "object" || typeof condition !== "function") throw new DocumentTypeError("extend", arguments);

            var node = this[0],
                mappings = this._["mappings2001004"];

            if (!mappings) {
                this._["mappings2001004"] = mappings = [];

                if (JSCRIPT_VERSION < 10) {
                    node.attachEvent("on" + CUSTOM_EVENT_TYPE, function()  {
                        var e = WINDOW.event;

                        if (e.srcUrn === CUSTOM_EVENT_TYPE) {
                            mappings.forEach(function(ext)  { ext(e.srcElement) });
                        }
                    });
                } else {
                    // declare the fake animation on the first DOM.extend method call
                    this.importStyles("@" + WEBKIT_PREFIX + "keyframes DOM2001004", "from {opacity:.99} to {opacity:1}");
                    // use capturing to suppress internal animationstart events
                    node.addEventListener(WEBKIT_PREFIX ? "webkitAnimationStart" : "animationstart", function(e)  {
                        if (e.animationName === "DOM2001004") {
                            mappings.forEach(function(ext)  { ext(e.target) });
                            // this is an internal event - stop it immediately
                            e.stopImmediatePropagation();
                        }
                    }, true);
                }
            }

            var ext = util$extensionhandler$$default(selector, condition, definition, mappings.length);

            mappings.push(ext);
            // live extensions are always async - append CSS asynchronously
            WINDOW.setTimeout(function()  {
                // initialize extension manually to make sure that all elements
                // have appropriate methods before they are used in other DOM.extend.
                // Also fixes legacy IEs when the HTC behavior is already attached
                util$index$$each.call(node.ownerDocument.querySelectorAll(selector), ext);
                // MUST be after querySelectorAll because of legacy IEs quirks
                this$0.importStyles(selector, document$extend$$cssText);
            }, 0);
        }
    });

    util$index$$register({
        importScripts: function() {var urls = SLICE$0.call(arguments, 0);
            var doc = this[0].ownerDocument;

            var callback = function()  {
                var arg = urls.shift(),
                    argType = typeof arg,
                    script;

                if (argType === "string") {
                    script = doc.createElement("script");
                    script.src = arg;
                    script.onload = callback;
                    script.async = true;

                    util$index$$injectElement(script);
                } else if (argType === "function") {
                    arg();
                } else if (arg) {
                    throw new DocumentTypeError("importScripts", arguments);
                }
            };

            callback();
        }
    });

    util$index$$register({
        importStyles: function(selector, cssText) {
            var styleSheet = this._["styles2001004"];

            if (!styleSheet) {
                var doc = this[0].ownerDocument,
                    styleNode = util$index$$injectElement(doc.createElement("style"));

                styleSheet = styleNode.sheet || styleNode.styleSheet;
                // store object internally
                this._["styles2001004"] = styleSheet;
            }

            if (typeof selector !== "string" || typeof cssText !== "string") {
                throw new DocumentTypeError("importStyles", arguments);
            }

            // insert rules one by one because of several reasons:
            // 1. IE8 does not support comma in a selector string
            // 2. if one selector fails it doesn't break others
            selector.split(",").forEach(function(selector)  {
                try {
                    if (styleSheet.cssRules) {
                        styleSheet.insertRule(selector + "{" + cssText + "}", styleSheet.cssRules.length);
                    } else if (selector[0] !== "@") {
                        styleSheet.addRule(selector, cssText);
                    } else {
                        // addRule doesn't support at-rules, use cssText instead
                        styleSheet.cssText += selector + "{" + cssText + "}";
                    }
                } catch(err) {
                    // silently ignore invalid rules
                }
            });
        }
    });

    util$index$$register({
        mock: function(content, varMap) {
            if (!content) return new $NullElement();

            var result = this.create(content, varMap),
                mappings = this._["mappings2001004"],
                applyExtensions = function(node)  {
                    mappings.forEach(function(ext)  { ext(node, true) });

                    util$index$$each.call(node.children, applyExtensions);
                };

            if (mappings && mappings.length) {
                applyExtensions(result[0]);
            }

            return result;
        }
    });

    util$index$$register({
        child: false,

        children: true

    }, function(methodName, all)  {return function(selector) {
        if (all) {
            if (selector && typeof selector !== "string") throw new MethodError(methodName, arguments);
        } else {
            if (selector && typeof selector !== "number") throw new MethodError(methodName, arguments);
        }

        var node = this[0],
            matcher = util$selectormatcher$$default(selector),
            children = node.children;
        if (JSCRIPT_VERSION < 9) {
            // fix IE8 bug with children collection
            children = util$index$$filter.call(children, function(node)  {return node.nodeType === 1});
        }

        if (all) {
            if (matcher) children = util$index$$filter.call(children, matcher);

            return util$index$$map.call(children, $Element);
        } else {
            if (selector < 0) selector = children.length + selector;

            return $Element(children[selector]);
        }
    }}, function(methodName, all)  {return function()  {return all ? [] : new $NullElement()}});

    var element$classes$$reSpace = /[\n\t\r]/g;

    util$index$$register({
        hasClass: [RETURN_FALSE, "contains", function(el, token)  {
            return (" " + el[0].className + " ")
                .replace(element$classes$$reSpace, " ").indexOf(" " + token + " ") >= 0;
        }],

        addClass: [RETURN_THIS, "add", function(el, token)  {
            if (!el.hasClass(token)) el[0].className += " " + token;
        }],

        removeClass: [RETURN_THIS, "remove", function(el, token)  {
            el[0].className = (" " + el[0].className + " ")
                .replace(element$classes$$reSpace, " ").replace(" " + token + " ", " ").trim();
        }],

        toggleClass: [RETURN_FALSE, "toggle", function(el, token)  {
            var hasClass = el.hasClass(token);

            if (hasClass) {
                el.removeClass(token);
            } else {
                el[0].className += " " + token;
            }

            return !hasClass;
        }]
    }, function(methodName, defaultStrategy, nativeMethodName, strategy)  {
        if (HTML.classList) {
            // use native classList property if possible
            strategy = function(el, token) {
                return el[0].classList[nativeMethodName](token);
            };
        }

        if (defaultStrategy === RETURN_FALSE) {
            return function(token, force) {
                if (typeof force === "boolean" && nativeMethodName === "toggle") {
                    this[force ? "addClass" : "removeClass"](token);

                    return force;
                }

                if (typeof token !== "string") throw new MethodError(methodName, arguments);

                return strategy(this, token);
            };
        } else {
            return function() {var $D$5;var $D$6;
                var tokens = arguments;

                $D$5 = 0;$D$6 = tokens.length;for (var token ;$D$5 < $D$6;){token = (tokens[$D$5++]);
                    if (typeof token !== "string") throw new MethodError(methodName, arguments);

                    strategy(this, token);
                };$D$5 = $D$6 = void 0;

                return this;
            };
        }
    }, function(methodName, defaultStrategy)  {return defaultStrategy});

    util$index$$register({
        clone: function(deep) {
            if (typeof deep !== "boolean") throw new MethodError("clone", arguments);

            var node = this[0], result;
            if (JSCRIPT_VERSION < 9) {
                result = DOM.create(node.outerHTML);

                if (!deep) result.set("");
            } else {
                result = new $Element(node.cloneNode(deep));
            }

            return result;
        }
    }, null, function()  {return function()  {return new $NullElement()}});

    util$index$$register({
        contains: function(element) {
            var node = this[0];

            if (element instanceof $Element) {
                var otherNode = element[0];

                if (otherNode === node) return true;
                if (node.contains) {
                    return node.contains(otherNode);
                } else {
                    return node.compareDocumentPosition(otherNode) & 16;
                }
            }

            throw new MethodError("contains", arguments);
        }
    }, null, function()  {return RETURN_FALSE});

    // Helper for CSS properties access

    var util$stylehooks$$reDash = /\-./g,
        util$stylehooks$$hooks = {get: {}, set: {}, find: function(name, style) {
            var propName = name.replace(util$stylehooks$$reDash, function(str)  {return str[1].toUpperCase()});

            if (!(propName in style)) {
                propName = VENDOR_PREFIXES
                    .map(function(prefix)  {return prefix + propName[0].toUpperCase() + propName.slice(1)})
                    .filter(function(prop)  {return prop in style})[0];
            }

            return this.get[name] = this.set[name] = propName;
        }},
        util$stylehooks$$directions = ["Top", "Right", "Bottom", "Left"],
        util$stylehooks$$shortCuts = {
            font: ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            padding: util$stylehooks$$directions.map(function(dir)  {return "padding" + dir}),
            margin: util$stylehooks$$directions.map(function(dir)  {return "margin" + dir}),
            "border-width": util$stylehooks$$directions.map(function(dir)  {return "border" + dir + "Width"}),
            "border-style": util$stylehooks$$directions.map(function(dir)  {return "border" + dir + "Style"})
        };

    // Exclude the following css properties from adding px
    "float fill-opacity font-weight line-height opacity orphans widows z-index zoom".split(" ").forEach(function(propName)  {
        var stylePropName = propName.replace(util$stylehooks$$reDash, function(str)  {return str[1].toUpperCase()});

        if (propName === "float") {
            stylePropName = "cssFloat" in HTML.style ? "cssFloat" : "styleFloat";
            // normalize float css property
            util$stylehooks$$hooks.get[propName] = util$stylehooks$$hooks.set[propName] = stylePropName;
        } else {
            util$stylehooks$$hooks.get[propName] = stylePropName;
            util$stylehooks$$hooks.set[propName] = function(value, style)  {
                style[stylePropName] = value.toString();
            };
        }
    });

    // normalize property shortcuts
    util$index$$keys(util$stylehooks$$shortCuts).forEach(function(key)  {
        var props = util$stylehooks$$shortCuts[key];

        util$stylehooks$$hooks.get[key] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[prop]);

                    return !result[index];
                };

            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };

        util$stylehooks$$hooks.set[key] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
                props.forEach(function(name)  {return style[name] = typeof value === "number" ? value + "px" : value.toString()});
            }
        };
    });

    var util$stylehooks$$default = util$stylehooks$$hooks;

    util$index$$register({
        css: function(name, value) {var this$0 = this;
            var len = arguments.length,
                node = this[0],
                style = node.style,
                computed;

            if (len === 1 && (typeof name === "string" || util$index$$isArray(name))) {
                var strategy = function(name)  {
                    var getter = util$stylehooks$$default.get[name] || util$stylehooks$$default.find(name, style),
                        value = typeof getter === "function" ? getter(style) : style[getter];

                    if (!value) {
                        if (!computed) computed = util$index$$computeStyle(node);

                        value = typeof getter === "function" ? getter(computed) : computed[getter];
                    }

                    return value;
                };

                if (typeof name === "string") {
                    return strategy(name);
                } else {
                    return name.map(strategy).reduce(function(memo, value, index)  {
                        memo[name[index]] = value;

                        return memo;
                    }, {});
                }
            }

            if (len === 2 && typeof name === "string") {
                var setter = util$stylehooks$$default.set[name] || util$stylehooks$$default.find(name, style);

                if (typeof value === "function") {
                    value = value(this);
                }

                if (value == null) value = "";

                if (typeof setter === "function") {
                    setter(value, style);
                } else {
                    style[setter] = typeof value === "number" ? value + "px" : value.toString();
                }
            } else if (len === 1 && name && typeof name === "object") {
                util$index$$keys(name).forEach(function(key)  { this$0.css(key, name[key]) });
            } else {
                throw new MethodError("css", arguments);
            }

            return this;
        }
    }, null, function()  {return function(name) {
        if (arguments.length === 1 && util$index$$isArray(name)) {
            return {};
        }

        if (arguments.length !== 1 || typeof name !== "string") {
            return this;
        }
    }});

    var element$define$$ATTR_CASE = JSCRIPT_VERSION < 9 ? "toUpperCase" : "toLowerCase";

    util$index$$register({
        define: function(name, getter, setter) {var this$0 = this;
            var node = this[0];

            if (typeof name !== "string" || typeof getter !== "function" || typeof setter !== "function") {
                throw new MethodError("define", arguments);
            }

            // Use trick to fix infinite recursion in IE8:
            // http://www.smashingmagazine.com/2014/11/28/complete-polyfill-html5-details-element/

            var attrName = name[element$define$$ATTR_CASE]();
            var _setAttribute = node.setAttribute;
            var _removeAttribute = node.removeAttribute;
            if (JSCRIPT_VERSION < 9) {
                // read attribute before the defineProperty call
                // to set the correct initial state for IE8
                var initialValue = node.getAttribute(name);

                if (initialValue !== null) {
                    node[attrName] = initialValue;
                }
            }

            Object.defineProperty(node, name, {
                get: function()  {
                    var attrValue = node.getAttribute(attrName, 1);
                    // attr value -> prop value
                    return getter.call(this$0, attrValue);
                },
                set: function(propValue)  {
                    // prop value -> attr value
                    var attrValue = setter.call(this$0, propValue);

                    if (attrValue == null) {
                        _removeAttribute.call(node, attrName, 1);
                    } else {
                        _setAttribute.call(node, attrName, attrValue, 1);
                    }
                }
            });

            // override methods to catch changes from attributes too
            node.setAttribute = function(name, value, flags)  {
                if (attrName === name[element$define$$ATTR_CASE]()) {
                    node[name] = getter.call(this$0, value);
                } else {
                    _setAttribute.call(node, name, value, flags);
                }
            };

            node.removeAttribute = function(name, flags)  {
                if (attrName === name[element$define$$ATTR_CASE]()) {
                    node[name] = getter.call(this$0, null);
                } else {
                    _removeAttribute.call(node, name, flags);
                }
            };

            return this;
        }
    }, null, function()  {return RETURN_THIS});

    util$index$$register({
        empty: function() {
            return this.set("");
        }
    }, null, function()  {return RETURN_THIS});

    // big part of code inspired by Sizzle:
    // https://github.com/jquery/sizzle/blob/master/sizzle.js

    var element$find$$rquick = DOCUMENT.getElementsByClassName ? /^(?:(\w+)|\.([\w\-]+))$/ : /^(?:(\w+))$/,
        element$find$$rescape = /'|\\/g;

    util$index$$register({
        find: "",

        findAll: "All"

    }, function(methodName, all)  {return function(selector) {
        if (typeof selector !== "string") throw new MethodError(methodName, arguments);

        var node = this[0],
            quickMatch = element$find$$rquick.exec(selector),
            result, old, nid, context;

        if (quickMatch) {
            if (quickMatch[1]) {
                // speed-up: "TAG"
                result = node.getElementsByTagName(selector);
            } else {
                // speed-up: ".CLASS"
                result = node.getElementsByClassName(quickMatch[2]);
            }

            if (result && !all) result = result[0];
        } else {
            old = true;
            context = node;

            if (node !== node.ownerDocument.documentElement) {
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                if ( (old = node.getAttribute("id")) ) {
                    nid = old.replace(element$find$$rescape, "\\$&");
                } else {
                    nid = "DOM2001004";
                    node.setAttribute("id", nid);
                }

                nid = "[id='" + nid + "'] ";
                selector = nid + selector.split(",").join("," + nid);
            }

            result = util$index$$safeCall(context, "querySelector" + all, selector);

            if (!old) node.removeAttribute("id");
        }

        return all ? util$index$$map.call(result, $Element) : $Element(result);
    }}, function(methodName, all)  {return function()  {return all ? [] : new $NullElement()}});

    var util$eventhooks$$hooks = {};
    if ("onfocusin" in DOCUMENT.documentElement) {
        util$eventhooks$$hooks.focus = function(handler)  { handler._type = "focusin" };
        util$eventhooks$$hooks.blur = function(handler)  { handler._type = "focusout" };
    } else {
        // firefox doesn't support focusin/focusout events
        util$eventhooks$$hooks.focus = util$eventhooks$$hooks.blur = function(handler)  { handler.capturing = true };
    }
    if (DOCUMENT.createElement("input").validity) {
        util$eventhooks$$hooks.invalid = function(handler)  { handler.capturing = true };
    }
    if (JSCRIPT_VERSION < 9) {
        // fix non-bubbling form events for IE8 therefore
        // use custom event type instead of original one
        ["submit", "change", "reset"].forEach(function(name)  {
            util$eventhooks$$hooks[name] = function(handler)  { handler._type = "_" };
        });
    }

    var util$eventhooks$$default = util$eventhooks$$hooks;

    function util$eventhandler$$getEventProperty(name, e, type, node, target, currentTarget) {
        if (typeof name === "number") {
            var args = e["__2001004__"];

            return args ? args[name] : void 0;
        }
        if (JSCRIPT_VERSION < 9) {
            var docEl = node.ownerDocument.documentElement;

            switch (name) {
            case "which":
                return e.keyCode;
            case "button":
                var button = e.button;
                // click: 1 === left; 2 === middle; 3 === right
                return button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) );
            case "pageX":
                return e.clientX + docEl.scrollLeft - docEl.clientLeft;
            case "pageY":
                return e.clientY + docEl.scrollTop - docEl.clientTop;
            case "preventDefault":
                return function()  {return e.returnValue = false};
            case "stopPropagation":
                return function()  {return e.cancelBubble = true};
            }
        }

        switch (name) {
        case "type":
            return type;
        case "defaultPrevented":
            // IE8 and Android 2.3 use returnValue instead of defaultPrevented
            return "defaultPrevented" in e ? e.defaultPrevented : e.returnValue === false;
        case "target":
            return $Element(target);
        case "currentTarget":
            return $Element(currentTarget);
        case "relatedTarget":
            return $Element(e.relatedTarget || e[(e.toElement === node ? "from" : "to") + "Element"]);
        }

        var value = e[name];

        if (typeof value === "function") {
            return function()  {return value.apply(e, arguments)};
        }

        return value;
    }

    function util$eventhandler$$EventHandler(type, selector, callback, props, el, once) {
        var node = el[0],
            hook = util$eventhooks$$default[type],
            matcher = util$selectormatcher$$default(selector, node),
            handler = function(e)  {
                e = e || WINDOW.event;
                // early stop in case of default action
                if (util$eventhandler$$EventHandler.skip === type) return;
                if (handler._type === CUSTOM_EVENT_TYPE && e.srcUrn !== type) {
                    return; // handle custom events in legacy IE
                }
                // srcElement can be null in legacy IE when target is document
                var target = e.target || e.srcElement || node.ownerDocument.documentElement,
                    currentTarget = matcher ? matcher(target) : node,
                    args = props || [];

                // early stop for late binding or when target doesn't match selector
                if (!currentTarget) return;

                // off callback even if it throws an exception later
                if (once) el.off(type, callback);

                if (props) {
                    args = args.map(function(name)  {return util$eventhandler$$getEventProperty(
                        name, e, type, node, target, currentTarget)});
                } else {
                    args = util$index$$slice.call(e["__2001004__"] || [0], 1);
                }

                // prevent default if handler returns false
                if (callback.apply(el, args) === false) {
                    if (JSCRIPT_VERSION < 9) {
                        e.returnValue = false;
                    } else {
                        e.preventDefault();
                    }
                }
            };

        if (hook) handler = hook(handler, type) || handler;
        if (JSCRIPT_VERSION < 9 && !("on" + (handler._type || type) in node)) {
            // handle custom events for IE8
            handler._type = CUSTOM_EVENT_TYPE;
        }

        handler.type = type;
        handler.callback = callback;
        handler.selector = selector;

        return handler;
    }

    var util$eventhandler$$default = util$eventhandler$$EventHandler;

    util$index$$register({
        fire: function(type) {
            var node = this[0],
                e, eventType, canContinue;

            if (typeof type === "string") {
                var hook = util$eventhooks$$default[type],
                    handler = {};

                if (hook) handler = hook(handler) || handler;

                eventType = handler._type || type;
            } else {
                throw new MethodError("fire", arguments);
            }
            if (JSCRIPT_VERSION < 9) {
                e = node.ownerDocument.createEventObject();
                e["__2001004__"] = arguments;
                // handle custom events for legacy IE
                if (!("on" + eventType in node)) eventType = CUSTOM_EVENT_TYPE;
                // store original event type
                if (eventType === CUSTOM_EVENT_TYPE) e.srcUrn = type;

                node.fireEvent("on" + eventType, e);

                canContinue = e.returnValue !== false;
            } else {
                e = node.ownerDocument.createEvent("HTMLEvents");
                e["__2001004__"] = arguments;
                e.initEvent(eventType, true, true);
                canContinue = node.dispatchEvent(e);
            }

            // call native function to trigger default behavior
            if (canContinue && node[type]) {
                // prevent re-triggering of the current event
                util$eventhandler$$default.skip = type;

                util$index$$safeCall(node, type);

                util$eventhandler$$default.skip = null;
            }

            return canContinue;
        }
    }, null, function()  {return RETURN_TRUE});

    var util$accessorhooks$$hooks = {get: {}, set: {}};

    // fix camel cased attributes
    "tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" ").forEach(function(key)  {
        util$accessorhooks$$hooks.get[ key.toLowerCase() ] = function(node)  {return node[key]};
    });

    // style hook
    util$accessorhooks$$hooks.get.style = function(node)  {return node.style.cssText};
    util$accessorhooks$$hooks.set.style = function(node, value)  { node.style.cssText = value };

    // title hook for DOM
    util$accessorhooks$$hooks.get.title = function(node)  {
        var doc = node.ownerDocument;

        return (node === doc.documentElement ? doc : node).title;
    };

    util$accessorhooks$$hooks.set.title = function(node, value)  {
        var doc = node.ownerDocument;

        (node === doc.documentElement ? doc : node).title = value;
    };

    // some browsers don't recognize input[type=email] etc.
    util$accessorhooks$$hooks.get.type = function(node)  {return node.getAttribute("type") || node.type};
    if (JSCRIPT_VERSION < 9) {
        // IE8 has innerText but not textContent
        util$accessorhooks$$hooks.get.textContent = function(node)  {return node.innerText};
        util$accessorhooks$$hooks.set.textContent = function(node, value)  { node.innerText = value };

        // IE8 sometimes breaks on innerHTML
        util$accessorhooks$$hooks.set.innerHTML = function(node, value) {
            try {
                node.innerHTML = value;
            } catch (err) {
                var sandbox = node.ownerDocument.createElement("div"), it;

                node.innerText = ""; // cleanup inner content
                sandbox.innerHTML = value;

                while (it = sandbox.firstChild) {
                    node.appendChild(it);
                }
            }
        };
    }

    var util$accessorhooks$$default = util$accessorhooks$$hooks;

    var element$get$$reUpper = /[A-Z]/g,
        element$get$$readPrivateProperty = function(node, key)  {
            // convert from camel case to dash-separated value
            key = key.replace(element$get$$reUpper, function(l)  {return "-" + l.toLowerCase()});

            var value = node.getAttribute("data-" + key);

            if (value != null) {
                // try to recognize and parse  object notation syntax
                if (value[0] === "{" && value[value.length - 1] === "}") {
                    try {
                        value = JSON.parse(value);
                    } catch (err) {
                        // just return the value itself
                    }
                }
            }

            return value;
        };

    util$index$$register({
        get: function(name) {var this$0 = this;
            var node = this[0],
                hook = util$accessorhooks$$default.get[name];

            if (hook) return hook(node, name);

            if (typeof name === "string") {
                if (name in node) {
                    return node[name];
                } else if (name[0] !== "_") {
                    return node.getAttribute(name);
                } else {
                    var key = name.slice(1),
                        data = this._;

                    if (!(key in data)) {
                        data[key] = element$get$$readPrivateProperty(node, key);
                    }

                    return data[key];
                }
            } else if (util$index$$isArray(name)) {
                return name.reduce(function(memo, key)  {
                    return (memo[key] = this$0.get(key), memo);
                }, {});
            } else if (name === void 0) {
                // TODO: remove this line in future
                return this.value();
            } else {
                throw new MethodError("get", arguments);
            }
        }
    }, null, function()  {return function() {}});

    util$index$$register({
        after: ["afterend", true, function(node, relatedNode)  {
            node.parentNode.insertBefore(relatedNode, node.nextSibling);
        }],

        before: ["beforebegin", true, function(node, relatedNode)  {
            node.parentNode.insertBefore(relatedNode, node);
        }],

        prepend: ["afterbegin", false, function(node, relatedNode)  {
            node.insertBefore(relatedNode, node.firstChild);
        }],

        append: ["beforeend", false, function(node, relatedNode)  {
            node.appendChild(relatedNode);
        }],

        replace: ["", true, function(node, relatedNode)  {
            node.parentNode.replaceChild(relatedNode, node);
        }],

        remove: ["", true, function(node)  {
            node.parentNode.removeChild(node);
        }]
    }, function(methodName, fastStrategy, requiresParent, strategy)  {return function() {var contents = SLICE$0.call(arguments, 0);var this$0 = this;
        var node = this[0];

        if (requiresParent && !node.parentNode) return this;

        // the idea of the algorithm is to construct HTML string
        // when possible or use document fragment as a fallback to
        // invoke manipulation using a single method call
        var fragment = fastStrategy ? "" : node.ownerDocument.createDocumentFragment();

        contents.forEach(function(content)  {
            if (typeof content === "function") {
                content = content(this$0);
            }

            if (typeof content === "string") {
                if (typeof fragment === "string") {
                    fragment += content.trim();
                } else {
                    content = DOM.createAll(content);
                }
            } else if (content instanceof $Element) {
                content = [ content ];
            }

            if (util$index$$isArray(content)) {
                if (typeof fragment === "string") {
                    // append existing string to fragment
                    content = DOM.createAll(fragment).concat(content);
                    // fallback to document fragment strategy
                    fragment = node.ownerDocument.createDocumentFragment();
                }

                content.forEach(function(el)  {
                    fragment.appendChild(el[0]);
                });
            }
        });

        if (typeof fragment === "string") {
            node.insertAdjacentHTML(fastStrategy, fragment);
        } else {
            strategy(node, fragment);
        }

        return this;
    }}, function()  {return RETURN_THIS});

    util$index$$register({
        map: function(fn, context) {
            if (typeof fn !== "function") {
                throw new MethodError("map", arguments);
            }

            return [ fn.call(context, this) ];
        }
    }, null, function()  {return function()  {return []}});

    var util$selectorhooks$$isHidden = function(node)  {
        var computed = util$index$$computeStyle(node);

        return computed.visibility === "hidden" || computed.display === "none";
    };

    var util$selectorhooks$$default = {
        ":focus": function(node)  {return node === node.ownerDocument.activeElement},

        ":visible": function(node)  {return !util$selectorhooks$$isHidden(node)},

        ":hidden": util$selectorhooks$$isHidden
    };

    util$index$$register({
        matches: function(selector) {
            if (!selector || typeof selector !== "string") throw new MethodError("matches", arguments);

            var checker = util$selectorhooks$$default[selector] || util$selectormatcher$$default(selector);

            return !!checker(this[0]);
        }
    }, null, function()  {return RETURN_FALSE});

    util$index$$register({
        off: function(type, selector, callback) {
            if (typeof type !== "string") throw new MethodError("off", arguments);

            if (callback === void 0) {
                callback = selector;
                selector = void 0;
            }

            var node = this[0];

            this._["handler2001004"] = this._["handler2001004"].filter(function(handler)  {
                var skip = type !== handler.type;

                skip = skip || selector && selector !== handler.selector;
                skip = skip || callback && callback !== handler.callback;

                if (skip) return true;

                type = handler._type || handler.type;
                if (JSCRIPT_VERSION < 9) {
                    node.detachEvent("on" + type, handler);
                } else {
                    node.removeEventListener(type, handler, !!handler.capturing);
                }
            });

            return this;
        }
    }, null, function()  {return RETURN_THIS});

    util$index$$register({
        offset: function() {
            var node = this[0],
                docEl = node.ownerDocument.documentElement,
                clientTop = docEl.clientTop,
                clientLeft = docEl.clientLeft,
                scrollTop = WINDOW.pageYOffset || docEl.scrollTop,
                scrollLeft = WINDOW.pageXOffset || docEl.scrollLeft,
                boundingRect = node.getBoundingClientRect();

            return {
                top: boundingRect.top + scrollTop - clientTop,
                left: boundingRect.left + scrollLeft - clientLeft,
                right: boundingRect.right + scrollLeft - clientLeft,
                bottom: boundingRect.bottom + scrollTop - clientTop,
                width: boundingRect.right - boundingRect.left,
                height: boundingRect.bottom - boundingRect.top
            };
        }
    }, null, function()  {return function() {
        return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }});

    util$index$$register({
        on: false,

        once: true

    }, function(method, single)  {return function(type, selector, args, callback) {var this$0 = this;
        if (typeof type === "string") {
            if (typeof args === "function") {
                callback = args;

                if (typeof selector === "string") {
                    args = null;
                } else {
                    args = selector;
                    selector = null;
                }
            }

            if (typeof selector === "function") {
                callback = selector;
                selector = null;
                args = null;
            }

            if (typeof callback !== "function") {
                throw new MethodError(method, arguments);
            }

            var node = this[0],
                handler = util$eventhandler$$default(type, selector, callback, args, this, single);

            if (JSCRIPT_VERSION < 9) {
                node.attachEvent("on" + (handler._type || type), handler);
            } else {
                node.addEventListener(handler._type || type, handler, !!handler.capturing);
            }
            // store event entry
            this._["handler2001004"].push(handler);
        } else if (typeof type === "object") {
            if (util$index$$isArray(type)) {
                type.forEach(function(name)  { this$0[method](name, selector, args, callback) });
            } else {
                util$index$$keys(type).forEach(function(name)  { this$0[method](name, type[name]) });
            }
        } else {
            throw new MethodError(method, arguments);
        }

        return this;
    }}, function()  {return RETURN_THIS});

    util$index$$register({
        set: function(name, value) {var this$0 = this;
            var node = this[0];

            var hook = util$accessorhooks$$default.set[name],
                watchers = this._["watcher2001004"][name],
                oldValue;

            if (watchers) {
                oldValue = this.get(name);
            }

            if (arguments.length === 1 && typeof name !== "object") {
                // TODO: remove this check in future
                return this.value(name);
            }

            if (typeof name === "string") {
                if (name[0] === "_") {
                    this._[name.slice(1)] = value;
                } else {
                    if (typeof value === "function") {
                        value = value(this);
                    }

                    if (hook) {
                        hook(node, value);
                    } else if (value == null) {
                        node.removeAttribute(name);
                    } else if (name in node) {
                        node[name] = value;
                    } else {
                        node.setAttribute(name, value);
                    }
                    if (JSCRIPT_VERSION < 9 || LEGACY_ANDROID) {
                        // always trigger reflow manually for IE8 and legacy Android
                        node.className = node.className;
                    }
                }
            } else if (util$index$$isArray(name)) {
                name.forEach(function(key)  { this$0.set(key, value) });
            } else if (typeof name === "object") {
                util$index$$keys(name).forEach(function(key)  { this$0.set(key, name[key]) });
            } else {
                throw new MethodError("set", arguments);
            }

            if (watchers && oldValue !== value) {
                watchers.forEach(function(w)  {
                    util$index$$safeCall(this$0, w, value, oldValue);
                });
            }

            return this;
        }
    }, null, function()  {return RETURN_THIS});

    util$index$$register({
        next: "nextSibling",

        prev: "previousSibling",

        nextAll: "nextSibling",

        prevAll: "previousSibling",

        closest: "parentNode"

    }, function(methodName, propertyName)  {return function(selector) {
        if (selector && typeof selector !== "string") throw new MethodError(methodName, arguments);

        var all = methodName.slice(-3) === "All",
            matcher = util$selectormatcher$$default(selector),
            nodes = all ? [] : null,
            it = this[0];

        // method closest starts traversing from the element itself
        // except no selector was specified where it returns parent
        if (!matcher || methodName !== "closest") {
            it = it[propertyName];
        }

        for (; it; it = it[propertyName]) {
            if (it.nodeType === 1 && (!matcher || matcher(it))) {
                if (!all) break;

                nodes.push(it);
            }
        }

        return all ? util$index$$map.call(nodes, $Element) : $Element(it);
    }}, function(methodName)  {return function()  {return methodName.slice(-3) === "All" ? [] : new $NullElement()}});

    util$index$$register({
        value: function(content) {
            var node = this[0], name;

            if (content === void 0) {
                switch (node.tagName) {
                case "SELECT":
                    return ~node.selectedIndex ? node.options[ node.selectedIndex ].value : "";

                case "OPTION":
                    name = node.hasAttribute("value") ? "value" : "text";
                    break;

                default:
                    name = node.type && "value" in node ? "value" : "innerHTML";
                }

                return node[name];
            } else if ((content instanceof $Element) || Array.isArray(content)) {
                return this.set("").append(content);
            }

            if (typeof content === "function") {
                content = content(this);
            }

            if (typeof content !== "string") {
                content = content == null ? "" : String(content);
            }

            switch (node.tagName) {
            case "INPUT":
            case "OPTION":
                name = "value";
                break;

            case "SELECT":
                // selectbox has special case
                if (util$index$$every.call(node.options, function(o)  {return !(o.selected = o.value === content)})) {
                    node.selectedIndex = -1;
                }
                // return earlier
                return this;

            case "TEXTAREA":
                // for IE use innerText for textareabecause it doesn't trigger onpropertychange
                name = JSCRIPT_VERSION < 9 ? "innerText" : "value";
                break;

            default:
                name = "innerHTML";
            }

            return this.set(name, content);
        }
    }, null, function()  {return function() {
        if (arguments.length) return this;
    }});

    var util$animationhandler$$TRANSITION_PROPS = ["timing-function", "property", "duration", "delay"].map(function(prop)  {return "transition-" + prop}),
        util$animationhandler$$parseTimeValue = function(value)  {
            var result = parseFloat(value) || 0;
            // if duration is in seconds, then multiple result value by 1000
            return !result || value.slice(-2) === "ms" ? result : result * 1000;
        },
        util$animationhandler$$calcTransitionDuration = function(transitionValues)  {
            var delays = transitionValues[3],
                durations = transitionValues[2];

            return Math.max.apply(Math, durations.map(function(value, index)  {
                return util$animationhandler$$parseTimeValue(value) + (util$animationhandler$$parseTimeValue(delays[index]) || 0);
            }));
        };

    // initialize hooks for properties used below
    util$animationhandler$$TRANSITION_PROPS.concat("animation-duration").forEach(function(prop)  { util$stylehooks$$default.find(prop, HTML.style) });

    var util$animationhandler$$default = function(node, computed, animationName, hiding, done)  {
        var rules, duration;

        // Legacy Android is usually slow and has lots of bugs in the
        // CSS animations implementation, so skip any animations for it
        if (LEGACY_ANDROID || JSCRIPT_VERSION < 10) return null;

        if (animationName) {
            duration = util$animationhandler$$parseTimeValue(computed[util$stylehooks$$default.get["animation-duration"]]);

            if (!duration) return; // skip animations with zero duration

            rules = [
                WEBKIT_PREFIX + "animation-direction:" + (hiding ? "normal" : "reverse"),
                WEBKIT_PREFIX + "animation-name:" + animationName,
                // for CSS3 animation element should always be visible
                "visibility:inherit"
            ];
        } else {
            var transitionValues = util$animationhandler$$TRANSITION_PROPS.map(function(prop, index)  {
                    // have to use regexp to split transition-timing-function value
                    return computed[util$stylehooks$$default.get[prop]].split(index ? ", " : /, (?!\d)/);
                });

            duration = util$animationhandler$$calcTransitionDuration(transitionValues);

            if (!duration) return; // skip transitions with zero duration

            if (transitionValues[1].indexOf("all") < 0) {
                // try to find existing or use 0s length or make a new visibility transition
                var visibilityIndex = transitionValues[1].indexOf("visibility");

                if (visibilityIndex < 0) visibilityIndex = transitionValues[2].indexOf("0s");
                if (visibilityIndex < 0) visibilityIndex = transitionValues[1].length;

                transitionValues[0][visibilityIndex] = "linear";
                transitionValues[1][visibilityIndex] = "visibility";
                transitionValues[hiding ? 2 : 3][visibilityIndex] = "0s";
                transitionValues[hiding ? 3 : 2][visibilityIndex] = duration + "ms";
            }

            rules = transitionValues.map(function(props, index)  {
                // fill holes in a trasition property value
                for (var i = 0, n = props.length; i < n; ++i) {
                    props[i] = props[i] || props[i - 1] || "initial";
                }

                return WEBKIT_PREFIX + util$animationhandler$$TRANSITION_PROPS[index] + ":" + props.join(", ");
            });

            rules.push(
                // append target visibility value to trigger transition
                "visibility:" + (hiding ? "hidden" : "inherit"),
                // use willChange to improve performance in modern browsers:
                // http://dev.opera.com/articles/css-will-change-property/
                "will-change:" + transitionValues[1].join(", ")
            );
        }

        return {
            cssText: rules.join(";"),
            initialCssText: node.style.cssText,
            // this function used to trigger callback
            handleEvent: function(e)  {
                if (e.target === node) {
                    if (animationName) {
                        if (e.animationName !== animationName) return;
                    } else {
                        if (e.propertyName !== "visibility") return;
                    }

                    e.stopPropagation(); // this is an internal event

                    done();
                }
            }
        };
    };

    var element$visibility$$TRANSITION_EVENT_TYPE = WEBKIT_PREFIX ? "webkitTransitionEnd" : "transitionend",
        element$visibility$$ANIMATION_EVENT_TYPE = WEBKIT_PREFIX ? "webkitAnimationEnd" : "animationend";

    util$index$$register({
        show: false,

        hide: true,

        toggle: null

    }, function(methodName, condition)  {return function(animationName, callback) {var this$0 = this;
        if (typeof animationName !== "string") {
            callback = animationName;
            animationName = null;
        }

        if (callback && typeof callback !== "function") {
            throw new MethodError(methodName, arguments);
        }

        var node = this[0],
            style = node.style,
            computed = util$index$$computeStyle(node),
            hiding = condition,
            frameId = this._["frame2001004"],
            done = function()  {
                if (animationHandler) {
                    node.removeEventListener(eventType, animationHandler, true);
                    // clear inline style adjustments were made previously
                    style.cssText = animationHandler.initialCssText;
                } else {
                    this$0.set("aria-hidden", String(hiding));
                }
                // always update element visibility property: use value "inherit"
                // to respect parent container visibility. Should be a separate
                // from setting cssText because of Opera 12 quirks
                style.visibility = hiding ? "hidden" : "inherit";

                this$0._["frame2001004"] = null;

                if (callback) callback(this$0);
            };

        if (typeof hiding !== "boolean") {
            hiding = computed.visibility !== "hidden";
        }

        // cancel previous frame if it exists
        if (frameId) DOM.cancelFrame(frameId);

        if (!node.ownerDocument.documentElement.contains(node)) {
            // apply attribute/visibility syncronously for detached DOM elements
            // because browser returns zero animation/transition duration for them
            done();
        } else {
            var animationHandler = util$animationhandler$$default(node, computed, animationName, hiding, done),
                eventType = animationName ? element$visibility$$ANIMATION_EVENT_TYPE : element$visibility$$TRANSITION_EVENT_TYPE;
            // use requestAnimationFrame to avoid animation quirks for
            // new elements inserted into the DOM
            // http://christianheilmann.com/2013/09/19/quicky-fading-in-a-newly-created-element-using-css/
            this._["frame2001004"] = DOM.requestFrame(!animationHandler ? done : function()  {
                node.addEventListener(eventType, animationHandler, true);
                // update modified style rules
                style.cssText = animationHandler.initialCssText + animationHandler.cssText;
                // trigger CSS3 transition / animation
                this$0.set("aria-hidden", String(hiding));
            });
        }

        return this;
    }}, function()  {return RETURN_THIS});

    util$index$$register({
        watch: function(name, callback) {
            var watchers = this._["watcher2001004"];

            if (!watchers[name]) watchers[name] = [];

            watchers[name].push(callback);

            return this;
        },

        unwatch: function(name, callback) {
            var watchers = this._["watcher2001004"];

            if (watchers[name]) {
                watchers[name] = watchers[name].filter(function(w)  {return w !== callback});
            }

            return this;
        }
    }, null, function()  {return RETURN_THIS});

    DOM.constructor = function(node)  {
        var nodeType = node && node.nodeType,
            ctr = nodeType === 9 ? $Document : $Element;
        // filter non elements like text nodes, comments etc.
        return ctr(nodeType === 1 || nodeType === 9 ? node : null);
    };

    var global$format$$reVar = /\{([\w\-]+)\}/g;

    DOM.format = function(tmpl, varMap) {
        if (typeof tmpl !== "string") tmpl = String(tmpl);

        if (!varMap || typeof varMap !== "object") varMap = {};

        return tmpl.replace(global$format$$reVar, function(x, name, index)  {
            if (name in varMap) {
                x = varMap[name];

                if (typeof x === "function") x = x(index);

                x = String(x);
            }

            return x;
        });
    };

    var global$frame$$raf = WINDOW.requestAnimationFrame,
        global$frame$$craf = WINDOW.cancelAnimationFrame,
        global$frame$$lastTime = 0;

    if (!(global$frame$$raf && global$frame$$craf)) {
        VENDOR_PREFIXES.forEach(function(prefix)  {
            prefix = prefix.toLowerCase();

            global$frame$$raf = global$frame$$raf || WINDOW[prefix + "RequestAnimationFrame"];
            global$frame$$craf = global$frame$$craf || WINDOW[prefix + "CancelAnimationFrame"];
        });
    }

    DOM.requestFrame = function(callback)  {
        if (global$frame$$raf) {
            return global$frame$$raf.call(WINDOW, callback);
        } else {
            // use idea from Erik Möller's polyfill:
            // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - global$frame$$lastTime));

            global$frame$$lastTime = currTime + timeToCall;

            return WINDOW.setTimeout(function()  { callback(currTime + timeToCall) }, timeToCall);
        }
    };

    DOM.cancelFrame = function(frameId)  {
        if (global$frame$$craf) {
            global$frame$$craf.call(WINDOW, frameId);
        } else {
            WINDOW.clearTimeout(frameId);
        }
    };

    var exports$$_DOM = WINDOW.DOM;

    DOM.noConflict = function() {
        if (WINDOW.DOM === DOM) {
            WINDOW.DOM = exports$$_DOM;
        }

        return DOM;
    };

    WINDOW.DOM = DOM;
})();
