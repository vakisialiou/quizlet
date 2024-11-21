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

### Docker deployment

```bash
# move to app directory
cd /srv/quizlet

# run script to generate SSL
./entrypoint-certbot.sh

# create next build from Dockerfile because we use next:latest inside docker-compose.yml
docker build -t next:latest .

# ------------------ Way 1 (swarm). -----------------------------
# swarm init and bind IP
docker swarm init --advertise-addr 104.131.51.32
# build and run containers
docker stack deploy -c docker-compose.yml app

# ------------------ Way 2 (compose). ---------------------------
# build and run containers
docker-compose up -d
```

### Docker example commands

```bash
docker build -t next .

docker swarm init --advertise-addr 104.131.51.32
docker stack deploy -c docker-compose.yml app

# check
docker service ls
docker service ps snext
# scale
docker service scale snext=3
# remove
docker service rm snext
# update
docker service update --force snext

# DEVELOPMENT
docker run --net=host -d --name=next --restart unless-stopped --memory=1024m next

# Remove all images
docker system prune -a --volumes
# Clear all unused images
docker image prune -f
# Clear all unused resources
docker system prune
# List unused containers
docker ps -a -f "status=exited"
# List unlinked containers
docker images -f "dangling=true"

# build
docker-compose build
# build and run all containers
docker-compose up -d
# remove all containers
docker-compose down --volumes --remove-orphans
```

## Prisma

После того как вы изменили схему `schema.prisma` (например, добавили новую колонку в таблицу), 
нужно выполнить несколько шагов для того, чтобы изменения отразились в базе данных.


### Применение миграции: 

Для того чтобы применить изменения, нужно создать и применить миграцию.

```bash
npx prisma migrate dev --name add-new-column
# or
yarn migrate:add add-new-column
```

Где `add-new-column` — это имя миграции, которое вы можете выбрать по своему усмотрению. 
Обычно это имя описывает изменения, которые были внесены (например, `add-user-age-column`).

#### Эта команда:
- Создаст миграцию.
- Применит её к вашей базе данных.
- Обновит файл `schema.prisma`, если необходимо.

### Проверка состояния миграций

```bash
npx prisma migrate status
# or
yarn migrate:status
```

#### Эта команда покажет:
- какие миграции были применены 
- какие ещё нужно применить

## Обновление модели Prisma:

Нужно обновить `Prisma Client` после изменения схемы.

```bash
npx prisma generate
# or
yarn generate
```

#### Эта команда:
- создаст новый клиент `Prisma`, который будет учитывать ваши изменения в схеме.

### Примечания:

Если нужно выполнить миграцию на продакшн-сервере

Вместо: 

```bash
npx prisma migrate dev
# or
yarn migrate:add
```

Используйте: 

```bash
npx prisma migrate deploy
# or
yarn deploy
```
