# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  before { @user = build(:user) }
  subject { @user }
  it { should respond_to(:first_name) }
  it { should respond_to(:last_name) }
  it { should be_valid }
  it { should validate_presence_of(:first_name) }
  it { should validate_presence_of(:last_name) }
end
