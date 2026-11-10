# ROV ศึกชิงสี

- `index.html` ตารางแข่งและคะแนน (ทุกคนดูได้ ปุ่ม "ผู้ดูแล" ต้องใส่รหัส)
- `poster.html` โปสเตอร์
- `config.js` ใส่ Project URL และ publishable key ของ Supabase
- `supabase.sql` สร้างตารางและฟังก์ชันตรวจรหัส

## ตั้งค่า (ครั้งเดียว)
1. สร้างโปรเจกต์ Supabase ใหม่ชื่อ `rov`
2. เปิด `supabase.sql` แก้รหัสผู้ดูแลที่บรรทัด `เปลี่ยนรหัสนี้` แล้วรันทั้งไฟล์ใน SQL Editor
3. เอา Project URL กับ publishable key (Project Settings > API) ใส่ใน `config.js`
4. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub แล้วเปิด Pages

## เปลี่ยนรหัสผู้ดูแล
แก้รหัสใน `supabase.sql` แล้วรันเฉพาะส่วน "ตั้งรหัสผู้ดูแล" ซ้ำ
