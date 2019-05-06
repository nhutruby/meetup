# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::GroupsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/groups").to route_to("api/v1/groups#index", format: :json)
    end

    it "routes to #show" do
      expect(:get => "/groups/1").to route_to("api/v1/groups#show", :id => "1", format: :json)
    end


    it "routes to #create" do
      expect(:post => "/groups").to route_to("api/v1/groups#create", format: :json)
    end

    it "routes to #update via PUT" do
      expect(:put => "/groups/1").to route_to("api/v1/groups#update", :id => "1", format: :json)
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/groups/1").to route_to("api/v1/groups#update", :id => "1", format: :json)
    end

    it "routes to #destroy" do
      expect(:delete => "/groups/1").to route_to("api/v1/groups#destroy", :id => "1", format: :json)
    end
    it "routes to #import" do
      expect(:post => "/groups/import").to route_to("api/v1/groups#import", format: :json)
    end
    it "routes to #remove" do
      expect(:post => "/groups/remove").to route_to("api/v1/groups#remove", format: :json)
    end
  end
end
