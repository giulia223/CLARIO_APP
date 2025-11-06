import journalEntry from "../models/journalEntryModel.js"

  //post api/journalEntry/
export const createJournalEntry = async(req, res) => {
    try{
       const { userId, text }  = req.body;
       if( !userId || !text) {
        return res.status(400).json({ message: ' userId and text are required'});
       }
       const newJournalEntry = await journalEntry.create({ userId, text});
       res.status(201).json(newJournalEntry);
    } catch( err){
        console.error(' newJournalEntry error', err);
        res.status(500).json({ message: ' server error creating journal entry'});
    }
}

  //get /api/journalEntry
export const getJournalEntry = async (req, res) => {
    try{
        const { userId } = req.query;
        const filter = userId ? { userId} : {};
        const journalEntrys = await journalEntry.find(filter);
        res.json(journalEntrys);
    } catch(err){
        console.error(' getJournalEntry error', err);
        res.status(500).json({ message: ' server error getting journal entry'});
    }
}

//patch /api/journalEntry/:id
export const updateJournalEntry = async (req, res) => {
    try{
        const { id } = req.params;
        const updates = req.body;
        updates.updatedAt = Date.now();
        const updated = await journalEntry.findByIdAndUpdate(id, updates, { new: true});
        if(!updated) return res.status(404).json({ message: 'journalEntry not found'});
        res.json(updated);
    } catch(err){
        console.error('updateJournalEntry err', err);
        res.status(500).json({ message: 'server error updating journalEntry'});
    }
}

//delete /api/journalEntry/:id
export const deleteJournalEntry = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await journalEntry.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({ message: 'journalEntry not found'});
        res.json({ message: 'journalEntry deleted'});
    } catch(err) {
        console.error('deleteJournalEntry', err);
        res.status(500).json({ message: 'server error deleting journalEntry'});
    }
}