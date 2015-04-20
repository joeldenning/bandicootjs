coot.Scenario({
  location: 'To-do list',
  event: 'clear all',
  scenario: 'remove all items from list',
  condition: function() {
    return this.dom.todoList.length > 0;
  },
  outcome: function() {
    this.dom.todoList = [];
  }
});