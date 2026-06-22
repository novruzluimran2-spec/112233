<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isCustomer()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Необходимо войти или зарегистрироваться.',
                ], 401);
            }

            return redirect('/index.html');
        }

        return $next($request);
    }
}
