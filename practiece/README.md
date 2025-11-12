## ディレクトリ構成

```bash
practiece/
├── src/
│   ├── db.ts                    # SQLite接続＋テーブル初期化
│   ├── index.ts                 # メインサーバー
│   ├── middleware/
│   │   ├── asyncHandler.ts      # 非同期関数のエラーハンドリング
│   │   └── errorHandler.ts      # エラーハンドリングミドルウェア
│   ├── routes/
│   │   └── tasks.ts             # CRUDルート
│   └── utils/
│       └── response.ts          # レスポンスユーティリティ
├── tasks.db                     # SQLite DBファイル（.gitignore推奨）
├── package.json
├── tsconfig.json
└── .gitignore
```

---

````markdown
# Node.js + TypeScript + Express + SQLite CRUD API (Practice)

このプロジェクトは、Node.js と TypeScript を使用して構築した
**シンプルな CRUD API**（Create / Read / Update / Delete）です。

「ORM なしで、SQL を直接書いてデータを操作する」
という基本をアウトプットすることを目的にしています。

また、エラーハンドリングミドルウェアを実装し、
より実践的な API 開発のデモを行っています。

---

## 使用技術

- **TypeScript** – 型安全なバックエンド開発
- **Express** – シンプルな HTTP サーバーフレームワーク
- **SQLite** – 軽量で手軽な RDBMS
- **jq** – CLI で JSON 整形出力

---

## プロジェクト構成

```bash
src/
├── db.ts                    # DB初期化・接続設定
├── index.ts                 # サーバー起動・ルート登録
├── middleware/
│   ├── asyncHandler.ts      # 非同期関数のエラーハンドリング
│   └── errorHandler.ts      # 共通エラーハンドリング
├── routes/
│   └── tasks.ts             # タスクCRUDエンドポイント
└── utils/
    └── response.ts          # レスポンスユーティリティ
```
````

---

## セットアップ

### 1. 依存関係をインストール

```bash
npm install
```

### 2. 開発サーバーを起動

```bash
npm run dev
```

サーバーが立ち上がったら 👇
[http://localhost:3000/api/tasks](http://localhost:3000/api/tasks) へアクセス。

---

## API エンドポイント

| メソッド | パス             | 説明                   |
| -------- | ---------------- | ---------------------- |
| `GET`    | `/api/tasks`     | タスク一覧取得         |
| `GET`    | `/api/tasks/:id` | タスク詳細取得         |
| `POST`   | `/api/tasks`     | タスク追加             |
| `PUT`    | `/api/tasks/:id` | タスクの完了状態を更新 |
| `PATCH`  | `/api/tasks/:id` | タスクの部分更新       |
| `DELETE` | `/api/tasks/:id` | タスク削除             |

---

## サンプルリクエスト

### GET: タスク一覧取得

```bash
curl http://localhost:3000/api/tasks | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy milk",
      "completed": 0,
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### GET: タスク詳細取得

```bash
curl http://localhost:3000/api/tasks/1 | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy milk",
    "completed": 0,
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### POST: タスク追加

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}' | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy milk",
    "completed": 0,
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### PUT: 完了状態を更新

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy milk",
    "completed": 1,
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### PATCH: タスクの部分更新

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "completed": true}' | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated title",
    "completed": 1,
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### DELETE: タスク削除

```bash
curl -X DELETE http://localhost:3000/api/tasks/1 | jq
```

**レスポンス例:**

```json
{
  "success": true,
  "data": null
}
```

### エラーレスポンス例

```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Task not found"
  }
}
```

---

## アーキテクチャ図

```text
[ Client (curl, browser) ]
          │
          ▼
[ Express Router (tasks.ts) ]
          │
          ▼
[ Async Handler Middleware (asyncHandler.ts) ]
          │
          ▼
[ Response Utils (response.ts) ]
          │
          ▼
[ Error Handler Middleware (errorHandler.ts) ]
          │
          ▼
[ DB Layer (db.ts) → SQLite ]
          │
          ▼
     [ tasks.db file ]
```

---

## 🧱 アーキテクチャ図（Mermaid 版）

