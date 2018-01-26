const child_process = require('child_process');

module.exports.main = function main (event, context, callback) {
  // on linux the executable is in the task root or __dirname, whichever is defined
  // the task root is the directory with the code package (/code for Spotinst Functions)
  process.env.PATH += ':' + __dirname + '/src/';
  
  // change the permissions for the binary and run the conversion command.
  let command = 'chmod 755 ./src/ffmpeg && ffmpeg -y -i satellite.avi satellite.gif -hide_banner';
  child_process.exec(command, function move_it (error, stdout, stderr) {
    // ffmpeg outputs all logs to stderr. Any exit code other than '0' will go to error.
    if(error){
      callback(null, {
        statusCode: 400,
        body: "error: " + error
      })
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    
    callback(null, {
      statusCode: 200,
      body: stderr
    })
  });
};
