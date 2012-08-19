class CreateFoodOrders < ActiveRecord::Migration
  def change
    create_table :food_orders do |t|
      t.string :name

      t.timestamps
    end
  end
end
