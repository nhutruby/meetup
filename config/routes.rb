# frozen_string_literal: true

require 'constraints/versions'

Rails.application.routes.draw do
  namespace :api,
            defaults: { format: :json },
            path: '/' do
    scope module: :v1,
          constraints: Versions.new(version: 1, default: true) do
      resources :groups
    end
  end
end
