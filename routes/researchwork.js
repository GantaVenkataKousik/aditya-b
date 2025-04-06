const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const ResearchData = require('../models/research');
const mongoose = require('mongoose');
const { logDeleteOperation, logUpdateOperation, logCreateOperation } = require('../utils/operationLogger');


router.post("/add", async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newResearch = new ResearchData({
      title: req.body.title,
      description: req.body.description,
      publishedDate: req.body.date,
      userId: user._id,
    });

    await newResearch.save();
    res.status(201).json({ message: "Research added successfully" });
  } catch (error) {
    console.error("Error adding research:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/data", async (req, res) => {
  try {
    const userId = req.query.userId;

    const researchData = await ResearchData.find({ userId: userId });

    res.status(200).json(researchData);
  }
  catch (error) {
    console.log("Unable to fetch the data:", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
})

router.get("/otherResearch/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const researches = await ResearchData.find({ userId: id });
    if (researches.length === 0) {
      return res.status(404).json({ message: "No researches found for this user" });
    }
    res.status(200).json(researches);
  } catch (error) {
    console.log("Failed to fetch the resources!!", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.body.userId;

    // Fetch the research data before deleting
    const researchToDelete = await ResearchData.findById(id);
    if (!researchToDelete) {
      return res.status(404).json({ message: "Research not found" });
    }

    await ResearchData.findByIdAndDelete(id);

    // Log the complete deleted entity
    await logDeleteOperation(userId, id, 'Research', researchToDelete.toObject());

    res.status(200).json({ message: "Research Deleted" });
  } catch (error) {
    console.log("Error occurred while deleting:", error);
    res.status(500).json({ message: 'Failed to delete research.' });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedResearch = await ResearchData.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.status(200).json(updatedResearch);
  } catch (error) {
    console.error('Error occurred while updating research:', error);
    res.status(500).json({ message: 'Failed to update research.' });
  }
});

router.get("/process", async (req, res) => {
  try {
    const userbranch = req.user.department;

    const unapprovedResearches = await ResearchData.aggregate([
      {
        $match: {
          status: false,
          rejected: false
        }
      },
      {
        $lookup: {
          from: 'users', // Replace 'users' with your actual user collection name
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $match: {
          'userDetails.department': userbranch
        }
      }
    ]);

    res.status(200).json(unapprovedResearches);

  } catch (error) {
    console.log("Error occured while getting data in HOD", error);
    res.status(500).json({ message: 'Failed to get research.' });
  }
})

router.put('/approve/:id', async (req, res) => {
  try {
    const research = await ResearchData.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );
    if (!research) {
      return res.status(404).send('Research not found');
    }
    res.send(research);
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.put('/reject/:id', async (req, res) => {
  try {
    const research = await ResearchData.findByIdAndUpdate(
      req.params.id,
      { rejected: true },
      { new: true }
    );
    if (!research) {
      return res.status(404).send('Research not found');
    }
    res.send(research);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get("/researchtext", async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const researchText = await ResearchData.findOne({ userId: userId });

    if (!researchText) {
      console.error("Research data not found for userId:", userId);
      // Return dummy data
      const dummyData = {
        _id: null,
        userId: userId,
        SciArticlesSize: 0,
        WosArticlesSize: 0,
        ProposalsSize: 0,
        PapersSize: 0,
        BooksSize: 0,
        ChaptersSize: 0,
        PGrantedSize: 0,
        PFiledSize: 0,
        SciMarks: 0,
        WosMarks: 0,
        ProposalMarks: 0,
        PapersMarks: 0,
        BooksMarks: 0,
        ChaptersMarks: 0,
        PGrantedMarks: 0,
        PFiledMarks: 0,
        SelfAssessment: 0,
      };
      return res.status(200).json(dummyData);
    }

    // Calculate array sizes safely
    const SciArticlesSize = researchText.SciArticles?.length || 0;
    const WosArticlesSize = researchText.WosArticles?.length || 0;
    const ProposalsSize = researchText.Proposals?.length || 0;
    const PapersSize = researchText.Papers?.length || 0;
    const BooksSize = researchText.Books?.length || 0;
    const ChaptersSize = researchText.Chapters?.length || 0;
    const PGrantedSize = researchText.PGranted?.length || 0;
    const PFiledSize = researchText.PFiled?.length || 0;

    // Calculate marks (apply min where needed)
    const PapersMarks = PapersSize * 5;
    const BooksMarks = BooksSize * 10;
    const ChaptersMarks = ChaptersSize * 5;
    const PGrantedMarks = PGrantedSize * 10;
    const PFiledMarks = PFiledSize * 5;
    const SciMarks = Math.min(SciArticlesSize * 20, 30);
    const WosMarks = Math.min(WosArticlesSize * 10, 30);
    const ProposalMarks = Math.min(ProposalsSize * 10, 10);
    const SelfAssessment = Math.min(PapersMarks + BooksMarks + ChaptersMarks + PGrantedMarks + PFiledMarks, 10);

    // Update user marks
    user.ResearchSelfAsses = SelfAssessment;
    user.WosMarks = WosMarks;
    user.SciMarks = SciMarks;
    user.ProposalMarks = ProposalMarks;
    await user.save(); // Ensure this is awaited

    // Construct response object
    const responseData = {
      _id: researchText._id,
      userId: researchText.userId,
      SciArticlesSize,
      WosArticlesSize,
      ProposalsSize,
      PapersSize,
      BooksSize,
      ChaptersSize,
      PGrantedSize,
      PFiledSize,
      SciMarks,
      WosMarks,
      ProposalMarks,
      PapersMarks,
      BooksMarks,
      ChaptersMarks,
      PGrantedMarks,
      PFiledMarks,
      SelfAssessment,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching research text:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});











router.post("/sciarticles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const articleData = req.body;

    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        SciArticles: [articleData]
      });
    } else {
      researchEntry.SciArticles.push(articleData);
    }

    // Save the updated document
    await researchEntry.save();

    // Log the creation operation
    await logCreateOperation(
      userId,
      researchEntry._id,
      'Research.SciArticle',
      articleData
    );

    res.status(201).json({ message: "Article added successfully!", data: researchEntry });
  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/sciarticles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.SciArticles);
  } catch (error) {
    console.error("Error while fetching SCI articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/sciarticles/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = parseInt(req.params.index, 10);

    const researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry || !researchEntry.SciArticles || index >= researchEntry.SciArticles.length) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Store the article to be deleted for logging
    const deletedArticle = researchEntry.SciArticles[index];

    // Remove the article
    researchEntry.SciArticles.splice(index, 1);
    await researchEntry.save();

    // Log the deletion with complete data
    await logDeleteOperation(
      userId,
      researchEntry._id,
      'Research.SciArticle',
      deletedArticle
    );

    res.status(200).json({ message: "Article deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting SCI article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/sciarticles/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = parseInt(req.params.index, 10);
    const updatedData = req.body;

    const researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry || !researchEntry.SciArticles || index >= researchEntry.SciArticles.length) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Store the original article for logging
    const originalArticle = researchEntry.SciArticles[index];

    // Update the article
    researchEntry.SciArticles[index] = updatedData;
    await researchEntry.save();

    // Log the update with both original and updated data
    await logUpdateOperation(
      userId,
      researchEntry._id,
      'Research.SciArticle',
      originalArticle,
      updatedData
    );

    res.status(200).json({ message: "Article updated successfully!" });
  } catch (error) {
    console.error("Error while updating SCI article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})







router.post("/wosarticles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { articleDetails, ISSN, authorPosition } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        WosArticles: [{ articleDetails, ISSN, authorPosition }]
      });
    } else {
      researchEntry.WosArticles.push({ articleDetails, ISSN, authorPosition });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.get("/wosarticles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.WosArticles);
  } catch (error) {
    console.error("Error while fetching Wos articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/wosarticles/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.WosArticles.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Article deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Wos article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/wosarticles/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.WosArticles[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Article updated successfully!" });
  } catch (error) {
    console.error("Error while updating Wos article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})










router.post("/proposals/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { proposalDetails, fundingAgency, amount } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Proposals: [{ proposalDetails, fundingAgency, amount }]
      });
    } else {
      researchEntry.Proposals.push({ proposalDetails, fundingAgency, amount });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.get("/proposals/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.Proposals);
  } catch (error) {
    console.error("Error while fetching Proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/proposals/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Proposals.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Proposal deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/proposals/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Proposals[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Proposal updated successfully!" });
  } catch (error) {
    console.error("Error while updating Proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})







router.post("/books/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bookDetails, ISBN } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Books: [{ bookDetails, ISBN }]
      });
    } else {
      researchEntry.Books.push({ bookDetails, ISBN });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.get("/books/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.Books);
  } catch (error) {
    console.error("Error while fetching Books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/books/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Books.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/books/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Books[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Book updated successfully!" });
  } catch (error) {
    console.error("Error while updating Book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})







router.post("/chapters/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { chapterDetails, Publisher, ISBN, authorPosition } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Chapters: [{ chapterDetails, Publisher, ISBN, authorPosition }]
      });
    } else {
      researchEntry.Chapters.push({ chapterDetails, Publisher, ISBN, authorPosition });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.get("/chapters/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.Chapters);
  } catch (error) {
    console.error("Error while fetching Chapters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/chapters/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Chapters.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Chapter deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Chapter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/chapters/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Chapters[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Chapter updated successfully!" });
  } catch (error) {
    console.error("Error while updating Chapter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})











router.post("/conference/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { conferenceDetails, conferenceName, conferenceDate } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Conference: [{ conferenceDetails, conferenceName, conferenceDate }]
      });
    } else {
      researchEntry.Conference.push({ conferenceDetails, conferenceName, conferenceDate });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });
  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.get("/conference/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });
    res.status(200).json(researchEntry.Conference);
  } catch (error) {
    console.error("Error while fetching Conference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/conference/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Conference.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Conference deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Conference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/conference/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Conference[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Conference updated successfully!" });
  } catch (error) {
    console.error("Error while updating Conference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

















router.post("/addpfiled", async (req, res) => {
  try {
    const userId = req.user._id;
    const { PTitle, PNumber, FiledinCountry, PublishedDate } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        PFiled: [{ PTitle, PNumber, FiledinCountry, PublishedDate }]
      });
    } else {
      researchEntry.PFiled.push({ PTitle, PNumber, FiledinCountry, PublishedDate });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})









router.get("/proposals/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });

    if (!researchEntry || researchEntry.Proposals.length === 0) {
      return res.status(404).json({ message: "No Proposals found" });
    }

    res.status(200).json(researchEntry.Proposals);
  } catch (error) {
    console.error("Error fetching Proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/proposals/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { proposalDetails, fundingAgency, amount } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Proposals: [{ proposalDetails, fundingAgency, amount }]
      });
    } else {
      researchEntry.Proposals.push({ proposalDetails, fundingAgency, amount });
    }
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });
  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/proposals/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Proposals[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Proposal updated successfully!" });
  } catch (error) {
    console.error("Error while updating Proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

router.delete("/proposals/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Proposals.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Proposal deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})























router.post("/pfiled/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { PTitle, PNumber, FiledinCountry, PublishedDate } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        PFiled: [{ PTitle, PNumber, FiledinCountry, PublishedDate }]
      });
    } else {
      researchEntry.PFiled.push({ PTitle, PNumber, FiledinCountry, PublishedDate });
    }
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });
  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})









