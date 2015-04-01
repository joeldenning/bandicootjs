coot.Location({
  location: 'To-do list',
  this: {
    dom: {
      todoList: 'list<thingToDo>',
      newItemUserInput: 'element<input>',
    },
    buildingBlocks: {
      thingToDo: 'thingToDo'
    }
  },
  types: {
    thingToDo: {
      checkbox: 'element<input>',
      label: 'element<label>'
    }
  }
});

coot.Event({
  location: 'To-do list',
  event: 'create new item'
})

coot.Scenario({
	location: 'To-do list',
	event: 'create new item',
  scenario: 'add new row to bulleted list',
	condition: function() {
    return this.dom.newItemUserInput.value.length > 0;
  },
	outcome: function() {
		var newItem = this.buildingBlocks.thingToDo.cloneDeep();
		delete newItem.checkbox.checked;
		newItem.checkbox.value = this.dom.newItemUserInput.value;
		newItem.label.innerHTML = this.dom.newItemUserInput.value;
		this.dom.todoList.push(newItem);
	}
});

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'warn the user that the item will not be added to the list',
  condition: function() {
    this.dom.newItemUserInput.value.length === 0
  },
  outcome: function() {
    alert('I am sorry but you can\'t add an item full of whitespace characters');
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'item checked',
  scenario: 'strikeout the corresponding label',
  condition: function() {
    return true;
  },
  outcome: function() {

  }
})
