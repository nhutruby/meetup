ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)
ENV['MONGODB_URI'] = 'mongodb://heroku_nq9kk9gs:fhf66mn78os8ddg0pct0ddl2s9@ds151626.mlab.com:51626/heroku_nq9kk9gs'
require 'bundler/setup' # Set up gems listed in the Gemfile.
require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