router.get("/papers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });

    if (!researchEntry || researchEntry.Papers.length === 0) {
      return res.status(404).json({ message: "No papers found" });
    }

    res.status(200).json(researchEntry.Papers);
  } catch (error) {
    console.error("Error fetching Papers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/papers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { paperDetails, authorPosition } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        Papers: [{ paperDetails, authorPosition }]
      });
    } else {
      researchEntry.Papers.push({ paperDetails, authorPosition });
    }

    // Save the updated document
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/papers/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Papers[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Paper updated successfully!" });
  } catch (error) {
    console.error("Error while updating Paper:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/papers/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.Papers.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Paper deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Paper:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})























router.get("/pgranted/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });

    if (!researchEntry || researchEntry.PGranted.length === 0) {
      return res.status(404).json({ message: "No Patents Granted found" });
    }

    res.status(200).json(researchEntry.PGranted);
  } catch (error) {
    console.error("Error fetching Patents Granted:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/pgranted/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { PTitle, PNumber, CountryGranted, GrantedDate } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        PGranted: [{ PTitle, PNumber, CountryGranted, GrantedDate }]
      });
    } else {
      researchEntry.PGranted.push({ PTitle, PNumber, CountryGranted, GrantedDate });
    }

    // Save the updated document    
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/pgranted/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.PGranted[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Patent Granted updated successfully!" });
  } catch (error) {
    console.error("Error while updating Patent Granted:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/pgranted/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.PGranted.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Patent Granted deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Patent Granted:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})












router.get("/pfiled/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const researchEntry = await ResearchData.findOne({ userId });

    if (!researchEntry || researchEntry.PFiled.length === 0) {
      return res.status(404).json({ message: "No Patents Filed found" });
    }

    res.status(200).json(researchEntry.PFiled);
  } catch (error) {
    console.error("Error fetching Patents Filed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/pfiled/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { PTitle, PNumber, FiledinCountry, PublishedDate } = req.body;
    let researchEntry = await ResearchData.findOne({ userId });
    if (!researchEntry) {
      researchEntry = new ResearchData({
        userId,
        PFiled: [{ PTitle, PNumber, FiledinCountry, PublishedDate }]
      });
    } else {
      researchEntry.PFiled.push({ PTitle, PNumber, FiledinCountry, PublishedDate });
    }

    // Save the updated document  
    await researchEntry.save();
    res.status(201).json({ message: "Article added successfully!", data: researchEntry });

  } catch (error) {
    console.error("Error while adding article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/pfiled/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.PFiled[index] = req.body;
    await researchEntry.save();
    res.status(200).json({ message: "Patent Filed updated successfully!" });
  } catch (error) {
    console.error("Error while updating Patent Filed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.delete("/pfiled/:userId/:index", async (req, res) => {
  try {
    const userId = req.params.userId;
    const index = req.params.index;
    const researchEntry = await ResearchData.findOne({ userId });
    researchEntry.PFiled.splice(index, 1);
    await researchEntry.save();
    res.status(200).json({ message: "Patent Filed deleted successfully!" });
  } catch (error) {
    console.error("Error while deleting Patent Filed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
















router.get("/getdata", async (req, res) => {
  try {
    const UserId = req.query.userId;
    const user = await User.findById({ _id: UserId });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const responseData = {
      CouAvgPerMarks: user.CouAvgPerMarks,
      CoufeedMarks: user.CoufeedMarks,
      ProctoringMarks: user.ProctoringMarks,
      SciMarks: user.SciMarks,
      WosMarks: user.WosMarks,
      ProposalMarks: user.ProposalMarks,
      ResearchSelfAssesMarks: user.ResearchSelfAsses,
      WorkSelfAssesMarks: user.WorkSelfAsses,
      OutreachSelfAssesMarks: user.OutreachSelfAsses,
      AddSelfAssesMarks: user.AddSelfAsses,
      SpecialSelfAssesMarks: user.SpeacialSelfAsses,
    };
    console.log(responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching Data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})



module.exports = router;