class CreateGuestbookEntries < ActiveRecord::Migration
  def change
    create_table :guestbook_entries do |t|
      t.string :name
      t.text :body

      t.timestamps
    end
  end
end
