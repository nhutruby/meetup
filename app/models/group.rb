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
    CSV.foreach(file.path, headers: true) do |i|
      i_group_name = i['Group Name'].strip
      i_first_name = i['First Name'].strip
      i_last_name = i['Last Name'].strip
      next unless i['Role in Group'].present? && i_group_name && i_first_name && i_last_name

      role = Role.where(name: /.*#{i['Role in Group'].strip}.*/i).first
      group = Group.find_or_create_by(name: i_group_name)
      user = User.find_or_create_by(first_name: i_first_name, last_name: i_last_name)
      next unless group.present? && user.present? && role.present?

      Meet.create(user_id: user.id, group_id: group.id, role_id: role.id)

      next unless role.name == 'Organizer'

      organizer = Organizer.new(name: [i_first_name, i_last_name].join(' '))
      group.organizers << organizer
      group.save
    end
  rescue CSV::MalformedCSVError => e
    puts e.message
  end
  # rubocop:enable all

  def self.search(params)
    @groups = Group.order_by(id: :desc).page(params[:page]).per(params[:per_page])
    @groups.to_json(only: %I[_id name], include: { organizers: { only: :name } })
    @groups
  end

  def self.replace(params)
    length = params[:ids].length
    per_page = params[:length].to_i
    page = (per_page - length) / per_page
    page += 1
    @groups = Group.search(page: page, per_page: per_page)
    { groups: @groups[(per_page - length)..(per_page - 1)],
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
