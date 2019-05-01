# frozen_string_literal: true

# Meet Model
class Meet
  include Mongoid::Document

  # validation
  validates :group_id, uniqueness: { scope: %I[user_id role_id] }

  # association
  belongs_to :group
  belongs_to :user
  belongs_to :role
end
