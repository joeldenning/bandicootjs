module.exports = {
  tagName: 'INPUT',
  defaultAttributeValues: {
    name: '',
    value: function(el) {
      return el.value;
    },
    type: 'text'
  }
};