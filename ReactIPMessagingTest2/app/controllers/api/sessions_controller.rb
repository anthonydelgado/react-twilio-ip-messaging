class Api::SessionsController < ApplicationController

  def create
    @user = User.find_by_credentials(params[:user][:username],
      params[:user][:password])
    if current_user
      # render json: {error: "#{current_user.username} already logged in"}, status: 400
      logout!
    end
    if @user
      login!(@user)
      render json: @user
    else
      error = "Invalid username and password"
      render json: {error: error}, status: 401
    end
  end

  def destroy
    if current_user
      logout!
      render json: {}
    else
      render json: {error: "Not Found"}, status: 404
    end
  end
end
