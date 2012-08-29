class Invitation < ActiveRecord::Base
  belongs_to :event
  has_many :attendees, :dependent => :destroy

  accepts_nested_attributes_for :attendees, :allow_destroy => true

  validates_presence_of [:name, :max_attendees]
  validate :number_of_attendees

  attr_accessible :id, :name, :responded, :attendees_attributes, :max_attendees, :event_id, :attending

  def number_of_attendees
    Rails.logger.info "attendees.reject(&:marked_for_destruction?).size => #{attendees.reject(&:marked_for_destruction?).size}"
    unless (attendees.reject(&:marked_for_destruction?).size) <= max_attendees
      errors.add(:attendees, "is limited to #{max_attendees} attendees.")
    end
  end

  def event_title
    event.title
  end
end
