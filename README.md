# PrintifAI-back

Бекенд для проекта PrintifAI.

Развернут по адресу https://printifai.ru/api

Имеет открытую документацию по адресу https://printifai.ru/api/swagger

## Требования для запуска

- node.js 18+
- yarn 4+
- Postgres 13+
- Redis
- Для генераций
  - API токен https://replicate.com/
  - API токен яндекс-переводчика https://yandex.cloud/ru/services/translate
  - Секретный токен для получения webhook от Replicate https://replicate.com/docs/reference/http#webhooks.default.secret.get

При локальной разработке для получения webhook ответов требуется прокси, например [ngrok](https://ngrok.com/)

## Env-переменные

- PORT - порт, который будет слушать приложение
- NODE_ENV - local, qa, prod - окружение приложенич
  - влияет на троттлинг
- POSTGRES_URL - строка подключения к Postgres
  - Например, "postgresql://root:root@127.0.0.1:5432/local?schema=printifai"
- WEBHOOK_HOST - хост для получения вебхуков
  - для ngrok, например "https://solely-useful-hound.ngrok-free.app"
- REPLICATE_TOKEN - токен replicate
- REPLICATE_WEBHOOK_SECRET - секретный токен веб-хуков
- REPLICATE_HOST - хост api replicate
  - например, "https://api.replicate.com/v1"
- YANDEX_API_TOKEN - токен Yandex.Translate
- YANDEX_API_HOST - хост api yandex.translate
  - "https://translate.api.cloud.yandex.net/translate/v2/translate"
- CLIENT_HOST - адрес фронта, нужен для CORS
  - локально "http://localhost:3000"
- REDIS_HOST - хост redis
- REDIS_PASS - токен для авторизации в redis, если есть
- ADMIN_TOKEN - токен для авторизации в панели администратора

## Локальный запуск проекта

- Для получения вебхук запросов, требуется прокси, например ngrok
- Настроить env переменные
  - Скопировать .env.example в .env и заполнить
  - Либо заполнить env переменные любым доступным в OS способом
- Установить зависимости
  - corepack enable
  - yarn install
- Смигрировать базу данных
  - yarn prisma migrate deploy
- Запустить проект
  - yarn start

## Команды запуска инструментов

- yarn lint - запуск линтинга
- yarn test - запуск тестов
- yarn build - сборка продакшен версии
- yarn prisma <cmd\> - для запуска призма команд

## Сборка в Docker

Проект содержит Dockerfile для сборки проекта. Актуальный образ заливается на DockerHub с тегом vanchenkin/printifai:back-latest

Команда для запуска Docker контейнера

```
docker run -d -t -i \
--restart=always \
-e PORT=3005 \
-e NODE_ENV="prod" \
-e POSTGRES_URL="" \
-e WEBHOOK_HOST="https://printifai.ru" \
-e REPLICATE_TOKEN="" \
-e REPLICATE_WEBHOOK_SECRET="" \
-e YANDEX_API_TOKEN="" \
-e YANDEX_API_HOST="https://translate.api.cloud.yandex.net/translate/v2/translate" \
-e REPLICATE_HOST="https://api.replicate.com/v1" \
-e CLIENT_HOST="https://printifai.ru" \
-e REDIS_HOST="printifai.ru" \
-e REDIS_PASS="" \
-e ADMIN_TOKEN="" \
-p 3005:3005 \
--name pritinfai-back vanchenkin/printifai:back-latest
```

## Вход в админ панель

Перейти по адресу /admin?token=, подставив значение переменной ADMIN_TOKEN.
