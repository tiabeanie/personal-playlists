class Playlist < ApplicationRecord
    has_many :songs 

    validates_presence_of :title
end
