# frozen_string_literal: true

# Meet Model
class Meet
  include Mongoid::Document

  # association
  belongs_to :group
  belongs_to :user
  belongs_to :role
end
