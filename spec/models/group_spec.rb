# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Group, type: :model do
  before { @group = build(:group) }
  subject { @group }
  it { should respond_to(:name) }
  it { should be_valid }
  it { should validate_presence_of(:name) }
end
