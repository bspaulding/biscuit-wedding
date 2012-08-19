class CreateProperties < ActiveRecord::Migration
  def up
    create_table :properties do |t|
      t.string :name
      t.string :key
      t.string :value
      t.text :allowed_values
    end
  end

  def down
    drop_table :properties
  end
end
