import favoriteVideo from "../models/favoriteVidModel.js";

// get /api/favoriteVids
export const getFavorites =  async (req, res) => {
    try{
        const favorites = await favoriteVideo.find();
        res.json(favorites);
    } catch(err){
        res.status(500).json({ message: "Eroare la obținerea videoclipurilor favorite", error: err.message });
    }
}

//put /api/favoriteVids

export const addFavorite = async (req, res) => {
    try{
        const { title, url, mood } = req.body;

        const existing = await favoriteVideo.findOne({ url });
        if(existing){
             return res.status(400).json({ message: "Acest videoclip este deja în favorite" });
        }

        const newFav = await favoriteVideo.create({ title, url, mood });
        res.status(201).json(newFav);
    } catch (err) {
    res.status(500).json({ message: "Eroare la adăugare videoclip", error: err.message });
  }
}

//delete /api/favoriteVids
export const deleteFavorite = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await favoriteVideo.findByIdAndDelete(id);
        if(!deleted){
             return res.status(404).json({ message: "Videoclipul nu a fost găsit" });
        }
      res.json({ message: "Videoclip șters din favorite" });  
    } catch (err) {
    res.status(500).json({ message: "Eroare la ștergere videoclip", error: err.message });
  }
}