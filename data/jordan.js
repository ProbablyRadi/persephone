// ============================================================================
// JORDAN VALE — PLAYER DATA
//
// All information for this character stays in this one file.
// Each player uses the same five sections in the same order.
// The assignments below are read by app.js; do not rename them.
// ============================================================================

// ============================================================================
// 01 — PROFILE, CAREER AND SEASON SUMMARIES
// DATA.jordan
// Identity, biography, overview statistics, honours and season descriptions.
// ============================================================================
DATA.jordan = {
  // IDENTITY AND IMAGES
  // Name, country, club crest, and site artwork.
  "name": "Jordan A.B. Vale",
  "displayName": "Jordan Vale",
  "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "internationalTeam": "England",
  "squadFocusName": "Jordan Vale",
  "homeCrest": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "portrait": "assets/portraits/jordan.png",

  // DISPLAY AND TIMELINE HELPERS
  // Squad nationality flags, timeline overrides and competition round markers.
  "timelineLeagueEntryBaselines": {
    "2026–27": {
      "league": "Premier League",
      "previousSeason": "2025–26",
      "source": "Real-life 2025–26 Premier League membership",
      "teams": [
        "AFC Bournemouth",
        "Arsenal",
        "Aston Villa",
        "Brentford",
        "Brighton & Hove Albion",
        "Burnley",
        "Chelsea",
        "Crystal Palace",
        "Everton",
        "Fulham",
        "Leeds United",
        "Liverpool",
        "Manchester City",
        "Manchester United",
        "Newcastle United",
        "Nottingham Forest",
        "Sunderland",
        "Tottenham Hotspur",
        "West Ham United",
        "Wolverhampton Wanderers"
      ]
    }
  },
  "squadFlags": {
    "Jordan Vale": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Joe Lumley": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Radek Vítek": "🇨🇿",
    "Cameron Pring": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Neto Borges": "🇧🇷",
    "Joane Gadou": "🇫🇷",
    "Josh Campbell-Slowey": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Rob Dickie": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Rob Atkinson": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Luke McNally": "🇮🇪",
    "Noah Eile": "🇸🇪",
    "Jamie Knight-Lebel": "🇨🇦",
    "Ross McCrorie": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "George Tanner": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Sam Morsy": "🇪🇬",
    "Delano Burgzorg": "🇳🇱",
    "Sam Bell": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Max Bird": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Adam Randell": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Jason Knight": "🇮🇪",
    "Tomi Horvat": "🇭🇷",
    "Josh Stokes": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Scott Twine": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Yū Hirakawa": "🇯🇵",
    "Mark Sykes": "🇮🇪",
    "Emil Riis": "🇩🇰",
    "Sinclair Armstrong": "🇮🇪",
    "Arséne Kouassi": "🇫🇷",
    "Gastón Benedetti": "🇦🇷",
    "Brooke Norton-Cuffy": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Joe Williams": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Harry Cornick": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Keinan Davis": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Bradley Locko": "🇫🇷",
    "Wisdom Mike": "🇩🇪",
    "Pablo López": "🇪🇸",
    "Bjorn Meijer": "🇳🇱",
    "Wagner Pina": "🇨🇻",
    "Noah Donovan Sahsah": "🇩🇰",
    "Adam Murphy": "🇮🇪",
    // 2029–30 Manchester United squad nationalities (including three user-confirmed flags).
    "Tom Heaton": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Senne Lammens": "🇧🇪",
    "Florian Daems": "🇧🇪",
    "Lucas Mincarelli": "🇫🇷",
    "Ayden Heaven": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Matthijs De Ligt": "🇳🇱",
    "Lisandro Martínez": "🇦🇷",
    "Malick Thiaw": "🇩🇪",
    "Thijmen Blokzijl": "🇳🇱",
    "Tyler Fredricson": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Trent Alexander-Arnold": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Sergiño Dest": "🇺🇸",
    "Rik Dekker": "🇳🇱",
    "Sékou Koné": "🇲🇱",
    "Jacob Devaney": "🇮🇪",
    "Toby Collyer": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Ro-Zangelo Daal": "🇳🇱",
    "Ethan Williams": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Jadon Sancho": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Jack Fletcher": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Tyler Fletcher": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Walem Mefrane": "🇩🇿",
    "Dani Ceballos": "🇪🇸",
    "Daniel Gore": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Mauricio": "🇵🇾",
    "James Scanlon": "🇬🇮",
    "Bruno Fernandes": "🇵🇹",
    "Mason Mount": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Matheus Cunha": "🇧🇷",
    "Ethan Ennis": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Marcus Rashford": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Bryan Mbeumo": "🇨🇲",
    "Ethan Wheatley": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Ferran Torres": "🇪🇸",
    "Joshua Zirkzee": "🇳🇱",
    "Benjamin Šeško": "🇸🇮"
  },
  // In-season changes compared with the earlier 2029–30 squad snapshot.
  // "Removed" means absent from the current supplied list, not a confirmed transfer.
  "timelineInSeasonSquadUpdates": {
    "2029–30": {
      "added": ["Emeka Adiele"],
      "removed": ["Benjamin Šeško", "Florian Daems", "Rik Dekker"]
    }
  },
  "timelineManualFinals": {
    "2025–26": [
      {
        "comp": "Carabao Cup",
        "winner": "Arsenal",
        "runner": "Liverpool"
      },
      {
        "comp": "FA Cup",
        "winner": "Nottingham Forest",
        "runner": "Tottenham Hotspurs"
      }
    ],
    "2026–27": [
      {
        "comp": "FA Cup",
        "winner": "Brighton & Hove",
        "runner": "Manchester City"
      }
    ]
  },
  "uefaRoundBreaks": {
    "2028–29|UEFA Europa League": {
      "0": "League phase",
      "8": "Knockout play-offs (agg)",
      "16": "Round of 16 (agg)",
      "24": "Quarter-finals (agg)",
      "28": "Semi-finals (agg)",
      "30": "Final"
    }
  },

  // PLAYER DETAILS
  // Personal information shown in the Overview infobox.
  "dob": "08 August",
  "birth": "Weston-super-Mare, England",
  "height": "1.82 m",
  "bootBrand": "Nike",
  "position": "Goalkeeper",
  "current": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
  "number": "1 (previously 37 at Bristol City; international: 12, 20, 17, 1)",
  "international": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England (2025–)",

  // BIOGRAPHY AND CAREER OVERVIEW
  // Biography, club history, national-team record, season statistics and awards.
  "intro": [
    "Jordan A.B. Vale is an English professional footballer who plays as a goalkeeper for Premier League club Manchester United and the England national team. Born in Weston-super-Mare, Vale began his senior career with Bristol City in 2025 and became the club's first-choice goalkeeper during their 2025–26 EFL Championship title-winning season.",
    "Vale remained in goal following Bristol City's promotion to the Premier League, helping the club retain its top-flight status in 2026–27 and finish 14th the following season. The 2027–28 campaign was highlighted by a historic FA Cup victory over Manchester City. The final remained goalless through 90 minutes before Pablo López gave Bristol City the lead in the 101st minute. In the 121st minute, Vale saved an initial effort but Boden scored from the rebound to force a 1–1 draw and a penalty shootout, which Bristol City won after a fiercely contested series of kicks.",
    "In 2028–29, Vale played 59 times as Bristol City finished 11th in the Premier League, reached the Europa League round of 16 and went out of the Carabao Cup in a penalty shootout against Arsenal. He finished the season with 18 clean sheets, five assists and two Man of the Match awards.",
    "Vale joined Manchester United ahead of the 2029–30 Premier League season, taking the number 1 shirt. At the latest update, United sat third with 34 points after 18 league matches (17 scored results supplied). Vale has 24 club appearances, no goals or assists and eight clean sheets. United have reached a Carabao Cup tie against Manchester City after defeating Brighton & Hove, Wrexham, Portsmouth and Liverpool.",
    "Vale has represented England at senior level since 2025. He was part of the England team that finished as runners-up at the 2026 FIFA World Cup and was awarded the UEFA Euro Golden Glove in 2028. He has made 36 appearances and scored one goal for the national team."
  ],
  "career": [
    [
      "2025–2029",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City",
      208,
      1
    ],
    [
      "2029–2037",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      24,
      0
    ],
    [
      "2037–2040",
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Celtic",
      "—",
      "—"
    ]
  ],
  "intl": [
    "2025–",
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England",
    36,
    1
  ],
  // Row order: season, club, role, league, league position,
  // average rating, appearances, goals, assists, clean sheets.
  "stats": [
    [
      "2025–26",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City",
      "GK",
      "EFL Championship",
      "1st",
      "6.1",
      53,
      1,
      5,
      25
    ],
    [
      "2026–27",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City",
      "GK",
      "Premier League",
      "17th",
      "6.4",
      48,
      0,
      2,
      14
    ],
    [
      "2027–28",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City",
      "GK",
      "Premier League",
      "14th",
      "6.1",
      48,
      0,
      0,
      19
    ],
    [
      "2028–29",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City",
      "GK",
      "Premier League",
      "11th",
      "6.3",
      59,
      0,
      5,
      18
    ],
    [
      "2029–30",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League",
      "",
      "",
      24,
      0,
      0,
      8
    ]
  ],
  // Overview-only POTM/MOTM awards, keyed by season.
  // Missing values mean unknown; use 0 only when confirmed.
  "careerAwards": {
    "2025–26": {
      "playerOfTheMonth": 0,
      "playerOfTheMatch": 4
    },
    "2026–27": {
      "playerOfTheMonth": 0,
      "playerOfTheMatch": 3
    },
    "2027–28": {
      "playerOfTheMonth": 0,
      "playerOfTheMatch": 0
    },
    "2028–29": {
      "playerOfTheMonth": 0,
      "playerOfTheMatch": 2
    }
  },
  // Future overview placeholders only: not playable seasons or fixtures.
  "careerOverviewFutureRows": [
    // Manchester United: the current season is already in stats; only future years appear here.
    [
      "2030–31",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2031–32",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2032–33",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2033–34",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2034–35",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2035–36",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],
    [
      "2036–37",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United",
      "GK",
      "Premier League"
    ],

    // Future Scottish league seasons (no fixtures or player statistics yet).
    [
      "2037–38",
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Celtic",
      "GK",
      "Scottish Premier"
    ],
    [
      "2038–39",
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Celtic",
      "GK",
      "Scottish Premier"
    ],
    [
      "2039–40",
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Celtic",
      "GK",
      "Scottish Premier"
    ]
  ],

  // HONOURS
  // Team titles and individual awards.
  "honours": {
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Bristol City": [
      "EFL Championship: 2025–26 🏆",
      "FA Cup: 2027–28 🏆"
    ],
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England": [
      "FIFA World Cup runner-up: 2026 🥈",
      "UEFA Euro Golden Glove: 2028 🧤"
    ]
  },

  // SEASON SUMMARIES
  // Descriptions and selected competition highlights for each season.
  "seasons": {
    // 2025–26
    "2025–26": {
      "summary": "Bristol City won the Championship with 94 points. Jordan made 53 appearances, scored once and kept 25 clean sheets.",
      "competitions": {
        "Pre-season friendlies": [
          "Bristol City 1–0 Le Havre",
          "Deportivo 0–0 Bristol City",
          "Bristol City 0–0 FC Utrecht"
        ],
        "EFL Championship": [
          "Champions 🏆 — 94 pts, 27 W, 13 D, 6 L, 67 GF, 34 GA"
        ],
        "Carabao Cup": [
          "Sheffield United 1–2 Bristol City",
          "Cardiff City 0–2 Bristol City",
          "Bristol City 0–0 Brighton — lost 3–4 pens"
        ],
        "FA Cup": [
          "Bristol City 1–0 Blackpool",
          "Nottingham Forest 0–0 Bristol City — lost 6–5 pens"
        ],
        "World Cup": [
          "England 2–0 Ghana",
          "Panama 0–2 England",
          "England 2–0 Croatia",
          "England 2–0 Colombia",
          "Mexico 1–2 England"
        ]
      },
      "table": "1st 🏆 — 94 pts"
    },
    // 2026–27
    "2026–27": {
      "summary": "Bristol City survived their first Premier League season in 17th. England finished World Cup runners-up.",
      "competitions": {
        "Premier League": [
          "17th — 37 pts, 8 W, 13 D, 17 L, 35 GF, 46 GA"
        ],
        "Carabao Cup": [
          "Reached semi-final",
          "Arsenal 1–0 Bristol City",
          "Bristol City 1–1 Arsenal"
        ],
        "World Cup": [
          "Japan 0–1 England — QF",
          "England 4–0 New Zealand — SF",
          "Netherlands 2–1 England — Final 🥈"
        ],
        "Euros Qualifiers": [
          "England unbeaten across the seven recorded qualifiers"
        ]
      },
      "table": "17th — 37 pts"
    },
    // 2027–28
    "2027–28": {
      "summary": "Bristol City finished 14th and won the FA Cup. Jordan kept 19 clean sheets.",
      "competitions": {
        "Premier League": [
          "14th — 46 pts, 13 W, 7 D, 18 L, 40 GF, 52 GA"
        ],
        "FA Cup": [
          "Bristol City 4–0 Wigan",
          "Charlton 0–2 Bristol City",
          "Bristol City 3–2 Middlesbrough",
          "Bristol City 4–0 Southampton",
          "Bristol City 2–1 Manchester United — SF",
          "Manchester City 1–1 Bristol City — Bristol won 4–3 pens 🏆"
        ],
        "Euros": [
          "England 4–0 Scotland",
          "Bosnia-Herzegovina 0–3 England",
          "England 1–1 Ukraine"
        ]
      },
      "table": "14th — 46 pts"
    },
    // 2028–29
    "2028–29": {
      "summary": "Bristol City finished 11th in the Premier League on 49 points and reached the Europa League round of 16. Jordan Vale made 59 appearances, supplied 5 assists, kept 18 clean sheets and earned 2 Man of the Match awards.",
      "competitions": {
        "Champions Trophy": [
          "Bristol City 1 - 1 RCD Espanyol",
          "Monza 1 - 4 Bristol City",
          "Bristol City 2 - 0 Venezia"
        ],
        "Premier League": [
          "11th — 49 pts, 13 W, 10 D, 15 L, 47 GF, 51 GA"
        ],
        "Carabao Cup": [
          "Coventry City 0 - 3 Bristol City",
          "Bristol City 4 - 1 Liverpool",
          "Arsenal (3) 0 - 0 (0) Bristol City",
          "F — Fulham 3 - 2 Newcastle United"
        ],
        "FA Cup": [
          "Bristol City 2 - 0 MK Dons",
          "Bristol City 0 - 1 Millwall",
          "F — Millwall 2 - 4 Liverpool"
        ],
        "FA Community Shield": [
          "F — Bristol City (2) 2 - 2 (3) Manchester City"
        ],
        "UEFA Europa League": [
          "Bristol City 4 - 1 FC Nordsjælland",
          "Bristol City 2 - 0 Brøndby IF",
          "Sparta Praha 1 - 1 Bristol City",
          "Stade Rennais FC 1 - 2 Bristol City",
          "Standard de Liège 2 - 0 Bristol City",
          "FCSB 1 - 2 Bristol City",
          "Bristol City 0 - 1 Feyenoord",
          "Bristol City 1 - 2 Viktoria Plzeň",
          "Knockout play-offs (agg): Bristol City 3 - 2 FC Nordsjælland",
          "Round of 16 (agg): Club Brugge 4 - 1 Bristol City"
        ],
        "Euros": [
          "England 4 - 0 Scotland",
          "Bosnia-Herzegov 0 - 3 England",
          "England 1 - 1 Ukraine",
          "Sweden (3) 2 - 2 (2) Hungary",
          "Germany 4 - 0 Northern Ireland",
          "England (9) 3 - 3 (8) Bosnia-Herzegov",
          "Belgium 2 - 1 Czechia",
          "Netherlands (3) 1 - 1 (1) Ireland",
          "France (2) 1 - 1 (4) Croatia",
          "Spain 3 - 1 Portugal",
          "Italy 1 - 2 Ukraine",
          "Sweden (4) 3 - 3 (2) Germany",
          "England 4 - 0 Belgium",
          "Netherlands 1 - 0 Croatia",
          "Spain 3 - 2 Ukraine",
          "Sweden 4 - 2 England",
          "Netherlands 1 - 2 Spain",
          "Sweden (3) 2 - 2 (1) Spain"
        ],
        "International Friendlies": [
          "Japan 1 - 1 England",
          "Northern Ireland 1 - 2 England",
          "Jordan 2 - 4 England",
          "England 4 - 2 Finland",
          "Uruguay 1 - 1 England",
          "England 1 - 1 Romania",
          "England 2 - 1 Australia",
          "Denmark 1 - 3 England"
        ]
      },
      "table": "11th — 49 pts"
    },
    // 2029–30 — in progress; 18 matches in table, 17 scored results supplied.
    "2029–30": {
      "inProgress": true,
      "summary": "Manchester United are third in the Premier League after 18 matches on 34 points. Seventeen league results are recorded in the supplied sheet; the remaining score has not been provided. Jordan Vale has 24 club appearances and eight clean sheets. United reached the next Carabao Cup tie against Manchester City after four recorded wins, including three penalty shootouts.",
      "competitions": {
        "Champions Trophy": [
          "Manchester United 1 - 1 Rayo Vallecano",
          "Sassuolo 1 - 0 Manchester United",
          "Manchester United 2 - 0 SC Freiburg"
        ],
        "Premier League": [
          "Manchester United 3 - 0 Wolves",
          "AFC Bournemouth 0 - 1 Manchester United",
          "Manchester United 3 - 0 Bristol City",
          "Crystal Palace 0 - 2 Manchester United",
          "Manchester United 2 - 1 Nottingham Forest",
          "Brentford 1 - 4 Manchester United",
          "Manchester United 1 - 0 Arsenal",
          "Manchester United 2 - 2 Brighton & Hove",
          "Everton 2 - 1 Manchester United",
          "Manchester United 1 - 2 Tottenham Hotspurs",
          "Sunderland 3 - 0 Manchester United",
          "Manchester United 1 - 0 Manchester City",
          "Burnley 1 - 2 Manchester United",
          "Manchester United 3 - 1 Newcastle United",
          "West Ham 1 - 3 Manchester United",
          "Manchester United 0 - 3 Chelsea",
          "Coventry City 2 - 1 Manchester United"
        ],
        "Carabao Cup": [
          "Brighton & Hove (2) 2 - 2 (4) Manchester United",
          "Wrexham (8) 2 - 2 (9) Manchester United",
          "Portsmouth (2) 0 - 0 (4) Manchester United",
          "Liverpool 0 - 1 Manchester United"
        ],
        "FA Cup": [],
        "International Friendlies": [
          "Uzbekistan 0 - 2 England",
          "Cabo Verde 2 - 2 England",
          "Uruguay 1 - 2 England",
          "Portugal 1 - 2 England",
          "England 4 - 3 Canada",
          "England 3 - 1 Uzbekistan"
        ]
      },
      "pendingFixtures": {
        "Premier League": [
          "Manchester United vs Liverpool"
        ],
        "Carabao Cup": [
          "Manchester City vs Manchester United"
        ]
      },
      "table": "3rd (provisional) — 18 played, 34 pts; 17 scored results supplied"
    }
  }
};

