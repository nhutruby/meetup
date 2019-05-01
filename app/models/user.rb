# frozen_string_literal: true

# User Model
class User
  include Mongoid::Document
  field :first_name, type: String
  field :last_name, type: String

  # validation
  validates :first_name, presence: true, uniqueness: { scope: :last_name }
  validates :last_name, presence: true

  # association
  has_many :meets
end
