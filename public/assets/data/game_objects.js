const game  = {
    players: [
        {id: 1, name: 'Tiago', color: 'black', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},  
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
        {id: 2, name: 'Paulo', color: 'green', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
        {id: 3, name: 'Edu', color: 'yellow', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
        {id: 4, name: 'Rafa', color: 'white', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
        {id: 5, name: 'Ygor', color: 'blue', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
        {id: 6, name: 'Tha', color: 'red', cards: [], objective: 0,
        placeble:{"all":0,"1":0}, placed:{"all":0,"1":0},
        totalCards: 0, totalArmies: 0, totalTerritories: 0, gainedTerritory: false},
    ],
    turn: {
        totalPlayers: 6,
        counter: 0,
        currentPlayer: 0,
        playersOrder:[],
        currentPhase: -1,
        phases: ["Mobilizar", "Atacar", "Fortificar"]
    },
    board :{
        territories: [
            {
                id: 1,
                name: 'Alaska',
                neighbors: [2,4],
                continent:1,
                card: 1,
                owner: 0,
                armies: 0
            },
            {
                id: 2,
                name: 'Mackenzie',
                neighbors: [1,3,4,5],
                continent: 1,
                card: 2,
                owner: 0,
                armies: 0
            },
            {
                id: 3,
                name: 'Groelândia',
                neighbors: [2,6],
                continent: 1,
                card: 2,
                owner: 0,
                armies: 0
            },
            {
                id: 4,
                name: 'Vancouver',
                neighbors: [1,2,5,7],
                continent: 1,
                card: 1,
                owner: 0,
                armies: 0
            },
            {
                id: 5,
                name: 'Ottawa',
                neighbors: [2,4,6,7,8],
                continent: 1,
                card: 2,
                owner: 0,
                armies: 0
            },
            {
                id: 6,
                name: 'Labrador',
                neighbors: [3,5,8],
                continent: 1,
                card: 3,
                owner: 0,
                armies: 0
            },
            {
                id: 7,
                name:'California',
                neighbors: [4,5,8,9],
                continent: 1,
                card: 3,
                owner: 0,
                armies: 0
            },
            {
                id: 8,
                name: 'Nova York',
                neighbors: [5,6,7,9],
                continent: 1,
                card: 1,
                owner: 0,
                armies: 0
            },
            {
                id: 9,
                name: 'México',
                neighbors: [7,8],
                continent: 1,
                card: 3,
                owner: 0,
                armies: 0
            }
            
        ]
    },
    decks :{
        cards: [1,2,3,4,5,6,7,8,9],
        objectives:[
            {id:1, description: "Destruir exércitos azuis"},
            {id:2, description: "Destruir exércitos amarelos"},
            {id:3, description: "Destruir exércitos brancos"},
            {id:4, description: "Destruir exércitos verdes"},
            {id:5, description: "Destruir exércitos pretos"},
            {id:6, description: "Destruir exércitos vermelhos"},
            {id:7, description: "Conquistar América do Norte e África"},
            {id:8, description: "Conquistar Ásia e África"},
            {id:9, description: "Conquistar América do Norte e Oceania"},
            {id:10, description: "Conquistar Europa, América do Sul e +1 continente"},
            {id:11, description: "Conquistar Ásia e América do Sul"},
            {id:12, description: "Conquistar Europa, Oceania e +1 continente"},
            {id:13, description: "18 territórios com 2 em cada"},
            {id:14, description: "Conquistar 24 territórios"},
        ],
        discards:[]
    },
}