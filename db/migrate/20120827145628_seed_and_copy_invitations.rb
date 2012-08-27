class SeedAndCopyInvitations < ActiveRecord::Migration
  def up
    wedding   = Event.create!(:name => 'Wedding')
    reception = Event.create!(:name => 'New England Reception')

    Invitation.update_all("event_id = #{wedding.id}")
    Invitation.find_in_batches do |group|
      group.each do |invitation|
        attributes = invitation.attributes
        attributes.delete("updated_at")
        attributes.delete("created_at")
        attributes.delete("id")

        new_invitation = Invitation.new(attributes)
        new_invitation.event_id = reception.id
        new_invitation.save!
      end
    end
  end

  def down
    reception = Event.find_by_name('New England Reception')
    reception.invitations.destroy_all
    Invitation.update_all("event_id = null")
    Event.destroy_all
  end
end
