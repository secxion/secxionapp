const BlogNote = require("../models/systemBlogModel");

exports.createBlogNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new BlogNote({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
};

exports.getAllBlogNotes = async (req, res) => {
  try {
    const notes = await BlogNote.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

exports.updateBlogNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedNote = await BlogNote.findByIdAndUpdate(id, { title, content, updatedAt: Date.now() }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
};

exports.deleteBlogNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await BlogNote.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
};