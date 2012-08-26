class AddAttendingNeReceptionToInvitation < ActiveRecord::Migration
  def change
    add_column :invitations, :attending_ne_reception, :boolean
  end
end
