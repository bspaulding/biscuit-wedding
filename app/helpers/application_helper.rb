module ApplicationHelper
  def navigation_slugs
    slugs = BiscuitWedding::Application::STATIC_PAGES - ["coming_soon"]

    slugs
  end
end
