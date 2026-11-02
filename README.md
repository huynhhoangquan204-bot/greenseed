# GreenSeed – Mầm Xanh

Monorepo (pnpm workspaces + Turborepo) gồm website bán hạt giống, cổng quản trị và backend API.
Tài liệu thiết kế DevOps & Hạ tầng: [`docs/DevOps_HaTang_TamQuan.docx`](docs/DevOps_HaTang_TamQuan.docx).

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `apps/web` | Website người dùng (deploy Netlify) |
| `apps/admin` | Cổng quản trị (deploy Netlify) |
| `apps/api` | Backend Node.js (Docker, deploy lên server) |
| `packages/*` | Code dùng chung (types, UI, cấu hình) |
| `infra/` | Docker Compose, Caddy, script backup chạy trên server |
| `.github/` | CI/CD, CODEOWNERS, PR template, Dependabot, CodeQL |

## Quy trình Git

- `main` = Production, `develop` = Staging, `feature/*` / `bugfix/*` tách từ `develop`, `hotfix/*` tách từ `main`.
- Mọi thay đổi qua Pull Request; tiêu đề PR và commit theo [Conventional Commits](https://www.conventionalcommits.org/).
- `feature/*` → `develop`: Squash merge. `develop` → `main`: Merge commit.

## Chạy trên máy

```bash
corepack enable
pnpm install
pnpm build
pnpm test
```

Dùng `pnpm commit` để viết commit đúng chuẩn.

## Biến môi trường

Sao chép `.env.example` thành `.env.local` và điền giá trị thật. **Không commit file `.env`.**
