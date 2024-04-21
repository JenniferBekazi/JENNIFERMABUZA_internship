

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://mabuzajennifer:Killer13.@cluster0.l63rwky.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose Schema
const surveySchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteFoods: [String],
    ratings: Number,
    ratingsTV:  [String],
    ratingsRadio: [String],
    ratingsEatOut: [String],
    ratingsMovie: [String],
});

const Survey = mongoose.model('Survey', surveySchema);

// Survey Form Route
app.get('/', (req, res) => {
    res.render('survey');
});

// Submit Survey Route
app.post('/submit-survey', (req, res) => {
    const newSurvey = new Survey({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        favoriteFoods: req.body.food.split(','),
        ratings: req.body.rating,
        ratingsMovie: req.body.ratingMovie.split(','),
        ratingsTV: req.body.ratingTV.split(','),
        ratingsRadio: req.body.ratingRadio.split(','),
        ratingsEatOut: req.body.ratingEatOut.split(','),

    });

    newSurvey.save().then(() => res.send("Thank you for your response!  ") );
});

// Results Route
app.get('/results', async (req, res) => {
    try {
        const surveys = await Survey.find();
        if (surveys.length === 0) {
            res.render('results', { dataAvailable: false });
        } else {
            const totalSurveys = surveys.length;
            const averageAge = surveys.reduce((sum, survey) => sum + survey.age, 0) / totalSurveys;
            const oldest = Math.max(...surveys.map(s => s.age));
            const youngest = Math.min(...surveys.map(s => s.age));
            const likesPizzaCount = surveys.filter(s => s.favoriteFoods.includes("Pizza")).length;
            const likesPastaCount = surveys.filter(s => s.favoriteFoods.includes("Pasta")).length;
            const likesPapWorsCount = surveys.filter(s => s.favoriteFoods.includes("Pap and Wors")).length;
            const percentageLikesPizza = (likesPizzaCount / totalSurveys) * 100;
            const percentageLikesPasta = (likesPastaCount / totalSurveys) * 100;
            const percentageLikesPapWors = (likesPapWorsCount / totalSurveys) * 100;
            const averageRating = surveys.reduce((sum, survey) => sum + survey.ratings, 0) / totalSurveys;
            const averageRatingMovies = surveys.filter(s => s.ratingsMovie.includes("Strongly Agree")).length;
            const averageRatingRadio = surveys.filter(s =>  s.ratingsRadio.includes("Agree")).length;
            const averageRatingEatOut = surveys.filter(s => s.ratingsEatOut.includes("Neutral")).length;
            const averageRatingTV = surveys.filter(s => s.ratingsTV.includes("Disagree")).length;

            res.render('results', {
                dataAvailable: true,
                totalSurveys,
                averageAge,
                oldest,
                youngest,
                percentageLikesPizza,
                percentageLikesPasta,
                percentageLikesPapWors,
                averageRatingMovies,
                averageRatingRadio,
                averageRatingEatOut,
                averageRatingTV,

                averageRating
            });
        }
    } catch (err) {
        res.status(500).send("Error retrieving data");
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
