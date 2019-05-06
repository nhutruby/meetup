# frozen_string_literal: true

require 'csv'
# Group Model
class Group
  include Mongoid::Document
  field :name, type: String

  # validation
  validates :name, presence: true, uniqueness: true

  # association
  has_many :meets, dependent: :delete_all
  embeds_many :organizers

  # rubocop:disable all
  def self.import(file)
    begin
      CSV.foreach(file.path, headers: true) do |i|
        next unless i['Role in Group'].present? && i['Group Name'].strip && i['First Name'].strip && i['Last Name'].strip
        role = Role.where(name: /.*#{i['Role in Group'].strip}.*/i).first
        group = Group.find_or_create_by(name: i['Group Name'].strip)
        user = User.find_or_create_by(first_name: i['First Name'].strip, last_name: i['Last Name'].strip)
        next unless group.present? && user.present? && role.present?

        meet = Meet.new
        meet.user = user
        meet.group = group
        meet.role = role
        meet.save
        next unless role.name == 'Organizer'

        organizer = Organizer.new
        organizer.name = [i['First Name'].strip, i['Last Name'].strip].join(' ')
        group.organizers << organizer
        group.save
      end
    rescue CSV::MalformedCSVError => er
      puts er.message
    end
  end
  # rubocop:enable all

  def self.search(params)
    @groups = Group.order_by(id: :desc).page(params[:page]).per(params[:per_page])
    @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
    @groups
  end

  def self.replace(params)
    length = params[:ids].length
    page = (params[:length] - length) / params[:per_page]
    page += 1
    @groups = Group.search(page: page, per_page: params[:per_page])
    { groups: @groups[(params[:per_page] - length)..(params[:per_page] - 1)],
      total: @groups.total_count }
  end
end

# Embedded Organizer Model
class Organizer
  include Mongoid::Document
  field :name, type: String
  # validation
  validates :name, uniqueness: true

  # association
  embedded_in :group
end
