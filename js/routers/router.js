import Backbone from 'backbone';
import Common from '../common';
import Todos from '../collections/todos';

var TodoRouter = Backbone.Router.extend({
  routes: {
	'*filter': 'setFilter'
  },

  setFilter: function (param) {
	// Set the current filter to be used
	Common.TodoFilter = param || '';

	// Trigger a collection filter event, causing hiding/unhiding
	// of Todo view items
	Todos.trigger('filter');
  }
});

export default TodoRouter;
