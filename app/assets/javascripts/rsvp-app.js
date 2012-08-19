// RSVP App
Handlebars.registerHelper('equals', function(a,b) { return a === b; });

var RSVP = Ember.Application.create({
  rootElement: "#rsvp-app",
  ready: function() {
    this._super();

    if ( $.browser.msie ) {
      alert("Whoops!\nWe've detected some problems with using Internet Explorer to RSVP.\nPlease use Firefox, Safari or Chrome to ensure RSVP gets to us successfully.\nThanks!")
      document.location = '/';
    }

    if ( window.invitations ) {
      this.importObjects(window.invitations, RSVP.Invitation, RSVP.InvitationsController);
    }

    if ( window.food_orders ) {
      this.importObjects(window.food_orders, RSVP.FoodOrder, RSVP.FoodOrdersController);
    }

    if ( window.invitations ) {
      for ( var i = 0; i < window.invitations.length; i += 1 ) {
        this.importObjects(window.invitations[i].attendees, RSVP.Attendee, RSVP.InvitationsController.objectAt(i).get('attendees'));
      }
    }

    var lookupInvitationView = RSVP.LookupInvitationView.create();
    lookupInvitationView.appendTo(this.get('rootElement'));
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

/* Controllers */

RSVP.InvitationsController = Ember.ArrayProxy.create({
  content: []
});

RSVP.FoodOrdersController = Ember.ArrayProxy.create({
  content: []
});

/* Models */

RSVP.FoodOrder = Ember.Object.extend({
  id: null,
  name: null,
  prompt: function() {
    return 'will have the ' + this.get('name').toLowerCase() + '.';
  }.property('name').cacheable()
});

RSVP.Invitation = Ember.Object.extend({
  id: null,
  name: null,
  _attendees: null,
  attendees: function() {
    if ( !this.get('_attendees') ) {
      this.set('_attendees', Ember.ArrayProxy.create({ content: [] }));
    }

    return this.get('_attendees');
  }.property(),

  isValid: function() {
    return _.all(this.get('attendees').get('content'), function(a) { return a.get('isValid'); });
  }.property('name', 'attendees.@each.isValid').cacheable(),
  isInvalid: function() {
    return !this.get('isValid');
  }.property('isValid').cacheable(),

  save: function(callback) {
    $.ajax({
      url: "/invitations/" + this.get('id') + ".json",
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify({
        invitation: this.get('asJSON')
      }),
      success: function(data) {
        if ( data.errors ) {
          // RSVP.showErrors(data);
          console.log(data.errors);
        } else {
          callback(data);
        }
      },
      error: function() {
        alert('There was an error processing your data. Please try again.');
      }
    });
  },

  asJSON: function() {
    return {
                        id: this.get('id'),
                      name: this.get('name'),
                 responded: this.get('responded'),
      attendees_attributes: _.map(this.get('attendees').get('content'), function(a) { return a.get('asJSON'); })
    };
  }.property('name', 'attendees.@each.name', 'attendees.@each.food_order_id')
});

RSVP.Attendee = Ember.Object.extend({
  name: null,
  food_order: null,
  food_order_id: function(key, value) {
    if ( arguments.length > 1 ) { // setter
      var food_order = RSVP.FoodOrdersController.filterProperty('id', value)[0];
      this.set('food_order', food_order);
    }

    var food_order = this.get('food_order');
    if ( food_order ) {
      return food_order.get('id');
    }

    return null;
  }.property('food_order').cacheable(),

  isValid: function() {
    return !!this.get('isDestroyed') || (this.get('name') && this.get('name').length > 0 && this.get('food_order_id') !== null);
  }.property('food_order_id'),

  isDestroyed: null,

  asJSON: function() {
    return {
      id: this.get('id'),
      name: this.get('name'),
      food_order_id: this.get('food_order_id'),
      '_destroy': !!this.get('isDestroyed')
    };
  }.property('')
});

/* Views */

RSVP.LookupInvitationView = Ember.View.extend({
  templateName: 'lookup-invitation',
  loadInvitation: function() {
    var nameInput = this.$('input[type="text"]')[0];
    var name = nameInput.value;
    var invitation = _.find(RSVP.InvitationsController.get('content'), function(i) {
      return i.get('name') === name;
    });
    if ( invitation ) {
      this.set('error', false);
      invitationView = RSVP.InvitationView.create();
      invitationView.set('invitation', invitation);
      invitationView.set('numAttendees', invitation.get('attendees').get('length'));
      this.remove();
      invitationView.appendTo(RSVP.get('rootElement'));
    } else {
      console.log("couldn't find invitation with that name");
      this.set('error', true);
      nameInput.setAttribute('class', 'shake');
      setTimeout(function() {
        $(nameInput).removeClass('shake');
      }, 1000);
    }
  },

  errors: null,

  willInsertElement: function() {
    var self = this;
    this.$('form').submit(function(event) {
      event.stopImmediatePropagation();
      self.loadInvitation();
      return false;
    });
  }
});

RSVP.InvitationView = Ember.View.extend({
  templateName: 'setup-attendees',
  invitation: null,
  classNames: ['invitation-view'],
  maxAttendees: function() {
    var invitation = this.get('invitation');
    if ( invitation ) {
      return invitation.max_attendees;
    }

    return 0;
  }.property('invitation').cacheable(),

  numAttendees: null,
  numAttendeesChanged: function() {
    var numAttendees = this.get('numAttendees');
    if ( 'undefined' === typeof numAttendees || numAttendees == null ) { return; }

    var invitation = this.get('invitation');
    var attendees = invitation.get('attendees');
    var difference = numAttendees - attendees.filter(function(item, index, self) {
      return !(!!item.get('isDestroyed'));
    }).length;

    if ( difference > 0 ) {
      // Add new attendees
      console.log('Add new attendees');
      for ( var i = 0; i < difference; i += 1 ) {
        var attendee = RSVP.Attendee.create();
        attendees.addObject(attendee);
      }
    } else if ( difference < 0 ) {
      // Truncate list
      for ( var i = 0; i < (difference * -1); i += 1 ) {
        attendees.objectAt(attendees.get('length') - 1).set('isDestroyed', true);
      }
    }
  }.observes('numAttendees'),
  isAttending: function() {
    return this.get('numAttendees') > 0;
  }.property('numAttendees').cacheable(),
  multipleAttendees: function() {
    return this.get('numAttendees') !== 1;
  }.property('numAttendees').cacheable(),

  numAttendeesOptions: function() {
    var options = [];

    for ( var i = 0; i <= this.get('maxAttendees'); i += 1 ) {
      options.push(i);
    }

    return options;
  }.property('maxAttendees').cacheable(),

  updateInvitation: function() {
    var invitation = this.get('invitation');
    invitation.set('responded', true);
    var self = this;
    invitation.save(function() {
      self.updateInvitationSuccess();
    });
  },

  updateInvitationSuccess: function() {
    var thanksView = RSVP.ThanksView.create();
    this.remove();
    thanksView.appendTo(RSVP.get('rootElement'));
  }
});

RSVP.AttendeeView = Ember.View.extend({
  templateName: 'attendee-view',
  classNames: ['attendee-view'],
  classNameBindings: ['isDestroyed'],
  isDestroyed: function() {
    return this.get('content').get('isDestroyed');
  }.property('content.isDestroyed'),
  food_order_id: function(key, value) {
    console.log('food_order_id');
    if ( arguments.length > 1 ) { // setter
      console.log('setting food_order_id to ');
      console.log(value.get('id'));
      this.get('content').set('food_order_id', value);
    }

    return this.get('content').get('food_order_id');
  }.property('content.food_order_id')
});

RSVP.ThanksView = Ember.View.extend({
  templateName: "thanks-view"
});