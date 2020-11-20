class Playlist {
    constructor(id, title, ownerId) {
      this.id = id
      this.title = title
      this.ownerId = ownerId
      this.user = appState["currentUser"]
      this.songs = []
      this.renderPlaylistList()
      this.initAndBindEventListeners()
    }
  
    /* -------------------------------------------------- */
    /* INITIALISATION - DOM */
    /* -------------------------------------------------- */
  
    renderPlaylistList() {
      const playlistList = document.querySelector('.PlaylistColumn-playlistList')
  
      const playlistListItem = document.createElement('li')
      playlistListItem.classList.add('ListItem')
      playlistListItem.id = `sc-${this.id}`
  
      const listItemTitle = document.createElement('p')
      listItemTitle.classList.add('PlaylistListItemTitle')
  
      const listItemTitleText = document.createTextNode(`${this.title}`)
      listItemTitle.appendChild(listItemTitleText)
      playlistListItem.appendChild(listItemTitle)
  
      const deleteIcon = document.createElement('i')
      deleteIcon.id = `${this.id}`
      deleteIcon.classList.add('far')
      deleteIcon.classList.add('fa-trash-alt')
      deleteIcon.classList.add('Button')
      deleteIcon.classList.add('PlaylistDelete')
      deleteIcon.classList.add('Delete')
      playlistListItem.appendChild(deleteIcon)
      playlistList.appendChild(playlistListItem)
  
      playlistListItem.addEventListener('click', () => {
        this.clearEditor()
      })
  
      deleteIcon.addEventListener('click', e => {
        this.delete(e)
        this.clearEditor()
      })
    }
  
    /* -------------------------------------------------- */
    /* EVENT LISTENERS */
    /* -------------------------------------------------- */
  
    initAndBindEventListeners() {
      const playlistList = document.querySelector('.PlaylistColumn-playlistList')
      this.clearEditor()
  
    }
  
    /* -------------------------------------------------- */
    /* DOM MANIPULATION */
    /* -------------------------------------------------- */
  
    clearList(element) {
      while (element.firstChild) {
        element.firstChild.remove()
      }
    }
  
    clearEditor() {
      const editor = document.querySelector('.EditorColumn-editorArea')
      editor.value = ""
    }
  
    /* -------------------------------------------------- */
    /* DELETE PLAYLIST, REMOVE IT AND ALL ITS
    /* SONGS FROM DOM */
    /* -------------------------------------------------- */
  
    preserveAPlaylistSelection() {
      const playlistList = document.querySelector('.PlaylistColumn-playlistList')
  
      if (playlistList.childNodes.length > 0) {
        playlistList.firstChild.classList.add('Selected')
        appState["selectedPlaylist"]["playlistId"] = playlistList.firstChild.id.split('-')[1]
      } else {
        appState["selectedPlaylist"] = {}
      }
      appState["selectedSong"] = {}
      this.clearEditor()
    }
  
  
  
  
  
  
    delete(e) {
      const playlistId = e.target.id
  
      const configObject = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      }
  
      fetch(`${app.baseUrl}users/${this.owner}/playlists/${playlistId}`, configObject)
        .then(() => {
          const songList = document.querySelector('.SongColumn-songList')
          this.clearList(songList)
          e.target.parentElement.remove()
          this.preserveAPlaylistSelection()
          console.log(appState)
        })
        .catch(error => console.log(error.message))
    }
  }