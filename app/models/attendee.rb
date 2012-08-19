class Attendee < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :food_order

  validates_presence_of [:name, :invitation, :food_order]

  attr_accessible :name, :food_order_id
end
