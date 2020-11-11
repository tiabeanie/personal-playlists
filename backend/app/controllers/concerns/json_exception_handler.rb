module JsonExceptionHandler
    extend ActiveSupport::Concern
  
    included do
      rescue_from ActiveRecord::RecordNotFound do |error|
        render json: { message: error.message }, status: :not_found
      end
  
      # using create! we rescue from model throwing exception
      rescue_from ActiveRecord::RecordInvalid do |error|
        render json: { message: error.message }, status: :unprocessable_entity
      end
    end
  end