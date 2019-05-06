# frozen_string_literal: true

module Api
  module V1
    # Groups Controller
    class GroupsController < ApplicationController
      before_action :set_group, only: %I[show update destroy]
      before_action :delete_all, only: :remove
      # GET /groups
      def index
        @groups = Group.search(page_params)
        render json: { groups: @groups, meta: { total_objects: @groups.total_count } }
      end

      # GET /groups/1
      def show
        @group = @group.to_json(only: %I[_id name],
                                include: { meets: { only: %I[_id],
                                                    include: { user: { only: %I[first_name last_name] },
                                                               role: { only: :name } } } })
        render json: @group
      end

      # POST /groups
      def create
        @group = Group.new(group_params)
        if @group.save
          page_params[:page] = 0
          @groups = Group.search(page_params)
          render json: { groups: @groups, meta: { total_objects: @groups.total_count } },
                 status: :created,
                 location: [:api, @group]
        else
          render json: { error: @group.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /groups/1
      def update
        if @group.update(group_params)
          render json: @group.to_json(only: %I[_id name]), status: :ok
        else
          render json: { error: @group.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def remove
        @groups = Group.replace(ids: params[:ids],
                                length: params[:length],
                                per_page: page_params[:per_page])
        render json: { groups: @groups[:groups],
                       delete_ids: params[:ids],
                       meta: { total_objects: @groups[:total] } }
      end

      def import
        Group.import(params[:file]) if params[:file] != 'undefined'
        page_params[:page] = 0
        @groups = Group.search(page_params)
        render json: { groups: @groups, meta: { total_objects: @groups.total_count } }
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_group
        @group = Group.find(params[:id])
      end

      def delete_all
        Group.where(id: { '$in': params[:ids] }).destroy
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
