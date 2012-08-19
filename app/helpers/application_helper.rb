module ApplicationHelper
  def navigation_slugs
    slugs = BiscuitWedding::Application::STATIC_PAGES - ["coming_soon"]

    slugs += ["rsvp"] if Property.check('allow-rsvp', 'true')

    slugs
  end
end
