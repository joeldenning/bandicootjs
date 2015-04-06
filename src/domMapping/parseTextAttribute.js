module.exports = function(element) {
  var text = '';
  for (var i=0; i<element.childNodes.length; i++) {
    if (element.childNodes[i].nodeType === 3) {
      text += element.childNodes[i].textContent;    
    }
  }
  return text;
}