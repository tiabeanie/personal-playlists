class Api::V1::SongsController < ApplicationController
    before_action :set_song, only: [:show, :update, :destroy]
  
    def index
      @songs = Song.where(:playlist_id => params[:playlist_id])
      json_response(object: @songs)
    end
  
    def create
      @song = Song.create!(
        title: params[:title],
        artist: params[:artist],
        genre: params[:genre]
        playlist_id: params[:playlist_id],
      )
      if @song
        json_response(object: @song, message: "song saved!", status: :created)
      end
    end
  
    def show
      json_response(object: @song)
    end
  
    def update
      @song.update(title: params["title"], artist: params["artist"], genre: params["genre"], playlist_id: params["playlist_id"])
      json_response(object: @song)
    end
  
    def destroy
      @song.destroy
      head :no_content
    end
  
    private
  
    def set_song
      @song = Song.find_by!(id: params[:id])
    end
  
    def song_params
      params.permit(:title, :artist, :genre, :playlist_id)
    end
  end