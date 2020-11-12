class API::V1::SessionsController < ApplicationController
    include CurrentUserConcern

    def create 
        @user = User.find_by(email: params[:email]).try(:authenticate, params["password"])

        if @user 
            session[:user_id] = @user.id 
            json_response(object: @ user, status: :created, logged_in: true)
        else 
            render json: { status: 401 }
        end
    end
    