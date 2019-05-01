# frozen_string_literal: true

# Api constraints for routes
class Versions
  def initialize(options)
    @version = options[:version]
    @default = options[:default]
  end

  def matches?(req)
    @default || req
      .headers['Accept']
      .include?("application/meetup.com.v#{@version}")
  end
end
