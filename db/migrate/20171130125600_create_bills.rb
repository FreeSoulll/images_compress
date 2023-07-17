class CreateBills < ActiveRecord::Migration[5.1]
  def change
    create_table :bills do |t|
      t.references :account, foreign_key: true, null: false
      t.integer :application_charge_id, null: false
      t.integer :year
      t.boolean :paid
    end

    add_index :bills, :application_charge_id
  end
end
