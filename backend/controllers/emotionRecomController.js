import emotionRecom from "../models/emotionRecomModel.js";

//get /api/emotionRecom



export const getAllEmotions = async (req, res) => {
  try {
    const emotions = await EmotionRecommendation.find();
    res.json(emotions);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea recomandărilor", error: err.message });
  }
};


export const getEmotionByMood = async (req, res) => {
  try {
    const { mood } = req.params; 
    const emotion = await EmotionRecommendation.findOne({ mood });

    if (!emotion) {
      return res.status(404).json({ message: "Nu există recomandări pentru această emoție" });
    }

    res.json(emotion);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea emoției", error: err.message });
  }
};




export const updateEmotion = async (req, res) => {
  try {
    const { mood } = req.params;
    const { videos } = req.body;

    const updatedEmotion = await EmotionRecommendation.findOneAndUpdate(
      { mood },
      { videos },
      { new: true }
    );

    if (!updatedEmotion) {
      return res.status(404).json({ message: "Emoția nu a fost găsită" });
    }

    res.json(updatedEmotion);
  } catch (err) {
    res.status(500).json({ message: "Eroare la actualizare emoție", error: err.message });
  }
};

