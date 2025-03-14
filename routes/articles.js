const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const Articles = require('../models/articles');

router.post("/add", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const {
      title,
      content,
      createdAt,
    } = req.body;

    const newArticle = new Articles({
      title,
      content,
      author: user._id,
      createdAt,

    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);

  } catch (error) {
    console.error('Error saving Article:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/data", async (req, res) => {
  try {
    const ArticleData = await Articles.aggregate([
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "author", // Field in articles that references the user's _id
          foreignField: "_id", // The field in the users collection that is being matched
          as: "userDetails", // The name of the new field that will contain the user data
        },
      },
      {
        $unwind: {
          path: "$userDetails", // Flatten the userDetails array so that each article has a single user object
        },
      },
      {
        $project: {
          // Select the fields to return in the response
          title: 1, // Assuming "title" is a field in Articles
          content: 1, // Assuming "content" is a field in Articles
          userDetails: {
            fullName: 1,
            email: 1,
            department: 1, // Include user details such as fullName, email, etc.
          },
        },
      },
    ]);
    res.status(200).json(ArticleData);

  } catch (error) {
    console.log("Unable to fetch the data:", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
})

router.post('/:id/like', async (req, res) => {
  try {
    await Articles.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.status(200).json({ message: 'Like added' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add like' });
  }
});

router.post('/:id/dislike', async (req, res) => {
  try {
    await Articles.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } });
    res.status(200).json({ message: 'Dislike added' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add dislike' });
  }
});

router.get('/othersArticles/:id', async (req, res) => {
  const Id = req.params.id;
  try {
    const OthersArticles = await Articles.find({ author: Id });
    if (OthersArticles.length === 0) {
      return res.status(404).json({ message: "No Articles found for this user" });
    }
    res.status(200).json(OthersArticles);
  } catch (error) {
    console.log("Failed to fetch the Artilces!!", error);
    res.status(500).json({ message: "Unable to fetch the Articles" });
  }

});

module.exports = router;