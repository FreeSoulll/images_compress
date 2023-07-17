class AddSnowPropertiesToAccount < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :speed, :integer, null: false, default: 1
    add_column :accounts, :snowflakes_count, :integer, null: false, default: 20
    add_column :accounts, :color, :string, null: false, default: '#63cdff'
  end
end
