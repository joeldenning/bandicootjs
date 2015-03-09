coot.Event({
	where: 'To-do list',
	action: 'create new item'
});

coot.Scenario({
	where: 'To-do list',
	action: 'create new item',
	when: 'domVariables.newItem.getValue().length > 1',
	what: 'add new row to bulleted list',
	how: function(domVariables, domExamples, services) {
		var newItem = domExamples.thingToDo.create()
		newItem.checkbox.uncheck()
		newItem.label.setValue('A new thing to do')
		domVariables.todoList.add(newItem)
	},

	domVariables: {
		todoList: {}
	},
	domExamples: {
		thingToDo: {
			checkbox: 'input',
			label: 'label'
		}
	},
	services: [],
})

coot.Scenario({
	where: 'To-do list',
	action: 'create new item',
	what: 'new item name is blank',
	when: 'domVariables.newItem.getValue().match(/[ \\t\\n]*/)',
	how: function() {
		alert('Hello!');
	}
})
