import confetti from 'confetti';
import { gsap } from 'gsap';

// État de l'application
const appState = {
    currentUser: {
        name: '',
        avatar: 1,
        points: 0,
        progress: {
            maths: 0,
            langues: 0,
            sciences: 0,
            arts: 0,
            sport: 0,
            metiers: 0,
            geographie: 0
        },
        badges: [],
        completedActivities: [],
        completedQuests: [],
        currentQuests: []
    },
    currentModule: null,
    currentScreen: 'welcome-screen',
    assistant: {
        isActive: false,
        messages: []
    },
    audioExplanations: {
        isPlaying: false,
        currentAudio: null
    },
    characters: {
        maths: {
            name: "Prof. Arithmus",
            avatar: "🦉",
            color: "#FF5722",
            intro: "Bienvenue dans mon laboratoire des nombres ! Je suis le Professeur Arithmus, et j'ai besoin de ton aide pour résoudre des énigmes mathématiques."
        },
        langues: {
            name: "Capitaine Lexico",
            avatar: "🦊",
            color: "#2196F3",
            intro: "Ahoy, moussaillon ! Je suis le Capitaine Lexico, et nous partons à l'aventure pour découvrir le monde des mots et des histoires !"
        },
        sciences: {
            name: "Dr. Eureka",
            avatar: "🐢",
            color: "#9C27B0",
            intro: "Bonjour jeune scientifique ! Je suis Dr. Eureka, et ensemble, nous allons percer les mystères de notre monde à travers des expériences fascinantes !"
        },
        arts: {
            name: "Maestro Colorino",
            avatar: "🦄",
            color: "#FFEB3B",
            intro: "Ciao créateur en herbe ! Je suis Maestro Colorino, et je vais t'aider à libérer ton imagination à travers l'art et la musique !"
        },
        sport: {
            name: "Coach Dynamo",
            avatar: "🐯",
            color: "#4CAF50",
            intro: "Hey champion ! Je suis Coach Dynamo, et ensemble, nous allons bouger, sauter et devenir plus forts tout en s'amusant !"
        },
        metiers: {
            name: "Mme. Carriera",
            avatar: "🦢",
            color: "#FF9800",
            intro: "Bonjour jeune explorateur ! Je suis Madame Carriera, et je vais te faire découvrir le monde fascinant des métiers. Il y a tellement de possibilités pour ton avenir !"
        },
        geographie: {
            name: "Capitaine Atlas",
            avatar: "🦅",
            color: "#03A9F4",
            intro: "Bonjour aventurier ! Je suis le Capitaine Atlas, et je t'invite à embarquer dans un voyage extraordinaire pour explorer le monde et découvrir l'Algérie !"
        }
    }
};

// Système de quêtes
const questTemplates = [
    {
        id: "math-explorer",
        title: "Explorateur des Nombres",
        module: "maths",
        description: "Le Professeur Arithmus a besoin de ton aide pour explorer le monde des nombres et des formes.",
        objectives: [
            { id: "math-numbers", text: "Apprendre les nombres de 1 à 10", completed: false },
            { id: "math-shapes", text: "Découvrir les formes géométriques", completed: false },
            { id: "math-add", text: "Maîtriser l'addition simple", completed: false }
        ],
        reward: { points: 50, badge: "math-explorer" }
    },
    {
        id: "langue-aventure",
        title: "Aventure Linguistique",
        module: "langues",
        description: "Rejoins le Capitaine Lexico dans une aventure pour maîtriser le langage et découvrir des histoires fascinantes.",
        objectives: [
            { id: "langue-alphabet", text: "Maîtriser l'alphabet", completed: false },
            { id: "langue-vocab", text: "Enrichir ton vocabulaire des animaux", completed: false }
        ],
        reward: { points: 40, badge: "langue-explorer" }
    },
    {
        id: "science-decouverte",
        title: "Mission Découverte",
        module: "sciences",
        description: "Aide Dr. Eureka à percer les mystères de la science à travers des expériences passionnantes.",
        objectives: [
            { id: "science-sens", text: "Explorer les cinq sens", completed: false },
            { id: "science-animals", text: "Étudier le monde animal", completed: false }
        ],
        reward: { points: 40, badge: "science-explorer" }
    },
    {
        id: "art-creation",
        title: "Expédition Créative",
        module: "arts",
        description: "Maestro Colorino t'invite à exprimer ta créativité à travers différentes formes d'art.",
        objectives: [
            { id: "art-colors", text: "Explorer le monde des couleurs", completed: false },
            { id: "art-music", text: "Découvrir les instruments de musique", completed: false }
        ],
        reward: { points: 40, badge: "art-explorer" }
    },
    {
        id: "sport-challenge",
        title: "Défi Dynamique",
        module: "sport",
        description: "Relève les défis sportifs du Coach Dynamo pour devenir plus agile et plus fort.",
        objectives: [
            { id: "sport-moves", text: "Maîtriser les mouvements du corps", completed: false },
            { id: "sport-games", text: "Participer à des jeux sportifs", completed: false }
        ],
        reward: { points: 40, badge: "sport-explorer" }
    },
    {
        id: "metiers-decouverte",
        title: "Explorateur des Métiers",
        module: "metiers",
        description: "Madame Carriera t'invite à découvrir le monde passionnant des métiers et professions.",
        objectives: [
            { id: "metiers-categories", text: "Découvrir les différentes catégories de métiers", completed: false },
            { id: "metiers-outils", text: "Connaître les outils des professionnels", completed: false },
            { id: "metiers-futur", text: "Explorer les métiers du futur", completed: false }
        ],
        reward: { points: 45, badge: "metiers-explorer" }
    },
    {
        id: "geo-monde",
        title: "Aventurier du Monde",
        module: "geographie",
        description: "Le Capitaine Atlas t'invite à explorer le monde et à découvrir les merveilles de l'Algérie.",
        objectives: [
            { id: "geo-continents", text: "Explorer les continents et océans", completed: false },
            { id: "geo-algerie", text: "Découvrir les régions d'Algérie", completed: false },
            { id: "geo-monuments", text: "Visiter les monuments célèbres", completed: false }
        ],
        reward: { points: 45, badge: "geo-explorer" }
    }
];

// Assistant virtuel - réponses prédéfinies
const assistantResponses = {
    greetings: [
        "Bonjour ! Je suis Édu, ton assistant. Comment puis-je t'aider aujourd'hui ?",
        "Salut ! Je suis là pour t'aider dans ton aventure d'apprentissage. Que veux-tu faire ?",
        "Coucou ! C'est Édu, ton assistant. As-tu des questions sur tes leçons ?"
    ],
    moduleHelp: {
        maths: [
            "Les mathématiques, c'est compter, mesurer et résoudre des problèmes avec des nombres.",
            "Tu savais que les formes ont des noms spéciaux ? Un cercle est rond comme une roue !",
            "L'addition, c'est quand on met ensemble. 2 pommes + 3 pommes = 5 pommes !"
        ],
        langues: [
            "L'alphabet a 26 lettres, de A à Z. C'est la base pour lire et écrire !",
            "Les mots forment des phrases, comme celle que tu lis en ce moment !",
            "Chaque animal a son propre cri : le chat fait 'miaou', le chien fait 'ouaf' !"
        ],
        sciences: [
            "Nous avons 5 sens : la vue, l'ouïe, le toucher, l'odorat et le goût.",
            "Les plantes ont besoin d'eau et de soleil pour grandir, comme toi !",
            "Certains animaux hibernent pendant l'hiver, comme les ours qui font une longue sieste !"
        ],
        arts: [
            "Mélanger le bleu et le jaune donne du vert, comme par magie !",
            "La musique est faite de sons qui peuvent être graves ou aigus.",
            "Dessiner, c'est comme raconter une histoire avec des images !"
        ],
        sport: [
            "Bouger ton corps est important pour rester en bonne santé.",
            "L'équilibre t'aide à tenir debout sur un pied comme un flamant rose !",
            "Courir, sauter, lancer - ce sont des mouvements que tu peux faire avec ton corps !"
        ],
        metiers: [
            "Chaque métier est spécial et nécessaire pour notre société. Les infirmières soignent les malades, les enseignants nous apprennent de nouvelles choses, et les architectes conçoivent des maisons et des bâtiments !",
            "Les métiers changent avec le temps. Il y a de nouveaux métiers qui apparaissent, comme les développeurs de jeux vidéo ou les spécialistes en énergie solaire.",
            "Le choix d'un métier dépend de tes passions et de tes compétences. Il est important de découvrir ce que tu aimes faire et ce que tu fais bien !"
        ],
        geographie: [
            "Notre monde est composé de continents et d'océans. L'Afrique est le berceau de l'humanité, et l'Amérique est un continent vaste et diversifié !",
            "La géographie nous enseigne à apprécier la beauté de notre planète et à comprendre les différences entre les cultures et les paysages.",
            "Les monuments célèbres, comme la Grande Muraille de Chine ou le Taj Mahal, sont des symboles de l'histoire et de la créativité humaine."
        ]
    },
    questions: [
        "Quelle est ta matière préférée ?",
        "As-tu déjà complété une quête ?",
        "Quel animal aimerais-tu être ?",
        "Qu'as-tu appris aujourd'hui ?",
        "Quel est ton jeu préféré ?"
    ],
    unknown: [
        "Je ne suis pas sûr de comprendre. Peux-tu me poser une question sur tes leçons ?",
        "Hmm, essayons autre chose. Tu peux me demander de l'aide sur les maths, les langues, les sciences, les arts ou le sport.",
        "Je suis encore en train d'apprendre. Peux-tu reformuler ta question ?"
    ]
};

