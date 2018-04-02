function initBuffers(gl) {

    // Create a buffer for the cube's vertex positions.
  
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Now create an array of positions for the cube.
    var v1 = 360.0/16.0;
    var v2 = -v1;
    var dif = 360.0/8.0;
    var r = 3.0;
    const positions = [];
    for(i=0;i<8;i++){
      x1 = r*Math.cos(v1*Math.PI/180.0);
      y1 = (r*Math.sin(v1*Math.PI/180.0));
      x2 = r*Math.cos(v2*Math.PI/180.0);
      y2 = (r*Math.sin(v2*Math.PI/180.0));  
      v1 += dif;
      v2 += dif;
      positions.push(x1,y1,0.0,x2,y2,0.0,x1,y1,-2.0*r,x2,y2,-2.0*r);
    }
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    // Now set up the colors for the faces. We'll use solid colors
    // for each face.
  
    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
    ];
  
    // Convert the array of colors into a table for all the vertices.
  
    var colors = [];
  
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
  
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
  
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
  
    const indices = [
      0,  1,  2,      1,  2,  3,    // front
      4,  5,  6,      5,  6,  7,    // back
      8,  9,  10,     9,  10, 11,   // top
      12, 13, 14,     13, 14, 15,   // bottom
      16, 17, 18,     17, 18, 19,   // right
      20, 21, 22,     21, 22, 23,   // left
      24, 25, 26,     25, 26, 27,
      28, 29, 30,     29, 30, 31
    ];
  
    // Now send the element array to GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      
        const textureCoordinates = [
          // Front
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Back
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Top
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Bottom
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Right
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Left
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,

          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
        gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      
        const vertexNormals = [
          // Front
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
      
          // Back
          -1.0,  -1.0, 0.0,
          -1.0,  -1.0, 0.0,
          -1.0,  -1.0, 0.0,
          -1.0,  -1.0, 0.0,

      
          // Top
           0.0,  -1.0,  0.0,
           0.0,  -1.0,  0.0,
           0.0,  -1.0,  0.0,
           0.0,  -1.0,  0.0,
      
          // Bottom
          1.0, -1.0,  0.0,
          1.0, -1.0,  0.0,
          1.0, -1.0,  0.0,
          1.0, -1.0,  0.0,

      
          // Right
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,
      
          // Left
          1.0,  1.0,  0.0,
          1.0,  1.0,  0.0,
          1.0,  1.0,  0.0,
          1.0,  1.0,  0.0,

          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,

          -1.0, 1.0, 0.0,
          -1.0, 1.0, 0.0,
          -1.0, 1.0, 0.0,
          -1.0, 1.0, 0.0
        ];
      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                      gl.STATIC_DRAW);


    return {
          position: positionBuffer,
          textureCoord: textureCoordBuffer,
          indices: indexBuffer,
          normal: normalBuffer,
          color: colorBuffer
        };
}
  
  //
  // Draw the scene.
  //
  function drawTunnel(gl, programInfo, buffers, deltaTime, i) {
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    if(over==0)
      pos[i] += (10*deltaTime);
    if(pos[i] >= 6.0){
      ind = i-1;
      if(ind < 0){
        ind += 10;
        pos[i] =  pos[ind] - 6.0 + (10*deltaTime);
      }
      else{
        pos[i] =  pos[ind] - 6.0;      
      }
    }
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [0.0, 1.5-height, pos[i]]);  // amount to translate
    
    temprotation = (i%8)*(360.0/8.0)*Math.PI/180.0;
    if(over==0)
      temprotation += rotation;
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                temprotation,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    var num,stride,type,normalize,offset;
    
    if(flag==0)
    {
      num = 4;
      type = gl.FLOAT;
      normalize = false;
      stride = 0;
      offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          num,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
    }
    else
    {
        num = 2; // every coordinate composed of 2 values
        type = gl.FLOAT; // the data in the buffer is 32 bit float
        normalize = false; // don't normalize
        stride = 0; // how many bytes to get from one set to the next
        offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        num=3;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            num,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal);
    }
  
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms


    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);


    if(flag==1){
      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);
      
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);

        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    }
    

    {
      const vertexCount = 48;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  
    // Update the rotation for the next draw
  
  }