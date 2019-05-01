# frozen_string_literal: true

# Group Model
class Group
  include Mongoid::Document
  field :name, type: String

  # validation
  validates :name, presence: true, uniqueness: true

  # association
  has_many :meets
end
