The Tree of Life
================

Prototype version 0.1
=====================



Video formats
-------------

This video for this prototype has been encoded as .ogv, for use in Firefox, and as .mov, for use in Safari and other WebKit-based browsers.

The code for the video element in index.html looks like this:

	<video id="treeOfLife" autoplay="autoplay" controls="controls">
		<source src="video/treeOfLife.mov" />
		<source src="video/treeOfLife.ogv" />
		<p id="videoElementWarning">Viewing these demos requires a browser capable of rendering the HTML 5 video element.<br />Please install a current version of <a href="http://www.mozilla.com">Firefox</a>, <a href="http://www.apple.com/safari">Safari</a> or <a href="http://www.google.com/chrome">Google&nbsp;Chrome</a>.</p>
		<img id="videoMockup" src="images/videoMockup.png" title="Use Firefox, Chrome or Safari to view video" />
	</video>

If the video element is implemented, the browser will play the .mov version if it can, or fall back to displaying the .ogv.

If the video element is not implemented, as in Internet Explorer, the browser will fall back to displaying explanatory text and a mockup graphic.