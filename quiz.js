document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-quiz");
    const nextButton = document.getElementById("next-question");
    const submitButton = document.getElementById("submit-answer");
    const retakeButton = document.getElementById("retake-quiz");
    const questionTitle = document.getElementById("question-title");
    const optionsContainer = document.getElementById("options");
    const quizQuestions = document.getElementById("quiz-questions");
    const introductionSection = document.getElementById("introduction");
    const resultsContainer = document.getElementById("quiz-results");
    const resultExplanation = document.getElementById("result-explanation");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedButton = null;

    const questions = [
        {
            question: "What is the primary risk of eating raw cookie dough, even if it doesn’t contain eggs?",
            answers: [
                { text: "Unpasteurized sugar can carry bacteria", correct: false, explanation: "Refined sugar is processed and does not typically harbor harmful bacteria." },
                { text: "Raw flour may be contaminated with E. coli", correct: true, explanation: "Flour is a raw agricultural product that hasn’t yet been treated to kill bacteria like E. coli, which can also survive in dry environments." },
                { text: "Butter in the dough can spoil quickly", correct: false, explanation: "Butter spoils only after extended periods at room temperature, which isn’t the main risk." },
                { text: "The dough contains too much sugar", correct: false, explanation: "High sugar content isn’t immediately dangerous, though it’s not healthy over time." }
            ]
        },
        {
            question: "What is the best way to cool a large pot of soup safely?",
            answers: [
                { text: "Leave it on the counter until it’s room temperature", correct: false, explanation: "Leaving soup out allows bacteria to multiply once it drops below safe temperatures." },
                { text: "Place it directly into the refrigerator while hot", correct: false, explanation: "Placing a large hot pot in the refrigerator can warm nearby food and slow cooling." },
                { text: "Divide it into smaller portions before refrigerating", correct: true, explanation: "Dividing soup into smaller containers increases surface area, allowing it to cool faster and avoid the danger zone where bacteria grow rapidly (41°F–135°F)." },
                { text: "Stir it frequently until cool, then refrigerate", correct: false, explanation: "Stirring helps but won’t cool it quickly enough on its own." }
            ]
        },
        {
            question: "What is the safest way to thaw frozen meat?",
            answers: [
                { text: "On the kitchen counter", correct: false, explanation: "Thawing on the counter exposes meat to room temperature, allowing bacteria to multiply." },
                { text: "In cold water, changing it every 30 minutes", correct: false, explanation: "Cold water is safe but requires constant attention to maintain the correct temperature." },
                { text: "In the refrigerator over time", correct: true, explanation: "Thawing meat in the refrigerator keeps it at a safe temperature (below 41°F) throughout the process, minimizing the risk of bacterial growth." },
                { text: "Using a blow dryer on low heat", correct: false, explanation: "Using a blow dryer is unsafe, as uneven heating can leave parts of the meat in the danger zone." }
            ]
        },
        {
            question: "Why is it UNSAFE to wash raw chicken before cooking?",
            answers: [
                { text: "It dilutes the flavor of the chicken", correct: false, explanation: "Washing doesn’t affect flavor and flavor doesn't affect safety." },
                { text: "It causes the chicken to spoil faster", correct: false, explanation: "Washing doesn’t directly influence spoilage rate." },
                { text: "It spreads bacteria to surrounding surfaces", correct: true, explanation: "Washing raw chicken can cause bacteria-laden water droplets to splash onto sinks, countertops, and utensils, increasing the risk of cross-contamination. Cooking kills the bacteria." },
                { text: "It makes the chicken cook unevenly", correct: false, explanation: "Cooking unevenly depends more on the cooking method, not washing." }
            ]
        },
        {
            question: "Which of the following is a high-risk food for foodborne illness?",
            answers: [
                { text: "Canned vegetables", correct: false, explanation: "Commercially canned products are tightly regulated to eliminate the risk of specific foodborne illnesses like botulism." },
                { text: "Pasteurized milk", correct: false, explanation: "Pasteurized milk has been heated to kill harmful pathogens." },
                { text: "Raw sprouts", correct: true, explanation: "Sprouts grow in warm, moist conditions ideal for bacterial growth, including Salmonella and E. coli. Cooking them greatly reduces risk." },
                { text: "Fresh bread", correct: false, explanation: "Bread is baked, which makes it low-risk if eaten while fresh." }
            ]
        },
        {
            question: "Why is it important to use a food thermometer when cooking meat?",
            answers: [
                { text: "To make sure it’s evenly cooked", correct: false, explanation: "Even cooking doesn’t ensure safety without temperature verification." },
                { text: "To check that the meat has reached a safe internal temperature", correct: true, explanation: "A thermometer ensures meat reaches a temperature that destroys harmful bacteria like E. coli and Salmonella, which visual cues like color can’t guarantee." },
                { text: "To reduce cooking time", correct: false, explanation: "A thermometer doesn’t shorten cooking time." },
                { text: "To enhance the meat’s flavor", correct: false, explanation: "Temprature can affect taste, but flavor isn’t directly affected by using a thermometer." }
            ]
        },
        {
            question: "Which of the following symptoms is LEAST likely to be caused by foodborne illness?",
            answers: [
                { text: "Nausea", correct: false, explanation: "Nausea is a hallmark symptom of foodborne illnesses." },
                { text: "Shortness of breath", correct: true, explanation: "Shortness of breath requires immediate medical attention as it is typically linked to allergic reactions, not foodborne illnesses, which primarily affect the digestive system." },
                { text: "Diarrhea", correct: false, explanation: "Diarrhea is usually one of the first symptoms to appear from foodborne illnesses." },
                { text: "Stomach cramps", correct: false, explanation: "Stomach cramps are a hallmark symptom of foodborne illness." }
            ]
        },
        {
            question: "What is the best way to store raw meat in the refrigerator?",
            answers: [
                { text: "On the top shelf, above other food", correct: false, explanation: "Placing raw meat on the top shelf increases the risk of dripping onto other foods." },
                { text: "On a plate, uncovered", correct: false, explanation: "Leaving meat uncovered can contaminate other items and promote drying." },
                { text: "In a sealed container or wrapped, on the bottom shelf", correct: true, explanation: "Storing raw meat on the bottom shelf prevents juices from dripping onto other foods, reducing cross-contamination. Sealing it adds an extra layer of protection." },
                { text: "Mixed with vegetables to save space", correct: false, explanation: "Mixing raw meat with vegetables increases cross-contamination risk." }
            ]
        },
        {
            question: "How long can perishable food safely sit out at room temperature?",
            answers: [
                { text: "30 minutes", correct: false, explanation: "This is overly cautious for normal room temperatures." },
                { text: "1 hour", correct: false, explanation: "This is also overly cautious for normal room temperatures." },
                { text: "2 hours", correct: true, explanation: "Bacteria grow rapidly at room temperature, and perishable foods should be refrigerated or discarded after 2 hours maximum." },
                { text: "4 hours", correct: false, explanation: "Four hours is too long and significantly increases the risk of bacterial growth." }
            ]
        },
        {
            question: "What is the leading cause of foodborne illness outbreaks?",
            answers: [
                { text: "Undercooked poultry", correct: false, explanation: "Undercooked poultry is a major risk from foodborne illness but less frequent than poor hand hygiene." },
                { text: "Poor hygiene practices", correct: true, explanation: "Most foodborne illness outbreaks occur because pathogens are transferred from unwashed hands to food. Proper handwashing is a simple and effective prevention method." },
                { text: "Improper food storage", correct: false, explanation: "Improper storage contributes to some outbreaks but isn’t the leading cause." },
                { text: "Contaminated water", correct: false, explanation: "Contaminated water is indeed a concern but it is a less common risk in countries with strict water standards." }
            ]
        }
    ];

    function startQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        selectedButton = null;
        shuffleQuestions();
        introductionSection.style.display = "none";
        resultsContainer.style.display = "none";
        quizQuestions.style.display = "block";
        progressContainer.style.display = "block";
        showQuestion();
        updateProgressBar();
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionTitle.textContent = question.question;
        optionsContainer.innerHTML = "";
        question.answers.forEach((answer) => {
            const button = document.createElement("button");
            button.textContent = answer.text;
            button.classList.add("option-button");
            button.dataset.correct = answer.correct;
            button.dataset.explanation = answer.explanation;
            button.addEventListener("click", () => selectAnswer(button));
            optionsContainer.appendChild(button);
        });
        submitButton.style.display = "block";
        nextButton.style.display = "none";
    }

    function selectAnswer(button) {
        selectedButton = button;
        const buttons = Array.from(optionsContainer.children);
        buttons.forEach((btn) => {
            btn.disabled = true;
            btn.classList.add(btn.dataset.correct === "true" ? "correct" : "incorrect");
            if (btn === selectedButton) {
                const explanation = document.createElement("div");
                explanation.classList.add("explanation");
                explanation.textContent = `You selected: "${btn.textContent}" - ${btn.dataset.explanation}`;
                btn.parentElement.insertBefore(explanation, btn.nextSibling);
            } else {
                const explanation = document.createElement("div");
                explanation.classList.add("explanation");
                explanation.textContent = btn.dataset.explanation;
                btn.parentElement.insertBefore(explanation, btn.nextSibling);
            }
        });
        submitButton.style.display = "none";
        nextButton.style.display = "block";
        if (selectedButton.dataset.correct === "true") {
            score++;
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            selectedButton = null;
            showQuestion();
            updateProgressBar();
        } else {
            showResults();
        }
    });

    function showResults() {
        quizQuestions.style.display = "none";
        progressContainer.style.display = "none";
        resultsContainer.style.display = "block";
        let scoreMessage;
        if (score === questions.length) {
            scoreMessage = "Excellent! You answered all questions correctly. You have a solid understanding of food safety.";
        } else if (score >= questions.length * 0.7) {
            scoreMessage = "Good job! You have a strong understanding of food safety, but there's room for improvement.";
        } else if (score >= questions.length * 0.5) {
            scoreMessage = "Not bad! You know some basics, but make sure to review food safety guidelines.";
        } else {
            scoreMessage = "It looks like you may need to learn more about food safety. Review the resources below to strengthen your knowledge.";
        }
        resultExplanation.textContent = `You scored ${score} out of ${questions.length}. ${scoreMessage}`;
    }

    function shuffleQuestions() {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        questions.forEach((question) => {
            for (let i = question.answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
            }
        });
    }

    retakeButton.addEventListener("click", startQuiz);
    startButton.addEventListener("click", startQuiz);
});
