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
    if (!this.dom.showRemaining.checked) {
      newThingToDo.item.style.display = 'none';
    }

    this.dom.todoList.push(newThingToDo);
    this.dom.newItemUserInput.value = '';
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