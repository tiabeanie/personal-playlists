class Song < ApplicationRecord
    belongs_to :playlist

    validates_presence_of :title
end
