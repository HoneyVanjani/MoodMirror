<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;

class AuthenticateWithToken
{
    public function handle($request, Closure $next)
    {
        $token = null;
        $header = $request->header('Authorization');

        if ($header && preg_match('/Bearer\s+(.+)/', $header, $m)) {
            $token = $m[1];
        } else {
            $token = $request->bearerToken();
        }

        if (!$token) {
            return response()->json(['message' => 'Unauthorized: token missing'], 401);
        }

        $user = User::where('api_token', $token)->first();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized: invalid token'], 401);
        }

        // make $request->user() return this user
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
