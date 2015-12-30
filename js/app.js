App = Ember.Application.create();

App.Router.map(function() {
	this.resource('artists', function() {
		this.route('songs', { path: ':slug' } )
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});
