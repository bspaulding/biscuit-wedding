var Properties = Ember.Application.create({
  rootElement: '#properties-app',

  ready: function() {
    this._super();

    if ( window.properties ) {
      this.importObjects(window.properties, Properties.property, Properties.propertiesController);
    }

    Properties.PropertiesView.create().appendTo(Properties.get('rootElement'));
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

Properties.propertiesController = Ember.ArrayProxy.create({
  content: []
});

Properties.property = Ember.Object.extend({
  id: null,
  key: null,
  name: null,
  value: null,
  allowed_values: null,

  valueChanged: function() {
    $.ajax({
      url: "/properties/" + this.get('id') + ".json",
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify({
        property: {
          id: this.get('id'),
          value: this.get('value')
        }
      }),
      success: function(data) {
        console.log('Saved!');
      },
      error: function() {
        alert('There was an error processing your data. Please try again.');
      }
    });
  }.observes('value')
});

Properties.PropertiesView = Ember.View.extend({
  templateName: 'properties-view'
});