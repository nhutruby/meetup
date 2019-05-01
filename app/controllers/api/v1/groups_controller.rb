# frozen_string_literal: true

module Api
  module V1
    # Groups Controller
    class GroupsController < ApplicationController
      before_action :set_group, only: %I[show update destroy]

      # GET /groups
      def index
        @groups = Group.all

        render json: @groups
      end

      # GET /groups/1
      def show
        render json: @group
      end

      # POST /groups
      def create
        @group = Group.new(group_params)

        if @group.save
          render json: @group, status: :created, location: [:api, @group]
        else
          render json: @group.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /groups/1
      def update
        if @group.update(group_params)
          render json: @group, status: :ok
        else
          render json: @group.errors, status: :unprocessable_entity
        end
      end

      # DELETE /groups/1
      def destroy
        @group.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_group
        @group = Group.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def group_params
        params.require(:group).permit(:name)
      end
    end
  end
end
