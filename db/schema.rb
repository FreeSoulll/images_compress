# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171205121008) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.integer "insales_id", null: false
    t.string "password", null: false
    t.string "insales_domain", null: false
    t.integer "js_tag_id"
    t.integer "speed", default: 1, null: false
    t.integer "snowflakes_count", default: 20, null: false
    t.string "color", default: "#63cdff", null: false
    t.integer "size", default: 20, null: false
    t.boolean "hide_on_mobile", default: true, null: false
    t.index ["insales_id"], name: "index_accounts_on_insales_id"
  end

  create_table "bills", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.integer "application_charge_id", null: false
    t.integer "year"
    t.boolean "paid"
    t.index ["account_id"], name: "index_bills_on_account_id"
    t.index ["application_charge_id"], name: "index_bills_on_application_charge_id"
  end

  add_foreign_key "bills", "accounts"
end
