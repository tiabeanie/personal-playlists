Rails.application.routes.draw do
  namespace "api" do
    namespace "v1" do
      resources :sessions, only: [:create]
      delete :logout, to: "sessions#logout"
      get :logged_in, to: "sessions#logged_in"

      resources :users, only: [:create] do
        resources :snippet_categories do
          resources :snippets
        end
      end
    end
  end
end