coot.Service({
  location: 'courses',
  service: 'CoursesService',
  owner: 'courses team',
  inject: {
    db: 'loki'
  },
  constructor: function() {
    this.collection = this.db.addCollection('courses');
  },
  getPopularCourses: function() {
    return this.collection.find({ popularity: { '$gt': 75 } });
  }
});