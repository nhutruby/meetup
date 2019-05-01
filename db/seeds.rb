# frozen_string_literal: true

roles = [{ name: 'Organizer' },
         { name: 'Presenter' },
         { name: 'Participant' }]
roles.each do |i|
  role = Role.new
  role.name = i[:name]
  role.save
end
