// Banco de perguntas por nível. Formato: [pergunta, resposta CERTA, errada 1, errada 2, errada 3]
// Para adicionar uma pergunta nova, copie uma linha no nível desejado e troque os textos.
// Perguntas GERAIS (reserva: só são usadas se faltar pergunta de um tema)
const GERAL = {
  facil: [
    ["Qual é a capital do Brasil?", "Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
    ["Qual destes animais é típico da savana africana?", "Zebra", "Pinguim", "Urso-polar", "Foca"],
    ["Qual gás as plantas liberam na fotossíntese?", "Oxigênio", "Gás carbônico", "Nitrogênio", "Hélio"],
    ["Qual é o maior animal terrestre do mundo?", "Elefante-africano", "Girafa", "Rinoceronte", "Hipopótamo"],
    ["Qual animal vive no gelo do Ártico?", "Urso-polar", "Camelo", "Zebra", "Onça-pintada"],
    ["Qual animal é conhecido como \"navio do deserto\"?", "Camelo", "Cavalo", "Elefante", "Avestruz"],
    ["Qual planeta é conhecido como \"planeta vermelho\"?", "Marte", "Vênus", "Mercúrio", "Netuno"],
    ["Qual é o satélite natural da Terra?", "Lua", "Sol", "Marte", "Vênus"],
    ["Em que estado físico a água está no gelo?", "Sólido", "Líquido", "Gasoso", "Plasma"],
    ["Qual órgão bombeia o sangue pelo corpo?", "Coração", "Pulmão", "Fígado", "Estômago"],
    ["Quanto é 7 x 8?", "56", "54", "48", "64"],
    ["Qual é a raiz quadrada de 81?", "9", "8", "7", "11"],
    ["Quantos lados tem um hexágono?", "6", "5", "8", "7"],
    ["Qual classe de palavras indica ação?", "Verbo", "Substantivo", "Adjetivo", "Artigo"],
    ["Qual ave não voa e vive na Antártida?", "Pinguim", "Avestruz", "Ema", "Gaivota"],
    ["Qual é o maior planeta do Sistema Solar?", "Júpiter", "Saturno", "Terra", "Marte"],
    ["Qual é o maior oceano do planeta?", "Oceano Pacífico", "Oceano Atlântico", "Oceano Índico", "Oceano Glacial Ártico"],
    ["Qual destes animais é um réptil?", "Jacaré", "Sapo", "Golfinho", "Morcego"],
    ["Qual destes animais é um anfíbio?", "Sapo", "Jacaré", "Baleia", "Tubarão"],
    ["Qual é o perímetro de um quadrado com lado de 12 cm?", "48 cm", "24 cm", "144 cm", "36 cm"]
  ],
  medio: [
    ["Qual é a maior floresta tropical do mundo?", "Floresta Amazônica", "Taiga", "Mata de Araucárias", "Floresta do Congo"],
    ["Qual é o maior deserto quente do mundo?", "Saara", "Atacama", "Gobi", "Kalahari"],
    ["Qual rio é o mais volumoso do mundo?", "Rio Amazonas", "Rio Nilo", "Rio Mississippi", "Rio Yangtzé"],
    ["Qual bioma brasileiro ocupa a maior área do país?", "Amazônia", "Cerrado", "Caatinga", "Pampa"],
    ["Qual bioma brasileiro é a maior planície alagável do mundo?", "Pantanal", "Caatinga", "Pampa", "Mata Atlântica"],
    ["Qual bioma exclusivamente brasileiro é típico do sertão nordestino?", "Caatinga", "Pampa", "Pantanal", "Cerrado"],
    ["Qual continente é o mais frio do planeta?", "Antártida", "Ásia", "América do Norte", "Europa"],
    ["Qual linha imaginária divide a Terra em hemisfério Norte e Sul?", "Linha do Equador", "Trópico de Câncer", "Meridiano de Greenwich", "Trópico de Capricórnio"],
    ["Qual meridiano divide a Terra em hemisfério Leste e Oeste?", "Meridiano de Greenwich", "Linha do Equador", "Trópico de Câncer", "Círculo Polar Ártico"],
    ["Como se chama o processo em que as plantas produzem alimento usando a luz do Sol?", "Fotossíntese", "Respiração", "Digestão", "Evaporação"],
    ["Qual vitamina o corpo produz com a ajuda da luz do Sol?", "Vitamina D", "Vitamina C", "Vitamina A", "Vitamina K"],
    ["Quantos ossos tem o corpo de um adulto?", "206", "150", "300", "98"],
    ["Quem chegou ao Brasil em 1500, segundo a história oficial?", "Pedro Álvares Cabral", "Cristóvão Colombo", "Dom Pedro I", "Vasco da Gama"],
    ["Em que ano o Brasil declarou independência?", "1822", "1500", "1889", "1888"],
    ["Quem foi o primeiro presidente do Brasil?", "Deodoro da Fonseca", "Getúlio Vargas", "Dom Pedro II", "Juscelino Kubitschek"],
    ["Em que ano foi proclamada a República no Brasil?", "1889", "1822", "1888", "1930"],
    ["Qual civilização construiu a cidade de Machu Picchu?", "Inca", "Maia", "Asteca", "Egípcia"],
    ["Quanto vale a soma dos ângulos internos de um triângulo?", "180 graus", "90 graus", "360 graus", "270 graus"],
    ["Qual é o plural de \"cidadão\"?", "Cidadãos", "Cidadões", "Cidadães", "Cidadãoes"],
    ["Qual palavra está escrita corretamente?", "Exceção", "Exeção", "Esceção", "Ezceção"],
    ["Qual é o animal terrestre mais rápido?", "Guepardo", "Leão", "Cavalo", "Avestruz"],
    ["Qual é a maior ilha do mundo?", "Groenlândia", "Madagascar", "Bornéu", "Islândia"],
    ["Qual é a montanha mais alta do mundo?", "Monte Everest", "K2", "Aconcágua", "Kilimanjaro"],
    ["Como se chama o movimento da Terra em torno do Sol?", "Translação", "Rotação", "Eclipse", "Maré"],
    ["Qual é o ponto de ebulição da água ao nível do mar?", "100 °C", "90 °C", "80 °C", "120 °C"],
    ["Quem escreveu o romance \"Dom Casmurro\"?", "Machado de Assis", "José de Alencar", "Monteiro Lobato", "Clarice Lispector"],
    ["Quem pintou a Mona Lisa?", "Leonardo da Vinci", "Michelangelo", "Van Gogh", "Picasso"],
    ["Qual é o planeta mais próximo do Sol?", "Mercúrio", "Vênus", "Terra", "Marte"],
    ["Resolva: 2x + 6 = 20. Quanto vale x?", "7", "6", "13", "10"],
    ["Quem foi o líder do Quilombo dos Palmares?", "Zumbi", "Tiradentes", "Dom Pedro I", "Frei Caneca"],
    ["Quanto é (-5) x (-4)?", "20", "-20", "9", "-9"]
  ],
  dificil: [
    ["Qual organela das células vegetais realiza a fotossíntese?", "Cloroplasto", "Mitocôndria", "Ribossomo", "Núcleo"],
    ["Como se chama o pigmento verde das plantas?", "Clorofila", "Melanina", "Hemoglobina", "Caroteno"],
    ["Qual gás forma a camada que filtra os raios ultravioleta do Sol?", "Ozônio", "Oxigênio", "Metano", "Hélio"],
    ["Qual é o símbolo químico do ferro?", "Fe", "F", "Fr", "Fo"],
    ["Quanto é 2 elevado a 10?", "1024", "512", "2048", "1000"],
    ["Qual é a área de um círculo de raio 3?", "9π", "6π", "3π", "18π"],
    ["Quanto é 15% de 480?", "72", "48", "60", "96"],
    ["Quanto vale a soma dos ângulos internos de um pentágono?", "540 graus", "360 graus", "720 graus", "450 graus"],
    ["Em que ano terminou a Segunda Guerra Mundial?", "1945", "1939", "1918", "1950"],
    ["Qual é o único mamífero capaz de voar de verdade?", "Morcego", "Esquilo-voador", "Pinguim", "Beija-flor"],
    ["Qual célula do sangue transporta oxigênio?", "Hemácia", "Plaqueta", "Leucócito", "Neurônio"],
    ["Qual é a capital da Austrália?", "Camberra", "Sydney", "Melbourne", "Perth"],
    ["Qual é o rio mais extenso da Europa?", "Volga", "Danúbio", "Reno", "Sena"],
    ["Qual é o maior deserto do mundo, considerando todos os tipos?", "Antártida", "Saara", "Gobi", "Atacama"],
    ["Qual cientista propôs a evolução por seleção natural?", "Charles Darwin", "Isaac Newton", "Albert Einstein", "Louis Pasteur"],
    ["Qual é o gás mais abundante na atmosfera terrestre?", "Nitrogênio", "Oxigênio", "Gás carbônico", "Argônio"],
    ["Qual tratado dividiu terras entre Portugal e Espanha em 1494?", "Tratado de Tordesilhas", "Tratado de Versalhes", "Tratado de Utrecht", "Paz de Westfália"],
    ["Qual é a unidade de medida de força no Sistema Internacional?", "Newton", "Joule", "Watt", "Pascal"],
    ["Quanto é 3 elevado a 4 menos 2 elevado a 5?", "49", "52", "47", "64"],
    ["Qual é o MMC de 12 e 18?", "36", "72", "6", "24"],
    ["Qual figura de linguagem aparece em \"Seus olhos são dois oceanos\"?", "Metáfora", "Comparação", "Hipérbole", "Ironia"],
    ["Qual é o sujeito da frase \"Choveu muito ontem\"?", "Sujeito inexistente", "Sujeito simples", "Sujeito composto", "Sujeito oculto"],
    ["Qual é a capital da Turquia?", "Ancara", "Istambul", "Izmir", "Antalya"],
    ["Qual é a velocidade aproximada da luz no vácuo?", "300.000 km/s", "30.000 km/s", "3.000 km/s", "1.000.000 km/s"],
    ["Qual ciência estuda os fósseis?", "Paleontologia", "Arqueologia", "Meteorologia", "Zoologia"],
    ["Quanto é 3/4 + 1/2?", "5/4", "4/6", "3/8", "1"],
    ["Qual é o pH de uma solução neutra, como a água pura?", "7", "0", "14", "1"],
    ["Qual tipo de rocha se forma pelo resfriamento do magma?", "Ígnea", "Sedimentar", "Metamórfica", "Calcária"],
    ["Em qual camada da atmosfera ocorrem fenômenos como a chuva?", "Troposfera", "Estratosfera", "Mesosfera", "Exosfera"],
    ["Qual povo criou a escrita cuneiforme?", "Sumérios", "Egípcios", "Fenícios", "Gregos"],
    ["Qual navegador chegou à Índia contornando a África em 1498?", "Vasco da Gama", "Pedro Álvares Cabral", "Fernão de Magalhães", "Cristóvão Colombo"],
    ["Qual era o nome completo de Tiradentes?", "Joaquim José da Silva Xavier", "José Bonifácio de Andrada", "Domingos Jorge Velho", "Joaquim Nabuco"]
  ]
};

// Perguntas por TEMA (cada fase usa o tema do seu cenário) e por nível.
// Formato: [pergunta, resposta CERTA, errada 1, errada 2, errada 3]
const TEMAS = {
  floresta: {
    facil: [
      ["Qual grande felino de manchas pretas vive nas florestas da América do Sul?", "Onça-pintada", "Leão", "Tigre", "Guepardo"],
      ["Qual ave colorida da floresta é famosa por imitar a voz humana?", "Papagaio", "Avestruz", "Pinguim", "Gaivota"],
      ["Qual gás as plantas liberam na fotossíntese?", "Oxigênio", "Gás carbônico", "Nitrogênio", "Hélio"],
      ["Como é o clima das florestas tropicais?", "Quente e úmido", "Frio e seco", "Frio e úmido", "Quente e seco"],
      ["Qual animal vive pendurado nas árvores e se move bem devagar?", "Preguiça", "Zebra", "Camelo", "Urso-polar"],
      ["O que as plantas precisam para fazer a fotossíntese?", "Luz solar, água e gás carbônico", "Só terra", "Só vento", "Gelo e sal"]
    ],
    medio: [
      ["Qual é a maior floresta tropical do mundo?", "Floresta Amazônica", "Taiga", "Mata de Araucárias", "Floresta do Congo"],
      ["Qual rio é o mais volumoso do mundo?", "Rio Amazonas", "Rio Nilo", "Rio Mississippi", "Rio Yangtzé"],
      ["Como se chama o processo em que as plantas produzem alimento usando a luz do Sol?", "Fotossíntese", "Respiração", "Digestão", "Evaporação"],
      ["Como se chama a camada de folhas e galhos caídos no chão da floresta?", "Serapilheira", "Dossel", "Duna", "Savana"],
      ["De qual árvore da Amazônia se extrai a borracha?", "Seringueira", "Cacto", "Baobá", "Pinheiro"],
      ["Qual país abriga a maior parte da Floresta Amazônica?", "Brasil", "Peru", "Colômbia", "Bolívia"]
    ],
    dificil: [
      ["Qual organela das células vegetais realiza a fotossíntese?", "Cloroplasto", "Mitocôndria", "Ribossomo", "Núcleo"],
      ["Como se chama o pigmento verde das plantas?", "Clorofila", "Melanina", "Hemoglobina", "Caroteno"],
      ["Como se chama a perda de vapor de água pelas folhas das plantas?", "Transpiração", "Respiração", "Germinação", "Polinização"],
      ["Como se chama a relação em que duas espécies se beneficiam, como a abelha e a flor?", "Mutualismo", "Parasitismo", "Predação", "Competição"],
      ["Qual linha imaginária passa pela região onde estão muitas florestas tropicais?", "Linha do Equador", "Trópico de Câncer", "Meridiano de Greenwich", "Círculo Polar Antártico"],
      ["O desmatamento libera em grande quantidade qual gás do efeito estufa?", "Gás carbônico", "Hélio", "Argônio", "Neônio"]
    ]
  },
  savana: {
    facil: [
      ["Qual animal típico da savana tem listras pretas e brancas?", "Zebra", "Pinguim", "Urso-polar", "Foca"],
      ["Qual é o maior animal terrestre do mundo?", "Elefante-africano", "Girafa", "Rinoceronte", "Hipopótamo"],
      ["Qual felino é chamado de \"rei dos animais\" e vive em grupos?", "Leão", "Pinguim", "Foca", "Camelo"],
      ["Qual animal tem o pescoço mais longo do mundo?", "Girafa", "Elefante", "Zebra", "Leão"],
      ["Em qual continente fica a savana mais famosa, com leões, zebras e girafas?", "África", "Antártida", "Europa", "Oceania"],
      ["Qual é o animal terrestre mais rápido?", "Guepardo", "Leão", "Cavalo", "Avestruz"]
    ],
    medio: [
      ["Em qual país fica o Parque Nacional do Serengeti?", "Tanzânia", "Brasil", "Egito", "Austrália"],
      ["Qual é o nome da savana brasileira?", "Cerrado", "Caatinga", "Pampa", "Pantanal"],
      ["Como é o clima da savana?", "Duas estações: uma seca e uma chuvosa", "Neve o ano todo", "Chuva todos os dias", "Nunca chove"],
      ["Qual árvore de tronco grosso, que guarda água, é típica da savana africana?", "Baobá", "Pinheiro", "Seringueira", "Coqueiro"],
      ["O que são animais herbívoros?", "Animais que comem plantas", "Animais que comem carne", "Animais que comem de tudo", "Plantas que comem insetos"],
      ["Como se chama a viagem anual de milhões de gnus e zebras pela savana?", "Grande Migração", "Grande Muralha", "Corrida do Ouro", "Maré Alta"]
    ],
    dificil: [
      ["Como se chama a relação em que o leão caça e come a zebra?", "Predação", "Mutualismo", "Comensalismo", "Parasitismo"],
      ["Na cadeia alimentar da savana, qual destes é um produtor?", "Capim", "Leão", "Zebra", "Hiena"],
      ["Como se chamam os animais que se alimentam de restos de carcaças, como os urubus?", "Necrófagos", "Herbívoros", "Produtores", "Predadores de topo"],
      ["Em qual faixa do planeta ficam as savanas, entre os trópicos?", "Zona intertropical", "Zona polar", "Zona temperada Norte", "Zona temperada Sul"],
      ["Qual bioma brasileiro é chamado de \"berço das águas\"?", "Cerrado", "Caatinga", "Pampa", "Mata Atlântica"],
      ["O que acontece com muitas plantas da savana na estação seca?", "Perdem as folhas ou secam", "Congelam", "Crescem mais rápido", "Viram cogumelos"]
    ]
  },
  deserto: {
    facil: [
      ["Qual animal é conhecido como \"navio do deserto\"?", "Camelo", "Cavalo", "Elefante", "Avestruz"],
      ["Qual planta do deserto guarda água e tem espinhos?", "Cacto", "Coqueiro", "Samambaia", "Pinheiro"],
      ["Como se chama a área com água e plantas no meio do deserto?", "Oásis", "Geleira", "Cachoeira", "Pântano"],
      ["Como é o clima do deserto durante o dia?", "Muito quente e seco", "Frio e úmido", "Chuvoso e frio", "Sempre nublado"],
      ["Como se chamam as grandes colinas de areia do deserto?", "Dunas", "Icebergs", "Recifes", "Vulcões"]
    ],
    medio: [
      ["Qual é o maior deserto quente do mundo?", "Saara", "Atacama", "Gobi", "Kalahari"],
      ["Qual rio atravessa o Egito, no meio do deserto?", "Rio Nilo", "Rio Amazonas", "Rio Tâmisa", "Rio Danúbio"],
      ["Qual deserto do Chile é conhecido como um dos lugares mais secos do mundo?", "Atacama", "Saara", "Gobi", "Kalahari"],
      ["Por que o deserto tem tão pouca vegetação?", "Chove muito pouco", "Tem muita neve", "Tem muita água", "Não tem Sol"],
      ["Qual povo construiu as pirâmides do Egito?", "Egípcios", "Romanos", "Gregos", "Maias"],
      ["Em qual continente fica o deserto do Saara?", "África", "Ásia", "América do Sul", "Oceania"]
    ],
    dificil: [
      ["Como se chama a grande diferença de temperatura entre o dia e a noite no deserto?", "Amplitude térmica", "Efeito estufa", "Maré", "Eclipse"],
      ["Qual é o maior deserto do mundo, considerando todos os tipos?", "Antártida", "Saara", "Gobi", "Atacama"],
      ["Qual deserto cobre parte da Mongólia e da China?", "Gobi", "Saara", "Atacama", "Kalahari"],
      ["Os espinhos do cacto são folhas transformadas. Para que servem?", "Reduzir a perda de água", "Atrair chuva", "Produzir frutas", "Esquentar a planta"],
      ["O que é desertificação?", "Terras férteis que se tornam áridas como um deserto", "Formação de um oásis", "Chuva forte no deserto", "Crescimento de uma floresta"]
    ]
  },
  tundra: {
    facil: [
      ["Qual animal vive no gelo do Ártico e tem pelagem branca?", "Urso-polar", "Camelo", "Zebra", "Onça-pintada"],
      ["Qual ave não voa e vive na Antártida?", "Pinguim", "Avestruz", "Ema", "Gaivota"],
      ["Em que estado físico a água está no gelo?", "Sólido", "Líquido", "Gasoso", "Plasma"],
      ["Como se chama a casa de gelo feita pelos povos do Ártico?", "Iglu", "Oca", "Cabana", "Palafita"],
      ["A água pura congela a quantos graus Celsius?", "0 °C", "10 °C", "100 °C", "-50 °C"]
    ],
    medio: [
      ["Qual continente é o mais frio do planeta?", "Antártida", "Ásia", "América do Norte", "Europa"],
      ["Como se chama o grande bloco de gelo que flutua no mar?", "Iceberg", "Duna", "Recife", "Vulcão"],
      ["Qual fenômeno de luzes coloridas aparece no céu perto dos polos?", "Aurora boreal", "Arco-íris", "Eclipse", "Cometa"],
      ["Qual animal do Ártico tem grandes presas e vive em grupos na costa?", "Morsa", "Camelo", "Zebra", "Girafa"],
      ["Qual oceano fica ao redor do Polo Norte?", "Oceano Glacial Ártico", "Oceano Pacífico", "Oceano Índico", "Oceano Atlântico Sul"],
      ["Qual vegetação é típica da tundra?", "Musgos e liquens", "Florestas densas", "Cactos", "Palmeiras"],
      ["O que acontece com o gelo quando a temperatura passa de 0 °C?", "Derrete", "Congela mais", "Vira areia", "Vira madeira"]
    ],
    dificil: [
      ["Como se chama o solo da tundra que fica congelado o ano todo?", "Permafrost", "Serapilheira", "Duna", "Húmus"],
      ["Qual é uma consequência do derretimento das geleiras?", "Aumento do nível do mar", "Diminuição das ondas", "Surgimento de desertos", "Menos chuva no mar"],
      ["Qual gás liberado por queimadas e combustíveis intensifica o aquecimento global?", "Gás carbônico", "Hélio", "Argônio", "Neônio"],
      ["Por que os polos recebem menos calor do Sol?", "Os raios solares chegam inclinados", "Não existe luz solar lá", "A Terra gira ao contrário", "Ficam perto da Lua"],
      ["Como se chama o fenômeno em que, no verão polar, o Sol quase não se põe?", "Sol da meia-noite", "Eclipse solar", "Aurora austral", "Solstício de inverno"]
    ]
  }
};
