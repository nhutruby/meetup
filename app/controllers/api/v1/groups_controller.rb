# frozen_string_literal: true

module Api
  module V1
    # Groups Controller
    class GroupsController < ApplicationController
      before_action :set_group, only: %I[show update destroy]

      # GET /groups
      def index
        @groups = Group.order_by(id: :desc).page(page_params[:page]).per(page_params[:per_page])
        @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
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
          @groups = Group.order_by(id: :desc).page(0).per(page_params[:per_page])
          @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
          render json: { groups: @groups, meta: { total_objects: @groups.total_count } }, status: :created, location: [:api, @group]
        else
          puts 'bba'
          render json: {error: @group.errors.full_messages}, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /groups/1
      def update
        if @group.update(group_params)
          render json: @group.to_json(only: %I[_id name]), status: :ok
        else
          render json: {error: @group.errors.full_messages}, status: :unprocessable_entity
        end
      end

      def remove
        puts params[:ids]
        Group.where(id: { '$in': params[:ids]}).destroy
        puts Group.count
        page = (params[:length] - params[:ids].length)/page_params[:per_page] + 1
        skip = page_params[:per_page] - params[:ids].length
        puts page_params[:per_page]
        puts page
        puts skip
        @groups = Group.order_by(id: :desc).page(page).per(page_params[:per_page])
        puts @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
        puts 'totla'
        puts @groups[skip..(page_params[:per_page] - 1)].to_json
        puts @groups.total_count
        render json: { groups: @groups[skip..(page_params[:per_page] - 1)], delete_ids: params[:ids], meta: { total_objects: @groups.total_count } }
      end

      def import
        Group.import(params[:file]) if params[:file] != 'undefined'
        @groups = Group.order_by(id: :desc).page(0).per(page_params[:per_page])
        @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
        render json: { groups: @groups, meta: { total_objects: @groups.total_count } }
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