// ============================================================================
// 02 — MATCH RESULTS
// FULL_FIXTURES.jordan
// Recorded fixtures grouped by season and competition; also used for Head to Head.
// ============================================================================
FULL_FIXTURES.jordan = {
  // 2025–26
  "2025–26": {
    "Pre-season friendlies": [
      "Bristol City 1 - 0 Havre AC",
      "RC Deportivo 0 - 0 Bristol City",
      "Bristol City 0 - 0 FC Utrecht"
    ],
    "EFL Championship": [
      "Sheffield United 1 - 0 Bristol City",
      "Bristol City 1 - 0 Charlton Athletic",
      "Derby County 0 - 0 Bristol City",
      "Bristol City 0 - 0 Hull City",
      "Sheffield Wed 0 - 0 Bristol City",
      "Bristol City 0 - 1 Oxford United",
      "Preston 0 - 0 Bristol City",
      "Bristol City 1 - 1 Ipswich",
      "Bristol City 3 - 1 QPR",
      "Norwich 1 - 0 Bristol City",
      "Bristol City 3 - 1 Southampton",
      "Bristol City 2 - 2 Birmingham City",
      "Stoke City 0 - 1 Bristol City",
      "Bristol City 3 - 1 Blackburn Rovers",
      "Watford 0 - 2 Bristol City",
      "Bristol City 3 - 0 Swansea City",
      "Wrexham 3 - 2 Bristol City",
      "Portsmouth 1 - 3 Bristol City",
      "Bristol City 0 - 0 Millwall",
      "Bristol City 2 - 3 Leicester City",
      "Coventry City 0 - 1 Bristol City",
      "Bristol City 3 - 2 Middlesborough",
      "West Bromwich 0 - 2 Bristol City",
      "Millwall 0 - 0 Bristol City",
      "Bristol City 1 - 0 Portsmouth",
      "Bristol City 2 - 1 Preston",
      "Oxford United 1 - 2 Bristol City",
      "Ipswich 2 - 1 Bristol City",
      "Bristol City 1 - 0 Sheffield Wed",
      "Bristol City 1 - 1 Derby County",
      "Hull City 0 - 0 Bristol City",
      "Bristol City 2 - 0 Wrexham",
      "Swansea City 0 - 1 Bristol City",
      "Blackburn Rovers 1 - 2 Bristol City",
      "Bristol City 2 - 1 Watford",
      "Bristol City 2 - 0 Coventry City",
      "Middlesborough 0 - 1 Bristol City",
      "Bristol City 2 - 1 West Bromwich",
      "Int — Leicester City 1 - 1 Bristol City",
      "Charlton Athletic 1 - 3 Bristol City",
      "Bristol City 2 - 2 Sheffield United",
      "QPR 0 - 2 Bristol City",
      "Bristol City 2 - 1 Norwich",
      "Southampton 2 - 2 Bristol City",
      "Birmingham City 1 - 2 Bristol City",
      "Bristol City 1 - 0 Stoke City"
    ],
    "Carabao Cup": [
      "Sheffield United 1 - 2 Bristol City",
      "Cardiff City 0 - 2 Bristol City",
      "Bristol City (3) 0 - 0 (4) Brighton & Hove",
      "Arsenal 4 - 1 Liverpool"
    ],
    "FA Cup": [
      "Bristol City 1 - 0 Blackpool",
      "Nottingham Forest (6) 0 - 0 (5) Bristol City",
      "Tottenham Hotspurs 1 - 2 Nottingham Forest"
    ],
    "World Cup": [
      "England 2 - 0 Ghana",
      "Panama 0 - 2 England",
      "England 2 - 0 Croatia",
      "Czechia 1 - 3 Canada",
      "Curaçao 1 - 2 Brazil",
      "Sweden 2 - 3 Scotland",
      "Morocco 0 - 1 Japan",
      "Senegal 1 - 2 Netherlands",
      "Germany 2 - 3 Norway",
      "Mexico 4 - 0 Saudi Arabia",
      "Turkiye (4) 2 - 2 (2) Bosnia-Herzegov",
      "IR Iran 2 - 1 Korea Republic",
      "England 2 - 0 Colombia",
      "Spain 2 - 1 Algeria",
      "Congo DR 1 - 0 Panama",
      "Switzerland 2 - 3 New Zealand",
      "Austria 3 - 2 Uruguay",
      "Portugal 1 - 0 Cote d'Ivorie",
      "United States 1 - 0 Egypt",
      "Brazil 0 - 2 Netherlands",
      "Canada 2 - 1 Scotland",
      "Congo DR 1 - 2 Spain",
      "Turkiye 2 - 0 IR Iran",
      "Mexico 1 - 2 England",
      "Japan 1 - 0 Norway",
      "New Zealand 2 - 1 Portugal",
      "Austria 1 - 3 United States",
      "Sweden 0 - 3 England",
      "England 0 - 0 Ecuador"
    ]
  },
  // 2026–27
  "2026–27": {
    "Pre-season friendlies": [
      "Bristol City 0 - 1 RC Deportivo",
      "FC Augsburg 0 - 0 Bristol City",
      "Bristol City 1 - 1 1. FC Köln"
    ],
    "Premier League": [
      "AFC Bournemouth 1  - 0 Bristol City",
      "Bristol City 1 - 0 Tottenham Hotspurs",
      "Chelsea 0 - 0 Bristol City",
      "Bristol City 0 - 1 Brentford",
      "Nottingham Forest 1 - 2 Bristol City",
      "Bristol City 1 - 2 Liverpool",
      "Wolves 1 - 1 Bristol City",
      "Bristol City 1 - 1 Newcastle United",
      "Arsenal 2 - 0 Bristol City",
      "Bristol City 2 - 2 Ipswich",
      "Everton 0 - 0 Bristol City",
      "Bristol City 1 - 4 West Ham",
      "Crystal Palace 2 - 1 Bristol City",
      "Bristol City 0 - 2 Manchester United",
      "Aston Villa 2 - 1 Bristol City",
      "Bristol City 1 - 0 Brighton & Hove",
      "Sunderland 1 - 1 Bristol City",
      "Manchester City 0 - 0 Bristol City",
      "Bristol City 1 - 2 Southampton",
      "Brighton & Hove 0 - 0 Bristol City",
      "Bristol City 1 - 2 Aston Villa",
      "Southampton 1 - 1 Bristol City",
      "Liverpool 2 - 1 Bristol City",
      "Bristol City 1 - 1 Nottingham Forest",
      "Ipswich 2 - 1 Bristol City",
      "Bristol City 2 - 4 Arsenal",
      "Brentford 1 - 1 Bristol City",
      "Bristol City 0 - 0 Chelsea",
      "West Ham 2 - 0 Bristol City",
      "Bristol City 1 - 2 Everton",
      "Tottenham Hotspurs 2 - 0 Bristol City",
      "Bristol City 2 - 0 AFC Bournemouth",
      "Bristol City 0 - 0 Manchester City",
      "Bristol City 3 - 0 Sunderland",
      "Manchester United 1 - 3 Bristol City",
      "Bristol City 1 - 2 Crystal Palace",
      "Newcastle United 0 - 2 Bristol City",
      "Bristol City 1 - 0 Wolves"
    ],
    "Carabao Cup": [
      "Bristol City 1 - 0 Crewe Alexandra",
      "Bristol City (4) 0 - 0 (1) Walsall",
      "Bristol City (5) 0 - 0 (3) Coventry City",
      "QF — Bristol City (4) 0 - 0 (1) Swansea City",
      "SF — Arsenal 1 - 0 Bristol City",
      "SF — Bristol City 1 - 1 Arsenal",
      "F — Arsenal 1 - 0 Chelsea"
    ],
    "FA Cup": [
      "Sheffield United 2 - 0 Bristol City",
      "Brighton & Hove 2 - 1 Manchester City"
    ],
    "World Cup": [
      "England 2 - 0 Ghana",
      "Panama 0 - 2 England",
      "England 2 - 0 Croatia",
      "Czechia 1 - 3 Canada",
      "Curaçao 1 - 2 Brazil",
      "Sweden 2 - 3 Scotland",
      "Morocco 0 - 1 Japan",
      "Senegal 1 - 2 Netherlands",
      "Germany 2 - 3 Norway",
      "Mexico 4 - 0 Saudi Arabia",
      "Turkiye (4) 2 - 2 (2) Bosnia-Herzegov",
      "IR Iran 2 - 1 Korea Republic",
      "England 2 - 0 Colombia",
      "Spain 2 - 1 Algeria",
      "Congo DR 1 - 0 Panama",
      "Switzerland 2 - 3 New Zealand",
      "Austria 3 - 2 Uruguay",
      "Portugal 1 - 0 Cote d'Ivorie",
      "United States 1 - 0 Egypt",
      "Brazil 0 - 2 Netherlands",
      "Canada 2 - 1 Scotland",
      "Congo DR 1 - 2 Spain",
      "Turkiye 2 - 0 IR Iran",
      "Mexico 1 - 2 England",
      "Japan 1 - 0 Norway",
      "New Zealand 2 - 1 Portugal",
      "Austria 1 - 3 United States",
      "Netherlands 2 - 1 Canada",
      "Spain 2 - 0 Turkiye",
      "Japan 0 - 1 England",
      "United States 1 - 3 New Zealand",
      "Netherlands 2 - 1 Spain",
      "England 4 - 0 New Zealand",
      "Spain 2 - 1 New Zealand",
      "Netherlands 2 - 1 England"
    ],
    "Euros Qualifiers": [
      "Iceland 1 - 2 England",
      "England 3 - 1 Wales",
      "Denmark 1 - 2 England",
      "England 3 - 3 Turkiye",
      "Wales 1 - 3 England",
      "England 2 - 1 Iceland",
      "Turkiye 0 - 1 England"
    ]
  },
  // 2027–28
  "2027–28": {
    "Pre-season friendlies": [
      "Bristol City 1 - 0 Torino",
      "Getafe CF 0 - 0 Bristol City",
      "Bristol City 2 - 0 TSG Hoffenheim"
    ],
    "Premier League": [
      "Crystal Palace 3 - 0 Bristol City",
      "Bristol City 1 - 0 Everton",
      "Brentford 1 - 0 Bristol City",
      "West Ham 4 - 1 Bristol City",
      "AFC Bournemouth 2 - 1 Bristol City",
      "Bristol City 1 - 2 Tottenham Hotspurs",
      "Manchester United 3 - 0 Bristol City",
      "Bristol City 0 - 0 Leicester City",
      "Aston Villa 2 - 1 Bristol City",
      "Bristol City 2 - 0 Sunderland",
      "Fulham 0 - 1 Bristol City",
      "Bristol City 1 - 0 Newcastle United",
      "Brighton & Hove 0 - 1 Bristol City",
      "Bristol City 1 - 1 Arsenal",
      "Norwich 2 - 1 Bristol City",
      "Bristol City 1 - 2 Liverpool",
      "Chelsea 3 - 1 Bristol City",
      "Bristol City 1 - 2 Manchester City",
      "Nottingham Forest 3 - 2 Bristol City",
      "Leicester City 0 - 1 Bristol City",
      "Bristol City 0 - 1 Manchester United",
      "Bristol City 1 - 0 Nottingham Forest",
      "Tottenham Hotspurs 3 - 1 Bristol City",
      "Bristol City 1 - 0 AFC Bournemouth",
      "Sunderland 0 - 0 Bristol City",
      "Bristol City 3 - 0 Aston Villa",
      "Newcastle United 1 - 2 Bristol City",
      "Bristol City 3 - 1 Fulham",
      "Bristol City 1 - 1 Everton",
      "Bristol City 1 - 2 Crystal Palace",
      "Bristol City 0 - 4 Chelsea",
      "West Ham 2 - 1 Bristol City",
      "Manchester City 2 - 1 Bristol City",
      "Arsenal 2 - 2 Bristol City",
      "Bristol City 0 - 0 Brighton & Hove",
      "Bristol City 1 - 0 Brentford",
      "Liverpool 2 - 3 Bristol City",
      "Bristol City 1 - 1 Norwich"
    ],
    "Carabao Cup": [
      "Bristol City 1 - 2 Leyton Orient",
      "F — Nottingham Forest (4) 1 - 1 (5) AFC Bournemouth"
    ],
    "FA Cup": [
      "Bristol City 4 - 0 Wigan Athletic",
      "Charlton Athletic 0 - 2 Bristol City",
      "Bristol City 3 - 2 Middlesbrough",
      "Bristol City 4 - 0 Southampton",
      "SF — Bristol City 2 - 1 Manchester United",
      "F — Manchester City (3) 1 - 1 (4) Bristol City"
    ],
    "Euros Qualifiers": [
      "England 3 - 2 Denmark"
    ],
    "Euros": [
      "England 4 - 0 Scotland",
      "Bosnia-Herzegov 0 - 3 England",
      "England 1 - 1 Ukraine"
    ],
    "International Friendlies": [
      "England 1 - 0 Congo DR",
      "England 4 - 1 Northern Ireland",
      "England 4 - 2 Poland",
      "Senegal 1 - 1 England",
      "England 1 - 2 Jordan",
      "England 2 - 1 Colombia"
    ]
  },
  // 2028–29
  "2028–29": {
    "Champions Trophy": [
      "Bristol City 1 - 1 RCD Espanyol",
      "Monza 1 - 4 Bristol City",
      "Bristol City 2 - 0 Venezia"
    ],
    "Premier League": [
      "Manchester City 3 - 2 Bristol City",
      "Bristol City 2 - 0 Aston Villa",
      "Newcastle United 1 - 2 Bristol City",
      "Chelsea 4 - 0 Bristol City",
      "Bristol City 3 - 0 AFC Bournemouth",
      "Crystal Palace 0 - 3 Bristol City",
      "Bristol City 1 - 1 West Ham",
      "Ipswich 1 - 0 Bristol City",
      "Bristol City 1 - 0 Wolves",
      "Manchester United 0 - 0 Bristol City",
      "Bristol City 0 - 1 Fulham",
      "Liverpool 1 - 1 Bristol City",
      "Bristol City 1 - 1 Tottenham Hotspurs",
      "Brentford 0 - 2 Bristol City",
      "Bristol City 1 - 0 Brighton & Hove",
      "Nottingham Forest 1 - 1 Bristol City",
      "Bristol City 2 - 4 Arsenal",
      "Everton 0 - 2 Bristol City",
      "Bristol City 1 - 1 Leeds United",
      "Bristol City 1 - 3 Everton",
      "Arsenal 1 - 1 Bristol City",
      "Bristol City 2 - 0 Brentford",
      "Tottenham Hotspurs 5 - 2 Bristol City",
      "Bristol City 2 - 4 Manchester United",
      "Wolves 2 - 1 Bristol City",
      "Aston Villa 0 - 1 Bristol City",
      "Bristol City 1 - 2 Manchester City",
      "Bristol City 0 - 2 Liverpool",
      "Fulham 1 - 1 Bristol City",
      "Bristol City 1 - 3 Chelsea",
      "Bristol City 0 - 0 Nottingham Forest",
      "Brighton & Hove 2 - 2 Bristol City",
      "Bristol City 0 - 1 Newcastle United",
      "Bristol City 2 - 0 Ipswich",
      "West Ham 3 - 1 Bristol City",
      "Bristol City 1 - 2 Crystal Palace",
      "AFC Bournemouth 1 - 2 Bristol City",
      "Leeds United 0 - 1 Bristol City"
    ],
    "Carabao Cup": [
      "Coventry City 0 - 3 Bristol City",
      "Bristol City 4 - 1 Liverpool",
      "Arsenal (3) 0 - 0 (0) Bristol City",
      "F — Fulham 3 - 2 Newcastle United"
    ],
    "FA Cup": [
      "Bristol City 2 - 0 MK Dons",
      "Bristol City 0 - 1 Millwall",
      "F — Millwall 2 - 4 Liverpool"
    ],
    "FA Community Shield": [
      "F — Bristol City (2) 2 - 2 (3) Manchester City"
    ],
    "UEFA Europa League": [
      "Bristol City 4 - 1 FC Nordsjælland",
      "Bristol City 2 - 0 Brøndby IF",
      "Sparta Praha 1 - 1 Bristol City",
      "Stade Rennais FC 1 - 2 Bristol City",
      "Standard de Liège 2 - 0 Bristol City",
      "FCSB 1 - 2 Bristol City",
      "Bristol City 0 - 1 Feyenoord",
      "Bristol City 1 - 2 Viktoria Plzeň",
      "KRC Genk 1 - 5 PSV",
      "AS Monaco 5 - 2 Beşiktaş",
      "Bristol City 3 - 2 FC Nordsjælland",
      "RB Salzburg 2 - 4 Viktoria Plzeň",
      "Feyenoord (7) 2 - 2 (6) AS Roma",
      "SS Lazio 5 - 4 Stade Rennais FC",
      "Sparta Praha 3 - 4 Real Betis",
      "APOEL FC 1 - 5 AZ",
      "Athletic Club 2 - 1 PSV",
      "Shakhtar Donetsk 2 - 4 SS Lazio",
      "Club Brugge 4 - 1 Bristol City",
      "Celtic 2 - 3 Viktoria Plzeň",
      "LOSC Lille 2 - 3 Feyenoord",
      "Chelsea (4) 4 - 4 (3) AS Monaco",
      "Sporting CP 6 - 1 Real Betis",
      "RB Leipzig 2 - 1 AZ",
      "SS Lazio 4 - 6 Athletic Club",
      "Club Brugge 4 - 5 Viktoria Plzeň",
      "Feyenoord 3 - 4 Chelsea",
      "Sporting CP 3 - 4 RB Leipzig",
      "Viktoria Plzeň 4 - 3 Athletic Club",
      "RB Leipzig 3 - 1 Chelsea",
      "Viktoria Plzeň 2 - 3 RB Leipzig"
    ],
    "Euros": [
      "England 4 - 0 Scotland",
      "Bosnia-Herzegov 0 - 3 England",
      "England 1 - 1 Ukraine",
      "Sweden (3) 2 - 2 (2) Hungary",
      "Germany 4 - 0 Northern Ireland",
      "England (9) 3 - 3 (8) Bosnia-Herzegov",
      "Belgium 2 - 1 Czechia",
      "Netherlands (3) 1 - 1 (1) Ireland",
      "France (2) 1 - 1 (4) Croatia",
      "Spain 3 - 1 Portugal",
      "Italy 1 - 2 Ukraine",
      "Sweden (4) 3 - 3 (2) Germany",
      "England 4 - 0 Belgium",
      "Netherlands 1 - 0 Croatia",
      "Spain 3 - 2 Ukraine",
      "Sweden 4 - 2 England",
      "Netherlands 1 - 2 Spain",
      "Sweden (3) 2 - 2 (1) Spain"
    ],
    "International Friendlies": [
      "Japan 1 - 1 England",
      "Northern Ireland 1 - 2 England",
      "Jordan 2 - 4 England",
      "England 4 - 2 Finland",
      "Uruguay 1 - 1 England",
      "England 1 - 1 Romania",
      "England 2 - 1 Australia",
      "Denmark 1 - 3 England"
    ]
  },
  // 2029–30 — scored matches only; pending fixtures stored separately in DATA.jordan.
  "2029–30": {
    "Champions Trophy": [
      "Manchester United 1 - 1 Rayo Vallecano",
      "Sassuolo 1 - 0 Manchester United",
      "Manchester United 2 - 0 SC Freiburg"
    ],
    "Premier League": [
      "Manchester United 3 - 0 Wolves",
      "AFC Bournemouth 0 - 1 Manchester United",
      "Manchester United 3 - 0 Bristol City",
      "Crystal Palace 0 - 2 Manchester United",
      "Manchester United 2 - 1 Nottingham Forest",
      "Brentford 1 - 4 Manchester United",
      "Manchester United 1 - 0 Arsenal",
      "Manchester United 2 - 2 Brighton & Hove",
      "Everton 2 - 1 Manchester United",
      "Manchester United 1 - 2 Tottenham Hotspurs",
      "Sunderland 3 - 0 Manchester United",
      "Manchester United 1 - 0 Manchester City",
      "Burnley 1 - 2 Manchester United",
      "Manchester United 3 - 1 Newcastle United",
      "West Ham 1 - 3 Manchester United",
      "Manchester United 0 - 3 Chelsea",
      "Coventry City 2 - 1 Manchester United"
    ],
    "Carabao Cup": [
      "Brighton & Hove (2) 2 - 2 (4) Manchester United",
      "Wrexham (8) 2 - 2 (9) Manchester United",
      "Portsmouth (2) 0 - 0 (4) Manchester United",
      "Liverpool 0 - 1 Manchester United"
    ],
    "FA Cup": [],
    "International Friendlies": [
      "Uzbekistan 0 - 2 England",
      "Cabo Verde 2 - 2 England",
      "Uruguay 1 - 2 England",
      "Portugal 1 - 2 England",
      "England 4 - 3 Canada",
      "England 3 - 1 Uzbekistan"
    ]
  }

};

