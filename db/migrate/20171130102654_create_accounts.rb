class CreateAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :accounts do |t|
      t.integer :insales_id, null: false
      t.string :password, null: false
      t.string :insales_domain, null: false
      t.integer :js_tag_id
    end

    add_index :accounts, :insales_id
  end
end
