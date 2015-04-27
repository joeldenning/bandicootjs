coot.Event({
  location: 'To-do list',
  event: 'toggle item checked',
  owner: 'joel',
  inject: {
    event: {
      source: 'element<input>'
    } 
  }
});