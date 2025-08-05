const startScreen = document.getElementById('start-screen');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const dashu = document.getElementById('dashu');
const amount = document.getElementById('amount');
const ranger = document.getElementById('ranger');

const quizScreen = document.getElementById('quiz-screen');
const questionText = document.getElementById('question');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestion = document.getElementById('total-question');
const scoreSpan = document.getElementById('score');
const answerContainer = document.getElementById('answer-container');
const progressBar = document.getElementById('progress');
const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const resultMsg = document.getElementById('result-msg');

const resultScreen = document.getElementById('result-screen');

const startbtn = document.getElementById('start-btn');
const restartbtn = document.getElementById('restart-btn');


var quizQuestions = []
var categoryValue = 0;
var difficultyValue = '';
var amountValue = 5;

category.addEventListener('change', valChecker);
difficulty.addEventListener('change', difChecker);
amount.addEventListener('input', (e) => {
    let val = e.target.value;
    ranger.textContent = val;
    amountValue = val;
});


function valChecker(event) {
    val = event.target.options[event.target.selectedIndex].value;
    text = event.target.options[event.target.selectedIndex].text;
    categoryValue = val
    dashu.classList.add('active')
    dashu.textContent = text;
    console.log(categoryValue)
}
function difChecker(event) {
    val = event.target.options[event.target.selectedIndex].value;
    text = event.target.options[event.target.selectedIndex].text;
    difficultyValue = val
    console.log(difficultyValue)
}


async function getQuiz() {
    quizQuestions.length = 0;
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${amountValue}&category=${categoryValue}&difficulty=${difficultyValue}&type=multiple`)
        if (!response.ok) {
            throw new Error("Network error");
        }
        const data = await response.json();
        data.results.forEach((element) => {
            qust = element.question;
            answerss = element.incorrect_answers;
            corect = element.correct_answer;
            answerss.push(corect);
            answerss.sort(function (a, b) {
                return Math.random() - 0.5;
            });
            res = orderAnswers(answerss, corect);
            quizQuestions.push({ question: decodeHTML(qust), answers: res });

        });

        return true;
    } catch (err) {
        console.error("Fetch error:", err);
        return false;
    }
}

async function checkStatus() {
    if (categoryValue == 0) return;
    else if (difficultyValue == "") return;
    startbtn.disabled = true;
    const loaded = await getQuiz();
    console.log(loaded)
    if (loaded && quizQuestions.length > 0) {
        totalQuestion.textContent = quizQuestions.length;
        maxScore.textContent = quizQuestions.length;
        startQuiz();
        console.log("success")
    } else {
        alert("Failed to load quiz. Please check your internet connection.");
        startbtn.disabled = false;
    }
}


function orderAnswers(ans, cor) {
    res = []
    ans.forEach((ele) => {
        ele = decodeHTML(ele);
        obj = {};
        obj.text = ele;
        if (ele === cor) obj.correct = true;
        else obj.correct = false;
        res.push(obj)
    })
    return res
}
/*
const quizQuestions=[
    {
        question:"Inside which HTML element do we put the JavaScript?",
        answers:[
            {text:'<scripting>', correct:false},
            {text:'<js>', correct:false},
            {text:'<javascript>', correct:false},
            {text:'<script>', correct:true},
        ]
    },
    {
        question:"What is the correct JavaScript syntax to change the content of the HTML element below?",
        answers:[
            {text:'document.getElementByName("p").innerHTML = "Hello World!";', correct:false},
            {text:'document.getElement("p").innerHTML = "Hello World!";', correct:false},
            {text:'#demo.innerHTML = "Hello World!";', correct:false},
            {text:'document.getElementById("demo").innerHTML = "Hello World!";', correct:true},
        ]
    },
    {
        question:"How to write an IF statement in JavaScript?",
        answers:[
            {text:'if (i == 5)', correct:true},
            {text:'if i == 5 then', correct:false},
            {text:'if i = 5 then', correct:false},
            {text:'if i = 5', correct:false},
        ]
    },
    {
        question:"What type of a language is HTML?",
        answers:[
            {text:'Programming Language', correct:false},
            {text:'Markup Language', correct:true},
            {text:'Scripting Language', correct:false},
            {text:'Network Protocol', correct:false},
        ]
    },
    {
        question:"What tag is used to display a picture in a HTML page?",
        answers:[
            {text:'src', correct:false},
            {text:'image', correct:false},
            {text:'picture', correct:false},
            {text:'img', correct:true},
        ]
    },
];
*/

let score = 0;
let currentQuestionIndex = 0;
let answerDisable = false

startbtn.addEventListener('click', checkStatus);
restartbtn.addEventListener('click', restartQuiz);



function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function startQuiz() {
    startbtn.disabled = false;
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = score;

    startScreen.classList.remove('active');
    quizScreen.classList.add('active')

    showQuestion();
}

function showQuestion() {
    answerDisable = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    progress = (currentQuestionIndex / quizQuestions.length) * 100;
    //console.log(progress)
    progressBar.style.width = progress + "%"

    questionText.textContent = currentQuestion.question;

    answerContainer.innerHTML = '';

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement('button');
        button.classList.add('answer-btn');
        button.textContent = answer.text;

        button.dataset.correct = answer.correct;

        button.addEventListener('click', selectAnswer);

        answerContainer.appendChild(button)
    })
}

function selectAnswer(e) {
    if (answerDisable) return;
    answerDisable = true;

    const selectedbtn = e.target;
    const isCorrect = selectedbtn.dataset.correct === "true";

    Array.from(answerContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            //console.log(button.dataset.correct)
            button.classList.add('correct');
        } else if (button == selectedbtn) {
            button.classList.add('incorrect')
        }
    });

    if (isCorrect) {
        score++;
        scoreSpan.textContent = score
    };

    let curo = currentQuestionIndex + 1
    if (curo == quizQuestions.length) {
        progress = (curo / quizQuestions.length) * 100;
        progressBar.style.width = progress + "%";
    }

    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();

        } else {
            showResult();
        };
    }, 1000);

}

function showResult() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    finalScore.textContent = score;

    let scorep = (score / quizQuestions.length) * 100


    switch (true) {
        case (scorep == 100):
            resultMsg.textContent = "Perfect! You're a genius";
            break;
        case (scorep >= 80):
            resultMsg.textContent = "Great! You know what you do";
            break;
        case (scorep >= 60):
            resultMsg.textContent = "Good effort! Keep it up";
            break;
        case (scorep >= 40):
            resultMsg.textContent = "Not bad! Try again to improve";
            break;
        default:
            resultMsg.textContent = "Keep studying! You will get better!"
    }
}

function restartQuiz() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    amount.value = 5;
    ranger.textContent = 5;
}