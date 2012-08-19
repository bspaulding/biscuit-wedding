class CreateAttendees < ActiveRecord::Migration
  def change
    create_table :attendees do |t|
      t.string :name
      t.integer :invitation_id
      t.integer :food_order_id

      t.timestamps
    end
  end
end
