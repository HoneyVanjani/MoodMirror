<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Feedback;
use App\Models\Activity;

class AdminController extends Controller
{
    public function getUsers()
    {
        $users = User::where('role', 'user')->get();
        return response()->json($users);
    }

    public function getAnalytics()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalFeedback = Feedback::count();
        $totalActivities = Activity::count();
        $recentActivities = Activity::latest()->take(10)->get();

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalFeedback' => $totalFeedback,
            'totalActivities' => $totalActivities,
            'recentActivities' => $recentActivities
        ]);
    }
}