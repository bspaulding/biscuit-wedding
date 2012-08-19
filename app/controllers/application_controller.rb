class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :check_site_launched

  def check_site_launched
    return if action_name == 'coming_soon'

    if !['invitations', 'properties', 'food_orders'].include?(controller_name) && !Property.check('site-launched', "true")
      redirect_to :controller => :pages, :action => :coming_soon
    end
  end
end
