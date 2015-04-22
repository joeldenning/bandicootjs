coot.Event({
  location: 'To-do list',
  event: 'create new item',
  owner: 'joel',
  condition: function() {
    if (this.event.keyboard) {
      return coot.framework.keycode(this.event.keyboard.keyCode) === 'enter'
    } else {
      return true;
    }
  }
});