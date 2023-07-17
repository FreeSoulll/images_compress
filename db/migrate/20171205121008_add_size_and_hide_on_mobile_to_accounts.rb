class AddSizeAndHideOnMobileToAccounts < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :size, :integer, null: false, default: 20
    add_column :accounts, :hide_on_mobile, :boolean, null: false, default: true
  end
end
