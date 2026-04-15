<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoodController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\MotivationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ActivityController;    
use App\Http\Controllers\AdminController;                    
use Illuminate\Support\Facades\Route;


Route::post('/send-reset-otp', [AuthController::class, 'sendResetOtp']);
Route::post('/verify-reset-otp', [AuthController::class, 'verifyResetOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);


    Route::get('/moods/{userId}', [MoodController::class, 'index']);   
    Route::post('/moods', [MoodController::class, 'store']);     // POST new mood

    Route::post('/journals', [JournalController::class, 'store']);
    Route::get('/journals', [JournalController::class, 'index']);
    Route::delete('/journals/{id}', [JournalController::class, 'destroy']);

    Route::get('/moods/summary/{userId}', [MoodController::class, 'weeklySummary']);
    Route::get('/moods/alerts/{userId}', [MoodController::class, 'alerts']);
    Route::get('/moods/streak/{userId}', [MoodController::class, 'streak']);

    Route::get('/motivation/{mood}', [MotivationController::class, 'getMotivation']);
    Route::get('/monthly-health/{userId}', [MotivationController::class, 'monthlyHealth']);
    Route::get('/activities/{userId}', [ActivityController::class, 'index']);

    Route::post('/feedback', [FeedbackController::class, 'store']);

    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::get('/admin/analytics', [AdminController::class, 'getAnalytics']);
    Route::get('/feedback', [FeedbackController::class, 'index']); // for admin

});