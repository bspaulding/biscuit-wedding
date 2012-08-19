class Property < ActiveRecord::Base
  SUPPORTED_PROPERTIES = [
    { :name => "Allow RSVP", :key => 'allow-rsvp', :value => "false", :allowed_values => ["true", "false"] },
    { :name => "Site Launched", :key => 'site-launched', :value => "false", :allowed_values => ["true", "false"] }
  ]

  validates_presence_of [:name, :value, :allowed_values]
  validate :value_in_allowed_values

  serialize :allowed_values, Array

  def self.seed
    SUPPORTED_PROPERTIES.each {|attributes| find_or_create_by_key(attributes) }
  end

  def self.check(key, value)
    property = find_by_key(key)

    property && property.value == value
  end

private

  def value_in_allowed_values
    unless allowed_values.include? value
      errors.add(:value, "is not included in the list.")
    end
  end
end