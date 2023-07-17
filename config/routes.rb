Rails.application.routes.draw do
  get :install, to: 'insales_app#install', as: :install
  get :uninstall, to: 'insales_app#uninstall', as: :uninstall
  post :update_settings, to: 'js#update_settings', as: :update_settings
  get :main, to: 'js#main', as: :main
  root controller: 'js', action: :main
end
