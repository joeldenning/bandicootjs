module.exports.build = function() {
  // URL.createObjectURL
  var URL = window.URL || window.webkitURL;

  return {
    workerFromString: function(string) {
      var blob;
      try {
          blob = new Blob([string], {type: 'application/javascript'});
      } catch (e) { // Backwards-compatibility
          window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
          blob = new BlobBuilder();
          blob.append(string);
          blob = blob.getBlob();
      }
      return new Worker(URL.createObjectURL(blob));
    }
  };
}