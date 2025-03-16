const mongoose = require('mongoose');
const Research = require('./models/research'); // Adjust the path as necessary

const createResearchEntries = async () => {
    try {
        const userId = new mongoose.Types.ObjectId(); // Replace with actual user ID if needed

        const researchData = {
            userId,
            SciArticles: [
                {
                    articleDetails: 'Scientific Article 1',
                    ISSN: '1234-5678',
                    authorPosition: 'First Author',
                },
                {
                    articleDetails: 'Scientific Article 2',
                    ISSN: '8765-4321',
                    authorPosition: 'Co-Author',
                },
            ],
            WosArticles: [
                {
                    articleDetails: 'WOS Article 1',
                    ISSN: 12345678,
                    authorPosition: 'First Author',
                },
                {
                    articleDetails: 'WOS Article 2',
                    ISSN: 87654321,
                    authorPosition: 'Co-Author',
                },
            ],
            Proposals: [
                {
                    proposalDetails: 'Proposal 1',
                    fundingAgency: 'Agency A',
                    amount: 5000,
                },
                {
                    proposalDetails: 'Proposal 2',
                    fundingAgency: 'Agency B',
                    amount: 10000,
                },
            ],
            Papers: [
                {
                    paperDetails: 'Paper 1',
                    authorPosition: 'First Author',
                },
                {
                    paperDetails: 'Paper 2',
                    authorPosition: 'Co-Author',
                },
            ],
            Books: [
                {
                    bookDetails: 'Book 1',
                    ISBN: 1234567890,
                },
                {
                    bookDetails: 'Book 2',
                    ISBN: 9876543210,
                },
            ],
            Chapters: [
                {
                    chapterDetails: 'Chapter 1',
                    Publisher: 'Publisher A',
                    ISBN: 1234567890,
                    authorPosition: 'First Author',
                },
                {
                    chapterDetails: 'Chapter 2',
                    Publisher: 'Publisher B',
                    ISBN: 9876543210,
                    authorPosition: 'Co-Author',
                },
            ],
            PGranted: [
                {
                    PTitle: 'Patent Granted 1',
                    PNumber: 123456,
                    CountryGranted: 'Country A',
                    GrantedDate: new Date('2023-01-01'),
                },
                {
                    PTitle: 'Patent Granted 2',
                    PNumber: 654321,
                    CountryGranted: 'Country B',
                    GrantedDate: new Date('2023-02-01'),
                },
            ],
            PFiled: [
                {
                    PTitle: 'Patent Filed 1',
                    PNumber: 123456,
                    FiledinCountry: 'Country A',
                    PublishedDate: new Date('2023-03-01'),
                },
                {
                    PTitle: 'Patent Filed 2',
                    PNumber: 654321,
                    FiledinCountry: 'Country B',
                    PublishedDate: new Date('2023-04-01'),
                },
            ],
        };

        const researchEntry = new Research(researchData);
        await researchEntry.save();
        console.log('Research data inserted successfully!');
    } catch (error) {
        console.error('Error inserting research data:', error);
    } finally {
        mongoose.connection.close();
    }
};

module.exports = {
    createResearchEntries
};
