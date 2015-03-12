coot.Event({
	where: 'To-do list',
	what: 'create new item',
	this: {
		dom: {
			todoList: 'list<thingToDo>',
			newItem: 'element<input>'
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
	},
	services: []
});

coot.Scenario({
	outcome: 'add new row to bulleted list',
	where: 'To-do list',
	what: 'create new item',
	when: 'this.dom.newItem.value.length > 1',
	how: function() {
		var newItem = this.buildingBlocks.thingToDo.create();
		newItem.checkbox.checked = false;
		newItem.label.innerHTML = this.dom.newItem.value;
		this.dom.todoList.insert(newItem);
	}
});

coot.Scenario({
	outcome: 'warn the user that the item will not be added to the list',
	where: 'To-do list',
	what: 'create new item',
	when: 'this.dom.newItem.value.match(/[ \\t\\n]*/)',
	how: function() {
		alert('I am sorry but you can\'t add an item full of whitespace characters');
	}
});
