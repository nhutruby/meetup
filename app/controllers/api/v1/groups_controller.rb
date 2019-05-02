# frozen_string_literal: true

module Api
  module V1
    # Groups Controller
    class GroupsController < ApplicationController
      before_action :set_group, only: %I[show update destroy]

      # GET /groups
      def index
        @groups = Group.page(page_params[:page]).per(page_params[:per_page])
        @group = @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
        render json: { groups: @groups, meta: { total_objects: @groups.total_count } }
      end

      # GET /groups/1
      def show
        # rubocop:disable all
        @group = @group.to_json(only: %I[_id name], include: {
            meets: { only: %I[_id], include: { user: { only: %I[first_name last_name] }, role: { only: :name } } }
        })
        # rubocop:enable all
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

      def import
        puts params[:file]
        Group.import(params[:file])
        @groups = Group.page(page_params[:page]).per(page_params[:per_page])
        render json: @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
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

      def page_params
        params[:page] = params[:page] || 1
        params[:per_page] = params[:per_page] || 5
        params
      end
    end
  end
end