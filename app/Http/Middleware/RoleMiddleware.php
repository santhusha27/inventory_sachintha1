<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
   {
    // Get the currently authenticated user
    $user = auth()->user();

    // Check whether the user's role is allowed to access the requested route
    if (!in_array($user->role->role_name, $roles)) {
        abort(403, 'Unauthorized Access');
}
     // Allow the request to continue
    return $next($request);
    }
}
