class FoodOrder < ActiveRecord::Base
  has_many :attendees
end
