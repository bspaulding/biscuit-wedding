class AddEventIdToInvitation < ActiveRecord::Migration
  def change
    add_column :invitations, :event_id, :integer
  end
end
