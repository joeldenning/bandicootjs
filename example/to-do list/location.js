coot.Location({
  location: 'To-do list',
  owner: 'Joel',
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
      item: {
        checkbox: 'element<input>',
        label: 'element<span>'
      }
    }
  }
});