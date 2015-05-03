coot.Location({
  location: 'courses',
  owner: 'joel',
  inject: {
    dom: {
      visibleCourses: 'table<course>'
    },
    buildingBlocks: 'table<course>'
  },
  types: {
    course: {
      courseId: 'element<td>',
      department: 'element<td>',
      courseName: 'element<td>',
      credits: 'element<td>'
    }
  }
});