```mermaid
flowchart TD
    A[Client curl / browser] --> B[Express Router routes/tasks.ts]
    B --> C[Async Handler Middleware asyncHandler.ts]
    C --> D[Route Handler with Response Utils]
    D --> E[DB Layer db.ts]
    E --> F[(SQLite tasks.db)]
    C -->|Error| G[Error Handler Middleware errorHandler.ts]
    G --> H[Error Response]

    subgraph Server["Express + TypeScript Server"]
        B
        C
        D
        E
        G
    end

    subgraph Utils["Utils"]
        I[Response Utils response.ts]
    end

    D -.->|uses| I

    classDef client fill:#34d399,stroke:#0f766e,stroke-width:2px,color:#fff
    classDef server fill:#60a5fa,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef middleware fill:#a78bfa,stroke:#5b21b6,stroke-width:2px,color:#fff
    classDef utils fill:#fb7185,stroke:#9f1239,stroke-width:2px,color:#fff
    classDef db fill:#facc15,stroke:#b45309,stroke-width:2px,color:#000
    classDef error fill:#ef4444,stroke:#991b1b,stroke-width:2px,color:#fff

    class A client
    class B server
    class C middleware
    class D server
    class E server
    class F db
    class G middleware
    class H error
    class I utils
```

---

## 学習ポイント

- TypeScript × Express の基本構成を理解
- SQL を直接書くことで DB 操作の流れを把握
- ORM なしでも CRUD が書ける実践力を習得
- 非同期処理のエラーハンドリング（asyncHandler の実装）
- エラーハンドリングミドルウェアの実装
- 統一されたレスポンス形式の実装
- RESTful API の設計（GET, POST, PUT, PATCH, DELETE）
- CLI (`curl`, `jq`) を使った API デバッグ

---

## 主な機能

### 非同期処理のエラーハンドリング（asyncHandler）

非同期関数のエラーハンドリングを簡素化するためのミドルウェアを実装しています。
`asyncHandler` を使用することで、各ルートハンドラーで try-catch を書く必要がなくなります。

```typescript
// middleware/asyncHandler.ts
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

### 統一されたレスポンス形式

成功時と失敗時のレスポンス形式を統一するユーティリティ関数を実装しています。

```typescript
// utils/response.ts
export const success = (res: Response, data: any, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const fail = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: { code: status, message } });
};
```

### エラーハンドリング

共通のエラーハンドリングミドルウェアを実装し、
すべてのルートで発生したエラーを一元管理しています。

```typescript
// middleware/errorHandler.ts
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error caught by middleware:", err);
  const status = (err as any).statusCode || 500;
  const message =
    status === 500 ? "Internal Server Error" : (err as any).message || "Error";
  res.status(status).json({ error: message });
};
```

### 部分更新（PATCH）

`PATCH /api/tasks/:id` エンドポイントでは、
リクエストボディで指定されたフィールドのみを更新します。
未指定のフィールドは既存の値が保持されます。

### ルートハンドラーの実装例

```typescript
// routes/tasks.ts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const db = await initDB();
    const tasks = await db.all("SELECT * FROM tasks");
    success(res, tasks, 200);
  })
);
```

---

## 今後の拡張アイデア

- Zod によるリクエストバリデーション
- Prisma や Drizzle による ORM 化
- Docker 化して環境ごと管理
- GitHub Actions で自動テスト＆CI/CD
- JWT 認証によるユーザー認可機能
- ログ出力の改善（Winston や Pino の導入）

---

## Author

**Yuta Tokeshi (toke)**
フリーランスエンジニア / フロントエンド＋バックエンド開発者

> 学びながら"本質的な仕組み"を理解することを大切にしています。

---

## License

This project is licensed under the MIT License.

````

---

## `.gitignore` も追加しとこう！

```bash
node_modules
tasks.db
.env
dist
````

---

## RESTful ガイドラインへの対応

- すべてのレスポンスで統一フォーマット（`success` / `error`）を返し、`POST` では `Location` ヘッダーを付与して新規リソースの URI を伝えるようにしました。
- `GET` 応答には `Cache-Control` を設定し、キャッシュ可能性を明示。`POST/PUT/PATCH/DELETE` はミドルウェアで `no-store` を宣言してクライアント側とのステートレスなやり取りを担保しています。
- URI に含まれる `:id` は数値チェックを行い、`PUT` は完全更新（タイトル＋ completed）を要求、`PATCH` は部分更新という形で HTTP メソッドの意味と冪等性を守っています。
- バリデーションとエラーハンドラで HTTP ステータスコードとメッセージを一元管理し、REST Constraints（Uniform Interface / Stateless / Cacheable）を学習しやすい構成にまとめています。
