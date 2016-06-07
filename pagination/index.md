## Introduction

It's simple to add video to your website, but how can you deliver great
performance even when connectivity is flakey and bandwidth is limited?

In this codelab you'll find out how to get the best possible experience
on any device.

<div class="section">

## What are you going to build?

You will build a player that enables you to deliver video using Dynamic
Adaptive Streaming over HTTP (DASH).

![](insert_image_url_here)

© Copyright 2008 [Blender Foundation](http://blender.org) |
[bigbuckbunny.org](https://peach.blender.org/)

</div>

<div class="section">

## Overview

Duration: 0:30

Learn how to use adaptive streaming to deliver a great video experience
across devices and platforms, even on flaky networks or offline.

### What you'll learn

-   Techniques to make the most of the video element.
-   How to build a simple adaptive streaming video player.
-   How to add captions, subtitles and synchronised metadata.
-   An introduction to Dynamic Adaptive Streaming over HTTP (DASH).
-   Media delivery testing, across devices and different bandwidths.

### What you'll need

-   Chrome 47 or above
-   [Web Server for
    Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb),
    or use your own web server of choice.
-   The sample code
-   A text editor
-   Basic knowledge of HTML, CSS and JavaScript

</div>

<div class="section">

## Get started

Duration: 2:00

### Download the code

If you're familiar with git, you can download the code for this codelab
from GitHub by cloning it:

> git clone https://github.com/googlecodelabs/adaptive-web-media

Alternatively, click the following button to download a .zip file of the
code:

[Download source
code](https://github.com/googlecodelabs/adaptive-web-media/archive/master.zip)

Open the downloaded zip file. This will unpack a project folder
(**adaptive-web-media**) that contains one folder for each step of this
codelab, along with all of the resources you will need.

You'll be doing all your coding work in the directory named **work**.

The **step-nn** folders contain a finished version for each step of this
codelab. They are there for reference.

### Install and verify web server

While you're free to use your own web server, this codelab is designed
to work well with the Chrome Web Server. If you don't have that app
installed yet, you can install it from the Chrome Web Store:

[Install Web Server for
Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)

![](insert_image_url_here)

After installing the **Web Server for Chrome** app, click on the Chrome
Apps shortcut from the bookmarks bar, a New Tab page, or from the App
Launcher:

![](insert_image_url_here)

Click on the Web Server icon:

![](insert_image_url_here)

Next, you'll see this dialog, which allows you to configure your local
web server:

![](insert_image_url_here)

Click the **CHOOSE FOLDER** button, and select the **work** folder you
just created. This will enable you to view your work in progress in
Chrome via the URL highlighted in the Web Server dialog in the **Web
Server URL(s)** section.

Under **Options**, check the box next to **Automatically show
index.html** as shown below:

![](insert_image_url_here)

Then stop and restart the server by sliding the toggle labeled **Web
Server: STARTED** to the left and then back to the right.

![](insert_image_url_here)

Now visit your work site in your web browser by clicking on the
highlighted Web Server URL. You should see a page that looks like this,
which corresponds to **work/index.html**:

![](insert_image_url_here)

Obviously, this app is not yet doing anything interesting — so far, it's
just a minimal skeleton we're using to make sure your web server is
working properly. We'll add functionality and layout features in
subsequent steps.

From this point forward, all testing and verification should be
performed using this web server setup. You'll usually be able to get
away with simply refreshing your test browser tab.

</div>

<div class="section">

## Make the most of the video element

Duration: 5:00

A completed version of this section is in the **step-02** folder.

In this codelab, we'll be using open source video from [The Blender
Foundation](https://www.blender.org/).

The `video` element is a thing of simple beauty. Download, decode and
play back video with a few lines of code.

Let's get started!

Add a `video` element to **index.html** in your work folder:

> &lt;video autoplay controls src="video/bunny.webm"&gt; &lt;p&gt;Sorry!
> Your browser doesn't support the video element.&lt;/p&gt;
> &lt;/video&gt;

Notice that the `video` element always has a closing `</video>` tag:
it's not 'self-closing'. Any elements inside it (such as the paragraph
in this example) will be displayed if the browser doesn't support
`video`.

Try it out in the browser: you should see a big white rabbit.

### Time fragments

You can specify a start and end time by adding a fragment to the URL.
This enables multiple views on the same video.

Try it out:

> &lt;video autoplay controls src="video/bunny.webm\#t=25,26"&gt;
> &lt;p&gt;Sorry! Your browser doesn't support the video
> element.&lt;/p&gt; &lt;/video&gt;

### Video formats

What if you want to serve video to Safari users? Safari supports MP4
video but not WebM.

**What's WebM?**

MP4 and WebM are container formats. You can think of these a bit like
.zip files, containing both audio and video components.

Most commonly, MP4 stores audio using AAC compression and video using
H.264.

WebM uses VP8 and Vorbis or, more recently VP9 and Opus.

### The source element

Use the `source` element to enable browsers to choose from multiple
formats. MP4 and WebM cover all modern browsers, including all mobile
browsers. Specify video sources in order of preference:

> &lt;video autoplay controls&gt; &lt;source src="video/bunny.webm"
> /&gt; &lt;source src="video/bunny.mp4" /&gt; &lt;p&gt;Sorry! Your
> browser doesn't support the video element.&lt;/p&gt; &lt;/video&gt;

Adding a `type` attribute to a `source` element enables the browser to
select a video source without having to download part of the video to
check:

> &lt;video autoplay controls&gt; &lt;source src="video/bunny.webm"
> type="video/webm" /&gt; &lt;source src="video/bunny.mp4"
> type="video/mp4" /&gt; &lt;p&gt;Sorry! Your browser doesn't support
> the video element.&lt;/p&gt; &lt;/video&gt;

**Try it out!**

The demo at
[simpl.info/video/notype](https://simpl.info/video/notype/index.html)
has `source` elements without `type` attributes. Open the page in Safari
from your own computer or phone and look at network activity from Web
Inspector.

You'll see that Safari has to download a little bit of metadata for the
WebM file to 'sniff' the format. That requires one more resource
request, and additional processing, which is not good anywhere,
particularly on mobile.

**Top Tip!**

Make sure your server reports [the correct video MIME
type](https://youtu.be/j5fYOYrsocs?t=3m56s).

### Format support

Want to know what formats are supported by your browser?

Try the video `canPlayType()` method.

Add the following code to the **main.js** file in the **js**directory in
your **work**directory:

> var videoElement = document.querySelector('video');
> console.log('fubar', videoElement.canPlayType('fubar'));
> console.log('webm', videoElement.canPlayType('video/webm'));
> console.log('webm/vp8', videoElement.canPlayType('video/webm;
> codecs="vp8"'));

Take a look at the output from the DevTools console.

There are many factors that affect whether or not a browser can play a
particular format, so the browser cannot give a definite yes or no
answer to `canPlayType()`. Hence the `maybe` and `probably v`alues! An
empty string means the container and codec combination is definitely not
supported.

### Video src

Want to know which source was actually chosen? Add this to your
JavaScript:

> console.log(videoElement.currentSrc);

### Video size and display size

While you're there, you can get the actual height and width of the
video. That might be different from the dimensions of the video element
— in the same way that images can be displayed bigger or smaller than
their actual size. For this, you need to wait until the video metadata
is loaded:

> videoElement.onloadedmetadata = function() {
> console.log(this.videoWidth); console.log(this.videoHeight); };

Thinking about display size and CSS, a simple technique for video is to
specify a `width` and a `max-width`. That way you get a preferred size,
but the video never overflows its container. Don't specify a height: the
browser will work that out automatically. That way you'll keep the right
aspect ratio. Much easier and less error prone than trying to calculate
it manually!

Add the following to **main.css** in the **work/css** folder:

> video { width: 640px; max-width: 100%; }

### The poster attribute

Last but not least, let's add a poster image: an image displayed before
playback, as soon as a video element is rendered.

There's already a poster image in the **work/images** folder:
**poster.jpg**. Add a `poster` attribute to the opening tag of the
`video` element:

> &lt;video autoplay controls poster="images/poster.jpg"&gt;

Including a poster attribute gives viewers a meaningful idea of content
without needing to download video or start playback. The only downside
is that using a poster image incurs an additional file request, which
consumes a little bit of bandwidth and requires rendering.

**Choose the right resolution**

Serve video at an appropriate resolution for the target device — not too
big, not too small. Don't just tweak the video element size! There's no
point in serving 1080x1920 files to phones with a small viewport when
360x640px looks just as good.

You can use media queries to choose a different video depending on the
viewport dimensions. Try this out at
[simpl.info/video/mq](https://simpl.info/video/mq): with a bigger
viewport, you get the bigger video, and with a smaller viewport you get
the smaller video.

### Learn more

-   [Video on mobile](https://www.youtube.com/watch?v=j5fYOYrsocs)
-   [Big Buck Bunny](https://peach.blender.org/): more about the video
    used in this codelab

</div>

<div class="section">

## Add subtitles, captions &amp; descriptions

Duration: 2:00

A completed version of this section is in the **step-03** folder.

It's easy to make audio and video more accessible to a wider audience by
adding subtitles, titles or descriptions.

This can be done by adding a `track` element as a child of a `video` or
`audio` element. The `track` element's `src` attribute points to a file
that gives information about text (such as subtitles) to be displayed by
the browser during playback. A track file consists of timed ‘cues' in a
plain text file.

Create a directory named **track** in your **work**folder and add a new
file named **track.vtt**. Add the following text to that file:

> WEBVTT FILE 00:00:00.000 --&gt; 00:00:02.000 Opening titles
> 00:00:03.500 --&gt; 00:00:05.000 A rabbit hole at the base of a tree
> 00:00:09.000 --&gt; 00:00:11.000 An enormous white rabbit in a field
> 00:00:13.000 --&gt; 00:00:14.500 Three rodents, one throws an acorn at
> the rabbit 00:00:15.500 --&gt; 00:00:16.750 The rabbit looks shocked

This format is called WebVTT.

Add the following `track` element as a child of your `video` element:

> &lt;track label="Descriptions" src="tracks/track.vtt" /&gt;

Your `video` element code should now look like this:

> &lt;video autoplay controls poster="images/poster.jpg"&gt; &lt;source
> src="video/bunny.webm" type="video/webm" /&gt; &lt;source
> src="video/bunny.mp4" type="video/mp4" /&gt; &lt;track
> label="Descriptions" src="tracks/track.vtt" /&gt; &lt;p&gt;Sorry! Your
> browser doesn't support the video element.&lt;/p&gt; &lt;/video&gt;

Open your page in the browser, click on the captions button at the right
of the video controls and select Descriptions:

![](insert_image_url_here)

The video should now display the descriptions you added — feel free to
embellish them.

![](insert_image_url_here)

The track element is supported by [all modern
browsers](http://caniuse.com/#feat=webvtt) on desktop and mobile — so
make the most of it!

You can also get and set text tracks in JavaScript, and listen out for
cue changes. Take a look at this example from
[simpl.info/track](https://simpl.info/track/):

> 'use strict'; var videoElement = document.querySelector('video'); var
> textTrack = videoElement.textTracks\[0\]; // there's only one! var
> data = document.getElementById('data'); textTrack.oncuechange =
> function() { // 'this' is a textTrack var cue = this.activeCues\[0\];
> // assuming there is only one active cue if (cue) { data.innerHTML =
> cue.startTime + '-' + cue.endTime + ': ' + cue.text + '\
> ' + data.innerHTML; // var obj = JSON.parse(cue.text); // cues can be
> data too :) } };

**Using tracks for synchronised metadata**

The track element can be used to synchronise any metadata with media
playback — not just subtitles.

You can add data (such as json) to cues, then parse the value of the
cues when the track `cuechange` event is fired.

[This demo](http://samdutton.com/map) shows how the track element can be
used to synchronise video playback with the position of a map marker,
and make synchronised changes to DOM elements. The position of the map
marker changes corresponding to the current time of the video. Time of
day is overlaid on the video.

**Tracks and tracks**

Don't confuse the track element and the [TextTrack
API](http://www.html5rocks.com/en/tutorials/track/basics/#toc-cues-js)
with
[MediaStreamTrack](https://developer.mozilla.org/docs/Web/API/MediaStream):
they are related but entirely different!

### Learn more

-   [Getting started with the track
    element](http://www.html5rocks.com/en/tutorials/track/basics/)
-   [An introduction to WebVTT
    and](https://dev.opera.com/articles/an-introduction-to-webvtt-and-track/)
-   [Mozilla Developer
    Network:](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)

</div>

<div class="section">

## Build a video stream in JavaScript

Duration: 2:00

A completed version of this section is in the **step-04** folder.

The source element makes it possible for the browser to choose between
multiple formats,

Modern browsers make 'partial requests' for video rather than waiting
for a whole video to download.

To see this in action, open
[simpl.info/longvideo](https://simpl.info/longvideo):

![](insert_image_url_here)

Open the Network panel of the Chrome DevTools, select Media, move around
between different times in the video, and you'll see lots of requests
for the same video. What's going on?

![](insert_image_url_here)

Click on one of the network responses, view the Request headers, and
you'll see something like this:

![](insert_image_url_here)

The browser has added a `range` header to the request, specifying a
start point in the video in bytes. As long as the server supports range
requests, it will return video data starting from that point.

Getting smaller segments is a better approach than waiting for
monolithic video downloads, but the decisions are all made by the
browser.

What if you wanted to choose between *different* video sources —
adapting to bandwidth, for example?

The [MediaSource
Extensions](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)
API (MSE) gives you more control by making it possible to construct
video streams in JavaScript. You can request segments of video using the
Fetch API or XHR, then stitch the segments together and buffer them for
a video element using MSE.

You can see MSE in action at [simpl.info/mse](https://simpl.info/mse):

![](insert_image_url_here)

In this example, video is retrieved via XHR, the video is divided up and
stored locally using the File APIs, then MSE creates a buffer to feed
the video element.

### Learn more

-   [W3C MSE specification](http://www.w3.org/TR/media-source/)
-   [Stream video using the Media Source
    API](http://updates.html5rocks.com/2011/11/Stream-video-using-the-MediaSource-API)
-   [Demo using MSE and the File
    APIs](http://html5-demos.appspot.com/static/media-source.html)

</div>

<div class="section">

## Implement adaptive streaming

Duration: 2:00

A completed version of this section is in the **step-05** folder.

It's useful to be able to build video streams in JavaScript, but how can
a video player adapt dynamically to device capabilities and current
network conditions?

### DASH: Dynamic Adaptive Streaming over HTTPS

This is where DASH comes in.

With DASH, you deliver video in segments over a normal HTTP connection.
Each segment is made available at a variety of bitrates, resolutions and
formats.The client chooses the best possible version, depending on
bandwidth and device capabilities. Using HTTP enables content delivery
with all the advantages of HTTP — and without the disadvantages of a
traditional streaming server. No proprietary protocols or hardware are
required.

However, rolling your own DASH solution can be complex.

Shaka Player is a simple-to-use DASH JavaScript library from Google
built on MSE and other Web standards. Shaka also supports multilingual
content for audio tracks and subtitles.

Shaka Player also enables delivery of protected content, using the EME
APIs to get licences and do decryption. To find out more take a look at
the [Shaka DRM
documentation](http://shaka-player-demo.appspot.com/docs/api/tutorial-drm-config.html).

Let's get started.

Replace everything in **main.js** with the following:

> 'use strict'; var manifestUri =
> 'https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd'; //
> Install built-in polyfills to patch browser incompatibilities.
> shaka.polyfill.installAll(); // Check to see if the browser supports
> the basic APIs Shaka needs. // This is an asynchronous check.
> shaka.Player.support().then(function(support) { // This executes when
> the asynchronous check is complete. if (support.supported) { //
> Everything looks good! initPlayer(); } else { // This browser does not
> have the minimum set of APIs you need. console.error('Browser not
> supported!'); } }); function initPlayer() { // Create a Player
> instance. var video = document.querySelector('video'); var player =
> new shaka.Player(video); player.configure({ preferredTextLanguage:
> 'en' }); // Add player to global scope so it's visible from the
> browser console window.player = player; // Listen for error events.
> player.addEventListener('error', onErrorEvent); // Try to load a
> manifest. // This is an asynchronous process.
> player.load(manifestUri).then(function() { // This runs if the
> asynchronous load is successful. console.log('The video has now been
> loaded!'); }).catch(onError); // onError is executed if the
> asynchronous load fails. } function onErrorEvent(event) { // Extract
> the shaka.util.Error object from the event. onError(event.detail); }
> function onError(error) { console.error('Error code', error.code,
> 'object', error); }

In **index.html** replace the video element and the script elements:

> &lt;video controls autoplay&gt;&lt;/video&gt; &lt;script
> src="js/dist/shaka-player.compiled.js"&gt;&lt;/script&gt; &lt;script
> src="js/main.js"&gt;&lt;/script&gt;

That's it!

Open **index.html** in your browser, and you should see
[Sintel](https://durian.blender.org/), an open source film from the
[Blender Institute](https://www.blender.org/institute/).

### How it works

The code in **main.js** uses Shaka player to implement DASH. Code for
Shaka is in **js/dist/shaka-player.compiled.js**.

The JavaScript for Shaka is compiled using
[Closure](https://developers.google.com/closure/compiler/), which makes
it efficient to use, but hard to read.

If you'd like to learn more about how Shaka is architected and coded,
the [API docs](http://shaka-player-demo.appspot.com/docs/api/index.html)
are a good place to start.

The JavaScript in **main.js** does the following:

1.  Install polyfills.
2.  Check for browser support.
3.  Create a Player object to wrap the video element.
4.  Listen for errors.
5.  Get and parse the DASH manifest.
6.  Get media segments via XHR and create a stream using MSE.

### What's a manifest?

A DASH manifest is an XML file that describes alternative sources for
each segment of video and audio — and also any text tracks for
subtitles, captions and descriptions.

The manifest is created programmatically when a media file is encoded
and/or segmented for DASH delivery.

Shaka estimates bandwidth and checks device capability using
`canPlayType()`. (Remember that from the previous step?) Shaka can then
fetch appropriate segments of audio and video via XHR, using the
information from the manifest. Once the segments are received, they can
be stitched together to form a stream using MSE.

Subtitles, captions and descriptions are also retrieved (if available)
and set for the video using the TextTrack API.

Take a look at the manifest used in this codelab,
[dash.mpd](http://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd).
Part of this is shown below:

> &lt;?xml version="1.0" encoding="UTF-8"?&gt; &lt;!--Generated with
> &lt;a
> href="https://github.com/google/edash-packager"&gt;https://github.com/google/edash-packager&lt;/a&gt;
> version fe6775a-release--&gt; &lt;MPD
> xmlns="urn:mpeg:dash:schema:mpd:2011"
> xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
> xmlns:xlink="http://www.w3.org/1999/xlink"
> xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd"
> xmlns:cenc="urn:mpeg:cenc:2013" minBufferTime="PT2S" type="static"
> profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
> mediaPresentationDuration="PT888.0533447265625S"&gt; &lt;Period
> id="0"&gt; &lt;AdaptationSet id="0" contentType="text" lang="nl"&gt;
> &lt;Representation id="0" bandwidth="256" mimeType="text/vtt"&gt;
> &lt;BaseURL&gt;s-dut.webvtt&lt;/BaseURL&gt; &lt;/Representation&gt;
> &lt;/AdaptationSet&gt; &lt;AdaptationSet id="1" contentType="text"
> lang="en"&gt; &lt;Representation id="1" bandwidth="256"
> mimeType="text/vtt"&gt; &lt;BaseURL&gt;s-eng.webvtt&lt;/BaseURL&gt;
> &lt;/Representation&gt; &lt;/AdaptationSet&gt; ... &lt;AdaptationSet
> id="10" contentType="video" maxWidth="3840" maxHeight="1636"
> frameRate="1000000/42000" par="40:17"&gt; &lt;Representation id="10"
> bandwidth="216910" codecs="vp9" mimeType="video/webm" sar="427:426"
> width="426" height="182"&gt;
> &lt;BaseURL&gt;v-0240p-0300k-vp9.webm&lt;/BaseURL&gt; &lt;SegmentBase
> indexRange="24075612-24076886" timescale="1000000"&gt;
> &lt;Initialization range="0-282"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; &lt;Representation id="11" bandwidth="393793"
> codecs="vp9" mimeType="video/webm" sar="639:640" width="640"
> height="272"&gt; &lt;BaseURL&gt;v-0360p-0550k-vp9.webm&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="43709632-43710931" timescale="1000000"&gt;
> &lt;Initialization range="0-284"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; ... &lt;Representation id="14"
> bandwidth="132318" codecs="mp4a.40.2" mimeType="audio/mp4"
> audioSamplingRate="48000"&gt; &lt;AudioChannelConfiguration
> schemeIdUri="urn:mpeg:dash:23003:3:audio\_channel\_configuration:2011"
> value="2"/&gt; &lt;BaseURL&gt;a-eng-0128k-aac.mp4&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="745-1844" timescale="48000"&gt;
> &lt;Initialization range="0-744"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; &lt;/AdaptationSet&gt; &lt;AdaptationSet
> id="12" contentType="audio" lang="en"&gt; &lt;Representation id="16"
> bandwidth="110385" codecs="vorbis" mimeType="audio/webm"
> audioSamplingRate="48000"&gt; &lt;AudioChannelConfiguration
> schemeIdUri="urn:mpeg:dash:23003:3:audio\_channel\_configuration:2011"
> value="2"/&gt;
> &lt;BaseURL&gt;a-eng-0128k-libvorbis.webm&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="12251633-12253142" timescale="1000000"&gt;
> &lt;Initialization range="0-4550"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; &lt;/AdaptationSet&gt; &lt;AdaptationSet
> id="13" contentType="video" maxWidth="3840" maxHeight="1636"
> frameRate="12288/512" subsegmentAlignment="true" par="40:17"&gt;
> &lt;Representation id="17" bandwidth="100729" codecs="avc1.42c01e"
> mimeType="video/mp4" sar="110:109" width="256" height="110"&gt;
> &lt;BaseURL&gt;v-0144p-0100k-libx264.mp4&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="828-1747" timescale="12288"&gt;
> &lt;Initialization range="0-827"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; ... &lt;Representation id="28"
> bandwidth="9270693" codecs="avc1.640028" mimeType="video/mp4"
> sar="1:1" width="2560" height="1090"&gt;
> &lt;BaseURL&gt;v-1440p-9000k-libx264.mp4&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="812-1731" timescale="12288"&gt;
> &lt;Initialization range="0-811"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; &lt;Representation id="29"
> bandwidth="17674702" codecs="avc1.640028" mimeType="video/mp4"
> sar="1636:1635" width="3840" height="1636"&gt;
> &lt;BaseURL&gt;v-2160p-17000k-libx264.mp4&lt;/BaseURL&gt;
> &lt;SegmentBase indexRange="831-1750" timescale="12288"&gt;
> &lt;Initialization range="0-830"/&gt; &lt;/SegmentBase&gt;
> &lt;/Representation&gt; &lt;/AdaptationSet&gt; &lt;/Period&gt;
> &lt;/MPD&gt;

This is not meant to be human readable! The main thing to understand is
that the manifest enables the player to choose alternative formats for
the same content and bitrate – in this example, WebM as well as MP4.

Great for media delivery to a range of devices and connectivity!

Shaka implements [its own bandwidth
estimator](https://shaka-player-demo.appspot.com/docs/api/shakaExtern.AbrManager.html),
which enables it to choose different resolutions and bitrates
accordingly, but Shaka can also use a plugin instead.

### How do DASH players get audio and video?

Take a look at the Chrome DevTools Network panel to see what's going on.

Note that you need to select **XHR** or **All**, not **Media**:

![](insert_image_url_here)

You'll see that Shaka has retrieved a number of files:

-   The manifest, dash.mpd.
-   Multiple .mp4 audio and .webm video segments.
-   Several WebVTT subtitle files.

Let's take a closer look:

![](insert_image_url_here)

From this you can see that different resolutions and bitrates have been
retrieved as Shaka adjusts to changing bandwidth. You can also check the
Headers for each request:

![](insert_image_url_here)

Note the Range header (remember that from the previous step?) and how
the Request URL relates to the URL from the manifest.

### Subtitles, captions and descriptions

It's possible to add text tracks to HTML5 video either declaratively by
adding a `<track>` element pointing to a WebVTT file, or via JavaScript
using [TextTrack
API](http://www.html5rocks.com/en/tutorials/track/basics/#toc-cues-js) —
which is what Shaka does.

You can turn on subtitles by clicking on the CC button near the bottom
right of the player:

![](insert_image_url_here)

(This shows a still from the open source film Sintel, © copyright
Blender Foundation | [sintel.org](http://www.sintel.org).)

From the DevTools console, you can set the subtitle language:

> player.configure({preferredTextLanguage: 'fr'});

From the DevTools, also take a look at the WebVTT files and the text
track options in dash.mpd.

If a video has audio tracks for different languages, you can set the
language from the player.

For example:

`player.configure({preferredAudioLanguage: 'fr'});`

The `player.getConfiguration()` and `player.getStats()` methods provide
more information about video playback and the player environment:

![](insert_image_url_here)

### Learn more

-   [Shaka Player repo, tutorials and
    documentation](https://github.com/google/shaka-player)
-   [High performance video for the
    web](https://www.youtube.com/watch?v=Fm3Bagcf9Oo): video about DASH
    and Shaka Player
-   [Building a simple MPEG-DASH streaming
    player](https://msdn.microsoft.com/en-us/library/dn551368(v=vs.85).aspx):
    detailed article explaining how to build your own DASH player
-   [Sintel](https://durian.blender.org/): more about the movie used for
    this codelab

</div>

<div class="section">

## Congratulations!

Duration: 2:00

You built a multi-platform, adaptive video player that can display
subtitles.

![](insert_image_url_here)

### What you've covered

-   Techniques to make the most of the video element.
-   How to build a simple adaptive streaming video player.
-   How to add captions, subtitles and synchronised metadata.
-   An introduction to Dynamic Adaptive Streaming over HTTP (DASH).
-   Media delivery testing, across devices and different bandwidths.

### Next Steps

-   Try out the [Shaka Player
    demo](http://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html):
    a fully featured app including multiple DRM and encoding options
-   Learn more about Shaka's [codebase and the API
    architecture](https://github.com/google/shaka-player)
-   Get to grips with APIs for DRM: [EME
    WTF?](http://www.html5rocks.com/en/tutorials/eme/basics/)

### Learn More

-   [A Digital Media Primer for
    Geeks](https://xiph.org/video/vid1.shtml): a great quirky
    introduction to the science behind digital audio and video

</div>
