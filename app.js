var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');
var inquirer = require('inquirer');
var fs = require('fs');

inquirer.prompt([{
    name: 'command',
    message: 'Would you like to review your flashcards or create a new one?',
    type: 'list',
    choices: [{
        name: 'create-new-flashcard'
    },{
        name: 'show-basic-cards'
    },{
        name: 'show-cloze-cards'
    }]
}]).then(function(answer) {
    if (answer.command === 'create-new-flashcard') {
        createCard();
    } else if (answer.command === 'show-basic-cards') {
        showBasicCards();
    } else if (answer.command === 'show-cloze-cards') {
        showClozeCards();
    }
});

function createCard() {
    inquirer.prompt([{
        name: 'cardType',
        message: 'What kind of flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'basic-flashcard'
        }, {
            name: 'cloze-flashcard'
        }]
    }]).then(function(answer) {
        if (answer.cardType === 'basic-flashcard') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?'
            }, {
                name: 'back',
                message: 'What is the answer?'
            }]).then(function(answer) {
                var newBasic = new BasicCard(answer.front, answer.back);
                newBasic.create();
                menuScreen();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?'
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?'
            }]).then(function(answer) {
                var newCloze = new ClozeCard(answer.text, answer.cloze);
                newCloze.create();
                menuScreen();
            });
        }
    });
};

function showBasicCards() {
    fs.readFile('./basicquestions.txt', 'utf8', function(error, data) {
    if (error) {
            console.log(error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

function showClozeCards() {
    fs.readFile('./clozequestions.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        }
        var questions = data.split(';');
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

function showQuestion(array, index) {
    question = array[index];
    var parsedQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.clozeDeleted;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('Correct!');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        } else {
            console.log('Wrong!');
            if (index < array.length - 1) {
              showQuestion(array, index + 1);
            }
        }
    });
};

function menuScreen() {
    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'create-new-flashcard'
        }, {
            name: 'show-basic-cards'
        },{
            name: 'show-cloze-cards'
        },{
            name: 'nothing'
        }]
    }]).then(function(answer) {
        if (answer.nextAction === 'create-new-flashcard') {
            createCard();
        } else if (answer.nextAction === 'show-basic-cards') {
            showBasicCards();
        } else if (answer.nextAction === 'show-cloze-cards') {
            showClozeCards();
        } else if (answer.nextAction === 'nothing') {
            return;
        }
    });
};