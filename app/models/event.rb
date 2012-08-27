class Event < ActiveRecord::Base
  has_many :invitations

  accepts_nested_attributes_for :invitations

  validates_presence_of :name

  attr_accessible :name
end