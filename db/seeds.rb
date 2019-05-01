# frozen_string_literal: true

roles = [{ name: 'Organizer' },
         { name: 'Presenter' },
         { name: 'Participant' }]
roles.each do |i|
  role = Role.new
  role.name = i[:name]
  role.save
end

data = [{ first_name: 'A', last_name: 'B', group: '1', role: 'Organizer' },
        { first_name: 'A', last_name: 'B', group: '2', role: 'Organizer' },
        { first_name: 'A', last_name: 'B', group: '3', role: 'Presenter' },
        { first_name: 'A', last_name: 'B', group: '4', role: 'Participant' },
        { first_name: 'C', last_name: 'D', group: '4', role: 'Organizer' },
        { first_name: 'C', last_name: 'D', group: '1', role: 'Organizer' },
        { first_name: 'C', last_name: 'D', group: '2', role: 'Participant' },
        { first_name: 'C', last_name: 'D', group: '3', role: 'Presenter' },
        { first_name: 'C', last_name: 'D', group: '5', role: 'Participant' },
        { first_name: 'E', last_name: 'F', group: '6', role: 'Organizer' },
        { first_name: 'E', last_name: 'F', group: '7', role: 'Organizer' },
        { first_name: 'E', last_name: 'F', group: '8', role: 'Presenter' },
        { first_name: 'E', last_name: 'F', group: '9', role: 'Participant' },
        { first_name: 'H', last_name: 'G', group: '10', role: 'Organizer' },
        { first_name: 'H', last_name: 'G', group: '11', role: 'Organizer' },
        { first_name: 'H', last_name: 'G', group: '12', role: 'Participant' },
        { first_name: 'H', last_name: 'G', group: '3', role: 'Presenter' },
        { first_name: 'H', last_name: 'G', group: '5', role: 'Participant' },
        { first_name: 'N', last_name: 'M', group: '13', role: 'Organizer' },
        { first_name: 'N', last_name: 'M', group: '14', role: 'Participant' },
        { first_name: 'N', last_name: 'M', group: '15', role: 'Presenter' },
        { first_name: 'N', last_name: 'M', group: '16', role: 'Participant' },
        { first_name: 'S', last_name: 'M', group: '17', role: 'Organizer' },
        { first_name: 'S', last_name: 'M', group: '18', role: 'Participant' },
        { first_name: 'S', last_name: 'W', group: '19', role: 'Presenter' },
        { first_name: 'S', last_name: 'W', group: '20', role: 'Participant' },
        { first_name: 'S', last_name: 'M', group: '21', role: 'Organizer' },
        { first_name: 'S', last_name: 'M', group: '22', role: 'Participant' },
        { first_name: 'S', last_name: 'W', group: '23', role: 'Presenter' },
        { first_name: 'S', last_name: 'W', group: '24', role: 'Participant' },
        { first_name: 'I', last_name: 'T', group: '25', role: 'Participant' },
        { first_name: 'I', last_name: 'T', group: '26', role: 'Organizer' },
        { first_name: 'I', last_name: 'T', group: '22', role: 'Participant' },
        { first_name: 'I', last_name: 'T', group: '23', role: 'Presenter' },
        { first_name: 'I', last_name: 'T', group: '24', role: 'Participant' }]

data.each do |i|
  role = Role.where(name: /.*#{i[:role].strip}.*/i).first
  group = Group.find_or_create_by(name: i[:group].strip)
  user = User.find_or_create_by(first_name: i[:first_name].strip, last_name: i[:last_name].strip)
  next unless user.present? && group.present? && user.present?

  meet = Meet.new
  meet.user = user
  meet.group = group
  meet.role = role
  meet.save
  next unless role.name == 'Organizer'

  organizer = Organizer.new
  organizer.name = [i[:first_name].strip, i[:last_name].strip].join(' ')
  group.organizers << organizer
  group.save
end
