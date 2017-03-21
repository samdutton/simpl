/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

// Code from https://sites.google.com/site/progyumming/javascript/shortest-webgl
// Courtesy of Karol Guciek

function shaderProgram(gl, vs, fs) {
  var prog = gl.createProgram();
  var addshader = function(type, source) {
    var s = gl.createShader((type === 'vertex') ?
      gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw 'Could not compile ' + type +
        ' shader:\n\n' + gl.getShaderInfoLog(s);
    }
    gl.attachShader(prog, s);
  };
  addshader('vertex', vs);
  addshader('fragment', fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw 'Could not link the shader program!';
  }
  return prog;
}

function attributeSetFloats(gl, prog, attrName, rsize, arr) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr),
    gl.STATIC_DRAW);
  var attr = gl.getAttribLocation(prog, attrName);
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
}

function draw() {
  var gl;
  try {
    var canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw 'x';
    }
  } catch (err) {
    alert('This browser does not support WebGL.');
    throw 'Your web browser does not support WebGL!';
  }
  gl.clearColor(0.3, 0.5, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var prog = shaderProgram(gl,
    'attribute vec3 pos;' +
    'void main() {' +
    ' gl_Position = vec4(pos, 2.0);' +
    '}',
    'void main() {' +
    ' gl_FragColor = vec4(0.7, 0.2, 0.2, 1.0);' +
    '}'
  );
  gl.useProgram(prog);

  attributeSetFloats(gl, prog, 'pos', 3, [-1, 0, 0,
    0, 1, 0,
    0, -1, 0,
    1, 0, 0
  ]);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function init() {
  try {
    draw();
  } catch (e) {
    alert('Error: ' + e);
  }
}
init();
