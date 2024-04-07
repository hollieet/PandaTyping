
// Your existing functions
function calculateSimilarity(str1, str2) {
    const m = str1.length;
    const n = str2.length;
  
    // Calculate the initial weights for the rows and columns
    const intervalSize1 = 1.0 / m;
    const intervalSize2 = 1.0 / n;
    const rowWeights = Array.from({ length: m + 1 }, (_, i) => 1.0 - i * intervalSize1);
    const colWeights = Array.from({ length: n + 1 }, (_, j) => 1.0 - j * intervalSize2);
  
    // Create a matrix to store the distances
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
    // Initialize the first row and column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
      if (i !== 0) {
        dp[i][0] = dp[i][0] + rowWeights[i - 1];
      }
    }
  
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
      if (j !== 0) {
        dp[0][j] = dp[0][j] + colWeights[j - 1];
      }
    }
  
    // Fill in the matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1 + rowWeights[i - 1];
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1 + rowWeights[i - 1],     // Deletion with front weight
          dp[i][j - 1] + 1 + colWeights[j - 1],     // Insertion with front weight
          dp[i - 1][j - 1] + cost                  // Substitution
        );
      }
    }
  
    // The similarity score is the inverse of the normalized Levenshtein distance
    const maxLen = Math.max(m, n);
    const similarityScore = 1.0 - (dp[m][n] / maxLen);
  
    return similarityScore;
}

function getTopCategories(input) {
    // Calculate similarities and get all categories using dbData
    const categories = [];
  
    for (const { category, spelling } of dbData) {
      const similarity = calculateSimilarity(input, spelling);
      categories.push({ category, similarity });
    }
  
    // Sort categories by similarity in descending order
    categories.sort((a, b) => b.similarity - a.similarity);
  
    // Extract the top 5 unique categories
    const topCategories = [];
    const seenCategories = new Set();
  
    for (const { category } of categories) {
      if (!seenCategories.has(category)) {
        topCategories.push(category);
        seenCategories.add(category);
  
        if (topCategories.length === 10) {
          break; // Stop when you have 5 unique categories
        }
      }
    }
    return topCategories;
  }

// Sample function to display Chinese characters for selected pinyin
function displayChineseCharacters(selectedPinyin) {
    selectedPinyin = selectedPinyin.toUpperCase();
    if (chineseData && chineseData[selectedPinyin]) {
      chineseCharacters = chineseData[selectedPinyin].join(',');
      htmlCharacters = selectedPinyin+":"  + chineseCharacters.split(',').map(char => `<span style="color:green;" onclick="clickWord('${char}')">${char}</span>`);
      //htmlCharacters = selectedPinyin+":" + htmlCharacters;
      return `${htmlCharacters}`;
    } else {
      return "";
    }
  }



// Sample function to display Chinese characters for selected pinyin
function filterByStartingChar(arr, char) {
  return arr.filter(item => item.startsWith(char));
}

function calculateAndDisplayCategories() {
  
  const inputField = document.getElementById('inputField');
  const topCategoriesList = document.getElementById('topCategoriesList');
  input = inputField.value.trim(); // Get the trimmed input
  input = input.toLowerCase();

  // Calculate top categories based on the input
  const topCategories = getTopCategories(input);

  // Clear previous results
  topCategoriesList.innerHTML = '';

  // Display the top categories
  html_ul="";
  for (const category of topCategories) {
    const listItem = document.createElement('li');
    const result = displayChineseCharacters(category);
    if(result !== "")
    {
      html_ul = html_ul+'<li>'+result+'</li>';
    }
    
  }
  topCategoriesList.innerHTML=html_ul;
}


function clickWord(input){
  result = filterByStartingChar(chineseVoca, input);
  const contextList = document.getElementById('li_context');
  contextList.innerHTML=result;
}

// Initial call to set up the page
calculateAndDisplayCategories();

