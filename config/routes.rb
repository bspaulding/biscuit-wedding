BiscuitWedding::Application.routes.draw do
  root :to => "pages#our-story"

  resources :food_orders
  resources :events
  resources :invitations
  resources :attendees, :only => [:index]
  resources :properties
  resources :guestbook_entries

  match "/guestbook" => 'guestbook_entries#index'
  match "/admin" => 'properties#index'

  (BiscuitWedding::Application::STATIC_PAGES + ['rsvp']).each do |slug|
    match "/#{slug}" => "pages##{slug}"
  end
end
