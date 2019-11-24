/*
* main.js 
*/

/* 
opentrivia first version - fetch api
$(document).ready(function () {
    OpenTrivia.initializeApp();
});
 */


let categories = []
let questions = []
const numQuestionsFetch = 5
let numQuestions = 0
let iQuestion = 0
let iRight = 0
let score = 0

/**
 * fetch categories from OpenTrivia
 */
const fetchCategories = function () {
    
    return new Promise((resolve, reject) => {

        const URL_CATEGORIES =  "https://opentdb.com/api_category.php"
        //const URL_CATEGORIES = "./categories.json"
        console.log('going to fetch categories: ' + URL_CATEGORIES)
        fetch(URL_CATEGORIES).then(response => {
            console.debug("response" + response)
            return response.json()
        }).then(json => {
            console.debug("JSON:" + json)
            categories = json.trivia_categories;
            resolve(categories)
        }).catch(error => {
            reject("Error retrieving categories: " + error.message);
        })
    })
}

/**
 * fetch questions from OpenTrivia
 * @param {*} category 
 * @param {*} difficulty
 * @param {*} num 
 */
const fetchQuestions = function (category, difficulty, num) {

    return new Promise((resolve, reject) => {

        const URL_QUESTION = "https://opentdb.com/api.php"
        //const URL_QUESTION = "./question.json"
        
        // ToDo: first fetch the number of avail quetions; not for all difficulty and category there are 10!
        console.log(`going to fetch ${num} questions with difficulty ${difficulty} for category ${category}`)
        let url = URL_QUESTION + `?amount=${num}&category=${category}&difficulty=${difficulty}&type=multiple`
        fetch(url).then(response => {
            console.debug('got response from: ' + url)
            return response.json()
        }).then(json => {
            console.debug("JSON:" + json)
            questions = json.results
            numQuestions = questions.length
            resolve(json.results)
        }).catch(error => {
            reject("Error retrieving questions: " + error.message)
        })
    })
}


/**
 * init app 
 */
const initializeApp = function () {

    console.log('initialize app using categories promise')

    fetchCategories().then(result => {

        console.log('got result :' + result)
        console.dir(categories)
        initializeCategorySelection('#category', categories)
        startNewGame()

    }).catch(rejected => {
        console.error('not resolved, some problem occured: ' + rejected)
    })
}

/**
 * initialize categories selection
 * @param {*} id 
 * @param {*} categories 
 */
const initializeCategorySelection = function (id, categories) {
    categories.forEach(cat => {
        $(id).append('<option value="' + cat.id + '">' + cat.name + '</option>')
    });
}

const startNewGame = function () {

    fetchQuestions($('#category').val(), $('#difficulty').val(), numQuestionsFetch).then(questions => {
        console.log('got questions ..')
        console.dir(questions)
        iQuestion = 0
        updateQuestionForm(questions[iQuestion])
    }).catch(rejected => {
        console.error('not resolved, some problem occured: ' + rejected)
    })
}

const updateQuestionForm = function (question) {
    $(".question_and_anwers").fadeOut(1500)
    // ToDo wait until faded out ... next question is already visible
    $('#question').html(question['question']);
    iRight = getRandomInt(4)
    var iwrong = 0
    for (var i = 0; i < 4; i++) {
        if (i == iRight) {
            $("#labela" + i).html(question['correct_answer'])
        } else {
            $("#labela" + i).html(question['incorrect_answers'][iwrong++])
        }
    }
    $('#info').html( `${iQuestion + 1}/${numQuestions}`)
    $(".question_and_anwers").fadeIn(1500)
}

const getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const handleRadioClicked = function (event) {
    elem = $(this)
    console.debug("radio clicked: " + iRight + ' t:' + event.target.id + ' ct:' + event.currentTarget.id)
    if ("a"+iRight == event.currentTarget.id) {
        $("#answer_correct").show();
        score += 1;
    } else {
        $("#answer_wrong").show();
    }
    $('#score').html(score)
}

const handleBtnStartClicked = function() {
    console.debug("button start clicked")
    startNewGame()
}

const handleBtnNextQuestion = function (event) {
    console.log("button next clicked")
    $("[id^=answer]").hide()
    if (++iQuestion < numQuestions -1) {
        updateQuestionForm(questions[iQuestion])
    }
}

/**
 * on document ready
 */
$(document).ready(function () {
    console.log('document ready ' + this)

    $(".question_and_anwers").hide()
    $("[id^=answer]").hide()
    initializeApp()
    $(".answerline").on("click", handleRadioClicked)
    $("#btn_next_question").click(handleBtnNextQuestion)
    $("#btn_start_quiz").click(handleBtnStartClicked)

})