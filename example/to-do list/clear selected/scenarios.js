coot.Scenario({
  location: 'To-do list',
  event: 'clear selected',
  scenario: 'remove checked items from to do list',
  condition: function() {
    return true;
  },
  outcome: function() {
    this.dom.todoList = this.dom.todoList.filter(function(thingToDo) {
      return !thingToDo.item.checkbox.checked;
    });
  }
});