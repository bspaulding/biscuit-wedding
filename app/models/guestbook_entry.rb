class GuestbookEntry < ActiveRecord::Base
  attr_accessible :name, :body
end
