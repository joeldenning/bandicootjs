coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'add new row to bulleted list',
  condition: function() {
    return this.dom.newItemUserInput.value.trim().length > 0;
  },
  outcome: function() {
    var newThingToDo = this.buildingBlocks.thingToDo.cloneDeep();
    delete newThingToDo.item.checkbox.checked;
    newThingToDo.item.checkbox.value = this.dom.newItemUserInput.value;
    newThingToDo.item.label.text = this.dom.newItemUserInput.value;
    this.dom.todoList.push(newThingToDo);
    this.dom.newItemUserInput.value = '';
    // coot.Event('To-do list/filter changed');
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'warn the user that the item will not be added to the list',
  condition: function() {
    return this.dom.newItemUserInput.value.length === 0;
  },
  outcome: function() {
    alert('I am sorry but you can\'t add an item full of whitespace characters');
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'toggle item checked',
  scenario: 'strike out the corresponding item',
  condition: function() {
    return this.event.source.checkbox.checked;
  },
  outcome: function() {
    this.event.source.class.push('completed-item');
  }
});