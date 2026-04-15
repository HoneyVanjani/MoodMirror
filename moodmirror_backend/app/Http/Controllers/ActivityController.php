<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activity;
use MongoDB\BSON\ObjectId;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    public function index($userId)
    {
      $objectId = new ObjectId($userId);
      $activities = Activity::where(function ($query) use ($userId, $objectId) {
          $query->where('user_id', $userId)
                ->orWhere('user_id', $objectId);
      })->orderBy('timestamp', 'desc')->get();

      \Log::info('Fetched activities: ' . $activities->count());
      \Log::info('Raw activities fetched: ' . json_encode($activities->toArray()));

      return response()->json([
          'status' => 'success',
          'user_id' => $userId,
          'count' => $activities->count(),
          'activities' => $activities
      ]);
    }
  
}
