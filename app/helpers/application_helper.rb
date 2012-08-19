module ApplicationHelper
  def navigation_slugs
    BiscuitWedding::Application::STATIC_PAGES + ["rsvp"]
  end
end
