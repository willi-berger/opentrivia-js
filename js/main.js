/*
* main.js 
*/

/* 
opentrivia first version - fetch api
$(document).ready(function () {
    OpenTrivia.initializeApp();
});
 */

const URL_CATEGORIES =  "https://opentdb.com/api_category.php"
//const URL_CATEGORIES = "./categories.json"
const URL_QUESTION = "https://opentdb.com/api.php"
//const URL_QUESTION = "./question.json"
let categories = []
let questions = []
let numQuestions = 0
let iQuestion = 0
let iRight = 0
let score = 0

/**
 * fetch categories from OpenTrivia
 */
const fetchCategories = function () {
    
    return new Promise((resolve, reject) => {

        console.log('going to fetch categories')
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
        console.log(`going to fetch ${num} questions with difficulty ${difficulty} for category ${category}`)
        let url = URL_QUESTION + `?amount=${num}&category=${category}&difficulty=${difficulty}&type=multiple`
        fetch(url).then(response => {
            console.debug('got response from: ' + url)
            return response.json()
        }).then(json => {
            console.debug("JSON:" + json)
            questions = json.results
            numQuestions = questions.length
            iQuestion = 1
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

        // fetch the first questions for selected category and difficulty
        return fetchQuestions($('#category').val(), $('#difficulty').val(), 10)

    }).then(questions => {
        console.log('got questions ..')
        console.dir(questions)
        $('#info').html( `${iQuestion}/${numQuestions}`)
        updateQuestionForm(questions[0])

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

const updateQuestionForm = function (question) {

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
    $(".quiz").fadeIn(2000)
}

const getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const handleRadioClicked = function (event) {
    elem = $(this)
    console.debug("radio clicked: " + iRight + ' ' + elem.val());
    if (iRight == elem.val()) {
        $("#answer_correct").show();
        score += 1;
    } else {
        $("#answer_wrong").show();
    }
    $('#score').html(score)
}

const handleBtnNextQuestion = function (event) {
    console.log("button next clicked")
}

/**
 * on document ready
 */
$(document).ready(function () {
    console.log('document ready ' + this)

    $(".quiz").hide()
    $("[id^=answer]").hide()
    initializeApp()
    $(".answer").on("click", handleRadioClicked)
    $("#btn_next_question").click(handleBtnNextQuestion)

})