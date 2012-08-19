var Invitations = Ember.Application.create({
  rootElement: '#invitations-app',
  ready: function() {
    if ( window.invitations ) {
      this.importObjects(window.invitations, Invitations.Invitation, Invitations.InvitationsController);
    }
  },

  importObjects: function(collection, modelClass, controller) {
    for ( var i = 0; i < collection.length; i += 1 ) {
      var modelAttributes = collection[i];
      var model = modelClass.create();
      for ( var key in modelAttributes ) {
        model.set(key, modelAttributes[key]);
      }
      controller.addObject(model);
    }
  }
});

/* Models */

Invitations.Invitation = Ember.Object.extend({
  id: null,
  name: null,
  max_attendees: null,
  num_attendees: null,
  attending: function() {
    if ( this.get('num_attendees') > 0 ) {
      return 'Yes';
    } else {
      return 'No';
    }
  }.property('num_attendees').cacheable(),
  filtered: null
});

/* Controllers */

Invitations.InvitationsController = Ember.ArrayProxy.create({
  content: [],

  respondedFilter: '',
  respondedFilterOptions: [
    { label: 'Filter by responded...',  value: ''    },
    { label: 'Show only responded',     value: 'Yes' },
    { label: 'Show only not responded', value: 'No'  }
  ],

  attendingFilter: '',
  attendingFilterOptions: [
    { label: 'Filter by attending...',  value: ''    },
    { label: 'Show only attending',     value: 'Yes' },
    { label: 'Show only not attending', value: 'No'  }
  ],

  filteredContent: function() {
    var content = this.get('content');

    var respondedFilter = this.get('respondedFilter').value;
    if ( respondedFilter && respondedFilter.length > 0 ) {
      content = content.filterProperty('responded', respondedFilter);
    }

    var attendingFilter = this.get('attendingFilter').value;
    if ( attendingFilter && attendingFilter.length > 0) {
      content = content.filterProperty('attending', attendingFilter);
    }

    return content;
  }.property('content', 'respondedFilter', 'attendingFilter').cacheable(),

  filteredContentEmpty: function() {
    return this.get('filteredContent').get('length') === 0;
  }.property('filteredContent').cacheable(),

  numResponded: function() {
    return this.get('filteredContent').filterProperty('responded', 'Yes').length;
  }.property('filteredContent').cacheable(),

  percentResponded: function() {
    // <%= Invitation.count == 0 ? '0' : (@num_responded / Invitation.count.to_f * 100.0).round(0) %>
    if ( this.get('filteredContent').get('length') === 0 ) {
      return 0;
    } else {
      return Math.round( this.get('numResponded') / this.get('filteredContent').get('length') * 100 );
    }
  }.property('filteredContent.length', 'numResponded').cacheable(),

  numAttendees: function() {
    var result = 0;

    var objects = this.get('filteredContent');
    for ( var i = 0; i < objects.length; i += 1 ) {
      result += objects[i].get('num_attendees');
    }

    return result;
  }.property('filteredContent.@each.num_attendees').cacheable(),

  totalGuestsAllowed: function() {
    var result = 0;

    var objects = this.get('filteredContent');
    for ( var i = 0; i < objects.length; i += 1 ) {
      result += objects[i].get('max_attendees');
    }

    return result;
  }.property('filteredContent.@each.max_attendees').cacheable(),
});

