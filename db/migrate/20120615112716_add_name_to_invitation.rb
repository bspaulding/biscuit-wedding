class AddNameToInvitation < ActiveRecord::Migration
  def change
    add_column :invitations, :name, :string

  end
end
