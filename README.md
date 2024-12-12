## 사용 기술 스택

**프론트엔드**: Next.js, React, TypeScript, Tailwind CSS

**백엔드**: Next.js API Routes, Neon Database (PostgreSQL)

**배포** : Vercel

## 설정하기

### 0. Node Js 설치

**Node.js 공식 웹사이트에서 설치**:

- [Node.js 다운로드 페이지](https://nodejs.org/)에 접속합니다.
- 최신 버전(LTS 추천)을 다운로드하고 설치합니다.

**설치 확인**: 설치 후, 터미널에서 다음 명령어를 입력하여 Node.js가 정상적으로 설치되었는지 확인할 수 있습니다.

```
node -v
npm -v
```

**Yarn을 사용하는 경우**: Yarn을 사용하려면, 다음 명령어로 Yarn을 설치할 수 있습니다.

```
npm install -g yarn
```

### **1. Next.js + TypeScript 프로젝트 생성**

먼저 Next.js 프로젝트를 생성하고, TypeScript를 사용할 수 있도록 설정합니다.

```
npx create-next-app@latest my-next-ts-project --typescript
```

### 2. Yarn, Tailwind 설치

```
yarn install
yarn add tailwindcss postcss autoprefixer
```

### **3. Neon Database 및 관련 패키지 설치**

Neon Database와 관련된 패키지들을 설치합니다.

```
yarn add @neondatabase/serverless @vercel/postgres
```

### **4. 기타 필요한 패키지 설치**

- `axios`: API 요청을 위한 HTTP 클라이언트
- `cors`: CORS 설정을 위한 패키지
- `dotenv`: 환경변수 관리

```
yarn add axios cors dotenv mysql2
```

### **5. 개발 의존성 설치**

```
yarn add -D @eslint/eslintrc @testing-library/dom @testing-library/jest-dom @testing-library/react @types/axios @types/jest @types/node @types/react @types/react-dom eslint eslint-config-next jest jest-environment-jsdom postcss tailwindcss ts-node typescript
```

### 6. 실행

```
yarn dev
```

## 주요 기능 소개

**메인 페이지**

1. 서버에 저장된 도서들을 조회하여 페이지네이션을 적용하여 나타냅니다.
2. 제목, 저자, 수량을 작성 후 책 추가를 할 수 있습니다.
3. 제목, 저자로 필터링하여 검색이 가능합니다.

**상세 페이지**

1. 메인 페이지에서 선택한 도서의 정보를 나타냅니다.
2. 해당 도서의 정보를 수정하고 저장할 수 있습니다.
3. 해당 도서를 삭제할 수 있습니다.

### 배운 점 및 아쉬운 점

- Jest를 이용해 주요 기능 테스트를 진행하려고 했으나 Next에 익숙하지 않아 router 부분의 오류를 해결하는데 어려움을 겪어서 구현하지 못한 아쉬움이 존재합니다.

- 초기에 mysql을 사용해서 로컬에서 테스트를 거치고 배포 단계에서는 사용에 한계를 느끼고 클라우드 네이티브 데이터베이스를 처음 학습하고 사용해보며 몰입하는 경험을 하였습니다.
