// ===== Products.js — Datový model, exporty, helpery a ProductManager =====
(() => {
  'use strict';
  
  if (window.__BEZVA_PRODUCTS_READY__) return;

  // 1) Enhanced categories and products with more detailed information
  const CATEGORIES = [
    {
      id: 'skakaci-hrady',
      name: 'Skákací hrady',
      description: 'Nafukovací skákací hrady pro děti všech věkových kategorií',
      icon: '🏰',
      color: '#A4D65E',
      products: [
        {
          id: 1,
          name: 'BAGR SE SKLUZAVKOU',
          price: 8900,
          originalPrice: 9500,
          image: 'img/Atrakce/Bagr.png',
            images: ['img/Atrakce/Bagr.png', 'img2/Bagr.png'],
          description: 'Skákací hrad se skluzavkou v designu stavebního bagru. Do dojezdové části skluzavky je možné umístit plastové míčky pro ještě větší zábavu.',
          shortDescription: 'Skákací hrad se skluzavkou a prostorem na míčky',
          dimensions: '8 × 3 × 4,5 m',
          capacity: '8–12 dětí',
          age: '3–12 let',
          weight: '120 kg',
          category: 'skakaci-hrady',
          available: true,
          featured: true,
          rating: 4.8,
          reviewCount: 27,
          tags: ['skluzavka', 'míčky', 'stavba', 'populární'],
          specifications: {
            'Rozměry': '8 × 3 × 4,5 m',
            'Kapacita': '8–12 dětí',
            'Věková skupina': '3–12 let',
            'Hmotnost': '120 kg',
            'Napájení': '220V / 16A',
            'Čas instalace': '20–30 min',
            'Norma EN14960': 'Ano',
            'Odolnost počasí': 'Ano'
          },
          services: [
            { id: 'install', name: 'Profesionální instalace', price: 800, recommended: true },
            { id: 'attendant', name: 'Obsluha po celou dobu akce', price: 1500, description: 'Kvalifikovaný obsluhovač' },
            { id: 'insurance', name: 'Pojištění akce', price: 600, description: 'Úrazové pojištění účastníků' },
            { id: 'balls', name: 'Plastové míčky (500 ks)', price: 400, description: 'Barevné míčky do dojezdové zóny' }
          ],
          included: [
            'Kompletní kotvení do země',
            'Krycí plachta proti dešti',
            'Profesionální ventilátor',
            'Instruktáž k bezpečné obsluze',
            'Základní pojištění'
          ],
          safety: [
            'Stálý dozor dospělých je povinný',
            'Nepoužívat za silného větru (nad 25 km/h)',
            'Respektovat kapacitní limity',
            'Před použitím zkontrolovat kotvení',
            'Zakázáno používat v bouři'
          ],
          reviews: [
            {
              id: 1,
              author: 'Jana Novotná',
              rating: 5,
              date: '2024-01-15',
              text: 'Děti byly nadšené! Kvalitní provedení, rychlá instalace.',
              verified: true
            },
            {
              id: 2,
              author: 'Petr Svoboda',
              rating: 5,
              date: '2024-01-10',
              text: 'Perfektní pro narozeniny. Doporučuji přidat míčky!',
              verified: true
            }
          ],
          seo: {
            title: 'Bagr se skluzavkou - pronájem skákacího hradu',
            description: 'Pronájem skákacího hradu Bagr se skluzavkou. Ideální pro dětské oslavy. Instalace zdarma v Ústeckém kraji.',
            keywords: ['skákací hrad', 'bagr', 'skluzavka', 'pronájem', 'děti']
          }
        },
        {
          id: 2,
          name: 'VODNÍ SVĚT SE SKLUZAVKOU',
          price: 8900,
          image: 'img/Atrakce/Vodni-svet.png',
            images: ['img/Atrakce/Vodni-svet.png', 'img2/Vodni-svet.png'],
          description: 'Skákací hrad s mořskou tematikou a skluzavkou vedle vstupu. Možnost využití plastových míčků v dojezdové části pro simulaci vody.',
          shortDescription: 'Mořský skákací hrad s tematickým designem',
          dimensions: '7,6 × 4 × 4,5 m',
          capacity: '8–12 dětí',
          age: '3–12 let',
          weight: '110 kg',
          category: 'skakaci-hrady',
          available: true,
          rating: 4.7,
          reviewCount: 12,
          tags: ['moře', 'voda', 'skluzavka', 'tematický'],
          specifications: {
            'Rozměry': '7,6 × 4 × 4,5 m',
            'Kapacita': '8–12 dětí',
            'Věková skupina': '3–12 let',
            'Hmotnost': '110 kg',
            'Napájení': '220V / 16A',
            'Čas instalace': '20–30 min',
            'Norma EN14960': 'Ano',
            'Odolnost počasí': 'Ano'
          },
          services: [
            { id: 'install', name: 'Profesionální instalace', price: 800 },
            { id: 'attendant', name: 'Obsluha', price: 1500 },
            { id: 'insurance', name: 'Pojištění akce', price: 600 },
            { id: 'decoration', name: 'Mořská dekorace', price: 300, description: 'Doplňková výzdoba v mořském stylu' }
          ],
          included: [
            'Kompletní kotvení',
            'Krycí plachta',
            'Ventilátor',
            'Instruktáž k obsluze'
          ],
          safety: [
            'Dozor dospělých povinný',
            'Nepoužívat za silného větru',
            'Respektovat kapacitní limity'
          ]
        },
        {
          id: 3,
          name: 'MONSTER TRUCK',
          price: 7900,
            image: 'img/Atrakce/Monster-truck.png',
            images: ['img/Atrakce/Monster-truck.png', 'img2/Monster-truck.png'],
          description: 'Nafukovací skákací hrad v podobě obřího Monster Trucku. Ideální pro malé automobilové nadšence a adrenalinové zážitky.',
          shortDescription: 'Automobilový skákací hrad pro malé řidiče',
          dimensions: '6 × 4 × 4,8 m',
          capacity: '6–10 dětí',
          age: '3–12 let',
          weight: '95 kg',
          category: 'skakaci-hrady',
          available: true,
          rating: 4.6,
          reviewCount: 18,
          tags: ['auto', 'truck', 'adrenalin', 'chlapci'],
          specifications: {
            'Rozměry': '6 × 4 × 4,8 m',
            'Kapacita': '6–10 dětí',
            'Věková skupina': '3–12 let',
            'Hmotnost': '95 kg',
            'Napájení': '220V / 16A',
            'Čas instalace': '15–25 min',
            'Norma EN14960': 'Ano',
            'Odolnost počasí': 'Ano'
          }
        },
        {
          id: 4,
          name: 'NAFUKOVACÍ HRAD PRINCEZNA ELSA',
          price: 6900,
          image: 'img/Atrakce/Hrad-elza.png',
            images: ['img/Atrakce/Hrad-elza.png', 'img2/Hrad-elza.png'],
          description: 'Kouzelný skákací hrad pro nejmenší princezny s motivy z Ledového království.',
          shortDescription: 'Princeznovský hrad pro malé víly',
          dimensions: '4 × 4 m',
          capacity: '4–8 dětí',
          age: '2–8 let',
          weight: '60 kg',
          category: 'skakaci-hrady',
          available: true,
          rating: 4.9,
          reviewCount: 23,
          tags: ['princezny', 'Frozen', 'dívky', 'pohádka'],
          popular: true
        },
        {
          id: 5,
          name: 'PAVOUČÍ MUŽ',
          price: 7900,
            image: 'img/Atrakce/spider-man.png',
            images: ['img/Atrakce/spider-man.png', 'img2/spider-man.png'],
          description: 'Skákací hrad pro malé superhrdiny s motivy Pavoučího muže.',
          shortDescription: 'Superhrdinský hrad s Spider-Manem',
          dimensions: '5 × 4 m',
          capacity: '6–10 dětí',
          age: '3–12 let',
          weight: '80 kg',
          category: 'skakaci-hrady',
          available: true,
          rating: 4.7,
          reviewCount: 15,
          tags: ['superhrdina', 'Spider-Man', 'akce', 'chlapci']
        },
        {
          id: 6,
          name: 'BÍLÝ HRAD',
          price: 7900,
          image: 'img/Atrakce/Bily-hrad.png',
            images: ['img/Atrakce/Bily-hrad.png', 'img2/Bily-hrad.png'],
          description: 'Elegantní bílý skákací hrad vhodný na svatby, křtiny i jiné slavnostní akce.',
          shortDescription: 'Elegantní bílý hrad pro slavnostní příležitosti',
          dimensions: '5 × 5 m',
          capacity: '6–10 dětí',
          age: '3–12 let',
          weight: '85 kg',
          category: 'skakaci-hrady',
          available: true,
          rating: 4.5,
          reviewCount: 8,
          tags: ['svatba', 'elegantní', 'bílý', 'slavnostní']
        }
      ]
    },
    {
      id: 'skluzavky',
      name: 'Obří skluzavky',
      description: 'Velké nafukovací skluzavky pro maximální zábavu a adrenalin',
      icon: '🎢',
      color: '#FF6B35',
      products: [
        {
          id: 7,
          name: 'SKLUZAVKA KLAUN',
          price: 13900,
          image: 'img/Atrakce/Skluzavka-klaun.png',
          images: ['img/Atrakce/Skluzavka-klaun.png', 'obrazky/klaun-detail.jpg'],
          description: 'Dvojitá obří skluzavka v podobě veselého klauna. Soutěžte, kdo dorazí dolů rychleji!',
          shortDescription: 'Dvojitá obří skluzavka pro soutěžení',
          dimensions: '9 × 7 × 7 m',
          capacity: '15–20 dětí',
          age: '4–15 let',
          weight: '200 kg',
          category: 'skluzavky',
          available: true,
          featured: true,
          rating: 4.9,
          reviewCount: 9,
          tags: ['obří', 'dvojitá', 'soutěž', 'adrenalin'],
          specifications: {
            'Rozměry': '9 × 7 × 7 m',
            'Výška skluzavky': '6 m',
            'Počet drah': '2',
            'Kapacita': '15–20 dětí',
            'Věková skupina': '4–15 let',
            'Hmotnost': '200 kg',
            'Napájení': '220V / 32A',
            'Čas instalace': '40–60 min'
          },
          services: [
            { id: 'install', name: 'Profesionální instalace', price: 1200, required: true },
            { id: 'attendant', name: 'Povinná obsluha', price: 2000, required: true, description: 'Ze bezpečnostních důvodů povinná' },
            { id: 'insurance', name: 'Pojištění akce', price: 800 }
          ]
        },
        {
          id: 8,
          name: 'PIRÁTSKÁ LOĎ SE SKLUZAVKOU',
          price: 10900,
          image: 'img/Atrakce/Piratska-lod.png',
          images: ['img/Atrakce/Piratska-lod.png', 'obrazky/piratska-detail.jpg'],
          description: 'Ahoj pirátové! Vydejte se na dobrodružnou plavbu a spusťte se z pirátské lodi.',
          shortDescription: 'Pirátská loď s vysokou skluzavkou',
          dimensions: '7 × 4 × 5 m',
          capacity: '8–12 dětí',
          age: '3–12 let',
          weight: '120 kg',
          category: 'skluzavky',
          available: true,
          rating: 4.7,
          reviewCount: 13,
          tags: ['piráti', 'loď', 'dobrodružství', 'tematický'],
          services: [
            { id: 'install', name: 'Instalace', price: 900 },
            { id: 'pirate-props', name: 'Pirátské doplňky', price: 500, description: 'Pirátské klobouky a meče z pěny' }
          ]
        },
        {
          id: 9,
          name: 'OBŘÍ KLOUZAČKA',
          price: null,
          priceNote: 'INDIVIDUÁLNÍ CENA',
          customPricing: true,
          image: 'obrazky/obri-klouzacka.jpg',
          images: ['obrazky/obri-klouzacka.jpg', 'obrazky/klouzacka-aerial.jpg'],
          description: 'Monumentální barevná klouzačka s 6 paralelními dráhami. Dopadiště lze naplnit vodou pro letní osvěžení.',
          shortDescription: 'Mega klouzačka se 6 dráhami',
          dimensions: '20 × 11 × 8 m',
          capacity: '20+ dětí současně',
          age: '5+ let',
          weight: '300 kg',
          category: 'skluzavky',
          available: true,
          premium: true,
          rating: 5.0,
          reviewCount: 3,
          tags: ['mega', '6 drah', 'voda', 'exkluzivní'],
          specifications: {
            'Rozměry': '20 × 11 × 8 m',
            'Výška skluzavky': '7 m',
            'Počet drah': '6',
            'Vodní dopadiště': 'Ano (volitelné)',
            'Kapacita': '20+ dětí',
            'Minimální věk': '5 let',
            'Napájení': '220V / 64A',
            'Čas instalace': '2–3 hodiny'
          },
          services: [
            { id: 'install', name: 'Profesionální instalace', price: 2500, required: true },
            { id: 'attendant', name: 'Obsluha (2 osoby)', price: 4000, required: true },
            { id: 'water-system', name: 'Vodní systém', price: 1500, description: 'Zapojení vodního dopadu' }
          ]
        }
      ]
    },
    {
      id: 'aktivni-centrum',
      name: 'Aktivní centrum',
      description: 'Interaktivní atrakce a dobrodružné aktivity pro aktivní děti',
      icon: '🎯',
      color: '#9CCC65',
      products: [
        {
          id: 10,
          name: 'SAFARI PARK',
          price: 11900,
          image: 'img/Atrakce/Safari.png',
          images: ['img/Atrakce/Safari.png', 'obrazky/safari-obstacles.jpg'],
          description: 'Napínavá nafukovací dráha plná překážek v prostředí afrického safari. Prolezněte se džunglí!',
          shortDescription: 'Dobrodružná safari dráha s překážkami',
          dimensions: '11 × 3,3 × 4,5 m',
          capacity: '10–15 dětí',
          age: '4–15 let',
          weight: '180 kg',
          category: 'aktivni-centrum',
          available: true,
          rating: 4.8,
          reviewCount: 7,
          tags: ['safari', 'překážky', 'dobrodružství', 'džungle'],
          specifications: {
            'Rozměry': '11 × 3,3 × 4,5 m',
            'Typ aktivity': 'Překážková dráha',
            'Počet překážek': '8',
            'Kapacita': '10–15 dětí',
            'Věková skupina': '4–15 let',
            'Čas instalace': '30–40 min'
          }
        },
        {
          id: 11,
          name: 'AKTIVNÍ CENTRUM SPORT',
          price: 6900,
          image: 'img/Atrakce/Aktivni-centrum.png',
          images: ['img/Atrakce/Aktivni-centrum.png', 'obrazky/sport-games.jpg'],
          description: 'Baseball, Basketball či Rugby? Otestujte svou přesnost a sportovní dovednosti v různých disciplínach.',
          shortDescription: 'Sportovní hry a aktivity na jedno místo',
          dimensions: '6 × 4 m (modulární)',
          capacity: '6–12 dětí',
          age: '5+ let',
          weight: '50 kg',
          category: 'aktivni-centrum',
          available: true,
          modular: true,
          rating: 4.4,
          reviewCount: 12,
          tags: ['sport', 'přesnost', 'soutěž', 'modulární']
        },
        {
          id: 12,
          name: 'AKTIVNÍ CENTRUM LEDOVÉ KRÁLOVSTVÍ',
          price: 7900,
          image: 'img/Atrakce/Ledove-kralovstvi.png',
          images: ['img/Atrakce/Ledove-kralovstvi.png', 'obrazky/frozen-activities.jpg'],
          description: 'Zábavné aktivity pro malé princezny v nafukovacím ledovém království s Elsou a Annou.',
          shortDescription: 'Princeznovské aktivity v ledovém světě',
          dimensions: '5 × 5 × 3 m',
          capacity: '6–10 dětí',
          age: '3–10 let',
          weight: '85 kg',
          category: 'aktivni-centrum',
          available: true,
          rating: 4.9,
          reviewCount: 18,
          tags: ['Frozen', 'princezny', 'aktivity', 'lední království']
        }
      ]
    },
    {
      id: 'sportovni-aktivity',
      name: 'Sportovní aktivity',
      description: 'Soutěžní a sportovní nafukovací atrakce pro všechny věkové kategorie',
      icon: '⚽',
      color: '#7CB342',
      products: [
        {
          id: 13,
          name: 'GLADIÁTOR ARÉNA',
          price: 6900,
          image: 'img/Atrakce/Gladiator.png',
          images: ['img/Atrakce/gladiator.png', 'obrazky/gladiator-arena.jpg'],
          description: 'Souboj gladiátorů na měkkých žíněnkách! Utkejte se v zápasu se svým protivníkem pomocí měkkých boxovacích rukavic.',
          shortDescription: 'Souboj gladiátorů s měkkými rukavicemi',
          dimensions: '4 × 5 × 2 m',
          capacity: '2 účastníci + diváci',
          age: '8+ let',
          weight: '70 kg',
          category: 'sportovni-aktivity',
          available: true,
          competitive: true,
          rating: 4.6,
          reviewCount: 14,
          tags: ['souboj', 'gladiátor', 'soutěž', 'adrenalin'],
          specifications: {
            'Rozměry arény': '4 × 5 × 2 m',
            'Typ aktivity': 'Souboj 1 vs 1',
            'Věková skupina': '8+ let',
            'Doba zápasu': '1–2 minuty',
            'Bezpečnost': 'Měkké rukavice a chrániče'
          },
          included: [
            'Měkké boxovací rukavice',
            'Ochranné přilby',
            'Měkké žíněnky',
            'Pravidla soutěže'
          ]
        },
        {
          id: 14,
          name: 'HOD SEKEROU',
          price: 6900,
          image: 'img/Atrakce/Hod-sekerou.png',
          images: ['img/Atrakce/Hod-sekerou.png', 'obrazky/axe-throwing-detail.jpg'],
          description: 'Který ze dvou hráčů se přiblíží svou trefou nejblíže středu? Bezpečné házení měkkých seker na terč.',
          shortDescription: 'Soutěž v přesnosti házení na terč',
          dimensions: '4,8 × 3 × 3,1 m',
          capacity: '2–4 hráči',
          age: '10+ let',
          weight: '60 kg',
          category: 'sportovni-aktivity',
          available: true,
          skillBased: true,
          rating: 4.7,
          reviewCount: 11,
          tags: ['přesnost', 'sekera', 'terč', 'soutěž'],
          specifications: {
            'Rozměry': '4,8 × 3 × 3,1 m',
            'Typ aktivity': 'Hod na přesnost',
            'Počet terčů': '2',
            'Vzdálenost hodu': '3 metry',
            'Věková skupina': '10+ let'
          },
          included: [
            'Měkké bezpečné sekery (4 ks)',
            'Magnetické terče',
            'Bodovací systém',
            'Pravidla hry'
          ]
        },
        {
          id: 15,
          name: 'BUNGEE RUNNING',
          price: 8900,
          image: 'img/Atrakce/Bungee.png',
          images: ['img/Atrakce/Bungee.png', 'obrazky/bungee-running.jpg'],
          description: 'Souboj v co nejvzdálenějším běhu proti odporu elastického lana. Kdo doběhne dál?',
          shortDescription: 'Běžecký souboj s elastickým lanem',
          dimensions: '12 × 2,5 × 2 m',
          capacity: '2 běžci',
          age: '12+ let',
          weight: '45 kg',
          category: 'sportovni-aktivity',
          available: true,
          intensive: true,
          rating: 4.8,
          reviewCount: 9,
          tags: ['běh', 'síla', 'souboj', 'kondice'],
          specifications: {
            'Celková délka': '12 metrů',
            'Typ aktivity': 'Běžecký souboj',
            'Věková skupina': '12+ let',
            'Maximální váha': '100 kg',
            'Bezpečnost': 'Elastické lano s bezpečnostní pojistkou'
          },
          safety: [
            'Vhodné jen pro zdravé jedince',
            'Před použitím rozcvička',
            'Respektovat hmotnostní limity'
          ]
        },
        {
          id: 16,
          name: 'NAFUKOVACÍ BILLIARD',
          price: 7900,
          image: 'obrazky/nafukovaci-billiard.jpg',
          images: ['obrazky/nafukovaci-billiard.jpg'],
          description: 'Obří billiard na zemi – místo tágo použijte nohy! Fotbalový billiard pro více hráčů.',
          shortDescription: 'Fotbalový billiard hraný nohami',
          dimensions: '7,8 × 4,8 × 0,45 m',
          capacity: '4–8 hráčů',
          age: '8+ let',
          weight: '55 kg',
          category: 'sportovni-aktivity',
          available: true,
          teamGame: true,
          rating: 4.5,
          reviewCount: 16,
          tags: ['billiard', 'fotbal', 'tým', 'strategie'],
          specifications: {
            'Rozměry stolu': '7,8 × 4,8 × 0,45 m',
            'Počet koulí': '16 nafukovacích',
            'Typ hry': 'Fotbalový billiard',
            'Počet hráčů': '4–8 současně',
            'Věková skupina': '8+ let'
          }
        },
        {
          id: 17,
          name: 'NAFUKOVACÍ ELEKTRICKÝ BÝK',
          price: 13900,
          image: 'img/Atrakce/Nafukovaci-byk.png',
          images: ['obrazky/elektricky-byk.jpg', 'obrazky/bull-riding.jpg'],
          description: 'Rodeo zábava na divokém býkovi! Udrž se co nejdéle a poměř síly s elektricky ovládaným býkem.',
          shortDescription: 'Elektrické rodeo s nastavitelnou obtížností',
          dimensions: '5 × 5 × 2 m',
          capacity: '1 jezdec',
          age: '14+ let',
          weight: '80 kg',
          category: 'sportovni-aktivity',
          available: true,
          premium: true,
          adultSupervision: true,
          rating: 4.9,
          reviewCount: 6,
          tags: ['rodeo', 'byk', 'adrenalin', 'výzva'],
          specifications: {
            'Rozměry arény': '5 × 5 × 2 m',
            'Typ aktivity': 'Mechanické rodeo',
            'Rychlost': '3 nastavitelné úrovně',
            'Věková skupina': '14+ let',
            'Maximální váha': '120 kg',
            'Napájení': '220V / 16A'
          },
          services: [
            { id: 'attendant', name: 'Povinný obsluhovač', price: 2500, required: true },
            { id: 'safety-gear', name: 'Bezpečnostní výbava', price: 500, description: 'Přilby a chrániče' }
          ],
          safety: [
            'Povinný dozor kvalifikovaného obsluhovatele',
            'Používat pouze s ochrannou výbavou',
            'Maximální doba jízdy 2 minuty',
            'Zdravotní omezení: srdce, záda, těhotenství'
          ]
        }
      ]
    },
    {
      id: 'party-vybaveni',
      name: 'Párty vybavení',
      description: 'Stany, stoly, židle a další vybavení pro dokonalou akci',
      icon: '🎪',
      color: '#FF6B35',
      products: [
        {
          id: 18,
          name: 'PIVNÍ SET',
          price: 300,
          priceNote: 'za set/den',
          image: 'img/Produkty/Pivní-sety.png',
          images: ['obrazky/pivni-set.jpg', 'obrazky/beer-set-setup.jpg'],
          description: 'Klasický dřevěný stůl s dvěma lavicemi. Ideální pro zahradní párty, oslavy nebo firemní akce.',
          shortDescription: 'Dřevěný stůl se dvěma lavicemi',
          dimensions: '220 × 80 × 76 cm',
          capacity: '6–8 osob',
          age: 'Všechny věky',
          weight: '25 kg',
          category: 'party-vybaveni',
          available: true,
          quantityAvailable: 20,
          practical: true,
          rating: 4.3,
          reviewCount: 31,
          tags: ['stůl', 'lavice', 'dřevo', 'klasický'],
          specifications: {
            'Rozměry stolu': '220 × 80 × 76 cm',
            'Materiál': 'Masivní dřevo',
            'Kapacita': '6–8 osob',
            'Hmotnost': '25 kg',
            'Povrchová úprava': 'Lakované',
            'Skladnost': 'Skládací'
          },
          included: [
            'Stůl 220×80 cm',
            'Dvě lavice 220×25 cm',
            'Montážní návod'
          ]
        },
        {
          id: 19,
          name: 'NŮŽKOVÝ STAN 3×3 m',
          price: 1000,
          priceNote: 'za ks/den',
          image: 'img2/Stan-3x3.png',
          images: ['obrazky/stan-3x3.jpg', 'obrazky/tent-setup.jpg'],
          description: 'Profesionální bílý nůžkový stan pro venkovní i vnitřní použití. Možnost dokoupení bočnic pro uzavření.',
          shortDescription: 'Profesionální nůžkový stan s možností bočnic',
          dimensions: '3 × 3 × 2,5/3,2 m',
          capacity: '15–20 osob',
          age: 'Všechny věky',
          weight: '22 kg',
          category: 'party-vybaveni',
          available: true,
          quantityAvailable: 8,
          weatherProof: true,
          rating: 4.6,
          reviewCount: 19,
          tags: ['stan', 'ochrana', 'profesionální', 'bílý'],
          specifications: {
            'Rozměry': '3 × 3 × 2,5/3,2 m',
            'Materiál': 'Polyester 300D',
            'Odolnost': 'UV + vodotěsný',
            'Konstrukce': 'Hliníkový rám 40×40mm',
            'Hmotnost': '22 kg',
            'Certifikace': 'CE označení'
          },
          services: [
            { id: 'side-walls', name: 'Boční stěny (4 ks)', price: 400, description: 'Uzavření stanu ze všech stran' },
            { id: 'setup-service', name: 'Instalace a demontáž', price: 300, description: 'Profesionální sestavení' }
          ],
          included: [
            'Nůžková konstrukce',
            'Střešní plachta',
            'Kotevní kolíky',
            'Dopravní taška'
          ]
        },
        {
          id: 20,
          name: 'KOKTEJLOVÝ STŮL',
          price: 200,
          priceNote: 'za ks/den',
          image: 'obrazky/koktejlovy-stul.jpg',
          images: ['obrazky/koktejlovy-stul.jpg'],
          description: 'Elegantní vysoký koktejlový stůl s bílým povlakem. Ideální pro přijímání a neformální setkání.',
          shortDescription: 'Vysoký stůl pro koktejlové přijímání',
          dimensions: '⌀ 80 × 110 cm',
          capacity: '4–6 osob',
          age: 'Dospělí',
          weight: '8 kg',
          category: 'party-vybaveni',
          available: true,
          quantityAvailable: 15,
          elegant: true,
          rating: 4.4,
          reviewCount: 12,
          tags: ['koktejl', 'elegantní', 'vysoký', 'přijímání']
        }
      ]
    }
  ];

  // 2) Flatten products with enhanced metadata
  const FLAT_PRODUCTS = CATEGORIES.flatMap(category =>
    (category.products || []).map(product => ({
      ...product,
      category: product.category || category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
      // Enhanced search metadata
      searchKeywords: [
        product.name,
        product.shortDescription || '',
        product.description || '',
        ...(product.tags || []),
        category.name,
        ...(product.specifications ? Object.values(product.specifications) : [])
      ].join(' ').toLowerCase(),
      // Computed properties
      isAvailable: product.available !== false,
      hasDiscount: product.originalPrice && product.price && product.originalPrice > product.price,
      discountPercentage: product.originalPrice && product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      priceLevel: product.price ? (
        product.price < 5000 ? 'low' : 
        product.price < 10000 ? 'medium' : 'high'
      ) : 'custom',
      // SEO and metadata
      slug: ProductUtils.slugify(product.name),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }))
  );

  // 3) Enhanced utility functions
  const ProductUtils = {
    formatPrice(price, options = {}) {
      if (price == null) return options.fallback || '—';
      const num = Number(price);
      if (!Number.isFinite(num)) return options.fallback || '—';
      
      const formatted = num.toLocaleString('cs-CZ');
      return options.includeCurrency !== false ? `${formatted} Kč` : formatted;
    },

    formatPriceRange(minPrice, maxPrice) {
      if (!minPrice && !maxPrice) return '—';
      if (minPrice === maxPrice) return this.formatPrice(minPrice);
      return `${this.formatPrice(minPrice, { includeCurrency: false })} - ${this.formatPrice(maxPrice)}`;
    },

    generateStars(rating = 5, options = {}) {
      const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
      const filled = '★'.repeat(r);
      const empty = '☆'.repeat(5 - r);
      
      if (options.html) {
        return `<span class="stars-filled">${filled}</span><span class="stars-empty">${empty}</span>`;
      }
      
      return filled + empty;
    },

    slugify(text = '') {
      return String(text)
        .toLowerCase()
        .trim()
        // Czech characters
        .replace(/[áäâà]/g, 'a')
        .replace(/[éěëèê]/g, 'e')
        .replace(/[íïîì]/g, 'i')
        .replace(/[óöôò]/g, 'o')
        .replace(/[úůüûů]/g, 'u')
        .replace(/[ý]/g, 'y')
        .replace(/[č]/g, 'c')
        .replace(/[ř]/g, 'r')
        .replace(/[š]/g, 's')
        .replace(/[ť]/g, 't')
        .replace(/[ž]/g, 'z')
        .replace(/[ň]/g, 'n')
        .replace(/[ď]/g, 'd')
        // Replace spaces and special chars
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    safeText(text = '') {
      return String(text).replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match]));
    },

    parseAge(ageString = '') {
      const match = ageString.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*let?/);
      if (!match) return { min: null, max: null };
      
      return {
        min: parseInt(match[1]),
        max: match[2] ? parseInt(match[2]) : null
      };
    },

    parseDimensions(dimensionString = '') {
      const match = dimensionString.match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)\s*(?:[×x]\s*(\d+(?:[.,]\d+)?))?\s*m/);
      if (!match) return { width: null, length: null, height: null };
      
      return {
        width: parseFloat(match[1].replace(',', '.')),
        length: parseFloat(match[2].replace(',', '.')),
        height: match[3] ? parseFloat(match[3].replace(',', '.')) : null
      };
    },

    calculateArea(product) {
      const dims = this.parseDimensions(product.dimensions);
      if (dims.width && dims.length) {
        return dims.width * dims.length;
      }
      return null;
    },

    isProductSuitableForAge(product, targetAge) {
      const age = this.parseAge(product.age);
      if (!age.min) return true;
      
      const target = Number(targetAge);
      if (!Number.isFinite(target)) return true;
      
      return target >= age.min && (!age.max || target <= age.max);
    },

    getProductsByPriceRange(products, minPrice, maxPrice) {
      return products.filter(product => {
        const price = Number(product.price);
        if (!Number.isFinite(price)) return false;
        
        const meetsMin = !minPrice || price >= minPrice;
        const meetsMax = !maxPrice || price <= maxPrice;
        
        return meetsMin && meetsMax;
      });
    },

    getProductRecommendations(product, allProducts, limit = 4) {
      if (!product) return [];
      
      const scored = allProducts
        .filter(p => p.id !== product.id && p.available)
        .map(p => {
          let score = 0;
          
          // Same category
          if (p.category === product.category) score += 10;
          
          // Similar price range
          if (product.price && p.price) {
            const priceDiff = Math.abs(product.price - p.price) / Math.max(product.price, p.price);
            score += (1 - priceDiff) * 5;
          }
          
          // Similar age group
          const productAge = this.parseAge(product.age);
          const pAge = this.parseAge(p.age);
          if (productAge.min && pAge.min) {
            const ageDiff = Math.abs(productAge.min - pAge.min) / Math.max(productAge.min, pAge.min);
            score += (1 - ageDiff) * 3;
          }
          
          // High rating bonus
          if (p.rating >= 4.5) score += 2;
          
          // Popular/featured bonus
          if (p.featured || p.popular) score += 1;
          
          return { product: p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.product);
      
      return scored;
    }
  };

  // 4) Enhanced Product Manager with advanced features
  class ProductManager {
    constructor(products, categories) {
      this.products = products;
      this.categories = categories;
      this.index = new Map(products.map(p => [String(p.id), p]));
      this.cache = new Map();
      
      // Create search indexes
      this.createSearchIndexes();
    }

    createSearchIndexes() {
      // Category index
      this.categoryIndex = new Map();
      this.categories.forEach(cat => {
        this.categoryIndex.set(cat.id, cat);
      });

      // Price ranges
      const prices = this.products
        .map(p => p.price)
        .filter(p => Number.isFinite(p))
        .sort((a, b) => a - b);
      
      this.priceRange = {
        min: prices[0] || 0,
        max: prices[prices.length - 1] || 20000
      };

      // Age ranges
      const ages = this.products
        .map(p => ProductUtils.parseAge(p.age))
        .filter(age => age.min)
        .flatMap(age => [age.min, age.max].filter(Boolean));
      
      this.ageRange = {
        min: Math.min(...ages) || 2,
        max: Math.max(...ages) || 18
      };
    }

    // Basic getters
    getAll() { return this.products.slice(); }
    getCategories() { return this.categories.slice(); }
    getCategoryById(id) { return this.categoryIndex.get(String(id)) || null; }
    getProductById(id) { return this.index.get(String(id)) || null; }
    getProductBySlug(slug) { 
      return this.products.find(p => ProductUtils.slugify(p.name) === slug) || null; 
    }

    // Advanced filtering
    filter(options = {}) {
      const cacheKey = JSON.stringify(options);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      let results = this.products.slice();

      // Text search
      if (options.query) {
        const query = String(options.query).toLowerCase().trim();
        results = results.filter(product => 
          product.searchKeywords.includes(query)
        );
      }

      // Category filter
      if (options.category) {
        const categories = Array.isArray(options.category) ? options.category : [options.category];
        results = results.filter(product => 
          categories.some(cat => product.category === cat)
        );
      }

      // Price range filter
      if (options.minPrice || options.maxPrice) {
        results = ProductUtils.getProductsByPriceRange(
          results, 
          options.minPrice, 
          options.maxPrice
        );
      }

      // Age filter
      if (options.age) {
        results = results.filter(product => 
          ProductUtils.isProductSuitableForAge(product, options.age)
        );
      }

      // Availability filter
      if (options.availableOnly !== false) {
        results = results.filter(product => product.isAvailable);
      }

      // Special filters
      if (options.featured) {
        results = results.filter(product => product.featured);
      }

      if (options.popular) {
        results = results.filter(product => product.popular || product.rating >= 4.7);
      }

      if (options.hasDiscount) {
        results = results.filter(product => product.hasDiscount);
      }

      // Sorting
      results = this.sort(results, options.sortBy);

      // Limit results
      if (options.limit) {
        results = results.slice(0, options.limit);
      }

      this.cache.set(cacheKey, results);
      return results;
    }

    sort(items, sortBy = 'name') {
      const sorted = items.slice();
      
      switch (sortBy) {
        case 'price-low':
          return sorted.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        
        case 'price-high':
          return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        
        case 'rating':
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        case 'popularity':
          return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        
        case 'newest':
          return sorted.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        
        case 'age-low':
          return sorted.sort((a, b) => {
            const ageA = ProductUtils.parseAge(a.age).min || 0;
            const ageB = ProductUtils.parseAge(b.age).min || 0;
            return ageA - ageB;
          });
        
        case 'size':
          return sorted.sort((a, b) => {
            const areaA = ProductUtils.calculateArea(a) || 0;
            const areaB = ProductUtils.calculateArea(b) || 0;
            return areaB - areaA;
          });
        
        default: // 'name'
          return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'cs'));
      }
    }

    // Statistics and analytics
    getStats() {
      return {
        totalProducts: this.products.length,
        availableProducts: this.products.filter(p => p.isAvailable).length,
        categories: this.categories.length,
        priceRange: this.priceRange,
        ageRange: this.ageRange,
        avgRating: this.products.reduce((sum, p) => sum + (p.rating || 0), 0) / this.products.length,
        totalReviews: this.products.reduce((sum, p) => sum + (p.reviewCount || 0), 0),
        featuredProducts: this.products.filter(p => p.featured).length,
        discountedProducts: this.products.filter(p => p.hasDiscount).length
      };
    }

    getFacets() {
      return {
        categories: this.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          count: this.products.filter(p => p.category === cat.id).length,
          icon: cat.icon,
          color: cat.color
        })),
        priceRanges: [
          { min: 0, max: 5000, label: 'Do 5 000 Kč', count: this.products.filter(p => p.price <= 5000).length },
          { min: 5000, max: 10000, label: '5 000 - 10 000 Kč', count: this.products.filter(p => p.price > 5000 && p.price <= 10000).length },
          { min: 10000, max: Infinity, label: 'Nad 10 000 Kč', count: this.products.filter(p => p.price > 10000).length }
        ],
        ratings: [5, 4, 3].map(rating => ({
          rating,
          label: `${rating}+ hvězdiček`,
          count: this.products.filter(p => (p.rating || 0) >= rating).length
        }))
      };
    }

    clearCache() {
      this.cache.clear();
    }

    // Recommendation engine
    getRecommendations(productId, limit = 4) {
      const product = this.getProductById(productId);
      if (!product) return [];
      
      return ProductUtils.getProductRecommendations(product, this.products, limit);
    }

    // Search suggestions
    getSearchSuggestions(query, limit = 5) {
      const q = String(query).toLowerCase().trim();
      if (!q) return [];
      
      const suggestions = new Set();
      
      this.products.forEach(product => {
        // Product names
        if (product.name.toLowerCase().includes(q)) {
          suggestions.add(product.name);
        }
        
        // Categories
        if (product.categoryName.toLowerCase().includes(q)) {
          suggestions.add(product.categoryName);
        }
        
        // Tags
        (product.tags || []).forEach(tag => {
          if (tag.toLowerCase().includes(q)) {
            suggestions.add(tag);
          }
        });
      });
      
      return Array.from(suggestions).slice(0, limit);
    }
  }

  // 5) Export enhanced objects to global scope
  window.BEZVA_CATEGORIES = CATEGORIES;
  window.BEZVA_PRODUCTS = FLAT_PRODUCTS;
  window.ProductUtils = ProductUtils;
  window.productManager = new ProductManager(FLAT_PRODUCTS, CATEGORIES);

  // Mark as ready
  window.__BEZVA_PRODUCTS_READY__ = true;
  
  console.log(`📦 Enhanced Products.js loaded: ${FLAT_PRODUCTS.length} products in ${CATEGORIES.length} categories`);
  console.log('📊 Product statistics:', window.productManager.getStats());

})();