// Initialisation des activités
const moduleActivities = {
    maths: [
        {
            id: 'math-numbers',
            title: 'Les nombres de 1 à 10',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Combien de points vois-tu ?',
                    image: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <circle cx="40" cy="50" r="10" fill="#FF5722" />
                        <circle cx="70" cy="50" r="10" fill="#FF5722" />
                        <circle cx="100" cy="50" r="10" fill="#FF5722" />
                        <circle cx="130" cy="50" r="10" fill="#FF5722" />
                        <circle cx="160" cy="50" r="10" fill="#FF5722" />
                    </svg>`,
                    options: ['3', '4', '5', '6'],
                    correct: '5'
                },
                {
                    question: 'Quel nombre vient après 7 ?',
                    options: ['6', '7', '8', '9'],
                    correct: '8'
                },
                {
                    question: 'Compte les triangles',
                    image: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <polygon points="30,80 50,30 70,80" fill="#FF5722" />
                        <polygon points="90,80 110,30 130,80" fill="#FF5722" />
                        <polygon points="150,80 170,30 190,80" fill="#FF5722" />
                    </svg>`,
                    options: ['2', '3', '4', '5'],
                    correct: '3'
                },
                {
                    question: 'Quel est le nombre après 2 ?',
                    options: ['1', '2', '3', '4'],
                    correct: '3'
                },
                {
                    question: 'Combien font 1 + 1 ?',
                    options: ['1', '2', '3', '4'],
                    correct: '2'
                },
                {
                    question: 'Quel nombre est entre 4 et 6 ?',
                    options: ['3', '4', '5', '6'],
                    correct: '5'
                },
                {
                    question: 'Compte les cercles',
                    image: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <circle cx="50" cy="50" r="10" fill="#FF5722" />
                        <circle cx="80" cy="50" r="10" fill="#FF5722" />
                        <circle cx="110" cy="50" r="10" fill="#FF5722" />
                        <circle cx="140" cy="50" r="10" fill="#FF5722" />
                    </svg>`,
                    options: ['3', '4', '5', '6'],
                    correct: '4'
                },
                {
                    question: 'Quel est le plus grand nombre ?',
                    options: ['3', '5', '1', '2'],
                    correct: '5'
                },
                {
                    question: 'Combien de doigts as-tu sur une main ?',
                    options: ['4', '5', '6', '10'],
                    correct: '5'
                },
                {
                    question: 'Quel est le premier nombre ?',
                    options: ['0', '1', '2', '10'],
                    correct: '1'
                }
            ]
        },
        {
            id: 'math-shapes',
            title: 'Les formes géométriques',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Comment s\'appelle cette forme ?',
                    image: `<svg width="100" height="100" viewBox="0 0 100 100">
                        <rect x="20" y="20" width="60" height="60" fill="#FF5722" />
                    </svg>`,
                    options: ['Cercle', 'Triangle', 'Carré', 'Rectangle'],
                    correct: 'Carré'
                },
                {
                    question: 'Combien de côtés a un triangle ?',
                    options: ['2', '3', '4', '5'],
                    correct: '3'
                },
                {
                    question: 'Quelle forme n\'a pas de coins ?',
                    options: ['Carré', 'Triangle', 'Rectangle', 'Cercle'],
                    correct: 'Cercle'
                },
                {
                    question: 'Comment s\'appelle cette forme ?',
                    image: `<svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="30" fill="#FF5722" />
                    </svg>`,
                    options: ['Carré', 'Triangle', 'Rectangle', 'Cercle'],
                    correct: 'Cercle'
                },
                {
                    question: 'Combien de côtés a un carré ?',
                    options: ['3', '4', '5', '6'],
                    correct: '4'
                },
                {
                    question: 'Quelle forme a 4 côtés mais pas tous égaux ?',
                    options: ['Carré', 'Triangle', 'Rectangle', 'Cercle'],
                    correct: 'Rectangle'
                },
                {
                    question: 'Comment s\'appelle cette forme ?',
                    image: `<svg width="100" height="100" viewBox="0 0 100 100">
                        <polygon points="50,20 80,80 20,80" fill="#FF5722" />
                    </svg>`,
                    options: ['Carré', 'Triangle', 'Rectangle', 'Cercle'],
                    correct: 'Triangle'
                },
                {
                    question: 'Quelle forme ressemble à une balle ?',
                    options: ['Carré', 'Triangle', 'Cercle', 'Rectangle'],
                    correct: 'Cercle'
                },
                {
                    question: 'Combien de côtés a un rectangle ?',
                    options: ['3', '4', '5', '6'],
                    correct: '4'
                },
                {
                    question: 'Quelle forme a tous ses côtés égaux ?',
                    options: ['Rectangle', 'Carré', 'Ovale', 'Losange'],
                    correct: 'Carré'
                }
            ]
        },
        {
            id: 'math-add',
            title: 'Addition simple',
            type: 'quiz',
            difficulty: 2,
            questions: [
                {
                    question: 'Combien font 3 + 2 ?',
                    options: ['4', '5', '6', '7'],
                    correct: '5'
                },
                {
                    question: 'Combien font 4 + 4 ?',
                    options: ['6', '7', '8', '9'],
                    correct: '8'
                },
                {
                    question: 'Combien font 5 + 3 ?',
                    options: ['7', '8', '9', '10'],
                    correct: '8'
                },
                {
                    question: 'Combien font 2 + 6 ?',
                    options: ['7', '8', '9', '6'],
                    correct: '8'
                },
                {
                    question: 'Combien font 1 + 7 ?',
                    options: ['7', '8', '9', '10'],
                    correct: '8'
                },
                {
                    question: 'Combien font 9 + 1 ?',
                    options: ['8', '9', '10', '11'],
                    correct: '10'
                },
                {
                    question: 'Combien font 6 + 2 ?',
                    options: ['6', '7', '8', '9'],
                    correct: '8'
                },
                {
                    question: 'Combien font 5 + 5 ?',
                    options: ['8', '9', '10', '11'],
                    correct: '10'
                },
                {
                    question: 'Combien font 3 + 4 ?',
                    options: ['5', '6', '7', '8'],
                    correct: '7'
                },
                {
                    question: 'Combien font 0 + 8 ?',
                    options: ['0', '8', '9', '10'],
                    correct: '8'
                }
            ]
        }
    ],
    langues: [
        {
            id: 'langue-alphabet',
            title: 'L\'alphabet',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quelle lettre vient après B ?',
                    options: ['A', 'C', 'D', 'E'],
                    correct: 'C'
                },
                {
                    question: 'Combien de voyelles y a-t-il dans l\'alphabet français ?',
                    options: ['4', '5', '6', '7'],
                    correct: '6'
                },
                {
                    question: 'Quelle est la dernière lettre de l\'alphabet ?',
                    options: ['X', 'Y', 'Z', 'W'],
                    correct: 'Z'
                },
                {
                    question: 'Quelle lettre vient avant D ?',
                    options: ['A', 'B', 'C', 'E'],
                    correct: 'C'
                },
                {
                    question: 'Quelle est la première lettre de l\'alphabet ?',
                    options: ['A', 'B', 'Z', 'E'],
                    correct: 'A'
                },
                {
                    question: 'Quelle lettre vient après Y ?',
                    options: ['V', 'W', 'X', 'Z'],
                    correct: 'Z'
                },
                {
                    question: 'Parmi ces lettres, laquelle est une voyelle ?',
                    options: ['B', 'C', 'D', 'E'],
                    correct: 'E'
                },
                {
                    question: 'Combien y a-t-il de lettres dans l\'alphabet français ?',
                    options: ['24', '25', '26', '27'],
                    correct: '26'
                },
                {
                    question: 'Quelle lettre vient après M ?',
                    options: ['L', 'N', 'O', 'P'],
                    correct: 'N'
                },
                {
                    question: 'Quelle lettre n\'est pas une voyelle ?',
                    options: ['A', 'E', 'I', 'B'],
                    correct: 'B'
                }
            ]
        },
        {
            id: 'langue-vocab',
            title: 'Vocabulaire des animaux',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel animal fait "Miaou" ?',
                    options: ['Chien', 'Chat', 'Vache', 'Mouton'],
                    correct: 'Chat'
                },
                {
                    question: 'Quel animal fait "Meuh" ?',
                    options: ['Chèvre', 'Cochon', 'Vache', 'Poule'],
                    correct: 'Vache'
                },
                {
                    question: 'Quel animal vit dans l\'eau ?',
                    options: ['Poisson', 'Lion', 'Éléphant', 'Girafe'],
                    correct: 'Poisson'
                },
                {
                    question: 'Quel animal a une trompe ?',
                    options: ['Girafe', 'Éléphant', 'Lion', 'Singe'],
                    correct: 'Éléphant'
                },
                {
                    question: 'Quel animal peut voler ?',
                    options: ['Chien', 'Chat', 'Poisson', 'Oiseau'],
                    correct: 'Oiseau'
                },
                {
                    question: 'Quel animal grimpe aux arbres ?',
                    options: ['Éléphant', 'Poisson', 'Singe', 'Vache'],
                    correct: 'Singe'
                },
                {
                    question: 'Quel animal a un long cou ?',
                    options: ['Girafe', 'Zèbre', 'Lion', 'Crocodile'],
                    correct: 'Girafe'
                },
                {
                    question: 'Quel animal fait "Ouaf ouaf" ?',
                    options: ['Chat', 'Vache', 'Chien', 'Mouton'],
                    correct: 'Chien'
                },
                {
                    question: 'Quel animal est le roi de la jungle ?',
                    options: ['Tigre', 'Lion', 'Éléphant', 'Girafe'],
                    correct: 'Lion'
                },
                {
                    question: 'Quel animal a des rayures noires et blanches ?',
                    options: ['Lion', 'Girafe', 'Zèbre', 'Éléphant'],
                    correct: 'Zèbre'
                }
            ]
        }
    ],
    sciences: [
        {
            id: 'science-sens',
            title: 'Les cinq sens',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Avec quel organe peut-on voir ?',
                    options: ['Nez', 'Oreille', 'Œil', 'Langue'],
                    correct: 'Œil'
                },
                {
                    question: 'Avec quel organe peut-on entendre ?',
                    options: ['Nez', 'Oreille', 'Œil', 'Langue'],
                    correct: 'Oreille'
                },
                {
                    question: 'Avec quel organe peut-on sentir les odeurs ?',
                    options: ['Nez', 'Oreille', 'Œil', 'Langue'],
                    correct: 'Nez'
                },
                {
                    question: 'Avec quel organe peut-on goûter ?',
                    options: ['Peau', 'Nez', 'Langue', 'Oreille'],
                    correct: 'Langue'
                },
                {
                    question: 'Avec quel sens peut-on distinguer le chaud du froid ?',
                    options: ['Ouïe', 'Odorat', 'Vue', 'Toucher'],
                    correct: 'Toucher'
                },
                {
                    question: 'Combien de sens avons-nous ?',
                    options: ['3', '4', '5', '6'],
                    correct: '5'
                },
                {
                    question: 'Quel sens utilises-tu quand tu écoutes de la musique ?',
                    options: ['Vue', 'Ouïe', 'Odorat', 'Goût'],
                    correct: 'Ouïe'
                },
                {
                    question: 'Quel sens utilises-tu quand tu manges une glace ?',
                    options: ['Vue', 'Ouïe', 'Toucher', 'Goût'],
                    correct: 'Goût'
                },
                {
                    question: 'Quel sens utilises-tu quand tu regardes un livre d\'images ?',
                    options: ['Vue', 'Ouïe', 'Odorat', 'Toucher'],
                    correct: 'Vue'
                },
                {
                    question: 'Quel sens utilises-tu quand tu sens une fleur ?',
                    options: ['Vue', 'Ouïe', 'Odorat', 'Goût'],
                    correct: 'Odorat'
                }
            ]
        },
        {
            id: 'science-animals',
            title: 'Les animaux',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel animal peut voler ?',
                    options: ['Poisson', 'Oiseau', 'Lion', 'Grenouille'],
                    correct: 'Oiseau'
                },
                {
                    question: 'Quel animal a une trompe ?',
                    options: ['Girafe', 'Éléphant', 'Tigre', 'Singe'],
                    correct: 'Éléphant'
                },
                {
                    question: 'Quel animal vit dans l\'océan ?',
                    options: ['Vache', 'Dauphin', 'Poule', 'Serpent'],
                    correct: 'Dauphin'
                },
                {
                    question: 'Quel animal a une carapace ?',
                    options: ['Tortue', 'Lion', 'Girafe', 'Oiseau'],
                    correct: 'Tortue'
                },
                {
                    question: 'Quel animal change de couleur pour se camoufler ?',
                    options: ['Tigre', 'Éléphant', 'Caméléon', 'Dauphin'],
                    correct: 'Caméléon'
                },
                {
                    question: 'Quel animal dort la tête en bas ?',
                    options: ['Oiseau', 'Singe', 'Chauve-souris', 'Poisson'],
                    correct: 'Chauve-souris'
                },
                {
                    question: 'Quel animal a huit pattes ?',
                    options: ['Fourmi', 'Araignée', 'Serpent', 'Papillon'],
                    correct: 'Araignée'
                },
                {
                    question: 'Quel animal est connu pour sa vitesse ?',
                    options: ['Tortue', 'Éléphant', 'Guépard', 'Escargot'],
                    correct: 'Guépard'
                },
                {
                    question: 'Quel animal pond des œufs ?',
                    options: ['Vache', 'Chat', 'Chien', 'Poule'],
                    correct: 'Poule'
                },
                {
                    question: 'Quel animal a des rayures ?',
                    options: ['Lion', 'Éléphant', 'Zèbre', 'Girafe'],
                    correct: 'Zèbre'
                }
            ]
        }
    ],
    arts: [
        {
            id: 'art-colors',
            title: 'Les couleurs',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quelle couleur obtient-on en mélangeant du bleu et du jaune ?',
                    options: ['Rouge', 'Orange', 'Vert', 'Violet'],
                    correct: 'Vert'
                },
                {
                    question: 'Quelle est la couleur du ciel par une journée ensoleillée ?',
                    options: ['Bleu', 'Vert', 'Rouge', 'Jaune'],
                    correct: 'Bleu'
                },
                {
                    question: 'Quelle est la couleur d\'une banane mûre ?',
                    options: ['Vert', 'Rouge', 'Jaune', 'Orange'],
                    correct: 'Jaune'
                },
                {
                    question: 'Quelle couleur obtient-on en mélangeant du rouge et du bleu ?',
                    options: ['Orange', 'Vert', 'Marron', 'Violet'],
                    correct: 'Violet'
                },
                {
                    question: 'Quelle est la couleur des feuilles en été ?',
                    options: ['Marron', 'Jaune', 'Orange', 'Vert'],
                    correct: 'Vert'
                },
                {
                    question: 'Quelle est la couleur du sang ?',
                    options: ['Bleu', 'Rouge', 'Vert', 'Jaune'],
                    correct: 'Rouge'
                },
                {
                    question: 'Quelle couleur obtient-on en mélangeant du rouge et du jaune ?',
                    options: ['Vert', 'Violet', 'Orange', 'Marron'],
                    correct: 'Orange'
                },
                {
                    question: 'Quelle est la couleur de la neige ?',
                    options: ['Blanc', 'Bleu', 'Gris', 'Transparent'],
                    correct: 'Blanc'
                },
                {
                    question: 'Quelles sont les trois couleurs primaires ?',
                    options: ['Rouge, vert, bleu', 'Rouge, jaune, bleu', 'Vert, orange, violet', 'Noir, blanc, gris'],
                    correct: 'Rouge, jaune, bleu'
                },
                {
                    question: 'Quelle est la couleur d\'une fraise mûre ?',
                    options: ['Vert', 'Jaune', 'Rouge', 'Orange'],
                    correct: 'Rouge'
                }
            ]
        },
        {
            id: 'art-music',
            title: 'Les instruments de musique',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel instrument a des touches noires et blanches ?',
                    options: ['Guitare', 'Flûte', 'Piano', 'Tambour'],
                    correct: 'Piano'
                },
                {
                    question: 'Quel instrument frappe-t-on pour en jouer ?',
                    options: ['Violon', 'Tambour', 'Flûte', 'Guitare'],
                    correct: 'Tambour'
                },
                {
                    question: 'Quel instrument a 6 cordes généralement ?',
                    options: ['Piano', 'Violon', 'Flûte', 'Guitare'],
                    correct: 'Guitare'
                },
                {
                    question: 'Quel instrument souffle-t-on pour en jouer ?',
                    options: ['Violon', 'Piano', 'Flûte', 'Tambour'],
                    correct: 'Flûte'
                },
                {
                    question: 'Quel instrument joue-t-on avec un archet ?',
                    options: ['Guitare', 'Violon', 'Piano', 'Trompette'],
                    correct: 'Violon'
                },
                {
                    question: 'Quel instrument est le plus grand ?',
                    options: ['Flûte', 'Violon', 'Contrebasse', 'Guitare'],
                    correct: 'Contrebasse'
                },
                {
                    question: 'Quel instrument de percussion est fait de deux disques métalliques ?',
                    options: ['Tambour', 'Cymbales', 'Triangle', 'Maracas'],
                    correct: 'Cymbales'
                },
                {
                    question: 'Quel instrument de musique est aussi le nom d\'un animal ?',
                    options: ['Tambour', 'Violon', 'Guitare', 'Trompette'],
                    correct: 'Guitare'
                },
                {
                    question: 'Quel instrument de musique joue-t-on en soufflant et en appuyant sur des pistons ?',
                    options: ['Trompette', 'Guitare', 'Violon', 'Piano'],
                    correct: 'Trompette'
                },
                {
                    question: 'Dans quel instrument faut-il mettre de l\'eau pour jouer ?',
                    options: ['Piano', 'Guitare', 'Harmonica', 'Verres musicaux'],
                    correct: 'Verres musicaux'
                }
            ]
        }
    ],
    sport: [
        {
            id: 'sport-moves',
            title: 'Les mouvements du corps',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quelle partie du corps utilise-t-on principalement pour courir ?',
                    options: ['Bras', 'Tête', 'Jambes', 'Dos'],
                    correct: 'Jambes'
                },
                {
                    question: 'Avec quoi lance-t-on une balle ?',
                    options: ['Pied', 'Main', 'Tête', 'Genou'],
                    correct: 'Main'
                },
                {
                    question: 'Que fait-on avec des rollers ?',
                    options: ['Nager', 'Courir', 'Sauter', 'Rouler'],
                    correct: 'Rouler'
                },
                {
                    question: 'Quelle action permet de se déplacer dans l\'eau ?',
                    options: ['Courir', 'Sauter', 'Nager', 'Ramper'],
                    correct: 'Nager'
                },
                {
                    question: 'Comment s\'appelle le mouvement qui consiste à se propulser vers le haut ?',
                    options: ['Courir', 'Sauter', 'Ramper', 'Tourner'],
                    correct: 'Sauter'
                },
                {
                    question: 'Quel mouvement fait-on lorsqu\'on fait du vélo ?',
                    options: ['Pédaler', 'Nager', 'Sauter', 'Glisser'],
                    correct: 'Pédaler'
                },
                {
                    question: 'Comment s\'appelle le mouvement où l\'on se déplace sur les genoux et les mains ?',
                    options: ['Ramper', 'Sauter', 'Nager', 'Courir'],
                    correct: 'Ramper'
                },
                {
                    question: 'Quelle partie du corps utilise-t-on pour s\'équilibrer sur un pied ?',
                    options: ['Bras', 'Tête', 'Jambes', 'Dos'],
                    correct: 'Jambes'
                },
                {
                    question: 'Quel mouvement fais-tu quand tu vas d\'un point à un autre rapidement ?',
                    options: ['Sauter', 'Courir', 'Se balancer', 'S\'étirer'],
                    correct: 'Courir'
                },
                {
                    question: 'Comment s\'appelle le mouvement où l\'on tourne autour de soi-même ?',
                    options: ['Pivoter', 'Glisser', 'Sauter', 'Lancer'],
                    correct: 'Pivoter'
                }
            ]
        },
        {
            id: 'sport-games',
            title: 'Les jeux sportifs',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Dans quel sport utilise-t-on un ballon rond ?',
                    options: ['Tennis', 'Football', 'Natation', 'Danse'],
                    correct: 'Football'
                },
                {
                    question: 'Quel sport se pratique dans l\'eau ?',
                    options: ['Vélo', 'Course', 'Natation', 'Football'],
                    correct: 'Natation'
                },
                {
                    question: 'Dans quel sport saute-t-on par-dessus des obstacles ?',
                    options: ['Natation', 'Football', 'Course d\'obstacles', 'Basket-ball'],
                    correct: 'Course d\'obstacles'
                },
                {
                    question: 'Dans quel sport lance-t-on le ballon dans un panier en hauteur ?',
                    options: ['Football', 'Rugby', 'Basket-ball', 'Volley-ball'],
                    correct: 'Basket-ball'
                },
                {
                    question: 'Dans quel sport utilise-t-on une raquette ?',
                    options: ['Football', 'Tennis', 'Natation', 'Vélo'],
                    correct: 'Tennis'
                },
                {
                    question: 'Quel sport se pratique sur la glace ?',
                    options: ['Natation', 'Football', 'Tennis', 'Patinage'],
                    correct: 'Patinage'
                },
                {
                    question: 'Dans quel sport frappe-t-on une balle avec un club ?',
                    options: ['Tennis', 'Football', 'Golf', 'Rugby'],
                    correct: 'Golf'
                },
                {
                    question: 'Quel sport se pratique en équipe avec un ballon ovale ?',
                    options: ['Football', 'Tennis', 'Rugby', 'Basket-ball'],
                    correct: 'Rugby'
                },
                {
                    question: 'Dans quel sport se déplace-t-on sur deux roues ?',
                    options: ['Natation', 'Course à pied', 'Vélo', 'Ski'],
                    correct: 'Vélo'
                },
                {
                    question: 'Quel sport utilise un filet au milieu du terrain ?',
                    options: ['Football', 'Volley-ball', 'Basket-ball', 'Rugby'],
                    correct: 'Volley-ball'
                }
            ]
        }
    ],
    metiers: [
        {
            id: 'metiers-categories',
            title: 'Les catégories de métiers',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Qui construit les maisons ?',
                    options: ['Médecin', 'Architecte', 'Boulanger', 'Enseignant'],
                    correct: 'Architecte'
                },
                {
                    question: 'Quel professionnel soigne les malades ?',
                    options: ['Pompier', 'Médecin', 'Policier', 'Coiffeur'],
                    correct: 'Médecin'
                },
                {
                    question: 'Qui nous aide à apprendre ?',
                    options: ['Cuisinier', 'Pilote', 'Enseignant', 'Jardinier'],
                    correct: 'Enseignant'
                },
                {
                    question: 'Qui fabrique le pain ?',
                    options: ['Boulanger', 'Boucher', 'Pâtissier', 'Cuisinier'],
                    correct: 'Boulanger'
                },
                {
                    question: 'Quel métier consiste à protéger les gens ?',
                    options: ['Pompier', 'Jardinier', 'Musicien', 'Photographe'],
                    correct: 'Pompier'
                },
                {
                    question: 'Qui cultive les fruits et légumes ?',
                    options: ['Pêcheur', 'Agriculteur', 'Fleuriste', 'Vétérinaire'],
                    correct: 'Agriculteur'
                },
                {
                    question: 'Qui répare les voitures ?',
                    options: ['Plombier', 'Électricien', 'Mécanicien', 'Chauffeur'],
                    correct: 'Mécanicien'
                },
                {
                    question: 'Qui vend des médicaments ?',
                    options: ['Pharmacien', 'Infirmier', 'Médecin', 'Biologiste'],
                    correct: 'Pharmacien'
                },
                {
                    question: 'Qui s\'occupe des animaux malades ?',
                    options: ['Médecin', 'Infirmier', 'Vétérinaire', 'Zoologiste'],
                    correct: 'Vétérinaire'
                },
                {
                    question: 'Qui dirige un restaurant ?',
                    options: ['Serveur', 'Chef cuisinier', 'Pâtissier', 'Hôtelier'],
                    correct: 'Chef cuisinier'
                }
            ]
        },
        {
            id: 'metiers-outils',
            title: 'Les outils des professionnels',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel outil utilise le médecin pour écouter ton cœur ?',
                    options: ['Thermomètre', 'Stéthoscope', 'Marteau', 'Loupe'],
                    correct: 'Stéthoscope'
                },
                {
                    question: 'Quel outil utilise le peintre ?',
                    options: ['Marteau', 'Pinceau', 'Règle', 'Ciseau'],
                    correct: 'Pinceau'
                },
                {
                    question: 'De quoi a besoin un jardinier pour arroser les plantes ?',
                    options: ['Ciseau', 'Râteau', 'Arrosoir', 'Pelle'],
                    correct: 'Arrosoir'
                },
                {
                    question: 'Quel outil utilise le pompier pour éteindre un feu ?',
                    options: ['Marteau', 'Lance à eau', 'Pelle', 'Corde'],
                    correct: 'Lance à eau'
                },
                {
                    question: 'Avec quoi le boulanger pétrit-il la pâte ?',
                    options: ['Ses mains', 'Une cuillère', 'Un fouet', 'Une fourchette'],
                    correct: 'Ses mains'
                },
                {
                    question: 'Quel est l\'outil principal du coiffeur ?',
                    options: ['Brosse', 'Peigne', 'Ciseaux', 'Sèche-cheveux'],
                    correct: 'Ciseaux'
                },
                {
                    question: 'Que porte un policier pour être reconnu ?',
                    options: ['Un uniforme', 'Un chapeau', 'Des gants', 'Des bottes'],
                    correct: 'Un uniforme'
                },
                {
                    question: 'Quel instrument utilise un dentiste ?',
                    options: ['Stéthoscope', 'Miroir dentaire', 'Marteau', 'Thermomètre'],
                    correct: 'Miroir dentaire'
                },
                {
                    question: 'Qu\'utilise le facteur pour livrer le courrier ?',
                    options: ['Vélo', 'Sac', 'Téléphone', 'Ordinateur'],
                    correct: 'Sac'
                },
                {
                    question: 'Quel outil un astronome utilise-t-il pour observer les étoiles ?',
                    options: ['Microscope', 'Jumelles', 'Télescope', 'Loupe'],
                    correct: 'Télescope'
                }
            ]
        },
        {
            id: 'metiers-futur',
            title: 'Les métiers du futur',
            type: 'quiz',
            difficulty: 2,
            questions: [
                {
                    question: 'Qui pourrait concevoir des robots dans le futur ?',
                    options: ['Agriculteur', 'Ingénieur en robotique', 'Boulanger', 'Professeur'],
                    correct: 'Ingénieur en robotique'
                },
                {
                    question: 'Quel métier pourrait aider à protéger la planète ?',
                    options: ['Écologiste', 'Astronaute', 'Pilote', 'Banquier'],
                    correct: 'Écologiste'
                },
                {
                    question: 'Qui pourrait créer des applications et des jeux vidéo ?',
                    options: ['Médecin', 'Développeur informatique', 'Facteur', 'Coiffeur'],
                    correct: 'Développeur informatique'
                },
                {
                    question: 'Quel métier pourrait nous aider à explorer l\'espace ?',
                    options: ['Astronaute', 'Professeur', 'Vétérinaire', 'Agriculteur'],
                    correct: 'Astronaute'
                },
                {
                    question: 'Qui pourrait cultiver des légumes dans l\'espace ?',
                    options: ['Agriculteur spatial', 'Vétérinaire', 'Pilote', 'Coiffeur'],
                    correct: 'Agriculteur spatial'
                },
                {
                    question: 'Quel métier pourrait aider à créer des énergies propres ?',
                    options: ['Mécanicien', 'Boulanger', 'Ingénieur en énergie renouvelable', 'Facteur'],
                    correct: 'Ingénieur en énergie renouvelable'
                },
                {
                    question: 'Qui pourrait concevoir les villes du futur ?',
                    options: ['Urbaniste', 'Boulanger', 'Facteur', 'Enseignant'],
                    correct: 'Urbaniste'
                },
                {
                    question: 'Quel métier pourrait soigner avec des technologies avancées ?',
                    options: ['Médecin-robot', 'Agriculteur', 'Pilote', 'Danseur'],
                    correct: 'Médecin-robot'
                },
                {
                    question: 'Qui pourrait créer des aliments du futur ?',
                    options: ['Facteur', 'Ingénieur alimentaire', 'Pompier', 'Danseur'],
                    correct: 'Ingénieur alimentaire'
                },
                {
                    question: 'Quel métier pourrait nous aider à communiquer avec des robots ?',
                    options: ['Médiateur homme-machine', 'Boulanger', 'Coiffeur', 'Dentiste'],
                    correct: 'Médiateur homme-machine'
                }
            ]
        }
    ],
    geographie: [
        {
            id: 'geo-continents',
            title: 'Les continents et océans',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Combien y a-t-il de continents sur Terre ?',
                    options: ['4', '5', '6', '7'],
                    correct: '7'
                },
                {
                    question: 'Sur quel continent se trouve l\'Algérie ?',
                    options: ['Europe', 'Asie', 'Afrique', 'Amérique'],
                    correct: 'Afrique'
                },
                {
                    question: 'Quel est le plus grand océan du monde ?',
                    options: ['Océan Atlantique', 'Océan Indien', 'Océan Pacifique', 'Océan Arctique'],
                    correct: 'Océan Pacifique'
                },
                {
                    question: 'Quel continent est le plus froid ?',
                    options: ['Europe', 'Antarctique', 'Amérique du Nord', 'Asie'],
                    correct: 'Antarctique'
                },
                {
                    question: 'Quel continent est le plus peuplé ?',
                    options: ['Europe', 'Afrique', 'Amérique', 'Asie'],
                    correct: 'Asie'
                },
                {
                    question: 'Quel est le plus petit continent ?',
                    options: ['Europe', 'Océanie', 'Antarctique', 'Amérique du Sud'],
                    correct: 'Océanie'
                },
                {
                    question: 'Quelle mer borde l\'Algérie au nord ?',
                    options: ['Mer Rouge', 'Mer Méditerranée', 'Mer Noire', 'Mer Caspienne'],
                    correct: 'Mer Méditerranée'
                },
                {
                    question: 'Sur quel continent peut-on voir des kangourous dans la nature ?',
                    options: ['Afrique', 'Asie', 'Europe', 'Océanie'],
                    correct: 'Océanie'
                },
                {
                    question: 'Quel est le continent le plus chaud ?',
                    options: ['Afrique', 'Asie', 'Amérique du Sud', 'Europe'],
                    correct: 'Afrique'
                },
                {
                    question: 'Quel océan se trouve entre l\'Afrique et l\'Amérique ?',
                    options: ['Océan Pacifique', 'Océan Indien', 'Océan Atlantique', 'Océan Arctique'],
                    correct: 'Océan Atlantique'
                }
            ]
        },
        {
            id: 'geo-algerie',
            title: 'Les régions d\'Algérie',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quelle est la capitale de l\'Algérie ?',
                    options: ['Oran', 'Constantine', 'Alger', 'Annaba'],
                    correct: 'Alger'
                },
                {
                    question: 'Quelle grande chaîne de montagnes traverse l\'Algérie ?',
                    options: ['Les Alpes', 'L\'Atlas', 'L\'Himalaya', 'Les Andes'],
                    correct: 'L\'Atlas'
                },
                {
                    question: 'Quel est le plus grand désert d\'Algérie ?',
                    options: ['Le Sahara', 'Le Kalahari', 'Le Gobi', 'Le Namib'],
                    correct: 'Le Sahara'
                },
                {
                    question: 'Quelle ville algérienne est surnommée "la ville blanche" ?',
                    options: ['Alger', 'Oran', 'Annaba', 'Tlemcen'],
                    correct: 'Alger'
                },
                {
                    question: 'Quelle mer borde l\'Algérie au nord ?',
                    options: ['Mer Rouge', 'Mer Noire', 'Mer Méditerranée', 'Mer Morte'],
                    correct: 'Mer Méditerranée'
                },
                {
                    question: 'Quelle ville est connue comme "la ville des ponts suspendus" ?',
                    options: ['Alger', 'Oran', 'Constantine', 'Annaba'],
                    correct: 'Constantine'
                },
                {
                    question: 'Quelle région d\'Algérie est connue pour ses dattes ?',
                    options: ['La Kabylie', 'Les Aurès', 'Le M\'zab', 'Le Mzab'],
                    correct: 'Le M\'zab'
                },
                {
                    question: 'Quelle est la plus grande ville portuaire d\'Algérie ?',
                    options: ['Alger', 'Oran', 'Béjaïa', 'Annaba'],
                    correct: 'Oran'
                },
                {
                    question: 'Dans quelle région se trouve le parc national du Tassili ?',
                    options: ['Au nord', 'Au sud', 'À l\'est', 'À l\'ouest'],
                    correct: 'Au sud'
                },
                {
                    question: 'Quel pays ne partage PAS de frontière avec l\'Algérie ?',
                    options: ['Maroc', 'Tunisie', 'Égypte', 'Mali'],
                    correct: 'Égypte'
                }
            ]
        },
        {
            id: 'geo-monuments',
            title: 'Les monuments célèbres',
            type: 'quiz',
            difficulty: 1,
            questions: [
                {
                    question: 'Quel monument célèbre se trouve à Paris ?',
                    options: ['La Tour Eiffel', 'Le Colisée', 'La Statue de la Liberté', 'La Grande Muraille'],
                    correct: 'La Tour Eiffel'
                },
                {
                    question: 'Quel monument algérien célèbre a été construit en 1982 ?',
                    options: ['La Casbah d\'Alger', 'Le Makam Echahid (Monument des Martyrs)', 'Djamaa el Djazaïr', 'Le pont de Constantine'],
                    correct: 'Le Makam Echahid (Monument des Martyrs)'
                },
                {
                    question: 'Où se trouve la Grande Muraille ?',
                    options: ['Japon', 'Égypte', 'Chine', 'Brésil'],
                    correct: 'Chine'
                },
                {
                    question: 'Quel monument algérien est classé au patrimoine mondial de l\'UNESCO ?',
                    options: ['Le Makam Echahid', 'La Grande Poste d\'Alger', 'La Casbah d\'Alger', 'Djamaa el Djazaïr'],
                    correct: 'La Casbah d\'Alger'
                },
                {
                    question: 'Quel monument est connu comme étant l\'une des sept merveilles du monde antique ?',
                    options: ['Les pyramides d\'Égypte', 'La Tour Eiffel', 'Le Colisée', 'La Statue de la Liberté'],
                    correct: 'Les pyramides d\'Égypte'
                },
                {
                    question: 'Quelle est la plus grande mosquée d\'Algérie ?',
                    options: ['La Grande Mosquée d\'Alger (Djamaa el Djazaïr)', 'La Grande Mosquée de Tlemcen', 'Ketchaoua', 'Ibn Badis'],
                    correct: 'La Grande Mosquée d\'Alger (Djamaa el Djazaïr)'
                },
                {
                    question: 'Où se trouve le Taj Mahal ?',
                    options: ['Inde', 'Pakistan', 'Iran', 'Égypte'],
                    correct: 'Inde'
                },
                {
                    question: 'Quel monument romain est bien préservé en Algérie ?',
                    options: ['Timgad', 'Colisée', 'Panthéon', 'Forum romain'],
                    correct: 'Timgad'
                },
                {
                    question: 'Dans quelle ville algérienne se trouve le Mausolée Royal Maurétanien ?',
                    options: ['Alger', 'Tipaza', 'Constantine', 'Oran'],
                    correct: 'Tipaza'
                },
                {
                    question: 'Quel monument est le symbole de la ville de New York ?',
                    options: ['L\'Empire State Building', 'La Statue de la Liberté', 'Le Golden Gate', 'La Maison Blanche'],
                    correct: 'La Statue de la Liberté'
                }
            ]
        }
    ]
};

// Audio explanations for modules and activities
const moduleAudioExplanations = {
    maths: {
        moduleIntro: "Bienvenue dans le monde des mathématiques ! Ici, tu vas découvrir les nombres, apprendre à compter, à additionner et bien plus encore. Prépare-toi pour une aventure pleine de défis amusants !",
        activities: {
            'math-numbers': "Aujourd'hui, nous allons explorer les nombres de 1 à 10. Sais-tu compter jusqu'à 10 ? Regarde bien les images et compte attentivement les objets pour trouver la bonne réponse !",
            'math-shapes': "Les formes sont partout autour de nous ! Un ballon est un cercle, une boîte est un carré ou un rectangle. Dans cette activité, tu vas apprendre à reconnaître ces formes.",
            'math-add': "L'addition, c'est quand on met ensemble deux groupes d'objets et qu'on compte combien il y en a au total. Par exemple, 2 pommes plus 3 pommes font 5 pommes en tout !"
        }
    },
    langues: {
        moduleIntro: "Bienvenue dans l'univers des langues ! Ici, tu vas apprendre les lettres, découvrir de nouveaux mots et même composer tes premières phrases. C'est le début d'une grande aventure !",
        activities: {
            'langue-alphabet': "L'alphabet est la base de notre langage. Il y a 26 lettres, de A à Z. Chaque lettre a un son spécial. Ensemble, nous allons apprendre à les reconnaître !",
            'langue-vocab': "Les animaux sont fascinants, n'est-ce pas ? Dans cette activité, tu vas apprendre comment ils s'appellent et quels sons ils font. Le chat fait miaou, et le chien fait ouaf !"
        }
    },
    sciences: {
        moduleIntro: "Bienvenue dans le laboratoire des sciences ! Ici, nous allons observer, expérimenter et découvrir comment fonctionne notre monde. Es-tu prêt à devenir un vrai scientifique ?",
        activities: {
            'science-sens': "Nous avons cinq sens merveilleux : la vue avec nos yeux, l'ouïe avec nos oreilles, l'odorat avec notre nez, le goût avec notre langue et le toucher avec notre peau. Découvrons-les ensemble !",
            'science-animals': "Le monde animal est plein de surprises ! Certains animaux volent, d'autres nagent ou rampent. Dans cette activité, nous allons découvrir où ils vivent et comment ils se déplacent."
        }
    },
    arts: {
        moduleIntro: "Bienvenue dans l'atelier des arts ! Ici, tu vas explorer les couleurs, les formes, les sons et laisser parler ton imagination. Prépare-toi à créer des chefs-d'œuvre !",
        activities: {
            'art-colors': "Les couleurs sont magiques ! Le rouge, le bleu, le jaune sont des couleurs primaires. En les mélangeant, tu peux créer de nouvelles couleurs comme le vert, l'orange ou le violet !",
            'art-music': "La musique est un langage universel. Elle peut nous rendre heureux, triste ou nous donner envie de danser. Aujourd'hui, nous allons découvrir différents instruments de musique !"
        }
    },
    sport: {
        moduleIntro: "Bienvenue dans l'univers du sport ! Ici, nous allons bouger, sauter, courir et jouer ensemble. Es-tu prêt à te dépenser et à t'amuser ?",
        activities: {
            'sport-moves': "Ton corps est extraordinaire ! Tu peux courir, sauter, te pencher, t'étirer et faire plein d'autres mouvements. Aujourd'hui, nous allons explorer toutes ces possibilités !",
            'sport-games': "Les jeux sportifs sont amusants et bons pour la santé. Ils nous apprennent aussi à jouer en équipe et à respecter des règles. Découvrons ensemble ces jeux passionnants !"
        }
    },
    metiers: {
        moduleIntro: "Bienvenue dans le monde des métiers ! Ici, tu vas découvrir toutes sortes de professions, des outils qu'elles utilisent et même les métiers qui pourraient exister dans le futur. Es-tu prêt à explorer les nombreuses possibilités pour ton avenir ?",
        activities: {
            'metiers-categories': "Il existe tellement de métiers différents ! Certaines personnes construisent des maisons, d'autres soignent les malades, cuisinent de délicieux repas ou enseignent aux enfants. Aujourd'hui, nous allons découvrir ces différentes catégories de métiers !",
            'metiers-outils': "Chaque métier utilise des outils spéciaux. Le médecin a son stéthoscope, le peintre a son pinceau, et le jardinier a sa pelle. Dans cette activité, tu vas apprendre quels outils sont utilisés par chaque professionnel !",
            'metiers-futur': "Le monde change très vite et de nouveaux métiers apparaissent. Dans le futur, nous pourrions avoir des agriculteurs dans l'espace, des médecins-robots ou des ingénieurs qui créent des énergies propres. Découvrons ensemble ces métiers passionnants du futur !"
        }
    },
    geographie: {
        moduleIntro: "Bienvenue dans le monde merveilleux de la géographie ! Ici, tu vas explorer les continents, les océans, découvrir les régions d'Algérie et visiter des monuments célèbres du monde entier. Prépare-toi pour un voyage extraordinaire !",
        activities: {
            'geo-continents': "Notre planète Terre est composée de continents et d'océans. Il y a sept continents : l'Afrique, l'Amérique, l'Antarctique, l'Asie, l'Europe, l'Océanie et l'Amérique du Sud. Dans cette activité, tu vas découvrir leurs caractéristiques et où ils se trouvent !",
            'geo-algerie': "L'Algérie est un pays magnifique avec de nombreuses régions différentes. Du nord au sud, il y a la côte méditerranéenne, les montagnes de l'Atlas, les hauts plateaux et le grand désert du Sahara. Explorons ensemble la diversité de ce beau pays !",
            'geo-monuments': "Partout dans le monde et en Algérie, il existe des monuments impressionnants. Certains sont très anciens, d'autres sont modernes. Ils racontent l'histoire et la culture des peuples. Dans cette activité, nous allons découvrir ces trésors architecturaux !"
        }
    }
};

// Définition des badges
const availableBadges = [
    { id: 'math-starter', emoji: '🔢', title: 'Mathématicien débutant', module: 'maths', condition: 'firstActivity' },
    { id: 'math-pro', emoji: '📊', title: 'Expert des nombres', module: 'maths', condition: 'progress50' },
    { id: 'langue-starter', emoji: '📝', title: 'Linguiste débutant', module: 'langues', condition: 'firstActivity' },
    { id: 'langue-pro', emoji: '📚', title: 'Maître des mots', module: 'langues', condition: 'progress50' },
    { id: 'science-starter', emoji: '🔬', title: 'Scientifique débutant', module: 'sciences', condition: 'firstActivity' },
    { id: 'science-pro', emoji: '🧪', title: 'Expert scientifique', module: 'sciences', condition: 'progress50' },
    { id: 'art-starter', emoji: '🎨', title: 'Artiste débutant', module: 'arts', condition: 'firstActivity' },
    { id: 'art-pro', emoji: '🎭', title: 'Maître artiste', module: 'arts', condition: 'progress50' },
    { id: 'sport-starter', emoji: '🏃', title: 'Sportif débutant', module: 'sport', condition: 'firstActivity' },
    { id: 'sport-pro', emoji: '🏆', title: 'Champion sportif', module: 'sport', condition: 'progress50' },
    { id: 'metiers-starter', emoji: '👷', title: 'Explorateur des métiers', module: 'metiers', condition: 'firstActivity' },
    { id: 'metiers-pro', emoji: '🔧', title: 'Expert des professions', module: 'metiers', condition: 'progress50' },
    { id: 'geo-starter', emoji: '🌍', title: 'Géographe débutant', module: 'geographie', condition: 'firstActivity' },
    { id: 'geo-pro', emoji: '🗺️', title: 'Maître explorateur', module: 'geographie', condition: 'progress50' },
    { id: 'all-rounder', emoji: '🌟', title: 'Polyvalent', condition: 'allModules' },
    { id: 'points-100', emoji: '💯', title: '100 points', condition: 'points100' }
];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initAvatarSelection();
    initModuleSelection();
    initButtonListeners();
    initAssistant();
    
    // Vérifier si des données utilisateur sont disponibles dans le localStorage
    const savedUser = localStorage.getItem('eduFunUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        updateUI();
        switchScreen('modules-screen');
    }
});

// Initialisation des quêtes
function initializeQuests() {
    appState.currentUser.currentQuests = [];
    
    questTemplates.forEach(quest => {
        const newQuest = JSON.parse(JSON.stringify(quest)); // Deep copy
        appState.currentUser.currentQuests.push(newQuest);
    });
    
    saveUserData();
}

// Initialisation de la sélection d'avatar
function initAvatarSelection() {
    const avatars = document.querySelectorAll('.avatar-options .avatar');
    
    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            // Supprimer la classe selected de tous les avatars
            avatars.forEach(a => a.classList.remove('selected'));
            // Ajouter la classe selected à l'avatar cliqué
            avatar.classList.add('selected');
            // Mettre à jour l'état de l'application
            appState.currentUser.avatar = avatar.getAttribute('data-id');
        });
    });
    
    // Sélectionner par défaut le premier avatar
    avatars[0].classList.add('selected');
}

// Initialisation de la sélection de module
function initModuleSelection() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.getAttribute('data-module');
            
            if (moduleId === 'dashboard') {
                updateDashboard();
                switchScreen('dashboard-screen');
            } else {
                appState.currentModule = moduleId;
                loadModuleActivities(moduleId);
            }
        });
    });
}

// Initialisation des écouteurs d'événements pour les boutons
function initButtonListeners() {
    // Bouton pour commencer l'aventure
    document.getElementById('start-adventure').addEventListener('click', () => {
        const userName = document.getElementById('user-name').value.trim();
        
        if (userName) {
            appState.currentUser.name = userName;
            updateUI();
            saveUserData();
            switchScreen('modules-screen');
        } else {
            alert('Merci d\'entrer ton prénom pour commencer l\'aventure !');
        }
    });
    
    // Bouton pour revenir aux modules depuis l'écran d'activité
    document.getElementById('back-to-modules').addEventListener('click', () => {
        switchScreen('modules-screen');
    });
    
    // Bouton pour revenir aux modules depuis le tableau de bord
    document.getElementById('back-to-modules-from-dashboard').addEventListener('click', () => {
        switchScreen('modules-screen');
    });
    
    // Bouton pour fermer la popup de récompense
    document.getElementById('close-reward').addEventListener('click', () => {
        document.getElementById('reward-popup').classList.remove('active');
    });
    
    // Événements pour la popup d'accès parents
    document.querySelector('.avatar-container').addEventListener('click', () => {
        document.getElementById('parent-login').classList.add('active');
    });
    
    document.getElementById('parent-login-cancel').addEventListener('click', () => {
        document.getElementById('parent-login').classList.remove('active');
    });
    
    document.getElementById('parent-login-submit').addEventListener('click', () => {
        const parentCode = document.getElementById('parent-code').value;
        
        // Code parent simple pour la démo: 1234
        if (parentCode === '1234') {
            alert('Accès aux statistiques détaillées sera disponible dans la prochaine mise à jour !');
            document.getElementById('parent-login').classList.remove('active');
        } else {
            alert('Code incorrect. Veuillez réessayer.');
        }
    });
}

// Mise à jour de l'interface utilisateur
function updateUI() {
    // Mettre à jour l'avatar
    const currentAvatar = document.getElementById('current-avatar');
    currentAvatar.className = 'avatar';
    currentAvatar.classList.add(`avatar-${appState.currentUser.avatar}`);
    
    // Mettre à jour le compteur de points
    document.getElementById('points-counter').textContent = appState.currentUser.points;
    
    // Animation des points si nécessaire
    if (appState.currentUser.points > 0) {
        gsap.from('#points-counter', {
            duration: 0.5,
            scale: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
    }
}

// Changement d'écran
function switchScreen(screenId) {
    // Cacher tous les écrans
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher l'écran demandé
    document.getElementById(screenId).classList.add('active');
    
    // Mettre à jour l'état de l'application
    appState.currentScreen = screenId;
}

// Chargement des activités d'un module
function loadModuleActivities(moduleId) {
    const activityContent = document.getElementById('activity-content');
    activityContent.innerHTML = '';
    
    // Titre du module
    const moduleTitle = {
        maths: 'Mathématiques',
        langues: 'Langues',
        sciences: 'Sciences',
        arts: 'Arts',
        sport: 'Éducation physique',
        metiers: 'Métiers',
        geographie: 'Géographie'
    }[moduleId];
    
    document.getElementById('activity-title').textContent = moduleTitle;
    
    // Afficher le personnage du module
    const character = appState.characters[moduleId];
    const characterHTML = `
        <div class="character-dialog">
            <div class="character-avatar" style="background-color: ${character.color}">${character.avatar}</div>
            <h3>${character.name}</h3>
            <p class="character-message">${character.intro}</p>
        </div>
    `;
    
    // Ajout du lecteur audio pour l'explication du module
    const audioExplanation = moduleAudioExplanations[moduleId].moduleIntro;
    const audioHTML = `
        <div class="audio-player" data-text="${audioExplanation}">
            <div class="audio-control" onclick="toggleAudioExplanation(this)">▶️</div>
            <div class="audio-status">
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
            </div>
            <div class="audio-progress">
                <div class="audio-progress-bar"></div>
            </div>
            <div class="audio-time">0:00</div>
        </div>
    `;
    
    // Création de la liste des activités
    const activities = moduleActivities[moduleId];
    let activitiesHTML = '';
    
    if (activities && activities.length > 0) {
        activities.forEach(activity => {
            const isCompleted = appState.currentUser.completedActivities.includes(activity.id);
            
            activitiesHTML += `
                <div class="activity-item ${isCompleted ? 'completed' : ''}">
                    <div>
                        <h3>${activity.title} ${isCompleted ? '✓' : ''}</h3>
                        <p>Difficulté : ${'⭐'.repeat(activity.difficulty)}</p>
                    </div>
                    <button class="primary-button start-activity" data-activity-id="${activity.id}">
                        ${isCompleted ? 'Refaire' : 'Commencer'}
                    </button>
                </div>
            `;
        });
    } else {
        activitiesHTML = '<p>Pas d\'activités disponibles pour le moment.</p>';
    }
    
    activityContent.innerHTML = characterHTML + audioHTML + activitiesHTML;
    
    // Ajouter des écouteurs d'événements pour démarrer les activités
    document.querySelectorAll('.start-activity').forEach(button => {
        button.addEventListener('click', (e) => {
            const activityId = e.target.getAttribute('data-activity-id');
            startActivity(moduleId, activityId);
        });
    });
    
    switchScreen('activity-screen');
}

// Démarrer une activité
function startActivity(moduleId, activityId) {
    const activity = moduleActivities[moduleId].find(a => a.id === activityId);
    
    if (!activity) return;
    
    // Préparer le contenu de l'activité avec l'audio explicatif
    const activityContent = document.getElementById('activity-content');
    
    // Ajout de l'explication audio pour cette activité spécifique
    const audioExplanation = moduleAudioExplanations[moduleId].activities[activityId];
    const audioHTML = `
        <div class="audio-player" data-text="${audioExplanation}">
            <div class="audio-control" onclick="toggleAudioExplanation(this)">▶️</div>
            <div class="audio-status">
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
            </div>
            <div class="audio-progress">
                <div class="audio-progress-bar"></div>
            </div>
            <div class="audio-time">0:00</div>
        </div>
    `;
    
    if (activity.type === 'quiz') {
        renderQuiz(activity, moduleId, audioHTML);
    }
}

// Rendre un quiz
function renderQuiz(quiz, moduleId, audioHTML = '') {
    const activityContent = document.getElementById('activity-content');
    
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
    
    // Intégrer l'explication audio au début du quiz
    if (audioHTML) {
        const audioDiv = document.createElement('div');
        audioDiv.innerHTML = audioHTML;
        quizContainer.appendChild(audioDiv.firstChild);
    }
    
    const questions = quiz.questions.map((q, index) => {
        return `
            <div class="question" data-index="${index}">
                <h3>Question ${index + 1} : ${q.question}</h3>
                ${q.image ? q.image : ''}
                <div class="options">
                    ${q.options.map((option, optIndex) => `
                        <div class="option" data-option="${option}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    quizContainer.innerHTML = questions[0];
    
    const nextButton = document.createElement('button');
    nextButton.className = 'primary-button';
    nextButton.id = 'next-question';
    nextButton.textContent = 'Question suivante';
    nextButton.style.display = 'none';
    
    const finishButton = document.createElement('button');
    finishButton.className = 'primary-button';
    finishButton.id = 'finish-quiz';
    finishButton.textContent = 'Terminer';
    finishButton.style.display = 'none';
    
    quizContainer.appendChild(nextButton);
    quizContainer.appendChild(finishButton);
    
    activityContent.innerHTML = '';
    activityContent.appendChild(quizContainer);
    
    // Variables pour suivre le quiz
    let currentQuestion = 0;
    let correctAnswers = 0;
    let hasAnswered = false;
    
    // Fonction pour vérifier la réponse
    function checkAnswer(selectedOption) {
        if (hasAnswered) return;
        
        hasAnswered = true;
        const question = quiz.questions[currentQuestion];
        const isCorrect = selectedOption === question.correct;
        
        if (isCorrect) {
            correctAnswers++;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
        // Marquer les options comme correctes ou incorrectes
        document.querySelectorAll('.option').forEach(option => {
            if (option.getAttribute('data-option') === question.correct) {
                option.classList.add('correct');
            } else if (option.getAttribute('data-option') === selectedOption && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Afficher le bouton pour la question suivante ou pour terminer
        if (currentQuestion < quiz.questions.length - 1) {
            nextButton.style.display = 'block';
        } else {
            finishButton.style.display = 'block';
        }
    }
    
    // Écouteur d'événements pour les options
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('option') && !hasAnswered) {
            const selectedOption = e.target.getAttribute('data-option');
            checkAnswer(selectedOption);
        }
    });
    
    // Écouteur d'événements pour le bouton suivant
    nextButton.addEventListener('click', () => {
        currentQuestion++;
        hasAnswered = false;
        
        const questionElement = document.querySelector('.question');
        questionElement.innerHTML = `
            <h3>Question ${currentQuestion + 1} : ${quiz.questions[currentQuestion].question}</h3>
            ${quiz.questions[currentQuestion].image ? quiz.questions[currentQuestion].image : ''}
            <div class="options">
                ${quiz.questions[currentQuestion].options.map((option, optIndex) => `
                    <div class="option" data-option="${option}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        nextButton.style.display = 'none';
    });
    
    // Écouteur d'événements pour le bouton terminer
    finishButton.addEventListener('click', () => {
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
        
        // Vérifier si l'activité est déjà complétée
        const isNewCompletion = !appState.currentUser.completedActivities.includes(quiz.id);
        
        // Ajouter des points à l'utilisateur si c'est une nouvelle complétion
        if (isNewCompletion) {
            const earnedPoints = stars * quiz.difficulty * 10;
            appState.currentUser.points += earnedPoints;
            
            // Mettre à jour le progrès du module
            updateModuleProgress(moduleId, quiz.difficulty * 5);
            
            // Ajouter l'activité aux activités complétées
            appState.currentUser.completedActivities.push(quiz.id);
            
            // Vérifier les badges
            checkAndAwardBadges(moduleId);
        }
        
        // Mettre à jour l'interface utilisateur
        updateUI();
        
        // Afficher le résultat
        const resultHTML = `
            <div class="quiz-result">
                <h3>Quiz terminé !</h3>
                <p>Tu as obtenu ${correctAnswers} réponses correctes sur ${quiz.questions.length}.</p>
                <div class="result-stars">${'⭐'.repeat(stars)}</div>
                ${isNewCompletion ? `<p>Tu as gagné ${stars * quiz.difficulty * 10} points !</p>` : ''}
                <button id="return-to-activities" class="primary-button">Retour aux activités</button>
            </div>
        `;
        
        activityContent.innerHTML = resultHTML;
        
        // Écouteur d'événements pour le bouton de retour
        document.getElementById('return-to-activities').addEventListener('click', () => {
            loadModuleActivities(moduleId);
        });
        
        // Sauvegarder les données de l'utilisateur
        saveUserData();
        
        // Vérifier l'achèvement de la quête
        checkQuestCompletion(quiz.id, moduleId);
    });
}

// Vérifie l'achèvement de la quête après une activité
function checkQuestCompletion(activityId, moduleId) {
    return;
}

// Mise à jour du progrès d'un module
function updateModuleProgress(moduleId, increment) {
    appState.currentUser.progress[moduleId] += increment;
    
    // Limiter le progrès à 100%
    if (appState.currentUser.progress[moduleId] > 100) {
        appState.currentUser.progress[moduleId] = 100;
    }
}

// Mise à jour du tableau de bord
function updateDashboard() {
    // Mettre à jour les barres de progression
    Object.keys(appState.currentUser.progress).forEach(module => {
        const progress = appState.currentUser.progress[module];
        const progressElement = document.getElementById(`${module}-progress`);
        const percentageElement = document.getElementById(`${module}-percentage`);
        
        if (progressElement && percentageElement) {
            gsap.to(progressElement, {
                width: `${progress}%`,
                duration: 1,
                ease: "power2.out"
            });
            
            percentageElement.textContent = `${Math.round(progress)}%`;
        }
    });
    
    // Mettre à jour les badges
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';
    
    availableBadges.forEach(badge => {
        const isUnlocked = appState.currentUser.badges.includes(badge.id);
        
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge ${isUnlocked ? 'unlocked' : ''}`;
        badgeElement.setAttribute('data-title', badge.title);
        badgeElement.textContent = isUnlocked ? badge.emoji : '?';
        
        badgesContainer.appendChild(badgeElement);
    });
}

// Vérification et attribution des badges
function checkAndAwardBadges(moduleId) {
    let newBadges = [];
    
    // Vérifier les badges spécifiques au module
    availableBadges.forEach(badge => {
        if (appState.currentUser.badges.includes(badge.id)) return;
        
        let shouldAward = false;
        
        if (badge.module === moduleId) {
            if (badge.condition === 'firstActivity') {
                // Badge pour la première activité d'un module
                shouldAward = true;
            } else if (badge.condition === 'progress50' && appState.currentUser.progress[moduleId] >= 50) {
                // Badge pour 50% de progrès dans un module
                shouldAward = true;
            }
        } else if (badge.condition === 'allModules') {
            // Badge pour avoir commencé tous les modules
            const allModulesStarted = Object.keys(appState.currentUser.progress).every(module => 
                appState.currentUser.progress[module] > 0
            );
            shouldAward = allModulesStarted;
        } else if (badge.condition === 'points100' && appState.currentUser.points >= 100) {
            // Badge pour avoir obtenu 100 points
            shouldAward = true;
        }
        
        if (shouldAward) {
            appState.currentUser.badges.push(badge.id);
            newBadges.push(badge);
        }
    });
    
    // Afficher les nouveaux badges
    if (newBadges.length > 0) {
        showRewardPopup(newBadges[0]);
    }
}

// Afficher la popup de récompense
function showRewardPopup(badge) {
    const rewardPopup = document.getElementById('reward-popup');
    const rewardMessage = document.getElementById('reward-message');
    const rewardBadge = document.getElementById('reward-badge');
    
    rewardMessage.textContent = `Tu as débloqué un nouveau badge : ${badge.title} !`;
    rewardBadge.textContent = badge.emoji;
    
    rewardPopup.classList.add('active');
}

// Sauvegarde des données utilisateur
function saveUserData() {
    localStorage.setItem('eduFunUser', JSON.stringify(appState.currentUser));
}

// Initialisation de l'assistant virtuel
function initAssistant() {
    const assistantHTML = `
        <div class="assistant-container">
            <div class="assistant-bubble">🦁</div>
            <div class="assistant-dialog">
                <div class="assistant-header">
                    <span>Édu, ton assistant</span>
                </div>
                <div class="assistant-messages">
                    <div class="message assistant">
                        ${assistantResponses.greetings[Math.floor(Math.random() * assistantResponses.greetings.length)]}
                    </div>
                </div>
                <div class="assistant-input">
                    <input type="text" id="assistant-input-field" placeholder="Pose ta question...">
                    <button id="assistant-send">📤</button>
                </div>
            </div>
        </div>
    `;
    
    const assistantContainer = document.createElement('div');
    assistantContainer.innerHTML = assistantHTML;
    document.body.appendChild(assistantContainer);
    
    // Écouteurs d'événements pour l'assistant
    const assistantBubble = document.querySelector('.assistant-bubble');
    const assistantDialog = document.querySelector('.assistant-dialog');
    const assistantInput = document.getElementById('assistant-input-field');
    const assistantSend = document.getElementById('assistant-send');
    
    assistantBubble.addEventListener('click', () => {
        assistantDialog.classList.toggle('active');
        if (assistantDialog.classList.contains('active')) {
            assistantInput.focus();
            
            // Poser une question aléatoire si c'est la première fois
            if (appState.assistant.messages.length === 0) {
                setTimeout(() => {
                    const randomQuestion = assistantResponses.questions[
                        Math.floor(Math.random() * assistantResponses.questions.length)
                    ];
                    
                    addAssistantMessage(randomQuestion);
                }, 3000);
            }
        }
    });
    
    assistantSend.addEventListener('click', sendAssistantMessage);
    assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAssistantMessage();
        }
    });
}

// Envoyer un message à l'assistant
function sendAssistantMessage() {
    const assistantInput = document.getElementById('assistant-input-field');
    const userMessage = assistantInput.value.trim();
    
    if (userMessage) {
        // Ajouter le message de l'utilisateur
        addUserMessage(userMessage);
        
        // Effacer l'input
        assistantInput.value = '';
        
        // Générer une réponse
        setTimeout(() => {
            const response = generateAssistantResponse(userMessage);
            addAssistantMessage(response);
        }, 1000);
    }
}

// Ajouter un message de l'utilisateur
function addUserMessage(message) {
    const messagesContainer = document.querySelector('.assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    appState.assistant.messages.push({
        sender: 'user',
        text: message
    });
}

