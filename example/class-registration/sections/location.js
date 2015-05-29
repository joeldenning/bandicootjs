coot.Location({
  location: 'courses',
  owner: 'joel',
  inject: {
    dom: {
      visibleSections: 'table<section>'
    },
    buildingBlocks: 'table<section>'
  },
  types: {
    course: {
      sectionId: 'element<td>',
      professor: 'element<td>',
      schedule: 'element<td>',
      availableSeats: 'element<td>'
    }
  }
});