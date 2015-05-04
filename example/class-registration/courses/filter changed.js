coot.Event({
  location: 'courses',
  event: 'filter changed',
  owner: 'joel'
});

coot.Scenario({
  location: 'courses',
  event: 'filter changed',
  scenario: 'Show popular courses when there is no filter',
  inject: {
    services: ['Courses']
  },
  condition: function() {
    return this.dom.search.value.trim().length === 0;
  },
  outcome: function() {
    //clear out all visible courses (we only show the popular ones)
    this.dom.visibleCourses = [];

    var popularCourses = this.services.Courses.getPopularCourses();
    for (var i=0; i<popularCourses.length; i++) {
      var popularCourse = popularCourses[i];
      var course = this.buildingBlocks[0].cloneDeep();
      course.courseId.text = popularCourse.courseId;
      course.courseName.text = popularCourse.courseName;
      course.department.text = popularCourse.department;
      course.credits.text = popularCourse.credits;
      
      this.dom.visibleCourses.push(course);
    }
  }
});

coot.Scenario({
  location: 'courses',
  event: 'filter changed',
  scenario: 'Search all fields for query string',
  inject: {
    services: ['Courses']
  },
  condition: function() {
    return this.dom.search.value.trim().length > 0;
  },
  outcome: function() {
    this.dom.visibleCourses = [];

    var matchingCourses = this.services.Courses.searchAllFields(this.dom.search.value);

    for (var i=0; i<matchingCourses.length; i++) {
      var matchingCourse = matchingCourses[i];
      var course = this.buildingBlocks[0].cloneDeep();
      course.courseId.text = matchingCourse.courseId;
      course.courseName.text = matchingCourse.courseName;
      course.department.text = matchingCourse.department;
      course.credits.text = matchingCourse.credits;
      
      this.dom.visibleCourses.push(course);
    }
  }
});