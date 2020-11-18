class Api::V1::PlaylistsController < ApplicationController
    before_action :set_playlist, only: [:show, :update, :destroy]
  
    def index
      @playlists = Playlist.where(:owner => params[:user_id])
      json_response(object: @playlists)
    end
  
    def create
      @playlist = Playlist.create!(title: params[:title], owner: params[:owner])
      if @playlist
        json_response(object: @playlist, message: "Playlist saved!", status: :created)
      end
    end
  
    def show
      json_response(object: @playlist)
    end
  
    def update
      @playlist.update(playlist_params)
      head :no_content
    end
  
    def destroy
      @playlist.destroy
      head :no_content
    end
  
    private
  
    def set_playlist
      @playlist = Playlist.find(params[:id])
    end
  
    def playlist_params
      params.require(:playlist).permit(:title, :owner)
    end
  end