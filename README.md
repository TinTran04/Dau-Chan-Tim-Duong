# Dấu Chân Tìm Đường

`Dấu Chân Tìm Đường` là game ôn tập lịch sử sau thuyết trình, kết hợp giao diện lựa chọn đáp án với bối cảnh 3D thời gian thực. Người chơi nhập vai một nhà nghiên cứu trẻ, đi qua từng chương để nối lại hồ sơ về hành trình tìm đường cứu nước.

Game tập trung vào việc giúp người chơi nhớ lại nội dung thuyết trình bằng tương tác: đọc lời dẫn, chọn đáp án, xem giải thích ngay, tích lũy điểm và hoàn thành hồ sơ.

## Nội dung game

Game hiện có 3 chương:

### Chương I - Những Con Đường Chưa Mở

Nội dung chính:

- Việt Nam cuối thế kỷ XIX - đầu thế kỷ XX.
- Đất nước mất độc lập, xã hội thuộc địa hình thành.
- Các phong trào Cần Vương, Yên Thế, Đông Du, Duy Tân, Đông Kinh Nghĩa Thục.
- Kết luận về khủng hoảng đường lối cứu nước.

Bối cảnh 3D:

- Bến cảng, tàu, nhà kho, thùng hàng.
- Bảng tư liệu các phong trào yêu nước.
- Không khí mở đầu hành trình tìm đường.

### Chương II - Qua Những Đại Dương

Nội dung chính:

- Sự kiện ra đi ngày 5/6/1911.
- Hành trình qua Pháp, Mỹ, Anh và nhiều nơi khác.
- Lao động, tự học, quan sát thực tế.
- Nhận thức về bạn và thù.
- Bản Yêu sách năm 1919.
- Luận cương Lênin và Đại hội Tua năm 1920.

Bối cảnh 3D:

- Phòng bản đồ hải trình.
- Tuyến sáng qua Bến Nhà Rồng, Pháp, Mỹ - Anh, Yêu sách 1919, Luận cương 1920.
- Cụm tri thức mô phỏng quá trình chuyển biến nhận thức.

### Chương III - Con Đường Được Xác Lập

Nội dung chính:

- Chuẩn bị tư tưởng, chính trị và tổ chức sau năm 1920.
- Báo chí và tác phẩm như `Le Paria`, `Bản án chế độ thực dân Pháp`, báo `Thanh Niên`.
- Hội Việt Nam Cách mạng Thanh niên.
- Tác phẩm `Đường cách mệnh`.
- Thành lập Đảng Cộng sản Việt Nam năm 1930 và Cương lĩnh chính trị đầu tiên.

Bối cảnh 3D:

- Phòng tư liệu, máy in, kệ hồ sơ.
- Bảng liên kết tư tưởng - chính trị - tổ chức - Đảng 1930.
- Tài liệu Cương lĩnh và hành động hoàn tất hồ sơ.

## Gameplay

Mỗi chương gồm các node lời dẫn và câu hỏi lựa chọn.

Mỗi câu hỏi có 4 đáp án:

- 1 đáp án tốt nhất.
- 1 đáp án gần đúng nhưng chưa đủ.
- 2 đáp án sai.

Sau khi chọn, game hiển thị giải thích ngay rồi chuyển sang tình huống tiếp theo. Đáp án tốt nhất cho nhiều điểm nhất; đáp án gần đúng vẫn cho đi tiếp nhưng ít điểm hơn; đáp án sai làm giảm độ chính xác hồ sơ.

Game có nút `Hướng dẫn` để người chơi mở lại luật chơi bất cứ lúc nào.

## Cơ chế điểm

Game dùng 2 chỉ số chính:

- `ideology`: độ chính xác hồ sơ, bắt đầu từ `50`.
- `forces`: tư liệu khôi phục, bắt đầu từ `1000`.

Mỗi lựa chọn trong file JSON có:

