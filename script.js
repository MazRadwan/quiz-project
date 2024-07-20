let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestionCount = 0;
let userAnswers = [];

function startQuiz() {
  selectedQuestionCount = document.getElementById("questionCount").value;
  fetch("data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questions = shuffleArray(data).slice(0, selectedQuestionCount);
      document.getElementById("home").style.display = "none";
      document.getElementById("quiz").style.display = "block";
      updateScoreTracker();
      showQuestion();
    });
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").innerText = question.question;
  document.getElementById("module-badge").innerText = question.module;
  const options = document.getElementById("options");
  options.innerHTML = "";
  question.options.forEach((option, index) => {
    const inputType = question.answer.length > 1 ? "checkbox" : "radio";
    const label = document.createElement("label");
    label.innerHTML = `<input type="${inputType}" name="option" value="${index}" onchange="limitSelection(${question.answer.length})"> ${option}`;
    options.appendChild(label);
  });
  document.getElementById("feedback").innerText = ""; // Clear feedback
}

function limitSelection(maxSelections) {
  const selectedOptions = document.querySelectorAll(
    'input[name="option"]:checked'
  );
  if (selectedOptions.length > maxSelections) {
    selectedOptions[selectedOptions.length - 1].checked = false;
    alert(`You can only select up to ${maxSelections} options.`);
  }
}

function submitAnswer() {
  const selectedOptions = document.querySelectorAll(
    'input[name="option"]:checked'
  );
  if (selectedOptions.length === 0) {
    alert("Please select an answer");
    return;
  }

  const selectedAnswers = Array.from(selectedOptions).map((option) =>
    parseInt(option.value)
  );
  const correctAnswers = Array.isArray(questions[currentQuestionIndex].answer)
    ? questions[currentQuestionIndex].answer
    : [questions[currentQuestionIndex].answer];

  const isCorrect = arraysEqual(selectedAnswers.sort(), correctAnswers.sort());
  userAnswers.push({
    question: questions[currentQuestionIndex].question,
    module: questions[currentQuestionIndex].module,
    isCorrect: isCorrect,
  });

  if (isCorrect) {
    score++;
    document.getElementById("feedback").innerText = "Correct!";
  } else {
    document.getElementById("feedback").innerText = "Wrong!";
  }

  currentQuestionIndex++;
  updateScoreTracker();
  if (currentQuestionIndex < questions.length) {
    setTimeout(showQuestion, 1000); // Show next question after 1 second delay
  } else {
    setTimeout(showResults, 1000); // Show results after 1 second delay
  }
}

function showResults() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("results").style.display = "block";
  document.getElementById(
    "score"
  ).innerText = `${score} / ${selectedQuestionCount}`;

  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";
  userAnswers.forEach((answer) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    const resultIcon = answer.isCorrect ? "🟢" : "🔴";
    resultItem.innerHTML = `<div><strong>Question:</strong> ${answer.question}</div>
                                <div><strong>Module:</strong> ${answer.module}</div>
                                <div><strong>Result:</strong> ${resultIcon}</div>`;
    resultsContainer.appendChild(resultItem);
  });
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("results").style.display = "none";
  document.getElementById("home").style.display = "block";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function arraysEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function updateScoreTracker() {
  document.getElementById(
    "score-tracker"
  ).innerText = `Score: ${score} | Question: ${
    currentQuestionIndex + 1
  } of ${selectedQuestionCount}`;
}
