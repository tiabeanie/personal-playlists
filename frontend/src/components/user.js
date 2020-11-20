class User {
    constructor(userId, firstName, email, isLoggedIn = true) {
      this.userId = userId
      this.firstName = firstName
      this.email = email
      this.isLoggedIn = isLoggedIn
      this.renderUserProfile()
      this.playlistAdapter = new PlaylistAdapter(userId)
      this.songAdapter = new SongAdapter(userId)
      this.fetchAndLoadPlaylists()
      this.playlists = []
      this.songs = []
      this.initAndBindEventListeners()
    }
  
    /* -------------------------------------------------- */
    /* INITIALISATION - DOM */
    /* -------------------------------------------------- */
  
    renderUserProfile() {
      const viewContainer = document.querySelector('.Container')
      const landingView = document.querySelector('.Info')
      landingView.classList.add('Hide')
      const activeViewHtml = `
        <div class="Profile">
          <div class="Sidebar">
            <i class="fas fa-book fa-3x Sidebar-book Button"></i>
          </div>
          <div class="PlaylistColumn Column Hide">
            <div class="CategoryColumn-columnHeader ColumnHeader">
              <input type="text" class="PlaylistColumn-playlistInput ColumnInput" placeholder="Add Playlist">
              <i class="far fa-plus-square fa-3x Add AddPlaylist Button"></i>
            </div>
            <ul class="PlaylistColumn-playlistList List"></ul>
          </div>
          <div class="SongColumn Column Hide">
            <div class="SongColumn-columnHeader ColumnHeader">
              <input type="text" class="SongColumn-songInput ColumnInput" placeholder="Add Song" disabled>
              <i class="far fa-plus-square fa-3x Add AddSong Button"></i>
            </div>
            <ul class="SongColumn-List List"></ul>
          </div>
          <div class="EditorColumn">
            <h2 class="EditorColumn-header"></h2>
            <div class="EditorColumn-Editor">
              <textarea class="EditorColumn-editorArea" disabled></textarea>
              <button type="submit" class="EditorColumn-save Button Primary">Save</button>
            </div>
          </div>
        </div>
      `
  
      viewContainer.insertAdjacentHTML('afterbegin', activeViewHtml)
    }
  
    /* -------------------------------------------------- */
    /* INITIALISATION - DATA */
    /* -------------------------------------------------- */
  
    fetchAndLoadPlaylists() {
      this.playlistAdapter.getPlaylists()
        .then(playlistsData => {
          const obj = playlistsData.data.object
          if (obj.length > 0) {
            obj.forEach(playlist => {
              const {
                id,
                title,
                owner
              } = playlist
              this.playlists.push(new Playlist(id, title, owner))
            })
          }
        })
        .catch(error => console.log(error.message))
    }

  
    /* -------------------------------------------------- */
    /* EVENT LISTENERS */
    /* -------------------------------------------------- */
  
    initAndBindEventListeners() {
      const addButtons = document.querySelectorAll('.Add')
      const lists = document.querySelectorAll('.List')
      const songList = document.querySelector('.SongColumn-songList')
      const songSave = document.querySelector('.EditorColumn-save')
  
      const accountButton = document.querySelector('.AccountButton')
      const songBook = document.querySelector('.Sidebar-book')
      const inputs = document.querySelectorAll('.ColumnInput')
  
      accountButton.classList.remove('Hide')
  
  
      songBook.addEventListener('click', () => {
        this.toggleColumnDisplay()
        this.clearEditor()
      })
  
      accountButton.addEventListener('click', () => {
        this.logUserOut()
        accountButton.classList.add('Hide')
      })
  
      inputs.forEach(input => {
        input.addEventListener('click', e => {
          if (e.target.className.includes('Playlist')) {
            this.removeAllSelections("Playlist", e)
            this.clearList(songList)
  
          } else {
            this.removeAllSelections("Song")
          }
  
          this.clearEditor()
        })
      })
  
      addButtons.forEach(btn => {
        btn.addEventListener('click', e => {
          if (e.target.className.includes('Playlist')) {
            this.addPlaylist(e)
          } else {
            this.addSong(e)
          }
        })
      })
  
      lists.forEach(list => {
        list.addEventListener('click', e => {
          const selection = e.target.parentNode
  
          // if a playlist title is clicked
          if (e.target.className.includes('PlaylistListItemTitle')) {
            // check if there is a previous selection in song list
            this.removeAllSelections("Song")
            // if selection is same as previous selection
            if (selection.className.includes('Selected')) {
              // deselect selection
              this.removeAllSelections("Playlist")
              this.clearList(songList)
            } else {
              this.processSelected("playlist", e)
              this.clearList(songList)
              this.fetchAndLoadSongs(e)
            }
            this.toggleColumnDisplay("playlist")
            this.clearEditor()
          } else if (e.target.className.includes('SongListItemTitle')) {
            // if selection is same as previous selection
            if (selection.className.includes('Selected')) {
              this.removeAllSelections("Song")
            } else {
              this.processSelected("song", e)
              this.renderSongArtist(e)
              this.renderSongGenre(e)
            }
          }
        })
      })
  
      songSave.addEventListener('click', (e) => {
        e.preventDefault()
        this.saveSongArtist()
        this.saveSongGenre()
      })
    }
  
    /* -------------------------------------------------- */
    /* NEW DATA */
    /* -------------------------------------------------- */
  
    addPlaylist(e) {
      const title = e.target.previousElementSibling.value
      const owner = appState["currentUser"]["userId"]
      this.playlistAdapter.createPlaylist(title, owner).then(playlistData => {
          const {
            id,
            title,
            owner
          } = playlistData.data.object
          this.playlists.push(new Playlist(id, title, owner))
        })
        .catch(error => error.message)
      e.target.previousElementSibling.value = ""
    }
  
  
    fetchAndLoadSongs(e) {
      this.clearEditor()
      const playlistId = e.target.parentNode.id.split('-')[1]
  
      this.songAdapter.getSongs(playlistId).then(songsData => {
          if (songsData) {
            const obj = songsData.data.object
            if (obj.length > 0) {
              obj.forEach(song => {
                const {
                  id,
                  title,
                  artist,
                  genre,
                  playlist_id
                } = song
                this.songs.push(new Song(id, title, artist, genre, playlist_id))
              })
            }
          }
        })
        .catch(error => console.log(error.message))
    }
  
    addSong(e) {
      const title = e.target.previousElementSibling.value
      const playlistId = appState["selectedPlaylist"]["playlistId"]
  
      this.songAdapter.createSong(title, playlistId).then(songData => {
          const {
            id,
            title,
            artist,
            genre,
            playlist_id
          } = songData.data.object
          this.songs.push(new Song(id, title, artist, genre, playlist_id))
        })
        .catch(error => error.message)
  
      e.target.previousElementSibling.value = ""
    }
  
    saveSongArtist() {
      const editor = document.querySelector('.EditorColumn-editorArea')
      const songContent = editor.value
      const userId = appState["currentUser"]["userId"]
      const playlistId = appState["selectedPlaylist"]["playlistId"]
      const songId = appState["selectedSong"]["songId"]
      const songTitle = appState["selectedSong"]["songTitle"]
  
      this.songAdapter.saveSongContent(songTitle, songContent, playlistId, songId, userId).then(json => {
        json.message === "SUCCESS" ? alert("Saved!") : alert("Error!")
      })

    saveSongGenre() {
      const editor = document.querySelector('.EditorColumn-editorArea')
      const songContent = editor.value
      const userId = appState["currentUser"]["userId"]
      const playlistId = appState["selectedPlaylist"]["playlistId"]
      const songId = appState["selectedSong"]["songId"]
      const songTitle = appState["selectedSong"]["songTitle"]
  
      this.songAdapter.saveSongContent(songTitle, songContent, playlistId, songId, userId).then(json => {
        json.message === "SUCCESS" ? alert("Saved!") : alert("Error!")
      })
    }
  
    /* -------------------------------------------------- */
    /* DOM MANIPULATION */
    /* -------------------------------------------------- */
  
    // removes any Selected class from lists
    removeAllSelections(item, e) {
      let list
  
      if (item === "Playlist") {
        list = document.querySelector('.SongColumn-songList').childNodes
        if (list.length > 0) {
          for (const item of list) {
            if (item.className.includes('Selected')) {
              item.classList.remove('Selected')
            }
          }
        }
  
        list = document.querySelector('.PlaylistColumn-playlistList').childNodes
        // remove category selection
        for (const item of list) {
          if (item.className.includes('Selected')) {
            item.classList.remove('Selected')
          }
        }
        // remove selected song object from appState
        appState["selectedSong"] = {}
        appState["selectedPlaylist"] = {}
      } else {
        // find and remove the selected item in song list only
        list = document.querySelector('.SongColumn-songList').childNodes
  
        for (const item of list) {
          if (item.className.includes('Selected')) {
            item.classList.remove('Selected')
          }
        }
        // remove selected song object from appState
        appState["selectedSong"] = {}
      }
    }
  
    toggleColumnDisplay(element = "songBook") {
      const playlistColumn = document.querySelector('.PlaylistColumn')
      const songColumn = document.querySelector('.SongColumn')
  
      if (element === "songBook") {
        this.clearEditor()
        if (appState["isPlaylistColumnVisible"] === true) {
          playlistColumn.classList.toggle('Hide')
  
          if (appState["isSongColumnVisible"] === true) {
            songColumn.classList.toggle('Hide')
            this.clearEditor()
          }
          appState["isSongColumnVisible"] = false
          appState["isPlaylistColumnVisible"] = false
          appState["selectedSong"] = {}
          appState["selectedPlaylist"] = {}
          this.removeAllSelections("Playlist")
        } else {
          playlistColumn.classList.toggle('Hide')
          appState["isPlaylistColumnVisible"] = true
        }
      }
  
      if (element === "playlist" && appState["isSongColumnVisible"] === false) {
        songColumn.classList.remove('Hide')
        appState["isSongColumnVisible"] = true
      }
    }
  
    // display select class to highlight user selection
    processSelected(item, e) {
      // initialise variables
      let id = e.target.parentNode.id.split("-")[1]
      let element, obj, keyId, keyName, list
      const fn = this.setInputStatus
  
      // assign values for selection checker
      if (item === "playlist") {
        element = document.getElementById(`sc-${id}`)
        obj = "selectedPlaylist"
        keyId = "playlistId"
        keyName = "playlistTitle";
        list = document.querySelector('.PlaylistColumn-playlistList')
      } else if (item === "song") {
        element = document.getElementById(`s-${id}`)
        obj = "selectedSong"
        keyId = "songId"
        keyName = "songTitle";
        list = document.querySelector('.SongColumn-songList')
      }
  
      this.checkAndDisplaySelection(id, element, obj, keyId, keyName, list, fn, e)
    }
  
    checkAndDisplaySelection(id, element, obj, keyId, keyName, list, fn, e) {
      // check if selection exists
      if (Object.keys(appState[obj]).length > 0) {
        // check if selection is the same
        if (appState[obj][keyId] === id) {
          // selection exists and is the same
          element.classList.toggle('Selected')
          appState[obj] = {}
          fn(keyName)
        } else {
          // selection exists and is not the same
          const previousSelection = list.querySelector('.Selected')
          previousSelection.classList.remove('Selected')
          element.classList.add('Selected')
          appState[obj][keyId] = id
          appState[obj][keyName] = e.target.parentNode.textContent
          fn(keyName, "enable")
        }
      } else {
        // selection does not exist
        element.classList.add('Selected')
        appState[obj][keyId] = id
        appState[obj][keyName] = e.target.parentNode.textContent
        fn(keyName, "enable")
      }
      console.log(appState)
    }
  
    setInputStatus(keyName, status = "disabled") ;
      let input
  
      if (keyName === "playlistTitle") {
        input = document.querySelector('.SongColumn-songInput')
      } else {
        input = document.querySelector('.EditorColumn-editorArea')
      }
      if (status === "enable") {
        input.removeAttribute("disabled")
      } else {
        input.setAttribute("disabled", "")
      }
    }
  
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
    /* SAVING NEW CATEGORIES */
    /* -------------------------------------------------- */
  
    renderSongArtist(e, id) {
      let songId
  
      if (e === "") {
        songId = id
      } else {
        songId = e.target.parentNode.id.split('-')[1]
      }
  
      const playlistId = appState["selectedPlaylist"]["playlistId"]
      const editor = document.querySelector('.EditorColumn-editorArea')
  
      this.songAdapter.getSongArtist(songId, playlistId).then(songData => {
        const body = songData.data.object.body
        editor.value = body
      })
    }
  
    /* -------------------------------------------------- */
    /* LOG USER OUT, DESTROY SESSION, RESET APP STATE */
    /* -------------------------------------------------- */
  
    logUserOut = () => {
      const configObject = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      }
  
      fetch(`${baseUrl}logout`, configObject, {
          credentials: 'include'
        })
        .then(response => response.json())
        .then(json => handleSession(json))
        .catch(error => console.log(error.message))
  
      appState = {
        ...app.state
      }
    }
  }
  