export const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbz3l58coPHUIIp734kFOqBPkWSZs4fDXWp2BGeOiowmhW_W_S-t3JDTT2XycKYNNCo2CQ/exec';

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

// Lấy danh sách bảng xếp hạng từ Google Sheets
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=get`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    // Sort from highest to lowest score
    return data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Gửi điểm số mới lên Google Sheets
export async function submitScore(name: string, score: number): Promise<boolean> {
  if (!name || score === undefined) return false;
  
  try {
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=add&name=${encodeURIComponent(name)}&score=${score}`, {
      method: 'GET',
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}