// ============================================================================
// 03 — LEAGUE TABLES AND SQUADS
// SEASON_TABLES.jordan
// League standings and season squad sheets.
// ============================================================================
SEASON_TABLES.jordan = {
  // 2025–26
  "2025–26": {
    "league": "EFL Championship",
    "standings": [
      [
        "1",
        "Bristol City",
        "46",
        "27",
        "13",
        "6",
        "67",
        "34",
        "33",
        "94"
      ],
      [
        "2",
        "Ipswich",
        "46",
        "26",
        "10",
        "10",
        "93",
        "59",
        "34",
        "88"
      ],
      [
        "3",
        "Southampton",
        "46",
        "22",
        "16",
        "8",
        "76",
        "49",
        "27",
        "82"
      ],
      [
        "4",
        "Sheffield United",
        "46",
        "23",
        "13",
        "10",
        "70",
        "49",
        "21",
        "82"
      ],
      [
        "5",
        "Norwich",
        "46",
        "22",
        "10",
        "14",
        "61",
        "48",
        "13",
        "76"
      ],
      [
        "6",
        "Stoke City",
        "46",
        "23",
        "7",
        "16",
        "65",
        "56",
        "9",
        "76"
      ],
      [
        "7",
        "Millwall",
        "46",
        "17",
        "19",
        "10",
        "57",
        "47",
        "10",
        "70"
      ],
      [
        "8",
        "Coventry City",
        "46",
        "20",
        "10",
        "16",
        "67",
        "58",
        "9",
        "70"
      ],
      [
        "9",
        "Swansea City",
        "46",
        "18",
        "15",
        "13",
        "63",
        "53",
        "10",
        "69"
      ],
      [
        "10",
        "Leicester City",
        "46",
        "20",
        "9",
        "17",
        "62",
        "57",
        "5",
        "69"
      ],
      [
        "11",
        "Hull City",
        "46",
        "18",
        "14",
        "14",
        "68",
        "58",
        "10",
        "68"
      ],
      [
        "12",
        "Middlesbrough",
        "46",
        "18",
        "13",
        "15",
        "66",
        "57",
        "9",
        "67"
      ],
      [
        "13",
        "Birmingham City",
        "46",
        "18",
        "13",
        "15",
        "62",
        "55",
        "7",
        "67"
      ],
      [
        "14",
        "Preston North End",
        "46",
        "15",
        "16",
        "15",
        "60",
        "59",
        "1",
        "61"
      ],
      [
        "15",
        "QPR",
        "46",
        "16",
        "13",
        "17",
        "55",
        "58",
        "-3",
        "61"
      ],
      [
        "16",
        "West Bromwich",
        "46",
        "15",
        "11",
        "20",
        "57",
        "64",
        "-7",
        "56"
      ],
      [
        "17",
        "Wrexham",
        "46",
        "15",
        "10",
        "21",
        "50",
        "60",
        "-10",
        "55"
      ],
      [
        "18",
        "Derby County",
        "46",
        "12",
        "14",
        "20",
        "42",
        "54",
        "-12",
        "50"
      ],
      [
        "19",
        "Portsmouth",
        "46",
        "12",
        "14",
        "20",
        "45",
        "66",
        "-21",
        "50"
      ],
      [
        "20",
        "Charlton Athletic",
        "46",
        "10",
        "17",
        "19",
        "50",
        "65",
        "-15",
        "47"
      ],
      [
        "21",
        "Watford",
        "46",
        "8",
        "19",
        "19",
        "54",
        "71",
        "-17",
        "43"
      ],
      [
        "22",
        "Oxford United",
        "46",
        "10",
        "13",
        "23",
        "42",
        "73",
        "-31",
        "43"
      ],
      [
        "23",
        "Blackburn Rovers",
        "46",
        "7",
        "12",
        "27",
        "42",
        "69",
        "-27",
        "33"
      ],
      [
        "24",
        "Sheffield Wed",
        "46",
        "3",
        "13",
        "30",
        "41",
        "97",
        "-56",
        "22"
      ]
    ],
    "club": "Bristol City",
    "squad": [
      [
        "GK",
        "37",
        "Jordan Vale",
        "53",
        "1",
        "5",
        "25"
      ],
      [
        "GK",
        "13",
        "Joe Lumley",
        "2",
        "0",
        "0",
        "0"
      ],
      [
        "GK",
        "23",
        "Radek Vítek",
        "3",
        "0",
        "0",
        "0"
      ],
      [
        "LB",
        "3",
        "Cameron Pring",
        "20",
        "4",
        "1",
        "5"
      ],
      [
        "LB",
        "21",
        "Neto Borges",
        "44",
        "2",
        "2",
        "21"
      ],
      [
        "CB",
        "22",
        "Joane Gadou",
        "9",
        "0",
        "0",
        "0"
      ],
      [
        "CB",
        "33",
        "Josh Campbell-Slowey",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "CB",
        "16",
        "Rob Dickie",
        "53",
        "0",
        "0",
        "26"
      ],
      [
        "CB",
        "5",
        "Rob Atkinson",
        "54",
        "0",
        "0",
        "26"
      ],
      [
        "CB",
        "15",
        "Luke McNally",
        "48",
        "1",
        "0",
        "20"
      ],
      [
        "CB",
        "38",
        "Noah Eile",
        "16",
        "0",
        "0",
        "3"
      ],
      [
        "CB",
        "22",
        "Jamie Knight-Lebel",
        "3",
        "0",
        "0",
        "0"
      ],
      [
        "RB",
        "2",
        "Ross McCrorie",
        "42",
        "1",
        "1",
        "13"
      ],
      [
        "RB",
        "19",
        "George Tanner",
        "33",
        "0",
        "0",
        "10"
      ],
      [
        "CDM",
        "40",
        "Sam Morsy",
        "2",
        "0",
        "0",
        "0"
      ],
      [
        "LM",
        "11",
        "Delano Burgzorg",
        "51",
        "11",
        "1",
        "29"
      ],
      [
        "LM",
        "20",
        "Sam Bell",
        "4",
        "0",
        "0",
        "0"
      ],
      [
        "CM",
        "6",
        "Max Bird",
        "38",
        "3",
        "5",
        "15"
      ],
      [
        "CM",
        "4",
        "Adam Randell",
        "5",
        "0",
        "1",
        "0"
      ],
      [
        "CM",
        "12",
        "Jason Knight",
        "53",
        "13",
        "10",
        "26"
      ],
      [
        "CM",
        "14",
        "Tomi Horvat",
        "44",
        "6",
        "9",
        "14"
      ],
      [
        "CAM",
        "28",
        "Josh Stokes",
        "2",
        "1",
        "0",
        "1"
      ],
      [
        "CAM",
        "10",
        "Scott Twine",
        "21",
        "1",
        "2",
        "0"
      ],
      [
        "RM",
        "13",
        "Yū Hirakawa",
        "8",
        "0",
        "1",
        "0"
      ],
      [
        "RM",
        "17",
        "Mark Sykes",
        "53",
        "7",
        "6",
        "25"
      ],
      [
        "ST",
        "18",
        "Emil Riis",
        "53",
        "23",
        "5",
        "24"
      ],
      [
        "ST",
        "30",
        "Sinclair Armstrong",
        "4",
        "0",
        "1",
        "0"
      ]
    ]
  },
  // 2026–27
  "2026–27": {
    "league": "Premier League",
    "standings": [
      [
        "1",
        "Chelsea",
        "38",
        "24",
        "9",
        "5",
        "75",
        "42",
        "33",
        "81"
      ],
      [
        "2",
        "Arsenal",
        "38",
        "24",
        "9",
        "5",
        "81",
        "50",
        "31",
        "81"
      ],
      [
        "3",
        "Manchester City",
        "38",
        "22",
        "10",
        "6",
        "79",
        "43",
        "36",
        "76"
      ],
      [
        "4",
        "Manchester United",
        "38",
        "19",
        "9",
        "10",
        "69",
        "49",
        "20",
        "66"
      ],
      [
        "5",
        "Tottenham Hotspurs",
        "38",
        "18",
        "10",
        "10",
        "57",
        "40",
        "17",
        "64"
      ],
      [
        "6",
        "Nottingham Forest",
        "38",
        "18",
        "9",
        "11",
        "62",
        "54",
        "8",
        "63"
      ],
      [
        "7",
        "Liverpool",
        "38",
        "18",
        "8",
        "12",
        "72",
        "53",
        "19",
        "62"
      ],
      [
        "8",
        "Newcastle United",
        "38",
        "18",
        "8",
        "12",
        "63",
        "49",
        "14",
        "62"
      ],
      [
        "9",
        "Crystal Palace",
        "38",
        "15",
        "9",
        "14",
        "55",
        "56",
        "-1",
        "54"
      ],
      [
        "10",
        "Everton",
        "38",
        "14",
        "8",
        "16",
        "46",
        "52",
        "-6",
        "50"
      ],
      [
        "11",
        "Brentford",
        "38",
        "13",
        "9",
        "16",
        "48",
        "59",
        "-11",
        "48"
      ],
      [
        "12",
        "Brighton & Hove",
        "38",
        "14",
        "5",
        "19",
        "44",
        "62",
        "-18",
        "47"
      ],
      [
        "13",
        "Aston Villa",
        "38",
        "11",
        "13",
        "14",
        "53",
        "55",
        "-2",
        "46"
      ],
      [
        "14",
        "AFC Bournemouth",
        "38",
        "11",
        "8",
        "19",
        "45",
        "58",
        "-13",
        "41"
      ],
      [
        "15",
        "West Ham",
        "38",
        "10",
        "11",
        "17",
        "46",
        "60",
        "-14",
        "41"
      ],
      [
        "16",
        "Sunderland",
        "38",
        "10",
        "9",
        "19",
        "44",
        "58",
        "-14",
        "39"
      ],
      [
        "17",
        "Bristol City",
        "38",
        "8",
        "13",
        "17",
        "35",
        "46",
        "-11",
        "37"
      ],
      [
        "18",
        "Ipswich",
        "38",
        "6",
        "14",
        "18",
        "41",
        "59",
        "-18",
        "32"
      ],
      [
        "19",
        "Southampton",
        "38",
        "8",
        "5",
        "25",
        "38",
        "73",
        "-35",
        "29"
      ],
      [
        "20",
        "Wolves",
        "38",
        "7",
        "8",
        "23",
        "36",
        "71",
        "-35",
        "29"
      ]
    ],
    "club": "Bristol City",
    "squad": [
      [
        "GK",
        "37",
        "Jordan Vale",
        "48",
        "0",
        "2",
        "14"
      ],
      [
        "LB",
        "2",
        "Arséne Kouassi",
        "37",
        "1",
        "1",
        "9"
      ],
      [
        "LB",
        "3",
        "Cameron Pring",
        "18",
        "1",
        "0",
        "5"
      ],
      [
        "LB",
        "23",
        "Gastón Benedetti",
        "27",
        "0",
        "0",
        "1"
      ],
      [
        "CB",
        "33",
        "Josh Campbell-Slowey",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "CB",
        "16",
        "Rob Dickie",
        "37",
        "0",
        "0",
        "9"
      ],
      [
        "CB",
        "5",
        "Rob Atkinson",
        "36",
        "0",
        "0",
        "11"
      ],
      [
        "CB",
        "15",
        "Luke McNally",
        "46",
        "0",
        "0",
        "14"
      ],
      [
        "CB",
        "38",
        "Noah Eile",
        "19",
        "0",
        "0",
        "3"
      ],
      [
        "CB",
        "22",
        "Jamie Knight-Lebel",
        "10",
        "0",
        "0",
        "5"
      ],
      [
        "RB",
        "21",
        "Ross McCrorie",
        "14",
        "0",
        "0",
        "2"
      ],
      [
        "RB",
        "19",
        "George Tanner",
        "27",
        "1",
        "1",
        "7"
      ],
      [
        "RB",
        "26",
        "Brooke Norton-Cuffy",
        "18",
        "0",
        "0",
        "6"
      ],
      [
        "CDM",
        "8",
        "Joe Williams",
        "3",
        "0",
        "0",
        "0"
      ],
      [
        "LM",
        "20",
        "Sam Bell",
        "7",
        "1",
        "0",
        "2"
      ],
      [
        "CM",
        "6",
        "Max Bird",
        "25",
        "0",
        "1",
        "6"
      ],
      [
        "CM",
        "4",
        "Adam Randell",
        "12",
        "0",
        "0",
        "2"
      ],
      [
        "CM",
        "12",
        "Jason Knight",
        "48",
        "9",
        "3",
        "14"
      ],
      [
        "CM",
        "14",
        "Tomi Horvat",
        "42",
        "5",
        "3",
        "8"
      ],
      [
        "CAM",
        "28",
        "Josh Stokes",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "CAM",
        "10",
        "Scott Twine",
        "44",
        "3",
        "9",
        "11"
      ],
      [
        "RM",
        "13",
        "Yū Hirakawa",
        "11",
        "1",
        "3",
        "4"
      ],
      [
        "RM",
        "17",
        "Mark Sykes",
        "34",
        "1",
        "2",
        "13"
      ],
      [
        "ST",
        "9",
        "Harry Cornick",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "ST",
        "11",
        "Keinan Davis",
        "29",
        "9",
        "2",
        "8"
      ],
      [
        "ST",
        "18",
        "Emil Riis",
        "18",
        "2",
        "2",
        "5"
      ],
      [
        "ST",
        "30",
        "Sinclair Armstrong",
        "10",
        "3",
        "0",
        "3"
      ]
    ]
  },
  // 2027–28
  "2027–28": {
    "league": "Premier League",
    "standings": [
      [
        "1",
        "Manchester City",
        "38",
        "27",
        "6",
        "4",
        "81",
        "36",
        "45",
        "87"
      ],
      [
        "2",
        "Manchester United",
        "38",
        "19",
        "11",
        "8",
        "71",
        "42",
        "29",
        "68"
      ],
      [
        "3",
        "Tottenham Hotspurs",
        "38",
        "19",
        "10",
        "9",
        "67",
        "55",
        "12",
        "67"
      ],
      [
        "4",
        "Arsenal",
        "38",
        "19",
        "9",
        "10",
        "77",
        "51",
        "26",
        "66"
      ],
      [
        "5",
        "Chelsea",
        "38",
        "19",
        "7",
        "11",
        "65",
        "47",
        "18",
        "64"
      ],
      [
        "6",
        "Nottingham Forest",
        "38",
        "17",
        "13",
        "8",
        "67",
        "56",
        "11",
        "64"
      ],
      [
        "7",
        "Liverpool",
        "38",
        "16",
        "11",
        "11",
        "60",
        "46",
        "14",
        "59"
      ],
      [
        "8",
        "Crystal Palace",
        "38",
        "17",
        "8",
        "13",
        "55",
        "49",
        "6",
        "59"
      ],
      [
        "9",
        "Fulham",
        "38",
        "15",
        "9",
        "14",
        "51",
        "57",
        "-6",
        "54"
      ],
      [
        "10",
        "Aston Villa",
        "38",
        "14",
        "11",
        "13",
        "49",
        "48",
        "1",
        "53"
      ],
      [
        "11",
        "Everton",
        "38",
        "13",
        "13",
        "12",
        "53",
        "47",
        "6",
        "52"
      ],
      [
        "12",
        "Brentford",
        "38",
        "13",
        "12",
        "13",
        "56",
        "55",
        "1",
        "51"
      ],
      [
        "13",
        "Brighton & Hove",
        "38",
        "12",
        "11",
        "15",
        "50",
        "54",
        "-4",
        "47"
      ],
      [
        "14",
        "Bristol City",
        "38",
        "13",
        "7",
        "18",
        "40",
        "52",
        "-12",
        "46"
      ],
      [
        "15",
        "Newcastle United",
        "38",
        "11",
        "11",
        "16",
        "58",
        "64",
        "-6",
        "44"
      ],
      [
        "16",
        "AFC Bournemouth",
        "38",
        "11",
        "11",
        "16",
        "49",
        "61",
        "-12",
        "44"
      ],
      [
        "17",
        "West Ham",
        "38",
        "13",
        "5",
        "20",
        "44",
        "56",
        "-12",
        "44"
      ],
      [
        "18",
        "Sunderland",
        "38",
        "10",
        "10",
        "18",
        "42",
        "59",
        "-17",
        "40"
      ],
      [
        "19",
        "Leicester City",
        "38",
        "3",
        "8",
        "27",
        "30",
        "83",
        "-53",
        "17"
      ],
      [
        "20",
        "Norwich",
        "38",
        "2",
        "9",
        "27",
        "35",
        "82",
        "-47",
        "15"
      ]
    ],
    "club": "Bristol City",
    "squad": [
      [
        "GK",
        "37",
        "Jordan Vale",
        "48",
        "0",
        "0",
        "19"
      ],
      [
        "GK",
        "13",
        "Joe Lumley",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "LB",
        "2",
        "Bradley Locko",
        "19",
        "0",
        "0",
        "9"
      ],
      [
        "LB",
        "3",
        "Cameron Pring",
        "4",
        "0",
        "0",
        "1"
      ],
      [
        "LB",
        "23",
        "Gastón Benedetti",
        "42",
        "0",
        "1",
        "7"
      ],
      [
        "CB",
        "16",
        "Rob Dickie",
        "36",
        "1",
        "0",
        "13"
      ],
      [
        "CB",
        "5",
        "Rob Atkinson",
        "46",
        "0",
        "0",
        "18"
      ],
      [
        "CB",
        "15",
        "Luke McNally",
        "45",
        "0",
        "0",
        "18"
      ],
      [
        "CB",
        "38",
        "Noah Eile",
        "14",
        "0",
        "0",
        "4"
      ],
      [
        "CB",
        "22",
        "Jamie Knight-Lebel",
        "10",
        "0",
        "0",
        "4"
      ],
      [
        "RB",
        "21",
        "Ross McCrorie",
        "5",
        "0",
        "0",
        "0"
      ],
      [
        "RB",
        "19",
        "George Tanner",
        "15",
        "0",
        "1",
        "1"
      ],
      [
        "RB",
        "26",
        "Brooke Norton-Cuffy",
        "46",
        "4",
        "5",
        "18"
      ],
      [
        "LM",
        "22",
        "Wisdom Mike",
        "14",
        "4",
        "2",
        "2"
      ],
      [
        "LM",
        "20",
        "Sam Bell",
        "13",
        "2",
        "1",
        "6"
      ],
      [
        "CM",
        "6",
        "Max Bird",
        "11",
        "2",
        "1",
        "1"
      ],
      [
        "CM",
        "4",
        "Adam Randell",
        "29",
        "3",
        "5",
        "11"
      ],
      [
        "CM",
        "12",
        "Jason Knight",
        "47",
        "14",
        "5",
        "22"
      ],
      [
        "CM",
        "14",
        "Tomi Horvat",
        "38",
        "4",
        "5",
        "7"
      ],
      [
        "CAM",
        "28",
        "Josh Stokes",
        "4",
        "0",
        "0",
        "0"
      ],
      [
        "CAM",
        "10",
        "Scott Twine",
        "25",
        "5",
        "5",
        "10"
      ],
      [
        "RM",
        "13",
        "Yū Hirakawa",
        "32",
        "2",
        "2",
        "13"
      ],
      [
        "RM",
        "17",
        "Mark Sykes",
        "17",
        "3",
        "1",
        "7"
      ],
      [
        "RW",
        "29",
        "Pablo López",
        "4",
        "1",
        "0",
        "0"
      ],
      [
        "ST",
        "11",
        "Keinan Davis",
        "28",
        "7",
        "5",
        "15"
      ],
      [
        "ST",
        "18",
        "Emil Riis",
        "2",
        "0",
        "0",
        "1"
      ],
      [
        "ST",
        "30",
        "Sinclair Armstrong",
        "22",
        "8",
        "4",
        "4"
      ]
    ]
  },
  // 2028–29
  "2028–29": {
    "league": "Premier League",
    "standings": [
      [
        "1",
        "Arsenal",
        "38",
        "26",
        "9",
        "3",
        "81",
        "35",
        "46",
        "87"
      ],
      [
        "2",
        "Chelsea",
        "38",
        "21",
        "11",
        "6",
        "70",
        "45",
        "25",
        "74"
      ],
      [
        "3",
        "Liverpool",
        "38",
        "21",
        "9",
        "8",
        "77",
        "43",
        "34",
        "72"
      ],
      [
        "4",
        "Manchester City",
        "38",
        "20",
        "11",
        "7",
        "73",
        "48",
        "25",
        "71"
      ],
      [
        "5",
        "Tottenham Hotspurs",
        "38",
        "20",
        "9",
        "9",
        "61",
        "48",
        "13",
        "69"
      ],
      [
        "6",
        "Crystal Palace",
        "38",
        "19",
        "8",
        "11",
        "57",
        "48",
        "9",
        "65"
      ],
      [
        "7",
        "Nottingham Forest",
        "38",
        "17",
        "12",
        "9",
        "53",
        "42",
        "11",
        "63"
      ],
      [
        "8",
        "Newcastle United",
        "38",
        "13",
        "15",
        "10",
        "59",
        "49",
        "10",
        "54"
      ],
      [
        "9",
        "West Ham",
        "38",
        "13",
        "12",
        "13",
        "56",
        "53",
        "3",
        "51"
      ],
      [
        "10",
        "Brighton & Hove",
        "38",
        "12",
        "14",
        "12",
        "58",
        "50",
        "8",
        "50"
      ],
      [
        "11",
        "Bristol City",
        "38",
        "13",
        "10",
        "15",
        "47",
        "51",
        "-4",
        "49"
      ],
      [
        "12",
        "Aston Villa",
        "38",
        "12",
        "13",
        "13",
        "49",
        "55",
        "-6",
        "49"
      ],
      [
        "13",
        "AFC Bournemouth",
        "38",
        "12",
        "10",
        "16",
        "48",
        "56",
        "-8",
        "46"
      ],
      [
        "14",
        "Manchester United",
        "38",
        "12",
        "9",
        "17",
        "55",
        "64",
        "-9",
        "45"
      ],
      [
        "15",
        "Wolves",
        "38",
        "8",
        "12",
        "18",
        "45",
        "68",
        "-23",
        "36"
      ],
      [
        "16",
        "Everton",
        "38",
        "7",
        "14",
        "17",
        "48",
        "62",
        "-14",
        "35"
      ],
      [
        "17",
        "Brentford",
        "38",
        "7",
        "14",
        "17",
        "43",
        "68",
        "-25",
        "35"
      ],
      [
        "18",
        "Leeds United",
        "38",
        "7",
        "10",
        "21",
        "41",
        "65",
        "-24",
        "31"
      ],
      [
        "19",
        "Ipswich",
        "38",
        "6",
        "10",
        "22",
        "40",
        "76",
        "-36",
        "28"
      ],
      [
        "20",
        "Fulham",
        "38",
        "3",
        "10",
        "25",
        "33",
        "68",
        "-35",
        "19"
      ]
    ],
    "club": "Bristol City",
    "squad": [
      [
        "GK",
        "37",
        "Jordan Vale",
        "59",
        "0",
        "5",
        "18"
      ],
      [
        "GK",
        "13",
        "Joe Lumley",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "LB",
        "3",
        "Cameron Pring",
        "6",
        "0",
        "0",
        "1"
      ],
      [
        "LB",
        "2",
        "Bjorn Meijer",
        "46",
        "3",
        "1",
        "8"
      ],
      [
        "LB",
        "23",
        "Gastón Benedetti",
        "45",
        "2",
        "4",
        "10"
      ],
      [
        "CB",
        "33",
        "Josh Campbell-Slowey",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "CB",
        "16",
        "Rob Dickie",
        "51",
        "0",
        "0",
        "14"
      ],
      [
        "CB",
        "5",
        "Rob Atkinson",
        "27",
        "0",
        "0",
        "6"
      ],
      [
        "CB",
        "15",
        "Luke McNally",
        "54",
        "0",
        "1",
        "16"
      ],
      [
        "CB",
        "38",
        "Noah Eile",
        "28",
        "0",
        "0",
        "9"
      ],
      [
        "CB",
        "22",
        "Jamie Knight-Lebel",
        "18",
        "0",
        "0",
        "8"
      ],
      [
        "RB",
        "21",
        "Ross McCrorie",
        "11",
        "1",
        "1",
        "3"
      ],
      [
        "RB",
        "19",
        "George Tanner",
        "17",
        "0",
        "1",
        "2"
      ],
      [
        "RB",
        "26",
        "Wagner Pina",
        "56",
        "0",
        "3",
        "17"
      ],
      [
        "CDM",
        "40",
        "Sam Morsy",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "LM",
        "22",
        "Wisdom Mike",
        "34",
        "10",
        "3",
        "7"
      ],
      [
        "LM",
        "20",
        "Sam Bell",
        "10",
        "3",
        "3",
        "5"
      ],
      [
        "LM",
        "27",
        "Noah Donovan Sahsah",
        "2",
        "0",
        "0",
        "0"
      ],
      [
        "CM",
        "6",
        "Max Bird",
        "50",
        "10",
        "9",
        "14"
      ],
      [
        "CM",
        "4",
        "Adam Randell",
        "11",
        "2",
        "1",
        "2"
      ],
      [
        "CM",
        "12",
        "Jason Knight",
        "59",
        "19",
        "11",
        "19"
      ],
      [
        "CM",
        "28",
        "Adam Murphy",
        "0",
        "0",
        "0",
        "0"
      ],
      [
        "CM",
        "14",
        "Tomi Horvat",
        "40",
        "5",
        "4",
        "3"
      ],
      [
        "CAM",
        "28",
        "Josh Stokes",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "CAM",
        "10",
        "Scott Twine",
        "22",
        "2",
        "1",
        "2"
      ],
      [
        "RM",
        "13",
        "Yū Hirakawa",
        "11",
        "0",
        "0",
        "4"
      ],
      [
        "RM",
        "17",
        "Mark Sykes",
        "36",
        "1",
        "5",
        "14"
      ],
      [
        "RW",
        "29",
        "Pablo López",
        "2",
        "1",
        "0",
        "0"
      ],
      [
        "ST",
        "9",
        "Harry Cornick",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "ST",
        "11",
        "Keinan Davis",
        "28",
        "1",
        "1",
        "2"
      ],
      [
        "ST",
        "18",
        "Emil Riis",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "ST",
        "30",
        "Sinclair Armstrong",
        "50",
        "21",
        "5",
        "19"
      ]
    ]
  },
  // 2029–30 — supplied positions, P and points after 18 matches.
  // Other league columns omitted from source; 17 scored fixtures are recorded.
  "2029–30": {
    "league": "Premier League",
    "standings": [
      [
        "1",
        "Chelsea",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "36"
      ],
      [
        "2",
        "Liverpool",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "36"
      ],
      [
        "3",
        "Manchester United",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "34"
      ],
      [
        "4",
        "Tottenham Hotspurs",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "32"
      ],
      [
        "5",
        "Arsenal",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "32"
      ],
      [
        "6",
        "Aston Villa",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "30"
      ],
      [
        "7",
        "Manchester City",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "30"
      ],
      [
        "8",
        "West Ham",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "30"
      ],
      [
        "9",
        "Nottingham Forest",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "26"
      ],
      [
        "10",
        "Newcastle United",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "25"
      ],
      [
        "11",
        "Everton",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "21"
      ],
      [
        "12",
        "Brighton & Hove",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "20"
      ],
      [
        "13",
        "Wolves",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "19"
      ],
      [
        "14",
        "Crystal Palace",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "18"
      ],
      [
        "15",
        "AFC Bournemouth",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "18"
      ],
      [
        "16",
        "Coventry City",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "16"
      ],
      [
        "17",
        "Bristol City",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "16"
      ],
      [
        "18",
        "Sunderland",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "13"
      ],
      [
        "19",
        "Brentford",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "13"
      ],
      [
        "20",
        "Burnley",
        "18",
        "",
        "",
        "",
        "",
        "",
        "",
        "11"
      ]
    ],
    "club": "Manchester United",
    "squad": [
      [
        "GK",
        "1",
        "Jordan Vale",
        "24",
        "0",
        "0",
        "8"
      ],
      [
        "GK",
        "22",
        "Tom Heaton",
        "",
        "",
        "",
        ""
      ],
      [
        "GK",
        "31",
        "Senne Lammens",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "GK",
        "44",
        "Radek Vítek",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "LB",
        "5",
        "Emeka Adiele",
        "2",
        "0",
        "0",
        "0"
      ],
      [
        "LB",
        "14",
        "Lucas Mincarelli",
        "23",
        "1",
        "1",
        "8"
      ],
      [
        "CB",
        "26",
        "Ayden Heaven",
        "9",
        "0",
        "0",
        "4"
      ],
      [
        "CB",
        "4",
        "Matthijs De Ligt",
        "19",
        "0",
        "0",
        "5"
      ],
      [
        "CB",
        "6",
        "Lisandro Martínez",
        "15",
        "1",
        "0",
        "1"
      ],
      [
        "CB",
        "16",
        "Malick Thiaw",
        "19",
        "1",
        "0",
        "5"
      ],
      [
        "CB",
        "21",
        "Thijmen Blokzijl",
        "2",
        "0",
        "0",
        "1"
      ],
      [
        "CB",
        "33",
        "Tyler Fredricson",
        "",
        "",
        "",
        ""
      ],
      [
        "RB",
        "2",
        "Trent Alexander-Arnold",
        "23",
        "0",
        "4",
        "9"
      ],
      [
        "RB",
        "3",
        "Sergiño Dest",
        "",
        "",
        "",
        ""
      ],
      [
        "CDM",
        "27",
        "Sékou Koné",
        "",
        "",
        "",
        ""
      ],
      [
        "CDM",
        "29",
        "Jacob Devaney",
        "8",
        "1",
        "0",
        "3"
      ],
      [
        "CDM",
        "25",
        "Toby Collyer",
        "22",
        "1",
        "3",
        "6"
      ],
      [
        "LM",
        "17",
        "Ro-Zangelo Daal",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "LM",
        "24",
        "Ethan Williams",
        "",
        "",
        "",
        ""
      ],
      [
        "LM",
        "13",
        "Jadon Sancho",
        "11",
        "1",
        "1",
        "5"
      ],
      [
        "CM",
        "38",
        "Jack Fletcher",
        "",
        "",
        "",
        ""
      ],
      [
        "CM",
        "39",
        "Tyler Fletcher",
        "",
        "",
        "",
        ""
      ],
      [
        "CM",
        "20",
        "Walem Mefrane",
        "23",
        "5",
        "5",
        "7"
      ],
      [
        "CM",
        "15",
        "Dani Ceballos",
        "8",
        "2",
        "0",
        "0"
      ],
      [
        "CM",
        "42",
        "Daniel Gore",
        "",
        "",
        "",
        ""
      ],
      [
        "CAM",
        "28",
        "James Scanlon",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "CAM",
        "47",
        "Mauricio",
        "8",
        "1",
        "0",
        "0"
      ],
      [
        "CAM",
        "8",
        "Bruno Fernandes",
        "24",
        "6",
        "1",
        "8"
      ],
      [
        "CAM",
        "7",
        "Mason Mount",
        "1",
        "0",
        "0",
        "0"
      ],
      [
        "CAM",
        "10",
        "Matheus Cunha",
        "17",
        "4",
        "0",
        "5"
      ],
      [
        "RM",
        "43",
        "Ethan Ennis",
        "",
        "",
        "",
        ""
      ],
      [
        "LW",
        "36",
        "Marcus Rashford",
        "5",
        "0",
        "1",
        "0"
      ],
      [
        "RW",
        "19",
        "Bryan Mbeumo",
        "24",
        "5",
        "2",
        "8"
      ],
      [
        "ST",
        "23",
        "Ethan Wheatley",
        "",
        "",
        "",
        ""
      ],
      [
        "ST",
        "9",
        "Ferran Torres",
        "24",
        "7",
        "5",
        "8"
      ],
      [
        "ST",
        "11",
        "Joshua Zirkzee",
        "4",
        "2",
        "0",
        "0"
      ]
    ]
  }

};

