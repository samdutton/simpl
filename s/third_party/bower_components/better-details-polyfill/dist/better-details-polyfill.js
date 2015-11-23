/**
 * better-details-polyfill: <details> polyfill for better-dom
 * @version 2.1.0 Tue, 16 Dec 2014 17:37:23 GMT
 * @link https://github.com/chemerisuk/better-details-polyfill
 * @copyright 2014 Maksim Chemerisuk
 * @license MIT
 */
(function(DOM, VK_SPACE, VK_ENTER) {
    "use strict";

    // add ARIA attributes for ALL browsers because current
    // native implementaions are weak:
    // https://bugs.webkit.org/show_bug.cgi?id=131111

    var hasNativeSupport = typeof DOM.create("details").get("open") === "boolean";

    DOM.extend("details", {
        constructor: function() {
            // http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-details-element
            this.set("role", "group")
                .on("toggle", ["stopPropagation"], this._changeOpen.bind(this));

            var firstSummary = this.children("summary")[0];
            // If there is no child summary element, the user agent
            // should provide its own legend (e.g. "Details")
            if (!firstSummary) firstSummary = DOM.create("summary>`Details`");
            // make the first <summary> always to be the first child
            if (this.child(0) !== firstSummary) {
                this.prepend(firstSummary);
            }
            // http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-summary-element
            firstSummary.set("role", "button");
            /* istanbul ignore if */
            if (!hasNativeSupport) {
                this.define("open", this._getOpen, this._setOpen);

                this._initSummary(firstSummary);
            }

            this._changeOpen();
        },
        _initSummary: function(summary) {
            summary
                .set("tabindex", 0)
                .on("keydown", ["which"], this._toggleOpen.bind(this))
                .on("click", this._toggleOpen.bind(this));
        },
        _changeOpen: function(stop) {
            this.set("aria-expanded", this.get("open"));

            if (stop) stop(); // toggle event should not bubble
        },
        _getOpen: function(attrValue) {
            attrValue = String(attrValue).toLowerCase();

            return attrValue === "" || attrValue === "open";
        },
        _setOpen: function(propValue) {var this$0 = this;
            var currentValue = this.get("open");

            propValue = !!propValue;

            if (currentValue !== propValue) {
                // have to use setTimeout because the event should
                // fire AFTER the attribute was updated
                setTimeout(function()  { this$0.fire("toggle") }, 0);
            }

            return propValue ? "" : null;
        },
        _toggleOpen: function(key) {
            if (!key || key === VK_SPACE || key === VK_ENTER) {
                this.set("open", !this.get("open"));
                // need to prevent default, because
                // the enter key usually submits a form
                return false;
            }
        }
    });
}(window.DOM, 32, 13));

DOM.importStyles("@media all", "summary:first-child~*{display:none}details[open]>*{display:block}details>summary:first-child{display:block}details:before{content:'\\25BA';font-family:serif;font-size:.75em;margin-top:.25em;margin-left:.25em;position:absolute}details[open]:before{content:'\\25BC'}summary:first-child{text-indent:1.25em}details::before{content:'';width:0;height:0;border:solid transparent;border-left-color:inherit;border-width:.25em .5em;margin-top:.4em;margin-left:.2em;-webkit-transform:rotate(0deg) scale(1.5);-ms-transform:rotate(0deg) scale(1.5);transform:rotate(0deg) scale(1.5);-webkit-transform-origin:25% 50%;-ms-transform-origin:25% 50%;transform-origin:25% 50%;-webkit-transition:-webkit-transform .15s ease-out;transition:transform .15s ease-out}details[open]::before{content:'';-webkit-transform:rotate(90deg) scale(1.5);-ms-transform:rotate(90deg) scale(1.5);transform:rotate(90deg) scale(1.5)}summary::-webkit-details-marker{display:none}");
