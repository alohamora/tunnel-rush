var obsPos = -30.0, obsRot = 0.0,obflag=0;
var rotation = 0.0;
var pos = [0.0,-6.0,-12.0,-18.0,-24.0,-30.0,-36.0,-42.0,-48.0,-54.0];
var time = 0.0,flag = 1,over=0;
var dist = 0.0,speed = 0.06, flag_jump = 0, jump_speed = 0.0, jump_acc = -0.02, height = 0;
const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const texture = loadTexture(gl, 'a.png');
const texture2 = loadTexture(gl, 'b.jpeg');
main();

//
// Start here
//
function main() {
  
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource2 = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

  // Fragment shader program

  const fsSource2 = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;



  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const vsSource3 = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.0, 0.8, 1.0));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;

const fsSource3 = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource2, fsSource2);
  const shaderProgram2 = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram3 = initShaderProgram(gl, vsSource3, fsSource3);
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram2, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram2, 'uSampler'),
    },
  };
  const programInfo2 = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const programInfo3 = {
    program: shaderProgram3,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram3, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram3, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram3, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram3, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram3, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram3, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram3, 'uSampler'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var Key = {
    _pressed: {},
  
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    C: 67,
    V: 86,
    
    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },
    
    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


  
  const buffers = initBuffers(gl);
  const obsBuffers = initObsBuffers(gl);
  const obsBuffers2 = initObsBuffers2(gl);

  var then = 0;

  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    time += deltaTime;
    dist += deltaTime;
    if(over==0)
      document.getElementById('aa2').innerHTML = Number(dist.toFixed(1));
      if (Key.isDown(Key.LEFT)) {
        rotation += 0.05;
        obsRot += 0.05;
      };
      if (Key.isDown(Key.RIGHT)) {
        rotation -= 0.05;
        obsRot -= 0.05;
      };
      if(Key.isDown(Key.UP)) {
        if(height == 0.0){
          flag_jump = 1;
          jump_speed = 0.35;
        }
      }
      if(dist > 10.0 && over == 0){
        if(flag==1) flag = 0;
        document.getElementById('aa4').innerHTML = "Level = 2";
        
      } 

    if(dist > 20.0 && over == 0){
      speed = 0.08;
      if(flag==0) flag = 1;
      document.getElementById('aa4').innerHTML = "Level = 3";
    }

      // Draw the scene repeatedly
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag_jump==1){
      height += jump_speed;
      jump_speed += jump_acc;
      if(height <= 0.0){
        height = 0.0;
        jump_speed = 0.0;
        flag_jump = 0;
      }
    }
    for(i=0;i<10;i++){
      if(flag==0) 
        drawTunnel(gl, programInfo2, buffers, deltaTime, i);
      else{
        drawTunnel(gl, programInfo3, buffers, deltaTime, i);
      }      
    }
    if(over==0){
      if(obflag==0){
        if(flag==1)
          drawObsPos(gl, programInfo, obsBuffers, deltaTime);
        else
          drawObsPos(gl, programInfo2, obsBuffers, deltaTime);
        if(obsPos > 1.0){
          obsPos = -30.0;
          obflag = 1;
        }
      }
      else{
        if(flag==1)
          drawObsPos2(gl, programInfo, obsBuffers2, deltaTime);
        else
          drawObsPos2(gl, programInfo2, obsBuffers2, deltaTime);
        
        if(obsPos > 1.0){
            obsPos = -30.0;
            obflag = 0;
        }
      }
      if(obflag==0){
        if(obsPos >= 0.0 && obsPos < 0.25){
          if(obsRot > 2*Math.PI){
            while(obsRot > 2*Math.PI) obsRot -= 2*Math.PI;
          }
          if(obsRot < 0.68 && obsRot > -0.68){
            document.getElementById('bb').pause();
            document.getElementById('bb2').play();
            window.alert('Game over');
            document.getElementById('aa').style.visibility = 'visible'

            over=1;
          }
          else if(obsRot < Math.PI + 0.68 && obsRot > Math.PI -0.68){
            document.getElementById('bb').pause();
            document.getElementById('bb2').play();
            window.alert('Game over');
            document.getElementById('aa').style.visibility = 'visible'
            over=1;
          }
        }
      }
      else{
        if(obsPos >= 0.0 && obsPos < 0.25){
          if(obsRot > 2*Math.PI){
            while(obsRot > 2*Math.PI) obsRot -= 2*Math.PI;
          }
          if(obsRot < 0.78 && obsRot > -0.78){
            document.getElementById('bb').pause();
            document.getElementById('bb2').play();
            window.alert('Game over');
            document.getElementById('aa').style.visibility = 'visible'
            over=1;
          }
          else if(obsRot < Math.PI + 0.78 && obsRot > Math.PI -0.78){
            document.getElementById('bb').pause();
            document.getElementById('bb2').play();
            window.alert('Game over');
            document.getElementById('aa').style.visibility = 'visible'
            over=1;
          }
        }
      }
  }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers  
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//


//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
