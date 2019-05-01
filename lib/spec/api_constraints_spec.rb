# frozen_string_literal: true

require 'rails_helper'
require 'constraints/versions'

describe Versions do
  let(:versions_v1) { Versions.new(version: 1) }
  let(:versions_v2) { Versions.new(version: 2, default: true) }
  describe '#matches?' do
    it 'returns true when the version matches the "Accept" header' do
      request = double(headers: { 'Accept' => 'application/meetup.com.v1' })
      expect(versions_v1.matches?(request)).to be true
    end

    it 'returns the default version when the "default" option is specified' do
      request = double
      expect(versions_v2.matches?(request)).to be true
    end
  end
end
