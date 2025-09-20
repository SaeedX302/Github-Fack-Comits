import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Function to make a commit on a specific date
const makeCommit = (date) => {
  return new Promise((resolve, reject) => {
    const data = {
      date: date,
    };
    jsonfile.writeFile(path, data, (err) => {
      if (err) return reject(err);
      simpleGit().add([path]).commit(date, { "--date": date }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};

// Main function to fill the 2023 contribution graph completely
const fillContributionGraphSolid = async () => {
  console.log("Starting to fill the 2023 contribution graph completely...");

  // Start at the beginning of 2023
  let date = moment().year(2023).startOf("year");
  const endOfYear = moment().year(2023).endOf("year");

  while (date.isSameOrBefore(endOfYear, 'day')) {
    // Generate a random number of commits between 5 and 10 to ensure a solid, dark color
    const commitsForDay = random.int(5, 10);
    console.log(`Committing ${commitsForDay} times for ${date.format('YYYY-MM-DD')}`);

    for (let i = 0; i < commitsForDay; i++) {
      try {
        await makeCommit(date.format());
      } catch (err) {
        console.error("An error occurred during commit:", err);
        // You might want to handle this error more gracefully, but for now, we'll continue
      }
    }
    date.add(1, 'day');
  }

  try {
    console.log("All commits created. Pushing to remote...");
    await simpleGit().push("origin", "master");
    console.log("Push successful! Your GitHub graph is now fully lit. 🌟");
  } catch (err) {
    console.error("An error occurred during push:", err);
  }
};

fillContributionGraphSolid();