// Ajouter un message de l'assistant
function addAssistantMessage(message) {
    const messagesContainer = document.querySelector('.assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message assistant';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    appState.assistant.messages.push({
        sender: 'assistant',
        text: message
    });
}

// Générer une réponse de l'assistant
function generateAssistantResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Rechercher des mots-clés sur les modules
    if (lowerMessage.includes('math') || lowerMessage.includes('nombre') || lowerMessage.includes('calcul')) {
        return assistantResponses.moduleHelp.maths[Math.floor(Math.random() * assistantResponses.moduleHelp.maths.length)];
    } else if (lowerMessage.includes('langue') || lowerMessage.includes('mot') || lowerMessage.includes('alphabet')) {
        return assistantResponses.moduleHelp.langues[Math.floor(Math.random() * assistantResponses.moduleHelp.langues.length)];
    } else if (lowerMessage.includes('science') || lowerMessage.includes('animal') || lowerMessage.includes('nature')) {
        return assistantResponses.moduleHelp.sciences[Math.floor(Math.random() * assistantResponses.moduleHelp.sciences.length)];
    } else if (lowerMessage.includes('art') || lowerMessage.includes('dessin') || lowerMessage.includes('couleur')) {
        return assistantResponses.moduleHelp.arts[Math.floor(Math.random() * assistantResponses.moduleHelp.arts.length)];
    } else if (lowerMessage.includes('sport') || lowerMessage.includes('bouger') || lowerMessage.includes('courir')) {
        return assistantResponses.moduleHelp.sport[Math.floor(Math.random() * assistantResponses.moduleHelp.sport.length)];
    } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
        return assistantResponses.greetings[Math.floor(Math.random() * assistantResponses.greetings.length)];
    } else {
        // Réponse par défaut ou inconnue
        return assistantResponses.unknown[Math.floor(Math.random() * assistantResponses.unknown.length)];
    }
}

