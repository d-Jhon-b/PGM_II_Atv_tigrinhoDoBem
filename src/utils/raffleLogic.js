export const evaluateRaffle = (selectedNumbers, minHitsToWin = 6, guaranteedWin = false) => {
  let drawnNumbers = [];

  if (guaranteedWin) {
    drawnNumbers = selectedNumbers.slice(0, 6);
  } else {
    while (drawnNumbers.length < 6) {
      const num = Math.floor(Math.random() * 60) + 1;
      if (!drawnNumbers.includes(num)) {
        drawnNumbers.push(num);
      }
    }
  }

  const hits = selectedNumbers.filter((num) => drawnNumbers.includes(num));
  const isWinner = hits.length >= minHitsToWin;
  const ticketNumber = Math.floor(100000 + Math.random() * 900000);

  return {
    drawnNumbers,
    hits,
    isWinner,
    ticketNumber,
    starColor: isWinner ? '#FFD700' : '#A855F7', // Dourado se ganhou, Roxo se perdeu
    glowColor: isWinner ? 'rgba(255, 215, 0, 0.8)' : 'rgba(168, 85, 247, 0.8)',
  };
};