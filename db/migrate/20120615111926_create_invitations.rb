class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :max_attendees
      t.boolean :responded
      t.boolean :attending

      t.timestamps
    end
  end
end
