class Attendee < ActiveRecord::Base
  belongs_to :invitation
  belongs_to :food_order

  validates_presence_of [:name, :invitation, :food_order]
end
