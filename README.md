# 💰 Preço Certo

Calculadora de marketplaces (Mercado Livre & Shopee) com autenticação, histórico de simulações e modo escuro.

## Stack
- **Frontend**: React + Vite
- **Backend/Auth/DB**: Supabase
- **Deploy**: Vercel

---

## 🚀 Setup — Passo a Passo

### 1. Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e cole o conteúdo de `supabase/migrations/001_init.sql`
3. Execute o script (cria a tabela `simulations` com RLS)
4. Vá em **Settings > API** e copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 2. Variáveis de Ambiente

```bash
cp .env.example .env
# edite o .env com suas chaves do Supabase
```

### 3. Instalar e rodar local

```bash
npm install
npm run dev
# abre em http://localhost:3000
```

### 4. GitHub

```bash
git init
git add .
git commit -m "feat: Preço Certo v1.0"
git remote add origin https://github.com/SEU_USER/preco-certo.git
git push -u origin main
```

### 5. Vercel (deploy em 1 clique)

1. Acesse [vercel.com](https://vercel.com) → **New Project**
2. Importe o repositório do GitHub
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! ✅

---

## 📐 Regras de Margem

| Margem | Status |
|--------|--------|
| < 0% | Prejuízo — corrija já |
| 0% – 10% | Muito baixa |
| 10% – 15% | Atenção |
| 15% – 20% | Saudável |
| 20%+ | Excelente |

## 🧮 Taxas

### Mercado Livre
- Comissão: **11,5%** (Clássico) ou **16,5%** (Premium)
- Antecipação: **4,2%** (editável)
- Frete: calculado pelo **peso volumétrico** (C×L×A÷5000 vs peso físico)

### Shopee
- Taxa automática por faixa de preço
- Antecipação: **6%** (inclui 2,5% spike day)
- Frete: opcional
