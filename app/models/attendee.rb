class Attendee < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :food_order

  validates_presence_of [:name, :invitation]
  validates_presence_of :food_order, :if => lambda { Property.check('menu-items-enabled', 'true') }

  attr_accessible :name, :food_order_id
end
