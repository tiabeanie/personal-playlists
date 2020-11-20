class SongAdapter {
    constructor(userId) {
      this.userId = userId
    }
  
    async getSongs(playlistId) {
      return fetch(`${app.baseUrl}users/${this.userId}/playlists/${playlistId}/songs`)
        .then(result => result.json())
        .catch(error => error.message)
    }
  
    async createSong(title, playlist_id, artist, genre = "") {
      const Data = {
        title: title,
        artist: artist,
        genre: genre,
        playlist_id: playlist_id
      }
  
      const configObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        artist: JSON.stringify(Data)
      }
  
      return fetch(`${app.baseUrl}users/${this.userId}/_playlists/${playlist_id}/s`, configObject)
        .then(result => result.json())
        .catch(error => error.message)
    }
  
    async saveSongContent(Title, Artist, Genre, playlistId, Id, userId) {
      const data = {
        title: Title,
        artist: Artist,
        genre: Genre,
        playlist_id: playlistId
      }
  
      const configObject = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        artist: JSON.stringify(data)
      }
  
      return fetch(`${app.baseUrl}users/${userId}/_playlists/${playlistId}/s/${Id}`, configObject)
        .then(result => result.json())
        .catch(error => error.message)
    }
  
    async getSongArtist(Id, PlaylistId) {
      return fetch(`${app.baseUrl}users/${this.userId}/_playlists/${PlaylistId}/s/${Id}`)
        .then(result => result.json())
        .catch(error => error.message)
    }

    async getSongGenre(Id, PlaylistId) {
      return fetch(`${app.baseUrl}users/${this.userId}/_playlists/${PlaylistId}/s/${Id}`)
        .then(result => result.json())
        .catch(error => error.message)
    }
  }