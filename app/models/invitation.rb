class Invitation < ActiveRecord::Base
  has_many :attendees

  accepts_nested_attributes_for :attendees, :allow_destroy => true

  validates_presence_of [:name, :max_attendees]
  validate :number_of_attendees

  def number_of_attendees
    Rails.logger.info "attendees.reject(&:marked_for_destruction?).size => #{attendees.reject(&:marked_for_destruction?).size}"
    unless (attendees.reject(&:marked_for_destruction?).size) <= max_attendees
      errors.add(:attendees, "is limited to #{max_attendees} attendees.")
    end
  end
end
