# React Electron App với Multiple WebSocket Namespaces

Ứng dụng này demo việc sử dụng nhiều kết nối WebSocket đến các namespace khác nhau trên cùng một server.

## Cấu trúc WebSocket

### Namespaces được hỗ trợ:

- `/ws/process` - Xử lý dữ liệu process
- `/ws/report` - Xử lý báo cáo production
- `/ws/dashboard` - Xử lý dashboard charts
- `/ws/iot` - Xử lý IoT devices

### Cách hoạt động:

```typescript
// Mỗi namespace có socket riêng biệt
const processSocket = io("ws://localhost:4000/ws/process", config);
const reportSocket = io("ws://localhost:4000/ws/report", config);
const dashboardSocket = io("ws://localhost:4000/ws/dashboard", config);
const iotSocket = io("ws://localhost:4000/ws/iot", config);
```

## Các component chính

### 1. WebApp.tsx

- Kết nối đến namespace `/ws/process`
- Xử lý events: `process-data`, `process-data-result`
- Hiển thị dữ liệu process

### 2. ReportApp.tsx

- Kết nối đến namespace `/ws/report`
- Xử lý events: `report-production`, `report-production-result`
- Hiển thị báo cáo production

### 3. WebAppRoot.tsx

- Component tổng hợp hiển thị cả hai app song song
- Demo việc sử dụng nhiều namespace cùng lúc

## API Functions

### Process Namespace:

```typescript
import { sendProcessData, getProcessConnectionStatus } from "./web-socket";

// Gửi dữ liệu process
sendProcessData(payload);

// Kiểm tra trạng thái kết nối
const isConnected = getProcessConnectionStatus();
```

### Report Namespace:

```typescript
import { sendReportProduction, getReportConnectionStatus } from "./web-socket";

// Gửi yêu cầu báo cáo production
sendReportProduction(payload);

// Kiểm tra trạng thái kết nối
const isConnected = getReportConnectionStatus();
```

## Events

### Process Events:

- `process-socket-connected` - Kết nối thành công
- `process-socket-disconnected` - Mất kết nối
- `process-data-result` - Nhận kết quả dữ liệu
- `data-changed` - Dữ liệu thay đổi

### Report Events:

- `report-socket-connected` - Kết nối thành công
- `report-socket-disconnected` - Mất kết nối
- `report-production-result` - Nhận kết quả báo cáo

## Lợi ích của Multiple Namespaces

1. **Tổ chức code tốt**: Mỗi chức năng có namespace riêng
2. **Bảo mật**: Có thể áp dụng guard khác nhau cho từng namespace
3. **Hiệu suất**: Không cần mở nhiều cổng TCP riêng biệt
4. **Quản lý dễ dàng**: Mỗi namespace có lifecycle riêng
5. **Scalability**: Dễ dàng mở rộng thêm namespace mới

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:5173` và hiển thị cả hai component song song để demo việc sử dụng nhiều namespace WebSocket.
