/**
 * opentrivia.js 
 */
var OpenTrivia = {

    /** selectable question categories */
    categories: [],
    /** rivia questions */
    questions: [],
    /**current question */
    iQuestion : 0,
    /** number of avail quetions fetched */
    nQuestions : 1,
    /** index of the correct answer - for multiple choice question, 0,1,2,3 */
    iRight : 0,

    initializeApp: function () {
        console.debug("Initialize app ..");
 

        this.fetchCategories();
        this.initializeCategories();
        this.iQuestion = 0;

        $(".answer").on("click", this.handleRadioClicked);


  /*       $(".answer").on("click", function () {
            console.log("event object:");
            console.dir(event);
            var elem = $(this);
            OpenTrivia.handleRadioClicked(elem);
        }); */
    },

    /**
     * fetch available qhestion categories
     */
    fetchCategories: function () {
        //const url = "https://opentdb.com/api_category.php";
        const url = "./categories.json";  // mock
        console.debug("going to fetch " + url);
        fetch(url).
            then(response => {
                console.debug("response" + response);
                response.json().then(json => {
                    console.debug("JSON:" + json);
                    this.categories = json["trivia_categories"];
                    this.initializeCategories();
                    this.fetchQuestions(
                        $('#category').val(),
                        $('#difficulty').val()
                    );
                }
                )
            }).catch(error => {
                console.error("Error retrieving categories: " + error.message);
            });
    },

    /**
     * initialize categories selection
     */
    initializeCategories: function () {
        this.categories.forEach(cat => {
            console.log("category: " + cat.id + ": " + cat.name);
            $("#category").append('<option value="' + cat.id + '">' + cat.name + '</option>')
        });
    },

    /**
     * fetch questions from opentrivia
     * @param {*} category 
     * @param {*} difficulty 
     */
    fetchQuestions: function (category, difficulty) {
        console.debug("fetch question cat: " + category + " difficulty: " + difficulty);
        //const url = "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple";
        const url = "./question.json";  // mock
        console.debug("going to fetch " + url);
        fetch(url).
            then(response => {
                response.json().then(json => {
                    console.debug("JSON:" + json);
                    this.questions = json["results"];
                    this.iQuestion = 0;
                    this.updateQuestionForm(this.iQuestion);
                }
                )
            }).catch(error => {
                console.error("Error retrieving questions: " + error.message);
            });
    },

    /**
     * update the questions form with question[i]
     * @param {*} i 
     */
    updateQuestionForm: function(i) 
    {
        var question = this.questions[i];
        $('#question').html(question['question']);
        this.iRight = this.getRandomInt(4);
        var iwrong = 0;
        for (var i = 0; i < 4; i++) {
            if (i == this.iRight) {
                $("#labela"+i).html(question['correct_answer']);
            } else {
                $("#labela"+i).html(question['incorrect_answers'][iwrong++]);
            }
        }
        $(".quiz").fadeIn(2000);
    },
    
    getRandomInt: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    handleRadioClicked: function(elem) {
        elem = $(this)
        console.debug("radio clicked: " + OpenTrivia.iRight + ' ' + elem.val());
        if (OpenTrivia.iRight == elem.val()) {
            $("#answer_correct").show();
        } else {
            $("#answer_wrong").show();
        }
    }
    
};

var OpenTrivia = OpenTrivia || {};