// Fonction pour lire l'explication audio
function toggleAudioExplanation(button) {
    // Arrêter tout audio en cours de lecture
    if (appState.audioExplanations.currentAudio) {
        window.speechSynthesis.cancel();
        appState.audioExplanations.isPlaying = false;
        appState.audioExplanations.currentAudio = null;
    }
    
    const audioPlayer = button.closest('.audio-player');
    const audioStatus = audioPlayer.querySelector('.audio-status');
    const audioText = audioPlayer.getAttribute('data-text');
    const progressBar = audioPlayer.querySelector('.audio-progress-bar');
    const timeDisplay = audioPlayer.querySelector('.audio-time');
    
    if (button.textContent === '▶️') {
        // Démarrer la lecture
        button.textContent = '⏹️';
        audioStatus.classList.add('audio-bars-active');
        
        // Utiliser l'API Speech Synthesis pour lire le texte
        const speech = new SpeechSynthesisUtterance(audioText);
        speech.lang = 'fr-FR';
        speech.rate = 0.9; // Un peu plus lent pour les enfants
        
        // Suivi de la progression
        let startTime = Date.now();
        const totalDuration = audioText.length * 50; // Estimation de la durée basée sur la longueur du texte
        
        const updateProgress = () => {
            if (!appState.audioExplanations.isPlaying) return;
            
            const elapsed = Date.now() - startTime;
            const percentage = Math.min(100, (elapsed / totalDuration) * 100);
            
            progressBar.style.width = `${percentage}%`;
            
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timeDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            if (percentage < 100) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        speech.onstart = () => {
            appState.audioExplanations.isPlaying = true;
            appState.audioExplanations.currentAudio = speech;
            startTime = Date.now();
            requestAnimationFrame(updateProgress);
        };
        
        speech.onend = () => {
            appState.audioExplanations.isPlaying = false;
            appState.audioExplanations.currentAudio = null;
            button.textContent = '▶️';
            audioStatus.classList.remove('audio-bars-active');
            progressBar.style.width = '100%';
        };
        
        window.speechSynthesis.speak(speech);
    } else {
        // Arrêter la lecture
        window.speechSynthesis.cancel();
        appState.audioExplanations.isPlaying = false;
        appState.audioExplanations.currentAudio = null;
        button.textContent = '▶️';
        audioStatus.classList.remove('audio-bars-active');
    }
}

// Exposer la fonction à la portée globale pour l'utiliser dans les événements onclick
window.toggleAudioExplanation = toggleAudioExplanation;