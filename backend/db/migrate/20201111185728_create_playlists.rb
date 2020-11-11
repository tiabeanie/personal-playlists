class CreatePlaylists < ActiveRecord::Migration[6.0]
  def change
    create_table :playlists do |t|

      t.timestamps
    end
  end
end
