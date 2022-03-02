export function aiNext(gameState, winningConditions, currentPlayer) {
  let maxRecord = [];
  for (let condition of winningConditions) {
    let localLen = gameState[condition[0]] === currentPlayer ? 1 : 0;
    let maxLen = localLen;

    for (let i = 1; i < condition.length; i++) {
      console.log("condition", condition);
      if (gameState[condition[i]] === currentPlayer) {
        localLen++;
        console.log("localLen", localLen);
      } else localLen = 0;
      maxLen = Math.max(maxLen, localLen);
      console.log("maxLen", maxLen);
    }

    maxRecord.push([maxLen, ...condition]);
  }

  maxRecord.sort((a, b) => b[0] - a[0]);
  //cross
  let cross1 = maxRecord[0]
    .slice(1)
    .filter((value) => maxRecord[1].slice(1).includes(value));
  let cross2 = maxRecord[0]
    .slice(1)
    .filter((value) => maxRecord[2].slice(1).includes(value));
  let cross3 = maxRecord[1]
    .slice(1)
    .filter((value) => maxRecord[2].slice(1).includes(value));

  if (cross1[0] && gameState[cross1[0]] === "") {
    console.log(111, cross1[0]);
    return cross1[0];
  }
  if (cross2[0] && gameState[cross2[0]] === "") {
    console.log(211, cross2[0]);
    return cross2[0];
  }
  if (cross3[0] && gameState[cross3[0]] === "") {
    console.log(311, cross1[3]);
    return cross3[0];
  } else {
    console.log(411);
    for (let item of maxRecord[0].slice(1)) {
      if (gameState[item] === "") return item;
    }
    for (let item of maxRecord[1].slice(1)) {
      if (gameState[item] === "") return item;
    }
    for (let item of maxRecord[2].slice(1)) {
      if (gameState[item] === "") return item;
    }
    for (let i = 0; i < gameState.length; i++)
      if (gameState[i] === "") return i;
  }
}