// ============================================================================
// 04 — PRE-SEASON TABLES
// PRESEASON_TABLES.jordan
// Friendly and pre-season tournament standings.
// ============================================================================
PRESEASON_TABLES.jordan = {
  // 2025–26
  "2025–26": {
    "type": "league",
    "rows": [
      [
        "1",
        "RC Deportivo",
        "3",
        "2",
        "1",
        "0",
        "3",
        "0",
        "3",
        "7"
      ],
      [
        "2",
        "Havre AC",
        "3",
        "2",
        "0",
        "1",
        "2",
        "1",
        "1",
        "6"
      ],
      [
        "3",
        "Bristol City",
        "3",
        "1",
        "2",
        "0",
        "1",
        "0",
        "1",
        "5"
      ],
      [
        "4",
        "FC Utrecht",
        "3",
        "1",
        "1",
        "1",
        "1",
        "1",
        "0",
        "4"
      ],
      [
        "5",
        "Stade Brestois 29",
        "3",
        "1",
        "1",
        "1",
        "2",
        "2",
        "0",
        "4"
      ],
      [
        "6",
        "Samsunspor",
        "3",
        "1",
        "1",
        "1",
        "2",
        "3",
        "-1",
        "4"
      ],
      [
        "7",
        "FC Metz",
        "3",
        "1",
        "0",
        "2",
        "1",
        "2",
        "-1",
        "3"
      ],
      [
        "8",
        "Hellas Verona",
        "3",
        "0",
        "0",
        "3",
        "0",
        "3",
        "-3",
        "0"
      ]
    ]
  },
  // 2026–27
  "2026–27": {
    "type": "league",
    "rows": [
      [
        "1",
        "Parma",
        "3",
        "2",
        "1",
        "0",
        "5",
        "3",
        "2",
        "7"
      ],
      [
        "2",
        "Real Oviedo",
        "3",
        "1",
        "1",
        "1",
        "4",
        "3",
        "1",
        "4"
      ],
      [
        "3",
        "Sassuolo",
        "3",
        "1",
        "1",
        "1",
        "4",
        "4",
        "0",
        "4"
      ],
      [
        "4",
        "RC Deportivo",
        "3",
        "1",
        "1",
        "1",
        "2",
        "3",
        "-1",
        "4"
      ],
      [
        "5",
        "Elche CF",
        "3",
        "0",
        "3",
        "0",
        "4",
        "4",
        "0",
        "3"
      ],
      [
        "6",
        "1. FC Köln",
        "3",
        "0",
        "3",
        "0",
        "3",
        "3",
        "0",
        "3"
      ],
      [
        "7",
        "FC Augsburg",
        "3",
        "0",
        "2",
        "1",
        "3",
        "4",
        "-1",
        "2"
      ],
      [
        "8",
        "Bristol City",
        "3",
        "0",
        "2",
        "1",
        "1",
        "2",
        "-1",
        "2"
      ]
    ]
  },
  // 2027–28
  "2027–28": {
    "type": "league",
    "rows": [
      [
        "1",
        "Bristol City",
        "3",
        "2",
        "1",
        "0",
        "3",
        "0",
        "3",
        "7"
      ],
      [
        "2",
        "Como 1907",
        "3",
        "2",
        "0",
        "1",
        "2",
        "1",
        "1",
        "6"
      ],
      [
        "3",
        "Real Sociedad",
        "3",
        "1",
        "1",
        "1",
        "4",
        "3",
        "1",
        "4"
      ],
      [
        "4",
        "SV Werder Bremen",
        "3",
        "1",
        "1",
        "1",
        "3",
        "3",
        "0",
        "4"
      ],
      [
        "5",
        "TSG Hoffenheim",
        "3",
        "1",
        "1",
        "1",
        "2",
        "2",
        "0",
        "4"
      ],
      [
        "6",
        "Getafe CF",
        "3",
        "1",
        "1",
        "1",
        "2",
        "2",
        "0",
        "4"
      ],
      [
        "7",
        "VfL Wolfsburg",
        "3",
        "1",
        "0",
        "2",
        "2",
        "4",
        "-2",
        "3"
      ],
      [
        "8",
        "Torino",
        "3",
        "0",
        "1",
        "2",
        "0",
        "3",
        "-3",
        "1"
      ]
    ]
  },
  // 2028–29
  "2028–29": {
    "type": "league",
    "rows": [
      [
        "1",
        "Girona FC",
        "3",
        "3",
        "0",
        "0",
        "5",
        "2",
        "3",
        "9"
      ],
      [
        "2",
        "Bristol City",
        "3",
        "2",
        "1",
        "0",
        "7",
        "2",
        "5",
        "7"
      ],
      [
        "3",
        "Genoa",
        "3",
        "2",
        "0",
        "1",
        "5",
        "3",
        "2",
        "6"
      ],
      [
        "4",
        "Venezia",
        "3",
        "2",
        "0",
        "1",
        "4",
        "2",
        "2",
        "6"
      ],
      [
        "5",
        "Monza",
        "3",
        "1",
        "0",
        "2",
        "5",
        "8",
        "-3",
        "3"
      ],
      [
        "6",
        "Cagliari",
        "3",
        "1",
        "0",
        "2",
        "3",
        "5",
        "-2",
        "3"
      ],
      [
        "7",
        "RCD Espanyol",
        "3",
        "0",
        "1",
        "2",
        "1",
        "4",
        "-3",
        "1"
      ],
      [
        "8",
        "Sevilla FC",
        "3",
        "0",
        "0",
        "3",
        "2",
        "6",
        "-4",
        "0"
      ]
    ]
  },
  // 2029–30 — Champions Trophy group standings
  "2029–30": {
    "type": "league",
    "rows": [
      ["1", "RC Mallorca", "3", "2", "1", "0", "8", "5", "3", "7"],
      ["2", "Manchester United", "3", "1", "1", "1", "3", "2", "1", "4"],
      ["3", "Al Ahli", "3", "1", "1", "1", "6", "6", "0", "4"],
      ["4", "Al Nassr", "3", "1", "1", "1", "2", "3", "-1", "4"],
      ["5", "Real Betis", "3", "1", "1", "1", "2", "2", "0", "4"],
      ["6", "Sassuolo", "3", "1", "1", "1", "2", "2", "0", "4"],
      ["7", "SC Freiburg", "3", "1", "0", "2", "3", "5", "-2", "3"],
      ["8", "Rayo Vallecano", "3", "0", "2", "1", "4", "5", "-1", "2"]
    ]
  }
};

