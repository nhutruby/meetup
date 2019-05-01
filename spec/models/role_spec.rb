# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Role, type: :model do
  before { @role = build(:role) }
  subject { @role }
  it { should respond_to(:name) }
  it { should be_valid }
  it { should validate_presence_of(:name) }
end
