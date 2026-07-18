/* ML Learning Companion content model. No framework is required. */
window.MLC_DATA = {
  appName: 'ML Learning Companion',
  version: '1.0.0',
  screenOrder: [
    'welcome', 'profile', 'home', 'path', 'foundations', 'supervised',
    'unsupervised', 'reinforcement', 'algorithms', 'scenario', 'practice',
    'quiz', 'results', 'progress', 'glossary', 'resources', 'about'
  ],
  screenInfo: {
    welcome: { title: 'Welcome', eyebrow: 'Start here', icon: 'sparkles', next: 'profile' },
    profile: { title: 'Set your learning plan', eyebrow: 'Personalize', icon: 'user', prev: 'welcome', next: 'home' },
    home: { title: 'Learning dashboard', eyebrow: 'Your companion', icon: 'home', prev: 'profile', next: 'path' },
    path: { title: 'Learning path', eyebrow: 'Four short stages', icon: 'route', prev: 'home', next: 'foundations' },
    foundations: { title: 'Machine learning foundations', eyebrow: 'Lesson 1', icon: 'brain', prev: 'path', next: 'supervised', module: 'learn' },
    supervised: { title: 'Supervised learning', eyebrow: 'Lesson 2', icon: 'tags', prev: 'foundations', next: 'unsupervised', module: 'learn' },
    unsupervised: { title: 'Unsupervised learning', eyebrow: 'Lesson 3', icon: 'cluster', prev: 'supervised', next: 'reinforcement', module: 'learn' },
    reinforcement: { title: 'Reinforcement learning', eyebrow: 'Lesson 4', icon: 'gamepad', prev: 'unsupervised', next: 'algorithms', module: 'learn' },
    algorithms: { title: 'Algorithm explorer', eyebrow: 'Choose the right tool', icon: 'blocks', prev: 'reinforcement', next: 'scenario', module: 'apply' },
    scenario: { title: 'Scenario lab', eyebrow: 'Make a design decision', icon: 'flask', prev: 'algorithms', next: 'practice', module: 'apply' },
    practice: { title: 'Guided practice', eyebrow: 'Feedback while you learn', icon: 'target', prev: 'scenario', next: 'quiz', module: 'apply' },
    quiz: { title: 'Mastery check', eyebrow: 'Eight-question assessment', icon: 'clipboard', prev: 'practice', next: 'results', module: 'assess' },
    results: { title: 'Results and review', eyebrow: 'Use the evidence', icon: 'chart', prev: 'quiz', next: 'progress', module: 'assess' },
    progress: { title: 'Progress and achievements', eyebrow: 'Your learning record', icon: 'trophy', prev: 'results', next: 'glossary' },
    glossary: { title: 'Machine learning glossary', eyebrow: 'Plain-language reference', icon: 'book', prev: 'progress', next: 'resources' },
    resources: { title: 'Resources and study tools', eyebrow: 'Keep learning', icon: 'library', prev: 'glossary', next: 'about' },
    about: { title: 'About this prototype', eyebrow: 'Help and design notes', icon: 'info', prev: 'resources' }
  },
  navGroups: [
    { label: 'Overview', screens: ['home', 'path'] },
    { label: 'Learn', screens: ['foundations', 'supervised', 'unsupervised', 'reinforcement'] },
    { label: 'Apply', screens: ['algorithms', 'scenario', 'practice'] },
    { label: 'Assess', screens: ['quiz', 'results', 'progress'] },
    { label: 'Reference', screens: ['glossary', 'resources', 'about'] }
  ],
  objectives: [
    {
      id: 'O1',
      label: 'Classify learning problems',
      text: 'Given a real-world problem, distinguish supervised, unsupervised, and reinforcement learning with at least 80% accuracy.',
      short: 'Distinguish the three primary categories of machine learning.',
      icon: 'layers'
    },
    {
      id: 'O2',
      label: 'Select an algorithm',
      text: 'Match common algorithms to appropriate data, outputs, and applications, then explain the match using evidence from the scenario.',
      short: 'Match common algorithms to appropriate applications.',
      icon: 'gitbranch'
    }
  ],
  lessonCards: [
    { id: 'foundations', step: '01', title: 'Foundations', duration: 6, objective: 'O1', description: 'Understand data, features, labels, training, inference, and evaluation.' },
    { id: 'supervised', step: '02', title: 'Supervised learning', duration: 7, objective: 'O1', description: 'Learn how labeled examples support classification and regression.' },
    { id: 'unsupervised', step: '03', title: 'Unsupervised learning', duration: 7, objective: 'O1', description: 'Explore how algorithms discover structure without target labels.' },
    { id: 'reinforcement', step: '04', title: 'Reinforcement learning', duration: 7, objective: 'O1', description: 'See how actions, rewards, and repeated feedback shape a policy.' },
    { id: 'algorithms', step: '05', title: 'Algorithm explorer', duration: 8, objective: 'O2', description: 'Compare practical algorithms by task, strengths, and tradeoffs.' },
    { id: 'scenario', step: '06', title: 'Scenario lab', duration: 6, objective: 'O2', description: 'Choose a category and algorithm for authentic learning problems.' },
    { id: 'practice', step: '07', title: 'Guided practice', duration: 8, objective: 'O1 + O2', description: 'Answer low-stakes questions with immediate explanatory feedback.' },
    { id: 'quiz', step: '08', title: 'Mastery check', duration: 8, objective: 'O1 + O2', description: 'Demonstrate mastery on an eight-question assessment.' }
  ],
  algorithms: [
    {
      id: 'linear-regression', name: 'Linear Regression', family: 'supervised', task: 'Regression', difficulty: 'Starter',
      icon: 'trend', tagline: 'Predict a continuous number from a weighted line or plane.',
      bestFor: ['numeric outcomes', 'interpretable relationships', 'baseline models'],
      examples: ['predicting apartment rent', 'estimating delivery time', 'forecasting energy use'],
      watchFor: 'It assumes a relatively linear relationship and can be sensitive to influential outliers.',
      input: 'Features such as square footage, distance, or temperature', output: 'A number such as price, minutes, or kilowatt-hours',
      analogy: 'Draw the best-fit trend through known examples, then read a new estimate from that trend.'
    },
    {
      id: 'logistic-regression', name: 'Logistic Regression', family: 'supervised', task: 'Classification', difficulty: 'Starter',
      icon: 'split', tagline: 'Estimate the probability that an example belongs to a class.',
      bestFor: ['binary classification', 'probability estimates', 'interpretable feature effects'],
      examples: ['spam detection', 'course completion risk', 'loan default screening'],
      watchFor: 'A simple decision boundary may miss complex nonlinear patterns.',
      input: 'Features plus known class labels', output: 'A class probability and predicted label',
      analogy: 'Combine clues into a score, then convert the score into a probability between 0 and 1.'
    },
    {
      id: 'decision-tree', name: 'Decision Tree', family: 'supervised', task: 'Classification / Regression', difficulty: 'Starter',
      icon: 'tree', tagline: 'Make predictions through a sequence of understandable yes-or-no splits.',
      bestFor: ['mixed data types', 'nonlinear rules', 'explainable decisions'],
      examples: ['support ticket routing', 'student intervention rules', 'equipment fault diagnosis'],
      watchFor: 'A deep tree can memorize training examples; pruning or ensembles help control overfitting.',
      input: 'Numeric or categorical features and labels', output: 'A class or continuous value',
      analogy: 'Follow a flowchart whose questions split similar examples into increasingly focused groups.'
    },
    {
      id: 'random-forest', name: 'Random Forest', family: 'supervised', task: 'Classification / Regression', difficulty: 'Intermediate',
      icon: 'forest', tagline: 'Combine many varied decision trees and let them vote or average.',
      bestFor: ['strong tabular-data performance', 'nonlinear patterns', 'robust baselines'],
      examples: ['fraud screening', 'churn prediction', 'medical risk estimation'],
      watchFor: 'It is less transparent than one tree and can become large or slower at inference.',
      input: 'Feature columns and labeled outcomes', output: 'A voted class or averaged number',
      analogy: 'Ask a diverse committee of trees and combine their independent judgments.'
    },
    {
      id: 'knn', name: 'k-Nearest Neighbors', family: 'supervised', task: 'Classification / Regression', difficulty: 'Starter',
      icon: 'neighbors', tagline: 'Predict from the labels or values of the most similar stored examples.',
      bestFor: ['small datasets', 'local patterns', 'simple similarity-based reasoning'],
      examples: ['handwriting classification', 'item similarity', 'basic recommendation prototypes'],
      watchFor: 'Scale features first; prediction becomes slower as the stored dataset grows.',
      input: 'Comparable numeric features and labeled neighbors', output: 'A majority class or average value',
      analogy: 'Look at the closest known cases and use what is common among them.'
    },
    {
      id: 'kmeans', name: 'K-Means Clustering', family: 'unsupervised', task: 'Clustering', difficulty: 'Starter',
      icon: 'cluster', tagline: 'Partition examples into K compact groups around learned centers.',
      bestFor: ['segment discovery', 'compact numeric clusters', 'exploratory analysis'],
      examples: ['learner personas', 'customer segments', 'image color compression'],
      watchFor: 'You choose K in advance, scale matters, and irregular cluster shapes can be misleading.',
      input: 'Unlabeled numeric feature vectors', output: 'A cluster assignment for each example',
      analogy: 'Move K magnets until each data point is closest to one stable center.'
    },
    {
      id: 'pca', name: 'Principal Component Analysis', family: 'unsupervised', task: 'Dimensionality Reduction', difficulty: 'Intermediate',
      icon: 'compress', tagline: 'Compress many correlated features into fewer information-rich directions.',
      bestFor: ['visualization', 'noise reduction', 'preprocessing high-dimensional data'],
      examples: ['plotting survey patterns', 'compressing sensor features', 'visualizing embeddings'],
      watchFor: 'Components can be difficult to interpret and emphasize variance rather than task relevance.',
      input: 'Unlabeled numeric features', output: 'A smaller set of transformed components',
      analogy: 'Rotate the coordinate system so the first few directions capture most of the spread.'
    },
    {
      id: 'qlearning', name: 'Q-Learning', family: 'reinforcement', task: 'Sequential Decision-Making', difficulty: 'Intermediate',
      icon: 'gamepad', tagline: 'Learn the long-term value of actions through rewards and exploration.',
      bestFor: ['small discrete state spaces', 'repeated decisions', 'delayed rewards'],
      examples: ['grid navigation', 'resource scheduling demos', 'adaptive game agents'],
      watchFor: 'Large state spaces require approximation; reward design strongly shapes behavior.',
      input: 'States, available actions, rewards, and next states', output: 'A policy selecting actions by learned value',
      analogy: 'Keep a scorecard for each action in each situation and update it after every outcome.'
    }
  ],
  scenarios: [
    {
      id: 'helpdesk', title: 'Route campus help requests', icon: 'inbox',
      prompt: 'A university has 18,000 past help tickets. Each ticket includes text features and a known destination such as IT, financial aid, or advising. The new system must route incoming tickets.',
      category: 'supervised', algorithm: 'decision-tree',
      categoryWhy: 'The historical tickets include known destination labels, so the model can learn from labeled examples.',
      algorithmWhy: 'A decision tree is an appropriate beginner-friendly option because it handles rule-like patterns and its routing logic can be explained to staff.',
      distractor: 'kmeans'
    },
    {
      id: 'personas', title: 'Discover learner study patterns', icon: 'users',
      prompt: 'An instructional designer has clickstream and study-session features for 4,500 learners, but no existing persona labels. The goal is to discover naturally occurring study patterns.',
      category: 'unsupervised', algorithm: 'kmeans',
      categoryWhy: 'There is no target label. The goal is to reveal structure that already exists in the feature data.',
      algorithmWhy: 'K-means can provide an exploratory segmentation when the features are numeric, scaled, and expected to form reasonably compact groups.',
      distractor: 'logistic-regression'
    },
    {
      id: 'energy', title: 'Estimate daily energy use', icon: 'bolt',
      prompt: 'A facilities team has daily weather, occupancy, calendar, and past energy-consumption records. It needs a numeric estimate of tomorrow’s kilowatt-hours.',
      category: 'supervised', algorithm: 'linear-regression',
      categoryWhy: 'Past examples include the known numeric outcome, energy consumption, so this is labeled learning.',
      algorithmWhy: 'Linear regression is a transparent baseline for predicting a continuous numeric output and examining feature relationships.',
      distractor: 'kmeans'
    },
    {
      id: 'tutor', title: 'Choose the next tutoring action', icon: 'route',
      prompt: 'An adaptive tutor selects a hint, worked example, or harder problem after each learner action. It receives a reward for later mastery and must improve a sequence of choices over time.',
      category: 'reinforcement', algorithm: 'qlearning',
      categoryWhy: 'The system repeatedly chooses actions and learns from rewards that may be delayed.',
      algorithmWhy: 'Q-learning is designed to estimate the long-term value of actions in states and can learn a policy for a manageable discrete tutoring environment.',
      distractor: 'linear-regression'
    }
  ],
  practiceQuestions: [
    {
      id: 'p1', objective: 'O1', type: 'single',
      prompt: 'A model learns from photos labeled “damaged” and “undamaged.” Which category is this?',
      options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning'], answer: 0,
      explanation: 'The target label is provided for every training example, so the model is learning a supervised classification task.',
      misconception: 'Unsupervised learning would not receive the damaged/undamaged target labels.'
    },
    {
      id: 'p2', objective: 'O1', type: 'single',
      prompt: 'A retailer wants to discover groups of shoppers with similar behavior and has no segment labels. Which category fits best?',
      options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning'], answer: 1,
      explanation: 'The goal is structure discovery without known target labels, which is the defining setup for unsupervised learning.',
      misconception: 'Supervised learning requires a target such as a known segment or outcome.'
    },
    {
      id: 'p3', objective: 'O2', type: 'single',
      prompt: 'Which algorithm is the clearest baseline for predicting a continuous value such as delivery minutes?',
      options: ['Linear regression', 'K-means clustering', 'Q-learning', 'Logistic regression'], answer: 0,
      explanation: 'Linear regression predicts a continuous numeric outcome and supplies an interpretable baseline.',
      misconception: 'Logistic regression produces class probabilities, while k-means and Q-learning solve different task types.'
    },
    {
      id: 'p4', objective: 'O2', type: 'single',
      prompt: 'You need understandable yes-or-no rules for routing support cases. Which algorithm is a strong fit?',
      options: ['PCA', 'Decision tree', 'K-means', 'Q-learning'], answer: 1,
      explanation: 'A decision tree represents prediction logic as a sequence of readable feature-based splits.',
      misconception: 'PCA compresses features, k-means clusters unlabeled data, and Q-learning optimizes action sequences.'
    },
    {
      id: 'p5', objective: 'O1', type: 'single',
      prompt: 'An agent explores a maze, receives +10 at the goal and -1 per move, and updates its future choices. Which category is this?',
      options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning'], answer: 2,
      explanation: 'The agent learns an action policy from rewards generated through interaction with an environment.',
      misconception: 'There is no fixed correct label for every move; the signal comes from cumulative reward.'
    },
    {
      id: 'p6', objective: 'O2', type: 'single',
      prompt: 'Which algorithm explicitly requires you to choose the number of groups, K, before training?',
      options: ['Random forest', 'K-means clustering', 'Logistic regression', 'Linear regression'], answer: 1,
      explanation: 'K-means partitions data around K learned centers, and K is a user-selected hyperparameter.',
      misconception: 'The other options are supervised predictors rather than centroid-based clustering methods.'
    }
  ],
  quizQuestions: [
    {
      id: 'q1', objective: 'O1', prompt: 'A dataset contains email features and a known spam/not-spam label. What kind of learning problem is this?',
      options: ['Supervised classification', 'Supervised regression', 'Unsupervised clustering', 'Reinforcement learning'], answer: 0,
      explanation: 'Known categorical labels make this supervised classification.'
    },
    {
      id: 'q2', objective: 'O1', prompt: 'Which statement best distinguishes unsupervised learning?',
      options: ['It always predicts a number.', 'It learns only through rewards.', 'It searches for structure without a target label.', 'It cannot use numeric features.'], answer: 2,
      explanation: 'Unsupervised methods analyze features without being trained against a provided target label.'
    },
    {
      id: 'q3', objective: 'O1', prompt: 'What is the defining feedback signal in reinforcement learning?',
      options: ['A cluster center', 'A reward tied to actions and outcomes', 'A label attached to every example', 'A principal component'], answer: 1,
      explanation: 'Rewards indicate the immediate or delayed value of actions and support policy learning.'
    },
    {
      id: 'q4', objective: 'O1', prompt: 'A hospital wants to discover patient subgroups before clinicians have named any categories. Which approach is most appropriate?',
      options: ['Supervised regression', 'Unsupervised clustering', 'Reinforcement learning', 'Supervised classification'], answer: 1,
      explanation: 'The goal is to discover groups without existing subgroup labels.'
    },
    {
      id: 'q5', objective: 'O2', prompt: 'Which algorithm is designed to predict a continuous outcome such as monthly sales?',
      options: ['Linear regression', 'Logistic regression', 'K-means clustering', 'Q-learning'], answer: 0,
      explanation: 'Linear regression directly estimates a numeric target.'
    },
    {
      id: 'q6', objective: 'O2', prompt: 'Why might a decision tree be selected for an instructional intervention system?',
      options: ['It guarantees perfect accuracy.', 'Its sequence of splits can be inspected and explained.', 'It needs no training data.', 'It can only form clusters.'], answer: 1,
      explanation: 'A tree exposes a human-readable chain of decision rules, though it does not guarantee perfect accuracy.'
    },
    {
      id: 'q7', objective: 'O2', prompt: 'A team needs an exploratory segmentation of scaled learner-behavior features. Which algorithm best matches the task?',
      options: ['K-means clustering', 'Linear regression', 'Logistic regression', 'Q-learning'], answer: 0,
      explanation: 'K-means groups unlabeled numeric examples into K compact clusters.'
    },
    {
      id: 'q8', objective: 'O2', prompt: 'Which pairing is correctly matched?',
      options: ['PCA — action policy learning', 'Q-learning — sequential decisions with rewards', 'K-means — labeled binary prediction', 'Logistic regression — dimensionality reduction'], answer: 1,
      explanation: 'Q-learning estimates action values from rewards in sequential decision settings.'
    }
  ],
  glossary: [
    { term: 'Algorithm', category: 'Core', definition: 'A defined procedure that learns a pattern or transforms data to produce an output.' },
    { term: 'Artificial intelligence (AI)', category: 'Core', definition: 'A broad field focused on systems that perform tasks associated with intelligent behavior; machine learning is one approach within AI.' },
    { term: 'Classification', category: 'Tasks', definition: 'Predicting one of a set of categories, such as spam/not spam or beginner/intermediate/advanced.' },
    { term: 'Cluster', category: 'Tasks', definition: 'A group of examples that an unsupervised method identifies as similar under the selected features and distance measure.' },
    { term: 'Data leakage', category: 'Evaluation', definition: 'Using information during training that would not legitimately be available when the model makes real predictions.' },
    { term: 'Dataset', category: 'Core', definition: 'A structured collection of examples used for exploration, training, validation, or testing.' },
    { term: 'Dimensionality reduction', category: 'Tasks', definition: 'Representing many features with fewer variables while preserving useful structure or variation.' },
    { term: 'Evaluation metric', category: 'Evaluation', definition: 'A quantitative measure, such as accuracy or mean absolute error, used to judge model performance.' },
    { term: 'Example', category: 'Core', definition: 'One observation or row in a dataset, represented by features and sometimes a label.' },
    { term: 'Feature', category: 'Core', definition: 'An input variable used by a model, such as study time, word frequency, or temperature.' },
    { term: 'Generalization', category: 'Evaluation', definition: 'A model’s ability to perform well on new examples that were not used to fit it.' },
    { term: 'Hyperparameter', category: 'Training', definition: 'A setting chosen outside the learning process, such as the number of clusters K or a tree’s maximum depth.' },
    { term: 'Inference', category: 'Core', definition: 'Using a trained model to produce a prediction, score, cluster assignment, or action for new input.' },
    { term: 'Label / target', category: 'Core', definition: 'The known outcome a supervised model is trained to predict.' },
    { term: 'Machine learning', category: 'Core', definition: 'Methods that improve task performance by learning patterns from data or experience rather than relying only on hand-coded rules.' },
    { term: 'Model', category: 'Core', definition: 'The learned mathematical representation that maps inputs to outputs or captures structure in data.' },
    { term: 'Overfitting', category: 'Evaluation', definition: 'Learning training-specific noise so closely that performance drops on new data.' },
    { term: 'Policy', category: 'Reinforcement', definition: 'A strategy that specifies which action an agent should select in a state.' },
    { term: 'Regression', category: 'Tasks', definition: 'Predicting a continuous numeric value, such as price, time, or energy consumption.' },
    { term: 'Reward', category: 'Reinforcement', definition: 'A numeric signal that indicates the immediate value of an agent’s action or resulting state.' },
    { term: 'State', category: 'Reinforcement', definition: 'The information describing the current situation available to a reinforcement-learning agent.' },
    { term: 'Test set', category: 'Evaluation', definition: 'Held-out examples used near the end of development to estimate performance on unseen data.' },
    { term: 'Training', category: 'Training', definition: 'The process of fitting model parameters from examples or experience.' },
    { term: 'Validation set', category: 'Evaluation', definition: 'Held-out examples used during development to tune choices and compare candidate models.' }
  ],
  resources: [
    { title: 'Category decision guide', type: 'In-app guide', icon: 'route', description: 'A one-page decision sequence for identifying supervised, unsupervised, and reinforcement tasks.', action: 'download-guide' },
    { title: 'Algorithm comparison notes', type: 'In-app reference', icon: 'blocks', description: 'The explorer summarizes task type, input, output, strengths, examples, and cautions.', action: 'algorithms' },
    { title: 'Practice with feedback', type: 'Interactive activity', icon: 'target', description: 'Six low-stakes questions diagnose misconceptions before the mastery check.', action: 'practice' },
    { title: 'Glossary', type: 'Searchable reference', icon: 'book', description: 'Twenty-four terms in plain language, filterable by keyword or category.', action: 'glossary' }
  ],
  badges: [
    { id: 'first-step', icon: 'footprints', title: 'First Step', description: 'Complete your first lesson.', test: s => s.completedLessons.length >= 1 },
    { id: 'category-scout', icon: 'layers', title: 'Category Scout', description: 'Complete all four category lessons.', test: s => ['foundations','supervised','unsupervised','reinforcement'].every(x => s.completedLessons.includes(x)) },
    { id: 'lab-thinker', icon: 'flask', title: 'Lab Thinker', description: 'Complete every scenario in the lab.', test: s => s.scenario.completed.length >= 4 },
    { id: 'practice-pro', icon: 'target', title: 'Practice Pro', description: 'Score at least 5 out of 6 in guided practice.', test: s => s.practice.best >= 5 },
    { id: 'mastery', icon: 'trophy', title: 'ML Mastery', description: 'Earn 80% or higher on the mastery check.', test: s => s.quiz.bestPercent >= 80 },
    { id: 'persistent', icon: 'refresh', title: 'Persistent Learner', description: 'Improve the mastery score on a later attempt.', test: s => s.quiz.improved === true }
  ]
};
