# Roadmap Hoàn Thiện Game

File này ghi lại những phần cần bổ sung trong tương lai để hoàn thiện **Dấu Chân Tìm Đường** sau khi đã có khung visual, nhân vật và bối cảnh ban đầu.

## 0. Quy trình khi có nội dung chính thức

Khi người dùng gửi toàn bộ nội dung lịch sử chính thức, cần xử lý theo quy trình sau:

- Đọc và phân loại nội dung theo 4 chương hiện có.
- Tách ra các ý chính, mốc lịch sử, nhân vật, địa danh, khái niệm và quan hệ nhân quả.
- Biên soạn nội dung đó thành bộ câu hỏi có thể đưa trực tiếp vào game.
- Mỗi câu hỏi cần có:
  - lời dẫn hoặc bối cảnh ngắn;
  - câu hỏi chính;
  - các lựa chọn trả lời;
  - đáp án đúng;
  - các đáp án nhiễu hợp lý;
  - hậu quả gameplay cho từng lựa chọn;
  - giải thích vì sao đúng/sai nếu cần.
- Chuyển bộ câu hỏi đã soạn vào cấu trúc JSON của game trong `src/data/chapter*.json`.
- Kiểm tra lại toàn bộ nhánh `consequence` để không bị đứt mạch hội thoại.
- Sau khi nội dung chính thức đã rõ, có thể thay đổi lại bối cảnh, nhân vật, lời thoại và visual của từng chương để khớp hơn với nội dung thật.
- Không xem bối cảnh/nhân vật hiện tại là cố định. Đây chỉ là khung ban đầu để demo và có thể chỉnh lại theo tài liệu người dùng cung cấp.

## 1. Hoàn thiện nội dung lịch sử

- Thay toàn bộ nội dung mẫu trong `src/data/chapter1.json` đến `src/data/chapter4.json` bằng nội dung chính thức.
- Bổ sung câu hỏi, đáp án và giải thích đúng/sai cho từng lựa chọn.
- Viết lại lời thoại theo cùng một giọng văn: rõ ràng, học thuật vừa phải, dễ hiểu với người học.
- Bổ sung các mốc lịch sử, sự kiện, nhân vật, địa danh và tư liệu kiểm chứng cho từng chương.
- Tạo phần giải thích sau mỗi lựa chọn để người chơi hiểu vì sao đáp án đúng hoặc sai.
- Soạn bộ câu hỏi từ nội dung người dùng gửi, thay vì tự bịa thêm nội dung ngoài phạm vi tài liệu.

## 2. Bổ sung nguồn tư liệu

- Lập danh sách nguồn tham khảo chính thống cho từng chương.
- Thêm thông tin nguồn vào dữ liệu hội thoại, ví dụ: tên tài liệu, năm, đường dẫn hoặc ghi chú trích dẫn.
- Xây dựng màn hình hoặc popup "Nguồn tư liệu" để người chơi xem lại sau mỗi chương.
- Phân biệt rõ tư liệu lịch sử, diễn giải học thuật và phần giả định/phản thực tế.

## 3. Hoàn thiện 4 chương học tập

### Chương I - Hành trình tìm đường cứu nước

- Bổ sung timeline chi tiết về bối cảnh trong nước và thế giới trước chuyến đi.
- Thêm các mốc hành trình quan trọng và ý nghĩa của từng mốc.
- Làm rõ câu hỏi trung tâm: vì sao cần ra đi tìm đường cứu nước?
- Gắn mỗi lựa chọn với thao tác học tập: tái dựng bối cảnh, nhận diện vấn đề, phân tích bước ngoặt.

### Chương II - Tiếp thu Đông - Tây

- Bổ sung các nhóm nguồn tư tưởng: truyền thống dân tộc, phương Đông, phương Tây, thực tiễn thế giới.
- Làm rõ quá trình tiếp thu, chọn lọc, cải biến và phát triển.
- Thêm các câu hỏi phân biệt giữa tiếp thu sáng tạo và sao chép máy móc.
- Cập nhật visual knowledge map để từng node có ý nghĩa cụ thể khi nội dung chính thức đã chốt.

### Chương III - Từ chủ nghĩa yêu nước đến chủ nghĩa Mác-Lênin

- Bổ sung documentary timeline với mốc, tư liệu và quan hệ nhân quả.
- Làm rõ sự chuyển biến từ lòng yêu nước đến tiếp cận lý luận mới.
- Thêm nhân vật nhà báo, biên tập viên tư liệu hoặc người phản biện để dẫn dắt phân tích.
- Thiết kế các câu hỏi kiểm tra khả năng giải thích "bước ngoặt" thay vì chỉ nhớ sự kiện.

### Chương IV - Nếu không có chuyến đi năm 1911?

