export const horses = [
    {
        id: "casanova",
        name: "Casanova",
        nickname: "Casanova",
        breed: "Connemara",
        year: 2019,
        ageText: "7 år, 2019",
        sex: "Valack",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: { e: "Callin2much", u: "Ember of Ennis", ue: "-" },

        focus: ["Dressyr", "Hoppning", "Terräng"],
        levels: { dressyr: "Lätt A", hopp: "115 cm", terrang: "100" },

        other: {
            mkh: 148,
            country: ":flag_jorvik:",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "ee/ At a / gg / Crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "",

        personality: "Ögontjänare / lat / people pleaser",
        description: "",
        notes: "",
        offspring: [],
    },

    {
        id: "starboy",
        name: "Björkängens Starboy RP314",
        nickname: "Starboy",

        breed: "Svensk ridponny",
        year: 2011,
        ageText: "15 år, 2011",
        sex: "Hingst",
        isStud: true,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        extraOffspringNote: "Radiant Axiell, svensk ridponny, 2020, valack, e. Björkängens Starboy RP314, u. radient shimmer, ue. radiant night, ägs av goldilock stable",

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: {
            e: "Björkängens Starman RP227",
            u: "Silver Promise RP268",
            ue: "Belissimo RP193",
        },

        focus: ["Dressyr", "Hoppning", "Terräng"],
        levels: { dressyr: "MSV C", hopp: "120 cm", terrang: "one star" },

        other: {
            mkh: 148,
            country: "🇸🇪",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "Ee/ Aa / gg / Crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Björkängens Gård",

        personality: "",
        description:
            "Björkängens Starboy RP314 är en allsidig och sportig svensk ridponnyhingst med tydlig kapacitet inom dressyr, hoppning och terräng. Han är intelligent och arbetsvillig med snabb reaktionsförmåga och frammåtbjudning.\n\nI vardagen är han intelligent och snabbtänkt vilket kan leda till intressanta situationer. Han föredrar en strukturerad vardag och samma rutiner. I ridningen är han framåt utan att bli okontrollerad. Han är snabb för hjälperna, lätt att reglera och arbetar med god energi. Han kräver en ryttare med tydlighet, sits och lätt hand.\n\nHan är utbildad upp till MSV C i dressyr. I hoppningen är han utbildad upp till 120 cm och har god spänst och kraft. I terrängen är han utbildad upp till 1*.\n\nHan har två tidigare avkommor. Avkommorna visar goda rörelser och bra mentalitet, men är ännu för unga för tävling.",
        notes: "Maxad D-ponny. Kan ge flera färger beroende på sto.",
        
        offspring: [
            {
                name: "Greyfalls Constellation",
                imageUrl: "/images/avelshastar.png"
            },
            {
                name: "Radiant Axiell",
                imageUrl: "/images/avelshastar.png"
            }
        ],

    },

    {
        id: "constellation",
        name: "Greyfalls Constellation",
        nickname: "Const",

        breed: "Svensk ridponny",
        year: 2021,
        ageText: "5 år, 2021",
        sex: "Hingst",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: "starboy",
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: {
            e: "Björkängens Starboy RP314",
            u: "Silver Dawn RP289",
            ue: "Golden Highlight RP212",
        },

        focus: [],
        levels: { dressyr: "Under utb.", hopp: "", terrang: "" },

        other: {
            mkh: "145 (147)",
            country: ":flag_jorvik:",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "Ee/ Aa / Gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Cecilia Greyfall",

        personality: "ADHD",
        description: "",
        notes: "",
        offspring: [],
    },

    {
        id: "rose",
        name: "Casa Relvas Rosé",
        nickname: "Rose",

        breed: "PRE",
        year: 2010,
        ageText: "16 år, 2010",
        sex: "Sto",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: { e: "Mi Castillo", u: "Rosas Y Revólver", ue: "Hermosas Rosas" },

        focus: ["Dressyr", "WE"],
        levels: { dressyr: "MSV A", hopp: "-", terrang: "-", we: "-" },

        other: {
            mkh: 162,
            country: "🇪🇦",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "Ee/ Aa / gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Yeguada Nobleza Real",

        personality: "",
        description:
            "Rose är en bombsäker och orubblig häst. Hon är en riktig läromästare som alltid gör sitt jobb, men gärna på sitt eget sätt. Hon kan vara envis, men med tålamod och lite humor får man snabbt ett fint samarbete.\n\nHon är utbildad upp till MSV A i dressyr och arbetar med rutin och trygghet.\n\nVid veterinärhantering kan hon bli stressad, särskilt vid sprutor, och kan då reagera kraftigt. Utöver detta är hon stabil och okomplicerad i vardag och arbete.",
        notes: "",
        offspring: [],
    },

    {
        id: "highpeak",
        name: "High Peak (SWB)",
        nickname: "High Peak",
        breed: "Svenskt Varmblod",
        year: 2023,
        ageText: "3 år, 2023",
        sex: "Hingst",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: {
            e: "High Pitch H.S. (SWB)",
            u: "Harmond Peak",
            ue: "Zirocco Blue VDL",
            ee: "Tango (SWB)",
        },

        focus: ["Dressyr", "Hoppning"],
        levels: { dressyr: "-", hopp: "-", terrang: "-" },

        other: {
            mkh: "172 (räknas bli 174)",
            country: ":flag_jorvik:",
            equipment: "",
            trainingStatus: "Halter Broke och grundhanterad",
        },

        genetics: "EE / Aa / gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Maja Silverfjord",

        personality: "Het",
        description: "",
        notes: "",
        offspring: [],
    },

    {
        id: "mistergrey",
        name: "Mister Grey",
        nickname: "Grey",
        breed: "Irish Sport Horse",
        year: 2002,
        ageText: "24 år, 2002",
        sex: "Valack",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: { e: "okänd", u: "okänd", ue: "okänd" },

        focus: ["Pensionerad"],
        levels: { dressyr: "", hopp: "", terrang: "" },

        other: {
            mkh: 155,
            country: "🇮🇪",
            equipment: "Boots",
            trainingStatus: "Pensionerad",
        },

        genetics: "okänd",
        owner: "Cecilia Greyfall",
        breeder: "Okänd",

        personality: "Ägd irl av Cecilia Greyfall",
        description: "",
        notes: "",
        offspring: [],
    },

    {
        id: "sadie",
        name: "Sadira Z (SWB)",
        nickname: "Sadie",
        breed: "Svenskt Varmblod",
        year: 2011,
        ageText: "14 år, 2011",
        sex: "Sto",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: { e: "Akribori", u: "Sabrina SN (SWB)", ue: "Robin Z" },

        focus: ["Allround"],
        levels: { dressyr: "-", hopp: "130 cm", terrang: "-" },

        other: {
            mkh: 163,
            country: "🇸🇪",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "EE / At A / gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Silverbrook Stud",

        personality: "",
        description:
            "Sadie är ett sto med tydliga åsikter och mycket personlighet. Hon vill gärna ha sitt eget utrymme och trivs bäst när allt är lugnt och tryggt runt henne, men är samtidigt mycket människokär.\n\nHon föredrar sällskap av andra ston. Vid uteritt kan hon gå i svansen utan problem och är trygg i grupp.\n\nI hoppningen är hon mycket snäll och ärlig och stannar inte. I dressyren är hon fin att arbeta med men har svårare för att länga stegen och går gärna lite kortare. Hon trivs bäst när hon får arbeta i sitt tempo.",
        notes: "",
        offspring: [],
    },

    {
        id: "pedro",
        name: "Casillero del Diablo",
        nickname: "Pedro",
        breed: "PRE",
        year: 2014,
        ageText: "12 år, 2014",
        sex: "Valack",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: "rose",

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: {
            e: "Ángel de Ceniza GP",
            u: "Casa Relvas Rosé",
            ue: "Mi Castillo",
        },

        focus: ["Dressyr", "WE"],
        levels: { dressyr: "MSV A", hopp: "-", terrang: "-", we: "" },

        other: {
            mkh: 163,
            country: ":flag_jorvik:",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "ee/ aa / Gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "Cecilia Greyfall",

        personality: "",
        description:
            "Pedro är en snäll häst med tydlig personlighet, stolthet och attityd. Han tycker om uppmärksamhet och söker gärna kontakt.\n\nHan är utbildad upp till MSV A i dressyr. I ridningen är han känslig för hjälper, mycket lätt i handen och lätt att reglera. Han är het utan att bli okontrollerad och arbetar med god vilja.\n\nPå nya platser kan han bli mer uppmärksam och spänd men är fortsatt hanterbar. Han bildar ett starkt band med sin ryttare.\n\nHan är kastrerad pga att han inte var hanterbar som hingst men har kvar mycket uttryck och karaktär.",
        notes: "Går med hingst just nu och fungerar bra (ej med ston).",
        offspring: [],
    },

    {
        id: "botanico",
        name: "Dream Heart Botanico (KWPN)",
        nickname: "Botanico",
        breed: "KWPN",
        year: 2019,
        ageText: "7 år, 2019",
        sex: "Hingst",
        isStud: true,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: {
            e: "Heart in your hand (KWPN)",
            u: "Florence MJ (46) (SWB)",
            ue: "Dream Boy",
        },

        focus: ["Dressyr"],
        levels: { dressyr: "MSV A", hopp: "-", terrang: "-" },

        other: {
            mkh: 165,
            country: "🇳🇱",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "Ee / At a / gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "KWPN Studs North",

        personality: "",
        description:
            "Dream Heart Botanico är en modern och uttrycksfull dressyrhingst med elastiska, vägvinnande gångarter och mycket god ridbarhet. Han är snäll och social, söker kontakt och trivs med både människor och andra hästar.\n\nUppfödd i Nederländerna hos KWPN Studs North. Efter Heart in Your Hand och undan Florence MJ (SWB) med Dream Boy som morfar.\n\nUtbildad upp till MSV A i dressyr och anpassar sig väl efter ryttaren. Negativ för WFFS och godkänd för Svenskt-, Holländskt-, Jorvikiskt Varmblod.\n\nI början av sin avelskarriär och har ännu inga avkommor (enligt texten).",
        notes: "Finns tillgänglig för backbreeding, första fölkull 2023.",
        offspring: [],
    },

    {
        id: "danny",
        name: "Dynamite Detonation",
            nickname: "Danny",
        breed: "Hannoveranare",
        year: 2022,
        ageText: "4 år, 2022",
        sex: "Valack",
        isStud: false,
        imageUrl: "/images/avelshastar.png",

        sireId: null,
        damId: null,

        images: {
            headshot: "",
            bodyshot: "",
            pedigree: ""
        },

        pedigree: { e: "Diacontinus", u: "Darlina", ue: "De Niro" },

        focus: ["Hoppning", "Eventing"],
        levels: { dressyr: "-", hopp: "-", terrang: "-" },

        other: {
            mkh: 174,
            country: "🇩🇪",
            equipment: "",
            trainingStatus: "",
        },

        genetics: "ee/ aa / gg / crcr / dd / chch / oo / lplp / toto",
        owner: "Cecilia Greyfall",
        breeder: "",

        personality: "Social / quirky",
        description: "",
        notes: "",
        offspring: [],
    },
];
