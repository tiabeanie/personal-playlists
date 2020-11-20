class PlaylistAdapter {
    constructor(userId) {
      this.userId = userId
    }
  
    async getPlaylists() {
      return fetch(`${app.baseUrl}users/${this.userId}/playlists`)
               .then(result => result.json())
               .catch(error => error.message)
    }
  
    async createPlaylist(title, owner) {
      const playlistData = {
        title: title,
        owner: owner
      }
  
      const configObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        artist: JSON.stringify(playlistData)
      }
  
      return fetch(`${app.baseUrl}users/${this.userId}/playlists`, configObject)
              .then(result => result.json())
              .catch(error => error.message)
    }
  }