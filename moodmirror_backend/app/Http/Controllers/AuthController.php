<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Activity;
use Illuminate\Support\Facades\Log;
use App\Models\Otp;  
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtp; 

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        if (\App\Models\User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Email is already registered! Please log in.'], 422);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addHours(1);
        $otpRecord=Otp::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otp, 'expires_at' => $expiresAt]
        );
        \Log::info('OTP saved for: ' . $request->email . ' OTP: ' . $otp . ' Record: ' . $otpRecord->toJson());
        Mail::to($request->email)->send(new SendOtp($otp));
        return response()->json(['message' => 'OTP sent to your email','otp'=>$otp]);
    }

    public function verifyOtp(Request $request)
    {
        \Log::info('Verifying OTP for: ' . $request->email . ' OTP: ' . $request->otp);
        $request->validate(['email' => 'required|email', 'otp' => 'required|string']);
        $otpRecord = Otp::where('email', $request->email)
                        ->where('otp', (int)$request->otp)  // Cast to int
                        ->where('expires_at', '>', now())
                        ->first();
        \Log::info('OTP Record: ' . ($otpRecord ? 'Found' : 'Not Found'));
        if ($otpRecord) \Log::info('Expires: ' . $otpRecord->expires_at . ' Now: ' . now());
        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }
        
        $otpRecord->delete();

        return response()->json(['message' => 'OTP verified']);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'gender' => 'required|string',
            'birthdate' => 'required|date',
            'ageRange' => 'required|string',
            'mobile' => 'required|string',
            'journalFrequency' => 'required|string',
            'role' => 'sometimes|string|in:user,admin',
            'otp' => 'required|boolean|accepted',
            'colorTheme' => 'required|string',  
            'emojiTheme' => 'required|string',
        ]);

        // $otpRecord = Otp::where('email', $data['email'])
        //             ->where('otp', $data['otp'])
        //             ->where('expires_at', '>', now())
        //             ->first();
        // if (!$otpRecord) {
        //     return response()->json(['message' => 'Invalid or expired OTP'], 400);
        // }
        // $otpRecord->delete();

        if (User::where('username', $data['username'])->exists()) {
            return response()->json(['message' => 'Username already taken'], 422);
        }
        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['message' => 'Email already registered'], 422);
        }

        $data['password'] = Hash::make($data['password']);
        $data['api_token'] = Str::random(60);
        $data['role'] = $data['role'] ?? 'user';

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'User registered successfully',
        ], 201);

    }

    // Login by username or email + password
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'sometimes|required_without:email|string',
                'email' => 'sometimes|required_without:username|email',
                'password' => 'required|string'
            ]);

            $user = null;
            if ($request->filled('email')) {
                $user = User::where('email', $request->email)->first();
            } else {
                $user = User::where('username', $request->username)->first();
            }

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // regenerate token (simple token approach)
            $user->api_token = Str::random(60);
            $user->save();

            Activity::create([
                'user_id' => $user->_id ?? $user->id,
                'type' => 'login',
                'description' => 'User logged in',
                'timestamp' => now(),
            ]);
            \Log::info('Login activity created successfully');

        } catch (\Exception $e) {
            \Log::error('Error creating activity: ' . $e->getMessage());
        }
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user,
                'token' => $user->api_token,
                
            ]);
        
    }

    // Logout (clear token)
    public function logout(Request $request)
    {
        $token = null;
        $header = $request->header('Authorization');
        if ($header && preg_match('/Bearer\s+(.+)/', $header, $m)) {
            $token = $m[1];
        } else {
            $token = $request->bearerToken();
        }

        if (!$token) {
            return response()->json(['message' => 'No token provided'], 400);
        }

        $user = User::where('api_token', $token)->first();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return response()->json(['status' => 'success', 'message' => 'Logged out']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);
        $otpRecord = Otp::where('email', $request->email)
                        ->where('otp', (int)$request->otp)
                        ->where('expires_at', '>', now())
                        ->first();
        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        $otpRecord->delete();
        return response()->json(['message' => 'Password reset successful']);
    }

    

    // Send reset OTP
    public function sendResetOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addHours(1);
        Otp::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otp, 'expires_at' => $expiresAt]
        );

        Mail::to($request->email)->send(new SendOtp($otp));
        return response()->json(['message' => 'Reset OTP sent to your email']);
    }

    // Verify reset OTP
    public function verifyResetOtp(Request $request)
    {
        $request->validate(['email' => 'required|email', 'otp' => 'required|string']);
        $otpRecord = Otp::where('email', $request->email)
                        ->where('otp', (int)$request->otp)
                        ->where('expires_at', '>', now())
                        ->first();
        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }
        return response()->json(['message' => 'OTP verified']);
    }

}
