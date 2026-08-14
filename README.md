# Dấu Chân Tìm Đường

**Dấu Chân Tìm Đường** là game học tập lịch sử dạng visual novel tương tác, kết hợp diorama 3D thời gian thực với hệ thống lựa chọn hội thoại. Người chơi theo chân một nhân vật thanh niên hư cấu trên hành trình tìm hiểu con đường cứu nước, phân tích tư liệu và đưa ra lập luận dựa trên chứng cứ lịch sử.

> Nội dung chi tiết từng chương hiện là khung bối cảnh ban đầu. Phần câu hỏi, tư liệu và đáp án lịch sử sẽ được thay bằng nội dung chính thức sau.

## Bối cảnh game

Game gồm 4 chương, mỗi chương có một không gian 3D riêng:

- **Chương I - Hành trình tìm đường cứu nước**: bến cảng, con tàu, vali tư liệu và các mốc hành trình.
- **Chương II - Tiếp thu Đông - Tây**: phòng bản đồ tri thức, các cụm nguồn tư tưởng và lõi chuyển hóa sáng tạo.
- **Chương III - Từ chủ nghĩa yêu nước đến chủ nghĩa Mác-Lênin**: phòng tư liệu, máy chiếu, documentary timeline và bàn dựng hồ sơ.
- **Chương IV - Nếu không có chuyến đi năm 1911?**: phòng mô phỏng phản thực tế với các nhánh lịch sử có kiểm chứng.

Nhân vật chính là một người tìm đường/nhà nghiên cứu trẻ hư cấu. Các nhân vật phụ đóng vai trò người kể chuyện, nhà khảo cứu, người phản biện, biên tập viên tư liệu và hệ thống mô phỏng.

## Tính năng chính

- Diorama 3D theo từng chương, dựng bằng Three.js qua `@react-three/fiber`.
- Hệ thống hội thoại gồm lời dẫn, nhân vật, câu hỏi lựa chọn và nhánh hậu quả.
- Chỉ số người chơi gồm **Nhận thức lịch sử**, **Tư liệu**, chương đã đạt, số lập luận đúng/sai và tư liệu đã mở khóa.
- Kết quả cuối phiên theo chất lượng hồ sơ học tập: cần ôn tập, đạt yêu cầu hoặc hoàn chỉnh.
- Lưu tiến trình/kỷ lục cục bộ bằng `localStorage` với key `dau_chan_tim_duong_player`.
- Bảng điểm online đồng bộ qua Google Sheets Web App.
- Menu có nhạc nền, hiệu ứng chuyển cảnh và giao diện hoạt họa bằng Framer Motion.

## Gameplay

Người chơi đọc các đoạn hội thoại và chọn phương án phản hồi trong từng nút lựa chọn. Mỗi đáp án có thể thay đổi:

- `ideology`: chỉ số nhận thức lịch sử, giới hạn từ 0 đến 100.
- `forces`: lượng tư liệu/lập luận tích lũy.
- `consequence`: nhánh truyện kế tiếp hoặc kết cục.

Nếu nhận thức lịch sử giảm về 0 hoặc người chơi chọn sai ở các trạm kiểm chứng quan trọng, hồ sơ sẽ chuyển sang trạng thái cần ôn tập. Nếu vượt qua đủ 4 chương, điểm cuối cùng được tính từ nhận thức lịch sử và tư liệu tích lũy, sau đó lưu vào lịch sử người chơi và có thể gửi lên bảng điểm.

## Công nghệ

- React 19
- TypeScript
- Vite
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- Zustand
- Framer Motion
- Tailwind CSS 4
- Google Sheets Web App API cho leaderboard

## Cấu trúc dự án

```text
src/
  components/3d/      Scene và model 3D theo từng chương
  data/               Dữ liệu hội thoại JSON cho 4 chương
  services/           Tích hợp leaderboard
  stores/             Zustand stores cho game state và dialogue state
  ui/                 Main menu, HUD, dialogue box, result screen
  App.tsx             Điều phối scene 3D, UI layer và trạng thái kết thúc
  main.tsx            Entry point React
public/
  menu_music.mp3      Nhạc nền menu
  favicon.svg
```

## Cài đặt

Yêu cầu Node.js phiên bản hiện đại.

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Vite được cấu hình chạy ở cổng `5175`.

```text
http://localhost:5175/Dau-Chan-Tim-Duong/
```

## Build production

```bash
npm run build
```

Kiểm tra bản build:

```bash
npm run preview
```

## Kiểm tra lint

```bash
npm run lint
```

## Deploy GitHub Pages

Dự án đã cấu hình:

- `homepage`: `https://TinTran04.github.io/Dau-Chan-Tim-Duong`
- Vite `base`: `/Dau-Chan-Tim-Duong/`
- script deploy dùng `gh-pages`

Chạy:

```bash
npm run deploy
```

## Ghi chú phát triển

- Nội dung chương nằm trong các file `src/data/chapter*.json`. Mỗi node có `id`, `type`, nội dung hiển thị, lựa chọn và `consequence` để điều hướng nhánh truyện.
- Scene 3D được chọn theo `chapter` trong `src/App.tsx`.
- Nhân vật chính dùng chung nằm trong `src/components/3d/VanguardModel.tsx`.
- Logic tính điểm, lưu local và thống kê phiên chơi nằm trong `src/stores/useGameStore.ts`.
- Logic nạp chương, đi tiếp node, xử lý lựa chọn và kết thúc game nằm trong `src/stores/useDialogueStore.ts`.
- Leaderboard hiện gọi trực tiếp Google Sheets Web App trong `src/services/leaderboard.ts`.
