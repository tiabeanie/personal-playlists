class Song {
    constructor(id, title, artist, genre, playlist_id) {
      this.id = id
      this.title = title
      this.artist = artist
      this.genre = genre
      this.playlistId = playlist_id
      this.renderSongList()
    }
  
    renderSongList() {
      const songList = document.querySelector('.SongColumn-songList')
      const songListItem = document.createElement('li')
      songListItem.classList.add('ListItem')
      songListItem.id = `s-${this.id}`
  
      const listItemTitle = document.createElement('p')
      listItemTitle.classList.add('SongListItemTitle')
  
      const listItemTitleText = document.createTextNode(`${this.title}`)
      listItemTitle.appendChild(listItemTitleText)
      songListItem.appendChild(listItemTitle)
  
      const deleteIcon = document.createElement('i')
      deleteIcon.id = `${this.id}`
      deleteIcon.classList.add('far')
      deleteIcon.classList.add('fa-trash-alt')
      deleteIcon.classList.add('Button')
      deleteIcon.classList.add('SongDelete')
      deleteIcon.classList.add('Delete')
  
      songListItem.appendChild(deleteIcon)
      songList.appendChild(songListItem)
  
      songList.addEventListener('click', () => {
        this.clearEditor()
      })
  
      deleteIcon.addEventListener('click', e => {
        this.delete(e)
        this.clearEditor()
      })
    }
  
    preserveASongSelection() {
      const songList = document.querySelector('.SongColumn-songList')
  
      if (songList.childNodes.length > 0) {
        songList.firstChild.classList.add('Selected')
        appState["selectedSong"]["songId"] = songList.firstChild.id.split('-')[1]
        appState["currentUser"].renderSongArtist("", songList.firstChild.id.split('-')[1])
      } else {
        appState["selectedSong"] = {}
      }
      this.clearEditor()
    }
  
    clearEditor() {
      const editor = document.querySelector('.EditorColumn-editorArea')
      editor.value = ""
    }
  
    clearList(element) {
      while (element.firstChild) {
        element.firstChild.remove()
      }
    }
  
    delete(e) {
      const songId = e.target.id
  
      const configObject = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      }
  
      const currentUserId = appState["currentUser"]["userId"]
  
      fetch(`${app.baseUrl}users/${currentUserId}/playlists/${this.playlistId}/songs/${songId}`, configObject)
        .then(() => {
          e.target.parentElement.remove()
          // maintains a selection in list if possible
          this.preserveASongSelection()
          console.log(appState)
  
        })
        .catch(error => console.log(error.message))
    }
  }