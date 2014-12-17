var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    glob = require("glob"),
    ExifImage = require("exif").ExifImage,
    moment = require("moment");

(function() {
  var sourceDir = '/Users/marc/github/photo/photos/',
      targetDir = '/Users/marc/github/photo/target/photos/',
      globPattern = '**/*.@(JPG|jpg|jpeg|JPEG)',
      failingFiles = [],
      movedFiles = [];

  var targetPath = function (dateTimeOriginal) {
    var targetDirSlice = moment(dateTimeOriginal, 'YYYY:MM:DD HH:mm:SS').format('YYYY/MM');
    return path.join(targetDir, targetDirSlice);
  };

  var extractData = function (filePath) {
    new ExifImage({image: filePath}, function(error, data) {
      if (error) {
        throw error;
      } else {
        var dateTimeOriginal = targetPath(data.exif.DateTimeOriginal);
        var targetFilePath = path.join(dateTimeOriginal, path.basename(filePath));
        moveFile(filePath, targetFilePath);
      }
    });
  };

  var moveFile = function(source, target) {
    mkdirp(path.dirname(source), function(error){
      if(error){
        throw error;
      } else {
        fs.rename(source, target, function(error) {
          if(error) {
            throw error;
          }
        });
      }
    });
  };

  glob(sourceDir + globPattern, function(err, sourceFiles) {
    sourceFiles.forEach(extractData);
  });
})();


