class Api::V1::UsersController < ApplicationController

    def create
      @user = User.create!(
        first_name: params[:first_name],
        email: params[:email],
        password: params[:password],
        password_confirmation: params[:password_confirmation]
      )
  
      if @user
        session[:user_id] = @user.id
        json_response(object: @user, status: :created)
      end
    end
  end