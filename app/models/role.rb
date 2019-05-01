# frozen_string_literal: true

# Role Model
class Role
  include Mongoid::Document
  field :name, type: String

  # validation
  validates :name, presence: true, uniqueness: true
end
