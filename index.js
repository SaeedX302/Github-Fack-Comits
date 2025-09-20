import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

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

// Main function to fill the entire year
const fillYear = async () => {
  const startDate = moment().year(2023).startOf("year");
  const endDate = moment().year(2023).endOf("year");
  const totalDays = endDate.diff(startDate, 'days') + 1;

  console.log(`Starting to fill ${totalDays} days of 2023 with commits...`);

  for (let i = 0; i < totalDays; i++) {
    const currentDate = moment(startDate).add(i, 'days').format();

    // This formula creates a gradient effect from a few commits to more commits per day.
    const commitsForDay = Math.ceil((i / totalDays) * 9) + 1;
    
    console.log(`Committing ${commitsForDay} times for ${currentDate}...`);

    for (let j = 0; j < commitsForDay; j++) {
      await makeCommit(currentDate);
    }
  }

  try {
    console.log("All commits created. Pushing to main branch...");
    // FIX: Explicitly pushing to the 'main' branch
    await simpleGit().push('origin', 'main');
    console.log("Push successful!");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

fillYear();