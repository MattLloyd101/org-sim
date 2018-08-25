define([], function() {


    var loadShader = function (gl, type, src) {
        shader = gl.createShader(type);

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Unable to compile shader");
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var initShaders = function(gl, fragmentShader, vertexShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

        return shaderProgram;
    }

  var create3DContext = function(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var i = 0; i < names.length; ++i) {
      try {
        context = canvas.getContext(names[i], opt_attribs);
      } catch(e) {}
      if (context) {
        break;
      }
    }
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
    return context;
  };

  
  return function () {

      create3DContext: create3DContext,
      loadShader: loadShader,
      initShaders: initShaders
  };

});