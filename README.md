This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Đồng hồ đếm ngược

Đồng hồ là hiệu ứng giao diện, chạy theo chu kỳ 15 phút và tự lặp lại.
Form và API luôn tiếp nhận đăng ký, không bị khóa khi đồng hồ hết một chu kỳ.
Các đồng hồ trên trang và popup được đồng bộ. Mốc bắt đầu được giữ trong
sessionStorage để tải lại trang vẫn tiếp tục chu kỳ đang chạy.
Đổi thời lượng tại `COUNTDOWN_SECONDS` trong `src/app/campaign.ts`.
Không cần cấu hình ngày kết thúc; `REGISTRATION_DEADLINE` không còn được sử dụng.
Link nhóm Zalo được cấu hình tại `/cms` (dùng link HTTPS của zalo.me).
Popup nhắc đăng ký khi cuộn xuống thêm 600px. Sau mỗi lần đóng, cần nghỉ ít nhất
15 giây và cuộn tiếp trước khi popup hiện lại. Lời mời theo thời gian (25 giây)
chỉ hiện một lần mỗi phiên. Không tự nhắc khi đang nhập liệu, đang gửi form hoặc
đã đăng ký thành công trong phiên. Có thể chỉnh khoảng cuộn và khoảng nghỉ tại
`POPUP_SCROLL_DISTANCE` và `POPUP_COOLDOWN_MS` trong `src/app/ClientPage.tsx`.