- Xây dựng các nhánh phản thực tế dựa trên điều kiện lịch sử có thật.
- Bổ sung quy tắc rõ ràng cho counterfactual: không tưởng tượng tùy ý, phải dựa trên dữ kiện và quan hệ nhân quả.
- Thêm nhiều nhánh so sánh các con đường cứu nước đương thời.
- Làm rõ vì sao chuyến đi năm 1911 là một bước ngoặt trong tiến trình tìm đường.

## 4. Hoàn thiện nhân vật và visual

- Đặt tên chính thức cho nhân vật chính hư cấu.
- Cho phép đổi lại nhân vật chính, nhân vật phụ và bối cảnh từng chương sau khi đã có nội dung chính thức.
- Nếu nội dung người dùng gửi có nhân vật, địa điểm hoặc tình huống trọng tâm khác với khung hiện tại, ưu tiên sửa visual/nhân vật để phục vụ nội dung đó.
- Thiết kế lại nhân vật chính nếu cần: trang phục, túi tài liệu, dáng đứng, màu sắc.
- Bổ sung nhân vật phụ riêng cho từng chương:
  - Người gác bến, thủy thủ hoặc người kể chuyện ở chương I.
  - Nhà khảo cứu và người phản biện ở chương II.
  - Biên tập viên tư liệu, nhà báo, nhân chứng ở chương III.
  - Sử gia và hệ thống mô phỏng ở chương IV.
- Bổ sung animation trạng thái đúng/sai rõ hơn cho từng scene.
- Thêm visual cue cho tư liệu mở khóa, node tri thức, timeline và nhánh phản thực tế.

## 5. Cải thiện gameplay

- Thêm bộ đếm thời gian thật cho các câu hỏi có `timerSeconds`.
- Hiển thị hậu quả của lựa chọn ngay sau khi người chơi chọn đáp án.
- Thêm màn hình tổng kết cuối chương.
- Thêm màn hình xem lại câu trả lời đúng/sai theo từng chương.
- Cân bằng lại điểm `ideology` và `forces` sau khi nội dung chính thức được chốt.
- Đổi tên biến nội bộ `ideology` và `forces` trong code thành tên mới phù hợp hơn, ví dụ `historicalInsight` và `evidenceScore`.

## 6. Cải thiện UI/UX

- Tối ưu giao diện mobile cho hộp thoại, nút chọn đáp án và bảng điểm.
- Thêm trạng thái loading cho scene 3D.
- Thêm tùy chọn bật/tắt nhạc nền.
- Thêm hướng dẫn ngắn trước khi bắt đầu game.
- Thêm màn hình chọn chương để giáo viên/người học có thể ôn từng phần.
- Thêm chế độ xem lại tư liệu đã mở khóa.

## 7. Kiểm chứng và chất lượng

- Viết test cho logic điều hướng hội thoại.
- Viết test cho tính điểm và lưu tiến trình.
- Kiểm tra toàn bộ JSON chương để tránh node bị đứt nhánh.
- Chạy build production sau mỗi lần thay nội dung lớn.
- Sửa các lỗi lint hiện có trong codebase, đặc biệt là `no-explicit-any`, unused variables và static components trong scene 3D.
- Kiểm tra hiệu năng scene 3D trên máy yếu và màn hình mobile.

## 8. Leaderboard và lưu dữ liệu

- Đổi tên hiển thị leaderboard thành bảng điểm học tập nhất quán trong toàn app.
- Kiểm tra Google Sheets Web App hiện tại có còn phù hợp với game mới không.
- Bổ sung trường dữ liệu: chương hoàn thành, tỷ lệ đúng, tư liệu mở khóa, loại hồ sơ cuối.
- Cân nhắc tách leaderboard theo lớp/nhóm nếu dùng trong môi trường học tập.

## 9. Deploy và tài liệu

- Deploy lại GitHub Pages theo slug mới `dau-chan-tim-duong`.
- Cập nhật link demo trong README sau khi deploy thật.
- Viết hướng dẫn cho giáo viên/người tổ chức lớp học.
- Viết hướng dẫn thêm/sửa nội dung chương trong các file JSON.
- Chuẩn bị checklist nghiệm thu trước khi công bố bản hoàn chỉnh.

## 10. Mốc hoàn thiện đề xuất

- **Bản 0.1**: Hoàn thiện bối cảnh, nhân vật, scene 3D và README.
- **Bản 0.2**: Thay toàn bộ nội dung lịch sử chính thức cho 4 chương.
- **Bản 0.3**: Thêm nguồn tư liệu, giải thích đáp án và màn tổng kết chương.
- **Bản 0.4**: Cải thiện UI/UX, mobile, âm thanh và replay.
- **Bản 1.0**: Hoàn thiện kiểm chứng lịch sử, build ổn định, deploy chính thức và tài liệu sử dụng.
