Rails.application.routes.draw do

  root to: 'static_pages#root'

  namespace :api, defaults: {format: :json} do
    get 'token', to: 'ip_messaging#token'
    resource :session, only: [:create, :destroy]
  end

end
