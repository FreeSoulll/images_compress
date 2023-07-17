class Account < ApplicationRecord
  has_many :bills, inverse_of: :account, dependent: :destroy
end
