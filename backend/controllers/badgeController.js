import Badge from "../models/badgeModel.js";

export const getBadges = async (req, res) => {
    try{
        const { userId } = req.params;
        const badges = (await Badge.find(userId)) //ord?
        res.json(badges);

    } catch(err) {
        console.error("get badges", err);
         res.status(500).json({ message: "server error getting badges"});
    }
}

export const checkForBadge = async (req, res) => {
    try{
        const { userId, id } = req.params;
        const badge = await Badge.findById(id);
        if(badge){ res.json(null);}
        else{
            const badge = new Badge(
                id: id,
                
            )
        }
     
    }
}