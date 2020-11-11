class ApplicationController < ActionController::API
    include JsonExceptionHandler
    include JsonResponse
    include ActionController::Cookies
    include ActionController::RequestForgeryProtection
  
    before_action :set_csrf_cookie
  
    private
  
    def set_csrf_cookie
      cookies["CSRF-TOKEN"] = form_authenticity_token
    end
  end