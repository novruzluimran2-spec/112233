<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            if ($user && $user->isCustomer()) {
                abort(403, 'Доступ только для администратора.');
            }

            return redirect()->route('admin.login');
        }

        return $next($request);
    }
}
