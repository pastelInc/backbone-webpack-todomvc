import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Common from '../common';
import todosTemplate from '../templates/todos.html';

var TodoView = Backbone.View.extend({
  //... is a list tag.
  tagName:  'li',

  // Cache the template function for a single item.
  template: _.template(todosTemplate),

  // The DOM events specific to an item.
  events: {
	'click .toggle': 'toggleCompleted',
	'dblclick label': 'edit',
	'click .destroy': 'clear',
	'keypress .edit': 'updateOnEnter',
	'keydown .edit': 'revertOnEscape',
	'blur .edit': 'close'
  },

  // The TodoView listens for changes to its model, re-rendering. Since
  // there's a one-to-one correspondence between a **Todo** and a
  // **TodoView** in this app, we set a direct reference on the model for
  // convenience.
  initialize: function () {
	this.listenTo(this.model, 'change', this.render);
	this.listenTo(this.model, 'destroy', this.remove);
	this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // Re-render the titles of the todo item.
  render: function () {
	// Backbone LocalStorage is adding `id` attribute instantly after
	// creating a model.  This causes our TodoView to render twice. Once
	// after creating a model and once on `id` change.  We want to
	// filter out the second redundant render, which is caused by this
	// `id` change.  It's known Backbone LocalStorage bug, therefore
	// we've to create a workaround.
	// https://github.com/tastejs/todomvc/issues/469
	if (this.model.changed.id !== undefined) {
	  return;
	}

	this.$el.html(this.template(this.model.toJSON()));
	this.$el.toggleClass('completed', this.model.get('completed'));
	this.toggleVisible();
	this.$input = this.$('.edit');
	return this;
  },

  toggleVisible: function () {
	this.$el.toggleClass('hidden', this.isHidden());
  },

  isHidden: function () {
	return this.model.get('completed') ?
	  Common.TodoFilter === 'active' :
	  Common.TodoFilter === 'completed';
  },

  // Toggle the `"completed"` state of the model.
  toggleCompleted: function () {
	this.model.toggle();
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function () {
	this.$el.addClass('editing');
	this.$input.focus();
  },

  // Close the `"editing"` mode, saving changes to the todo.
  close: function () {
	var value = this.$input.val();
	var trimmedValue = value.trim();

	// We don't want to handle blur events from an item that is no
	// longer being edited. Relying on the CSS class here has the
	// benefit of us not having to maintain state in the DOM and the
	// JavaScript logic.
	if (!this.$el.hasClass('editing')) {
	  return;
	}

	if (trimmedValue) {
	  this.model.save({ title: trimmedValue });
	} else {
	  this.clear();
	}

	this.$el.removeClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function (e) {
	if (e.which === Common.ENTER_KEY) {
	  this.close();
	}
  },

  // If you're pressing `escape` we revert your change by simply leaving
  // the `editing` state.
  revertOnEscape: function (e) {
	if (e.which === Common.ESC_KEY) {
	  this.$el.removeClass('editing');
	  // Also reset the hidden input back to the original value.
	  this.$input.val(this.model.get('title'));
	}
  },

  // Remove the item, destroy the model from *localStorage* and delete its view.
  clear: function () {
	this.model.destroy();
  }
});

export default TodoView;
