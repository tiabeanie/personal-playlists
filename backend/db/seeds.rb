p1 = Playlist.create!({ title: "Roadtrip Jams", owner: 1 })
p2 = Playlist.create!({ title: "Shower Tunes", owner: 2 })
p3 = Playlist.create!({ title: "Study Sesh", owner: 3 })

s1 = Song.create!({ title: "Life is a Highway", artist: "Tom Cochrane", genre: "country rock", playlist_id: 1 })
s2 = Song.create!({ title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", genre: "classic rock", playlist_id: 1 })
s3 = Song.create!({ title: "Send Me On My Way", artist: "Rusted Root", genre: "folk rock", playlist_id: 1 })
s4 = Song.create!({ title: "American Girl", artist: "Tom Petty", genre: "rock", playlist_id: 1 })
s5 = Song.create!({ title: "Come On Eileen", artist: "Dexys Midnight Runners", genre: "new wave", playlist_id: 2 })
s6 = Song.create!({ title: "Feel It Still", artist: "Portugal. The Man", genre: "alt/indie", playlist_id: 2 })
s7 = Song.create!({ title: "Take A Chance On Me", artist: "ABBA", genre: "pop", playlist_id: 2 })
s8 = Song.create!({ title: "Save Tonight", artist: "Eagle-Eye Cherry", genre: "alt rock", playlist_id: 2 })
s9 = Song.create!({ title: "We've Been Here Our Whole Lives", artist: "Postcard Boy", genre: "alt", playlist_id: 3 })
s10 = Song.create!({ title: "I've Been Waiting", artist: "Uevo", genre: "lofi", playlist_id: 3 })
s11 = Song.create!({ title: "oceans", artist: "SpoonBeats", genre: "lofi", playlist_id: 3 })
s12 = Song.create!({ title: "Benadryl", artist: "Sofi Tukker", genre: "alt", playlist_id: 3 })

usr1 = User.create!({ first_name: "Annie", email: "AnnieTaylor@gmail.com", password_digest: "123" })
usr2 = User.create!({ first_name: "Mona", email: "MonaKitty@gmail.com", password_digest: "456" })
usr3 = User.create!({ first_name: "Ophelia", email: "o-o-phelia@gmail.com", password_digest: "789" })
