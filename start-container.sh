#!/bin/bash
# Railpack runs config:cache during *build* without Railway env → migrate sees 127.0.0.1.
# Clear config before migrate so runtime MYSQL_URL / DATABASE_URL from Railway apply.
set -e

if [ "$IS_LARAVEL" = "true" ]; then
  php artisan config:clear 2>/dev/null || true

  if [ "$RAILPACK_SKIP_MIGRATIONS" != "true" ]; then
    echo "Running migrations and seeding database ..."
    php artisan migrate --force
  fi

  php artisan storage:link
  php artisan optimize:clear
  php artisan optimize

  echo "Starting Laravel server ..."
fi

exec docker-php-entrypoint --config /Caddyfile --adapter caddyfile 2>&1
