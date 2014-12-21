var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    glob = require("glob"),
    probe = require('node-ffprobe'),
    moment = require("moment"),
    Q = require("q"),
    async = require("async");

var sourceDir = '/Users/marc/github/photo/photos/videos/',
    targetDir = '/Users/marc/github/photo/target/videos/',
    globPattern = '**/*.@(mp4|MP4)';

sourceFiles().then(function(files) { 
  files.forEach(function(file) {
    extractData(file).then(ensureTargetDirectories).then(moveFile);
  });
});

function sourceFiles() {
  var deferred = Q.defer();
  glob(sourceDir + globPattern, function(error, sourceFiles) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(sourceFiles);
    }
  });
  return deferred.promise;
}

function extractData(file) {
  var deferred = Q.defer();

  probe(file, function(error, data) {
    if(error) {
      deferred.reject(new Error(error));
    } else {
      data.targetbasepath = 
        path.join(targetDir, 
                  moment(data.metadata.creation_time, 
                         'YYYY[:-]MM[:-]DD HH:mm:SS').format('YYYY/MM'));
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

function ensureTargetDirectories(data) {
  var deferred = Q.defer();

   mkdirp(data.targetbasepath, function(error) {
     if (error) {
      deferred.reject(new Error(error));
     } else {
      deferred.resolve(data);
     }
  });
  return deferred.promise;
}

function moveFile(data) {
  var deferred = Q.defer();

  var sourceFile = data.file;
  var targetFile = path.join(data.targetbasepath, data.filename);

  fs.rename(sourceFile, targetFile, function(error) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(data);
    }
  });
}
