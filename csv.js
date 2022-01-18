const dotenv = require("dotenv");
const { open } = require("fs/promises");
const { parse } = require("csv-parse/sync");

dotenv.config();

const GLOBAL_CONFIG = {
    RECORD_FILE_PATH: process.env.RECORD_FILE_PATH || ""
};

async function runApp() {
    console.log("Running CSV parser");

    if (GLOBAL_CONFIG.RECORD_FILE_PATH === "") {
        console.log("Nothing to read");
        process.exit();
    }

    try {
        const csvFile = await open(GLOBAL_CONFIG.RECORD_FILE_PATH, "r");
        const data = await csvFile.readFile({ encoding: "utf-8" });

        await csvFile.close();

        let records = parse(data, {
            cast: true,
            castDate: true,
            trim: true
        })

        // now process the records
        // count every wins
        let wins = 0;
        let total = records.length;

        records.forEach(el => {
            if (el[2] === "true") {
                wins++;
            }
        });

        console.log(`Total rounds to win is: ${total} / ${wins}`);
        const prc = (wins / total) * 100;
        console.log(`The winning percentage is ${prc} %`);
    } catch (err) {
        console.error(`Unexpected error: ${err}`);
    }

    process.exit();
};

(async () => {
    await runApp();
})();
