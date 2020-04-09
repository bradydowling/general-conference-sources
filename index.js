const puppeteer = require('puppeteer');
const fs = require('fs');

async function getAnimals(animalType) {
    let animalPath;
    if (animalType === 'fish') {
        animalPath = 'Fish_(New_Leaf)';
    }
    else if (animalType === 'bug') {
        animalPath = 'Bugs_(New_Leaf)';
    }
    else if (animalType === 'deepSeaCreature') {
        animalPath = 'Deep-sea_creatures';
    }
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`https://animalcrossing.fandom.com/wiki/${animalPath}`);

    const fishData = await page.evaluate(() => {
        const camelize = (str) => {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        };
        const header = [...document.querySelectorAll('table thead tr')][0];
        const headerItemsWithMonths = [...header.querySelectorAll('th')].map(node => camelize(node.innerText.trim()));
        const months = headerItemsWithMonths.filter(item => item.length === 3);
        const headerItems = headerItemsWithMonths.filter(item => item.length !== 3);
        const fishRows = [...document.querySelector('tr tbody').querySelectorAll('tr')];
        const allFishData = fishRows.map((tr, i) => {
            const thisFish = [...tr.querySelectorAll('td')].reduce((fishData, td, i) => {
                const monthStartIndex = headerItems.indexOf('time') + 1;
                if (i < monthStartIndex) {
                    const headerKey = headerItems[i];
                    if (i === 1) {
                        fishData[headerKey] = td.querySelector('img').src;
                    }
                    else {
                        fishData[headerKey] = td.innerText;
                    }
                    return fishData;
                }
                if (td.innerText === '✓') {
                    fishData.months.push(months[i - monthStartIndex]);
                }
                return fishData;
            }, { months: [] });
            return thisFish;
        });

        return allFishData;
    });

    await browser.close();
    return fishData;
}

async function getAllAnimalData() {
    const fishData1 = await getAnimals('fish');
    const fishData = fishData1.map((fish) => {
        return {
            ...fish,
            animalType: 'fish'
        }
    });
    const bugsData1 = await getAnimals('bug');
    const bugsData = bugsData1.map((bug) => {
        return {
            ...bug,
            animalType: 'bug'
        }
    });
    const deepSeaCreatures1 = await getAnimals('deepSeaCreature');
    const deepSeaCreatures = deepSeaCreatures1.map((deepSeaCreature) => {
        return {
            ...deepSeaCreature,
            animalType: 'deepSeaCreature'
        }
    });
    return [...fishData, ...bugsData, ...deepSeaCreatures];
}

getAllAnimalData().then((animals) => {
    fs.writeFile('animals.json', JSON.stringify(animals, null, 2), () => {
        console.log('written!');
    });
});