class Bill < ApplicationRecord
  belongs_to :account, inverse_of: :bills
end
