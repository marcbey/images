var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    glob = require("glob"),
    probe = require('node-ffprobe'),
    moment = require("moment");

(function() {
  var sourceDir = '/Users/marc/github/photo/photos/videos/',
      targetDir = '/Users/marc/github/photo/target/videos/',
      globPattern = '**/*.@(mp4|MP4)';

  glob(sourceDir + globPattern, function(err, sourceFiles){
    sourceFiles.forEach(extractData);
  });

  function extractData(sourceFile) {
    probe(sourceFile, prepareTargetFile);

    function prepareTargetFile(error, data) {
      if(error) throw error;

      var creationTime = data.metadata.creation_time;
      var basename = path.basename(sourceFile);
      var targetFile = path.join(targetPath(creationTime), basename);

      makeDirectories(sourceFile, targetFile);
    }

    function targetPath(dateTimeOriginal) {
      var targetDirPart = moment(dateTimeOriginal, 'YYYY[:-]MM[:-]DD HH:mm:SS').format('YYYY/MM');
      return path.join(targetDir, targetDirPart);
    }

    function makeDirectories(sourceFile, targetFile) {
      mkdirp(path.dirname(targetFile), function(error){
        if(error) throw error;

        renameFile(sourceFile, targetFile);
      });
    }

    function renameFile(sourceFile, targetFile) {
      fs.rename(sourceFile, targetFile, function(error) {
        if(error) throw error;
      });
    }
  }

})();