// ============================================================================
// 05 — OTHER COMPETITION TABLES
// COMPETITION_TABLES.jordan
// European and other competition-specific standings.
// ============================================================================
COMPETITION_TABLES.jordan = {
  // 2025–26
  "2025–26": {
    "World Cup": {
      "type": "groups",
      "groups": [
        {
          "name": "Group A",
          "rows": [
            [
              "1",
              "Mexico",
              "3",
              "2",
              "1",
              "0",
              "6",
              "4",
              "2",
              "7"
            ],
            [
              "2",
              "Czechia",
              "3",
              "1",
              "1",
              "1",
              "6",
              "4",
              "2",
              "4"
            ],
            [
              "3",
              "Korea Republic",
              "3",
              "0",
              "3",
              "0",
              "5",
              "5",
              "0",
              "3"
            ],
            [
              "4",
              "South Africa",
              "3",
              "0",
              "1",
              "2",
              "2",
              "6",
              "-4",
              "1"
            ]
          ]
        },
        {
          "name": "Group B",
          "rows": [
            [
              "1",
              "Switzerland",
              "3",
              "2",
              "1",
              "0",
              "6",
              "2",
              "4",
              "7"
            ],
            [
              "2",
              "Canada",
              "3",
              "2",
              "1",
              "0",
              "5",
              "2",
              "3",
              "7"
            ],
            [
              "3",
              "Bosnia-Herzegov",
              "3",
              "1",
              "0",
              "2",
              "3",
              "3",
              "0",
              "3"
            ],
            [
              "4",
              "Qatar",
              "3",
              "0",
              "0",
              "3",
              "2",
              "9",
              "-7",
              "0"
            ]
          ]
        },
        {
          "name": "Group C",
          "rows": [
            [
              "1",
              "Morocco",
              "3",
              "3",
              "0",
              "0",
              "6",
              "2",
              "4",
              "9"
            ],
            [
              "2",
              "Scotland",
              "3",
              "1",
              "1",
              "1",
              "7",
              "5",
              "2",
              "4"
            ],
            [
              "3",
              "Brazil",
              "3",
              "1",
              "1",
              "1",
              "5",
              "4",
              "1",
              "4"
            ],
            [
              "4",
              "Haiti",
              "3",
              "0",
              "0",
              "3",
              "3",
              "10",
              "-7",
              "0"
            ]
          ]
        },
        {
          "name": "Group D",
          "rows": [
            [
              "1",
              "Turkiye",
              "3",
              "3",
              "0",
              "0",
              "8",
              "3",
              "5",
              "9"
            ],
            [
              "2",
              "United States",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "3",
              "Paraguay",
              "3",
              "0",
              "2",
              "1",
              "6",
              "7",
              "-1",
              "2"
            ],
            [
              "4",
              "Australia",
              "3",
              "0",
              "1",
              "2",
              "3",
              "6",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group E",
          "rows": [
            [
              "1",
              "Curaçao",
              "3",
              "1",
              "2",
              "0",
              "5",
              "4",
              "1",
              "5"
            ],
            [
              "2",
              "Germany",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "3",
              "Cote d'Ivorie",
              "3",
              "0",
              "3",
              "0",
              "2",
              "2",
              "0",
              "3"
            ],
            [
              "4",
              "Ecuador",
              "3",
              "0",
              "2",
              "1",
              "2",
              "3",
              "-1",
              "2"
            ]
          ]
        },
        {
          "name": "Group F",
          "rows": [
            [
              "1",
              "Sweden",
              "3",
              "2",
              "1",
              "0",
              "4",
              "2",
              "2",
              "7"
            ],
            [
              "2",
              "Japan",
              "3",
              "2",
              "0",
              "1",
              "4",
              "3",
              "1",
              "6"
            ],
            [
              "3",
              "Netherlands",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Tunisia",
              "3",
              "0",
              "0",
              "3",
              "4",
              "7",
              "-3",
              "0"
            ]
          ]
        },
        {
          "name": "Group G",
          "rows": [
            [
              "1",
              "IR Iran",
              "3",
              "2",
              "0",
              "1",
              "4",
              "3",
              "1",
              "6"
            ],
            [
              "2",
              "Egypt",
              "3",
              "1",
              "1",
              "1",
              "4",
              "4",
              "0",
              "4"
            ],
            [
              "3",
              "New Zealand",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Belgium",
              "3",
              "1",
              "0",
              "2",
              "4",
              "5",
              "-1",
              "3"
            ]
          ]
        },
        {
          "name": "Group H",
          "rows": [
            [
              "1",
              "Spain",
              "3",
              "3",
              "0",
              "0",
              "6",
              "1",
              "5",
              "9"
            ],
            [
              "2",
              "Uruguay",
              "3",
              "2",
              "0",
              "1",
              "5",
              "4",
              "1",
              "6"
            ],
            [
              "3",
              "Saudi Arabia",
              "3",
              "1",
              "0",
              "2",
              "2",
              "4",
              "-2",
              "3"
            ],
            [
              "4",
              "Cabo Verde",
              "3",
              "0",
              "0",
              "3",
              "0",
              "4",
              "-4",
              "0"
            ]
          ]
        },
        {
          "name": "Group I",
          "rows": [
            [
              "1",
              "Senegal",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "2",
              "Norway",
              "3",
              "1",
              "2",
              "0",
              "7",
              "3",
              "4",
              "5"
            ],
            [
              "3",
              "France",
              "3",
              "0",
              "2",
              "1",
              "4",
              "5",
              "-1",
              "2"
            ],
            [
              "4",
              "Iraq",
              "3",
              "0",
              "1",
              "2",
              "2",
              "8",
              "-6",
              "1"
            ]
          ]
        },
        {
          "name": "Group J",
          "rows": [
            [
              "1",
              "Austria",
              "3",
              "3",
              "0",
              "0",
              "6",
              "2",
              "4",
              "9"
            ],
            [
              "2",
              "Algeria",
              "3",
              "2",
              "0",
              "1",
              "4",
              "2",
              "2",
              "6"
            ],
            [
              "3",
              "Argentina",
              "3",
              "1",
              "0",
              "2",
              "2",
              "4",
              "-2",
              "3"
            ],
            [
              "4",
              "Jordan",
              "3",
              "0",
              "0",
              "3",
              "2",
              "6",
              "-4",
              "0"
            ]
          ]
        },
        {
          "name": "Group K",
          "rows": [
            [
              "1",
              "Portugal",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "2",
              "Congo DR",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "3",
              "Colombia",
              "3",
              "1",
              "0",
              "2",
              "5",
              "5",
              "0",
              "3"
            ],
            [
              "4",
              "Uzbekistan",
              "3",
              "0",
              "0",
              "3",
              "4",
              "10",
              "-6",
              "0"
            ]
          ]
        },
        {
          "name": "Group L",
          "rows": [
            [
              "1",
              "England",
              "3",
              "3",
              "0",
              "0",
              "6",
              "0",
              "6",
              "9"
            ],
            [
              "2",
              "Panama",
              "3",
              "2",
              "0",
              "1",
              "3",
              "3",
              "0",
              "6"
            ],
            [
              "3",
              "Ghana",
              "3",
              "0",
              "1",
              "2",
              "2",
              "5",
              "-3",
              "1"
            ],
            [
              "4",
              "Croatia",
              "3",
              "0",
              "1",
              "2",
              "1",
              "4",
              "-3",
              "1"
            ]
          ]
        }
      ]
    }
  },
  // 2026–27
  "2026–27": {
    "World Cup": {
      "type": "groups",
      "groups": [
        {
          "name": "Group A",
          "rows": [
            [
              "1",
              "Mexico",
              "3",
              "2",
              "1",
              "0",
              "6",
              "4",
              "2",
              "7"
            ],
            [
              "2",
              "Czechia",
              "3",
              "1",
              "1",
              "1",
              "6",
              "4",
              "2",
              "4"
            ],
            [
              "3",
              "Korea Republic",
              "3",
              "0",
              "3",
              "0",
              "5",
              "5",
              "0",
              "3"
            ],
            [
              "4",
              "South Africa",
              "3",
              "0",
              "1",
              "2",
              "2",
              "6",
              "-4",
              "1"
            ]
          ]
        },
        {
          "name": "Group B",
          "rows": [
            [
              "1",
              "Switzerland",
              "3",
              "2",
              "1",
              "0",
              "6",
              "2",
              "4",
              "7"
            ],
            [
              "2",
              "Canada",
              "3",
              "2",
              "1",
              "0",
              "5",
              "2",
              "3",
              "7"
            ],
            [
              "3",
              "Bosnia-Herzegov",
              "3",
              "1",
              "0",
              "2",
              "3",
              "3",
              "0",
              "3"
            ],
            [
              "4",
              "Qatar",
              "3",
              "0",
              "0",
              "3",
              "2",
              "9",
              "-7",
              "0"
            ]
          ]
        },
        {
          "name": "Group C",
          "rows": [
            [
              "1",
              "Morocco",
              "3",
              "3",
              "0",
              "0",
              "6",
              "2",
              "4",
              "9"
            ],
            [
              "2",
              "Scotland",
              "3",
              "1",
              "1",
              "1",
              "7",
              "5",
              "2",
              "4"
            ],
            [
              "3",
              "Brazil",
              "3",
              "1",
              "1",
              "1",
              "5",
              "4",
              "1",
              "4"
            ],
            [
              "4",
              "Haiti",
              "3",
              "0",
              "0",
              "3",
              "3",
              "10",
              "-7",
              "0"
            ]
          ]
        },
        {
          "name": "Group D",
          "rows": [
            [
              "1",
              "Turkiye",
              "3",
              "3",
              "0",
              "0",
              "8",
              "3",
              "5",
              "9"
            ],
            [
              "2",
              "United States",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "3",
              "Paraguay",
              "3",
              "0",
              "2",
              "1",
              "6",
              "7",
              "-1",
              "2"
            ],
            [
              "4",
              "Australia",
              "3",
              "0",
              "1",
              "2",
              "3",
              "6",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group E",
          "rows": [
            [
              "1",
              "Curaçao",
              "3",
              "1",
              "2",
              "0",
              "5",
              "4",
              "1",
              "5"
            ],
            [
              "2",
              "Germany",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "3",
              "Cote d'Ivorie",
              "3",
              "0",
              "3",
              "0",
              "2",
              "2",
              "0",
              "3"
            ],
            [
              "4",
              "Ecuador",
              "3",
              "0",
              "2",
              "1",
              "2",
              "3",
              "-1",
              "2"
            ]
          ]
        },
        {
          "name": "Group F",
          "rows": [
            [
              "1",
              "Sweden",
              "3",
              "2",
              "1",
              "0",
              "4",
              "2",
              "2",
              "7"
            ],
            [
              "2",
              "Japan",
              "3",
              "2",
              "0",
              "1",
              "4",
              "3",
              "1",
              "6"
            ],
            [
              "3",
              "Netherlands",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Tunisia",
              "3",
              "0",
              "0",
              "3",
              "4",
              "7",
              "-3",
              "0"
            ]
          ]
        },
        {
          "name": "Group G",
          "rows": [
            [
              "1",
              "IR Iran",
              "3",
              "2",
              "0",
              "1",
              "4",
              "3",
              "1",
              "6"
            ],
            [
              "2",
              "Egypt",
              "3",
              "1",
              "1",
              "1",
              "4",
              "4",
              "0",
              "4"
            ],
            [
              "3",
              "New Zealand",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Belgium",
              "3",
              "1",
              "0",
              "2",
              "4",
              "5",
              "-1",
              "3"
            ]
          ]
        },
        {
          "name": "Group H",
          "rows": [
            [
              "1",
              "Spain",
              "3",
              "3",
              "0",
              "0",
              "6",
              "1",
              "5",
              "9"
            ],
            [
              "2",
              "Uruguay",
              "3",
              "2",
              "0",
              "1",
              "5",
              "4",
              "1",
              "6"
            ],
            [
              "3",
              "Saudi Arabia",
              "3",
              "1",
              "0",
              "2",
              "2",
              "4",
              "-2",
              "3"
            ],
            [
              "4",
              "Cabo Verde",
              "3",
              "0",
              "0",
              "3",
              "0",
              "4",
              "-4",
              "0"
            ]
          ]
        },
        {
          "name": "Group I",
          "rows": [
            [
              "1",
              "Senegal",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "2",
              "Norway",
              "3",
              "1",
              "2",
              "0",
              "7",
              "3",
              "4",
              "5"
            ],
            [
              "3",
              "France",
              "3",
              "0",
              "2",
              "1",
              "4",
              "5",
              "-1",
              "2"
            ],
            [
              "4",
              "Iraq",
              "3",
              "0",
              "1",
              "2",
              "2",
              "8",
              "-6",
              "1"
            ]
          ]
        },
        {
          "name": "Group J",
          "rows": [
            [
              "1",
              "Austria",
              "3",
              "3",
              "0",
              "0",
              "6",
              "2",
              "4",
              "9"
            ],
            [
              "2",
              "Algeria",
              "3",
              "2",
              "0",
              "1",
              "4",
              "2",
              "2",
              "6"
            ],
            [
              "3",
              "Argentina",
              "3",
              "1",
              "0",
              "2",
              "2",
              "4",
              "-2",
              "3"
            ],
            [
              "4",
              "Jordan",
              "3",
              "0",
              "0",
              "3",
              "2",
              "6",
              "-4",
              "0"
            ]
          ]
        },
        {
          "name": "Group K",
          "rows": [
            [
              "1",
              "Portugal",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "2",
              "Congo DR",
              "3",
              "2",
              "1",
              "0",
              "6",
              "3",
              "3",
              "7"
            ],
            [
              "3",
              "Colombia",
              "3",
              "1",
              "0",
              "2",
              "5",
              "5",
              "0",
              "3"
            ],
            [
              "4",
              "Uzbekistan",
              "3",
              "0",
              "0",
              "3",
              "4",
              "10",
              "-6",
              "0"
            ]
          ]
        },
        {
          "name": "Group L",
          "rows": [
            [
              "1",
              "England",
              "3",
              "3",
              "0",
              "0",
              "6",
              "0",
              "6",
              "9"
            ],
            [
              "2",
              "Panama",
              "3",
              "2",
              "0",
              "1",
              "3",
              "3",
              "0",
              "6"
            ],
            [
              "3",
              "Ghana",
              "3",
              "0",
              "1",
              "2",
              "2",
              "5",
              "-3",
              "1"
            ],
            [
              "4",
              "Croatia",
              "3",
              "0",
              "1",
              "2",
              "1",
              "4",
              "-3",
              "1"
            ]
          ]
        }
      ]
    }
  },
  // 2027–28
  "2027–28": {
    "Euros": {
      "type": "groups",
      "groups": [
        {
          "name": "Group A",
          "rows": [
            [
              "1",
              "Belgium",
              "3",
              "3",
              "0",
              "0",
              "9",
              "3",
              "6",
              "9"
            ],
            [
              "2",
              "Sweden",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "3",
              "Czechia",
              "3",
              "1",
              "0",
              "2",
              "5",
              "7",
              "-2",
              "3"
            ],
            [
              "4",
              "Türkiye",
              "3",
              "0",
              "1",
              "2",
              "1",
              "4",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group B",
          "rows": [
            [
              "1",
              "Germany",
              "3",
              "3",
              "0",
              "0",
              "7",
              "2",
              "5",
              "9"
            ],
            [
              "2",
              "Netherlands",
              "3",
              "1",
              "1",
              "1",
              "6",
              "5",
              "1",
              "4"
            ],
            [
              "3",
              "Austria",
              "3",
              "0",
              "2",
              "1",
              "5",
              "8",
              "-3",
              "2"
            ],
            [
              "4",
              "Switzerland",
              "3",
              "0",
              "1",
              "2",
              "3",
              "6",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group C",
          "rows": [
            [
              "1",
              "Spain",
              "3",
              "2",
              "0",
              "1",
              "7",
              "4",
              "3",
              "6"
            ],
            [
              "2",
              "Hungary",
              "3",
              "1",
              "1",
              "1",
              "4",
              "4",
              "0",
              "4"
            ],
            [
              "3",
              "Northern Ireland",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Poland",
              "3",
              "0",
              "2",
              "1",
              "4",
              "7",
              "-3",
              "2"
            ]
          ]
        },
        {
          "name": "Group D",
          "rows": [
            [
              "1",
              "England",
              "3",
              "2",
              "1",
              "0",
              "8",
              "1",
              "7",
              "7"
            ],
            [
              "2",
              "Ukraine",
              "3",
              "1",
              "2",
              "0",
              "4",
              "2",
              "2",
              "5"
            ],
            [
              "3",
              "Bosnia-Herzegov",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "4",
              "Scotland",
              "3",
              "0",
              "0",
              "3",
              "0",
              "8",
              "-8",
              "0"
            ]
          ]
        },
        {
          "name": "Group E",
          "rows": [
            [
              "1",
              "Italy",
              "3",
              "2",
              "1",
              "0",
              "5",
              "4",
              "1",
              "7"
            ],
            [
              "2",
              "Croatia",
              "3",
              "1",
              "2",
              "0",
              "5",
              "3",
              "2",
              "5"
            ],
            [
              "3",
              "Finland",
              "3",
              "0",
              "2",
              "1",
              "3",
              "4",
              "-1",
              "2"
            ],
            [
              "4",
              "Norway",
              "3",
              "0",
              "1",
              "2",
              "2",
              "6",
              "-4",
              "1"
            ]
          ]
        },
        {
          "name": "Group F",
          "rows": [
            [
              "1",
              "Ireland",
              "3",
              "3",
              "0",
              "0",
              "5",
              "2",
              "3",
              "9"
            ],
            [
              "2",
              "France",
              "3",
              "2",
              "0",
              "1",
              "5",
              "4",
              "1",
              "6"
            ],
            [
              "3",
              "Portugal",
              "3",
              "1",
              "0",
              "2",
              "6",
              "3",
              "3",
              "3"
            ],
            [
              "4",
              "Romania",
              "3",
              "0",
              "0",
              "3",
              "4",
              "11",
              "-7",
              "0"
            ]
          ]
        }
      ]
    }
  },
  // 2028–29
  "2028–29": {
    "UEFA Europa League": {
      "type": "league",
      "rows": [
        [
          "1",
          "Athletic Club",
          "8",
          "5",
          "2",
          "1",
          "17",
          "11",
          "6",
          "17"
        ],
        [
          "2",
          "LOSC Lille",
          "8",
          "5",
          "2",
          "1",
          "16",
          "10",
          "6",
          "17"
        ],
        [
          "3",
          "Celtic",
          "8",
          "5",
          "2",
          "1",
          "14",
          "8",
          "6",
          "17"
        ],
        [
          "4",
          "RB Leipzig",
          "8",
          "5",
          "1",
          "2",
          "13",
          "5",
          "8",
          "16"
        ],
        [
          "5",
          "Club Brugge",
          "8",
          "5",
          "1",
          "2",
          "16",
          "11",
          "5",
          "16"
        ],
        [
          "6",
          "Sporting CP",
          "8",
          "4",
          "3",
          "1",
          "16",
          "10",
          "6",
          "15"
        ],
        [
          "7",
          "Chelsea",
          "8",
          "4",
          "3",
          "1",
          "17",
          "14",
          "3",
          "15"
        ],
        [
          "8",
          "Shakhtar Donetsk",
          "8",
          "4",
          "2",
          "2",
          "13",
          "10",
          "3",
          "14"
        ],
        [
          "9",
          "AS Monaco",
          "8",
          "3",
          "4",
          "1",
          "14",
          "11",
          "3",
          "13"
        ],
        [
          "10",
          "SS Lazio",
          "8",
          "4",
          "1",
          "3",
          "12",
          "9",
          "3",
          "13"
        ],
        [
          "11",
          "Bristol City",
          "8",
          "4",
          "1",
          "3",
          "12",
          "9",
          "3",
          "13"
        ],
        [
          "12",
          "Sparta Praha",
          "8",
          "3",
          "4",
          "1",
          "13",
          "11",
          "2",
          "13"
        ],
        [
          "13",
          "RB Salzburg",
          "8",
          "4",
          "1",
          "3",
          "11",
          "9",
          "2",
          "13"
        ],
        [
          "14",
          "APOEL FC",
          "8",
          "3",
          "3",
          "2",
          "13",
          "15",
          "-2",
          "12"
        ],
        [
          "15",
          "Feyenoord",
          "8",
          "4",
          "0",
          "4",
          "9",
          "11",
          "-2",
          "12"
        ],
        [
          "16",
          "KRC Genk",
          "8",
          "3",
          "2",
          "3",
          "15",
          "11",
          "4",
          "11"
        ],
        [
          "17",
          "AS Roma",
          "8",
          "3",
          "2",
          "3",
          "14",
          "11",
          "3",
          "11"
        ],
        [
          "18",
          "PSV",
          "8",
          "2",
          "5",
          "1",
          "14",
          "13",
          "1",
          "11"
        ],
        [
          "19",
          "AZ",
          "8",
          "3",
          "2",
          "3",
          "13",
          "12",
          "1",
          "11"
        ],
        [
          "20",
          "Viktoria Plzeň",
          "8",
          "3",
          "2",
          "3",
          "9",
          "9",
          "0",
          "11"
        ],
        [
          "21",
          "FC Nordsjælland",
          "8",
          "3",
          "2",
          "3",
          "9",
          "10",
          "-1",
          "11"
        ],
        [
          "22",
          "Real Betis",
          "8",
          "2",
          "4",
          "2",
          "12",
          "14",
          "-2",
          "10"
        ],
        [
          "23",
          "Stade Rennais FC",
          "8",
          "2",
          "3",
          "3",
          "12",
          "10",
          "2",
          "9"
        ],
        [
          "24",
          "Beşiktaş",
          "8",
          "2",
          "3",
          "3",
          "11",
          "9",
          "2",
          "9"
        ],
        [
          "25",
          "PAOK FC",
          "8",
          "2",
          "3",
          "3",
          "13",
          "15",
          "-2",
          "9"
        ],
        [
          "26",
          "BSC Young Boys",
          "8",
          "2",
          "3",
          "3",
          "10",
          "12",
          "-2",
          "9"
        ],
        [
          "27",
          "Brøndby IF",
          "8",
          "2",
          "3",
          "3",
          "5",
          "8",
          "-3",
          "9"
        ],
        [
          "28",
          "Hearts",
          "8",
          "2",
          "2",
          "4",
          "6",
          "9",
          "-3",
          "8"
        ],
        [
          "29",
          "Rangers",
          "8",
          "2",
          "2",
          "4",
          "11",
          "15",
          "-4",
          "8"
        ],
        [
          "30",
          "Standard de Liège",
          "8",
          "2",
          "2",
          "4",
          "8",
          "13",
          "-5",
          "8"
        ],
        [
          "31",
          "Lech Poznań",
          "8",
          "2",
          "1",
          "5",
          "12",
          "16",
          "-4",
          "7"
        ],
        [
          "32",
          "FCSB",
          "8",
          "1",
          "3",
          "4",
          "9",
          "13",
          "-4",
          "6"
        ],
        [
          "33",
          "Samsunspor",
          "8",
          "1",
          "3",
          "4",
          "9",
          "16",
          "-7",
          "6"
        ],
        [
          "34",
          "TSG Hoffenheim",
          "8",
          "0",
          "4",
          "4",
          "8",
          "14",
          "-6",
          "4"
        ],
        [
          "35",
          "Hammarby IF",
          "8",
          "1",
          "1",
          "6",
          "9",
          "17",
          "-8",
          "4"
        ],
        [
          "36",
          "Silkeborg IF",
          "8",
          "1",
          "0",
          "7",
          "9",
          "23",
          "-14",
          "3"
        ]
      ]
    },
    "Euros": {
      "type": "groups",
      "groups": [
        {
          "name": "Group A",
          "rows": [
            [
              "1",
              "Belgium",
              "3",
              "3",
              "0",
              "0",
              "9",
              "3",
              "6",
              "9"
            ],
            [
              "2",
              "Sweden",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "3",
              "Czechia",
              "3",
              "1",
              "0",
              "2",
              "5",
              "7",
              "-2",
              "3"
            ],
            [
              "4",
              "Türkiye",
              "3",
              "0",
              "1",
              "2",
              "1",
              "4",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group B",
          "rows": [
            [
              "1",
              "Germany",
              "3",
              "3",
              "0",
              "0",
              "7",
              "2",
              "5",
              "9"
            ],
            [
              "2",
              "Netherlands",
              "3",
              "1",
              "1",
              "1",
              "6",
              "5",
              "1",
              "4"
            ],
            [
              "3",
              "Austria",
              "3",
              "0",
              "2",
              "1",
              "5",
              "8",
              "-3",
              "2"
            ],
            [
              "4",
              "Switzerland",
              "3",
              "0",
              "1",
              "2",
              "3",
              "6",
              "-3",
              "1"
            ]
          ]
        },
        {
          "name": "Group C",
          "rows": [
            [
              "1",
              "Spain",
              "3",
              "2",
              "0",
              "1",
              "7",
              "4",
              "3",
              "6"
            ],
            [
              "2",
              "Hungary",
              "3",
              "1",
              "1",
              "1",
              "4",
              "4",
              "0",
              "4"
            ],
            [
              "3",
              "Northern Ireland",
              "3",
              "1",
              "1",
              "1",
              "3",
              "3",
              "0",
              "4"
            ],
            [
              "4",
              "Poland",
              "3",
              "0",
              "2",
              "1",
              "4",
              "7",
              "-3",
              "2"
            ]
          ]
        },
        {
          "name": "Group D",
          "rows": [
            [
              "1",
              "England",
              "3",
              "2",
              "1",
              "0",
              "8",
              "1",
              "7",
              "7"
            ],
            [
              "2",
              "Ukraine",
              "3",
              "1",
              "2",
              "0",
              "4",
              "2",
              "2",
              "5"
            ],
            [
              "3",
              "Bosnia-Herzegov",
              "3",
              "1",
              "1",
              "1",
              "3",
              "4",
              "-1",
              "4"
            ],
            [
              "4",
              "Scotland",
              "3",
              "0",
              "0",
              "3",
              "0",
              "8",
              "-8",
              "0"
            ]
          ]
        },
        {
          "name": "Group E",
          "rows": [
            [
              "1",
              "Italy",
              "3",
              "2",
              "1",
              "0",
              "5",
              "4",
              "1",
              "7"
            ],
            [
              "2",
              "Croatia",
              "3",
              "1",
              "2",
              "0",
              "5",
              "3",
              "2",
              "5"
            ],
            [
              "3",
              "Finland",
              "3",
              "0",
              "2",
              "1",
              "3",
              "4",
              "-1",
              "2"
            ],
            [
              "4",
              "Norway",
              "3",
              "0",
              "1",
              "2",
              "2",
              "6",
              "-4",
              "1"
            ]
          ]
        },
        {
          "name": "Group F",
          "rows": [
            [
              "1",
              "Ireland",
              "3",
              "3",
              "0",
              "0",
              "5",
              "2",
              "3",
              "9"
            ],
            [
              "2",
              "France",
              "3",
              "2",
              "0",
              "1",
              "5",
              "4",
              "1",
              "6"
            ],
            [
              "3",
              "Portugal",
              "3",
              "1",
              "0",
              "2",
              "6",
              "3",
              "3",
              "3"
            ],
            [
              "4",
              "Romania",
              "3",
              "0",
              "0",
              "3",
              "4",
              "11",
              "-7",
              "0"
            ]
          ]
        }
      ]
    }
  }
};

