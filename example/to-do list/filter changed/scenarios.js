coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select all items',
  condition: function() {
    return true;
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      var item = this.dom.todoList[i].item;
      var isCompleted = item.checkbox.checked;
      if (isCompleted) {
        if (this.dom.showCompleted.checked) {
          delete item.style.display;
        } else {
          item.style.display = 'none';
        }
      } else {
        //the item remains to be done
        if (this.dom.showRemaining.checked) {
          delete item.style.display;
        } else {
          item.style.display = 'none';
        }
      }
    }
  }
});