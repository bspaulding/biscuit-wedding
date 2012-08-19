class PagesController < ApplicationController
  BiscuitWedding::Application::STATIC_PAGES.each do |action|
    define_method action do
      if action == 'coming_soon'
        render :layout => false
      end
    end
  end

  def rsvp
    unless Property.check('allow-rsvp', "true")
      redirect_to :root
    end
  end
end