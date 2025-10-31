import UserPreference from "../models/userPreferenceModel.js";
import EmotionRecommendation from "../models/emotionRecomModel.js";


export const recordPreference = async (req, res) => {
    try{
        const { userId, mood, video, feedbackScore } = req.body;

        let pref = await UserPreference.findOne( { userId, mood });

        if(!pref){
            pref = await UserPreference.create({
                userId,
                mood,
                linkedVideos: [{ ...video, score: feedbackScore || 0 }],
            });
        } else {
            const existing = pref.likedVideos.find((v) => v.url === video.url);
            if(existing) {
                existing.timesSelected +=1;
                existing.lastSelectedAt = new Date();
                if(feedbackScore) {
                    existing.score = Math.round((existing.score + feedbackScore) / 2);
                }
            } else {
                pref.likedVideos.push({
                    ...video,
                    score: feedbackScore || 0,
                    lastSelectedAt: new Date(),
                });
            }
            await pref.save();
            res.status(200).json(pref);
        } 
    } catch (err) {
            res.status(500).json({  message: "Eroare la salvarea preferintei", error: err.message });
        }
};

// get
export const getPersonalizedRecom = async (req, res) => {
    try {
        const { userId, mood } = req.query;
        const pref = await UserPreference.findOne({ userId, mood });
        const emotion = await EmotionRecommendation.findOne({ mood });
        let recommendations = emotion?.videos || [];

        if (pref) {
            const now = new Date();

            const scored = pref.likedVideos.map((v) => {
                const daysSince = (now - v.lastSelectedAt) / (1000 * 60 * 60 * 24);
                const recencyBonus = daysSince < 3 ? 3 : daysSince < 7 ? 1 : 0; 
                const totalScore = v.timesSelected * 2 + v.score + recencyBonus;
                return { ...v.toObject?.() ?? v, totalScore};
            });
            scored.sort((a, b) => b.totalScore - a.totalScore);
            const prefUrls = new Set(scored.map((v) => v.url));
            recommendations = [
                ...scored, 
                ...recommendations.filter((v) => !prefUrls.has(v.url)),
            ];
        }
        res.json(recommendations);

    } catch (err) {
    res.status(500).json({ message: "Eroare la recomandari", error: err.message });
  }
};