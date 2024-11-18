#!/bin/bash

# Запуск Nginx в фоновом режиме, чтобы Certbot мог обратиться к серверу для получения сертификатов
nginx &

# Получение сертификатов через Certbot
certbot --nginx --non-interactive --agree-tos --email admin@quizerplay.com -d quizerplay.com

# Обновление сертификатов (если нужно)
certbot renew --quiet

# Завершаем работу скрипта и запускаем Nginx в foreground
nginx -g "daemon off;"