- `quality`: `best`, `partial`, hoặc `wrong`.
- `ideologyDelta`: mức thay đổi độ chính xác.
- `forcesDelta`: mức thay đổi tư liệu.
- `feedback`: giải thích sau khi chọn.
- `consequence`: node tiếp theo.

Điểm cuối game:

```ts
Math.max(0, ideology * 100) + forces
```

Nếu `ideology <= 0`, người chơi thua và cần ôn tập lại hồ sơ.

## Bảng xếp hạng

Game dùng Google Sheets thông qua Google Apps Script để lưu bảng điểm.

File tích hợp:

```text
src/services/leaderboard.ts
```

Google Sheet cần có 3 cột:

```text
name | score | date
```

Apps Script cần hỗ trợ:

```text
?action=get
?action=add&name=...&score=...
```

## Nhạc nền

Nhạc được đặt trong thư mục `public`:

```text
menu_music.mp3
chapter1_archive.mp3
chapter2_voyage.mp3
chapter3_resolution.mp3
```

Menu và từng chương có nhạc riêng. Nhạc được fade dần khi chuyển chương. Nếu trình duyệt chặn autoplay, nhạc sẽ phát sau khi người chơi click hoặc bấm phím.

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
- Tailwind CSS
- Lucide React
- Google Sheets Web App API
- GitHub Pages

## Cấu trúc dự án

```text
src/
  App.tsx
  components/3d/
    VillageScene.tsx
    ValleyScene.tsx
    FactoryScene.tsx
    VanguardModel.tsx
  data/
    chapter1.json
    chapter2.json
    chapter3.json
  services/
    leaderboard.ts
  stores/
    useGameStore.ts
    useDialogueStore.ts
  ui/
    MainMenu.tsx
    HUD.tsx
    DialogueSystem.tsx
    ResultScreen.tsx
    GameGuide.tsx
public/
  menu_music.mp3
  chapter1_archive.mp3
  chapter2_voyage.mp3
  chapter3_resolution.mp3
docs/
  superpowers/
    noidunglamgame.docx
    du-an-game-dau-chan-tim-duong.md
```

## Cài đặt

```powershell
npm install
```

## Chạy local

```powershell
npm run dev
```

Vite đang chạy ở port `5175`.

Đường dẫn local thường dùng:

```text
http://localhost:5175/Dau-Chan-Tim-Duong/
```

Nếu port `5175` bị chiếm, cần tắt process Node đang giữ port hoặc đổi port chạy Vite.

## Build production

```powershell
npm run build
```

Xem thử bản build:

```powershell
npm run preview
```

## Deploy GitHub Pages

Dự án đang cấu hình:

```json
"homepage": "https://TinTran04.github.io/Dau-Chan-Tim-Duong"
```

Deploy:

```powershell
npm run deploy
```

Script `deploy` sẽ build và đưa thư mục `dist` lên nhánh GitHub Pages bằng `gh-pages`.

## Chỉnh sửa nội dung

Nội dung câu hỏi, lời dẫn, đáp án và feedback nằm trong:

```text
src/data/chapter1.json
src/data/chapter2.json
src/data/chapter3.json
```

Khi sửa câu hỏi cần giữ:

- Mỗi câu có đúng 4 lựa chọn.
- Mỗi câu có 1 `best`, 1 `partial`, 2 `wrong`.
- Khi xáo trộn A/B/C/D, phải giữ `quality`, `feedback`, `ideologyDelta`, `forcesDelta` đi cùng đáp án tương ứng.

## Ghi chú tài liệu

Tài liệu mô tả đầy đủ hơn nằm ở:

```text
docs/superpowers/du-an-game-dau-chan-tim-duong.md
```

Nội dung gốc do nhóm cung cấp nằm ở:

```text
docs/superpowers/noidunglamgame.docx
```

Lưu ý: thư mục `docs` đang nằm trong `.gitignore`, nên các tài liệu trong `docs` sẽ không được push nếu không cấu hình lại Git.
