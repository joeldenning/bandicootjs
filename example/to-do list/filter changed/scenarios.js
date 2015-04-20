coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select all items',
  condition: function() {
    return this.event.source.value === 'all';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      delete this.dom.todoList[i].item.style.display;
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select completed items',
  condition: function() {
    return this.event.source.value === 'completed';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      var item = this.dom.todoList[i].item;
      if (item.checkbox.checked) {
        delete item.style.display;
      } else {
        item.style.display = 'none';
      }
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select remaining items',
  condition: function() {
    return this.event.source.value === 'remaining';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      var item = this.dom.todoList[i].item;
      if (item.checkbox.checked) {
        item.style.display = 'none';
      } else {
        delete item.style.display;
      }
    }
  }
});