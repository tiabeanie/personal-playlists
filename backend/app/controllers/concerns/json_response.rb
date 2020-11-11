module JsonResponse
    def json_response(object, message = "SUCCESS", status = :ok, logged_in = false)
      if object.class.name == "User"
        render json: { message: message, user: object , logged_in: logged_in}, status: status
      else
        render json: { message: message, data: object }, status: status
      end
    end
  end
  