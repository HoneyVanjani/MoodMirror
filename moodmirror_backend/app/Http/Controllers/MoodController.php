<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use Illuminate\Http\Request;
use Carbon\Carbon;
use MongoDB\BSON\ObjectId;
use App\Models\Activity;


class MoodController extends Controller
{
    private function getOneWeekAgo()
    {
        return Carbon::now()->subDays(7)->format('Y-m-d');
    }
    public function store(Request $request) 
    { 
        $user = $request->user(); 
        $validated = $request->validate([ 'mood' => 'required|string', 'date' => 'nullable|date', 'notes' => 'nullable|string', 'user_id' => 'nullable|string', ]); 
        // set user_id from token if available 
        if ($user) 
        { 
            $validated['user_id'] = new ObjectId($user->_id ?? $user->id);
        }elseif (empty($validated['user_id'])) { 
            return response()->json(['message' => 'user_id is required if not authenticated'], 422); 
        }else {
            $validated['user_id'] = new ObjectId($validated['user_id']);
        } 
        if (empty($validated['date'])) {
            $validated['date'] = now();
        } 
        $mood = \App\Models\Mood::create($validated); 
        Activity::create([
            'user_id' => $validated['user_id'],
            'type' => 'mood',
            'description' => 'Logged mood: ' . $validated['mood'],
            'timestamp' => now(),
        ]);

        return response()->json([ 'message' => 'Mood entry created successfully!', 'data' => $mood, ], 201); 
    }
    
    public function index($userId)
    {
       $objectId = new \MongoDB\BSON\ObjectId($userId);
        $moods = Mood::where('user_id', $objectId)->get();
        return response()->json($moods);
        
    }

    public function weeklySummary($userId)
    {
        $objectId = new \MongoDB\BSON\ObjectId($userId);
        $oneWeekAgo = Carbon::now()->subDays(7);

        $moods = Mood::where('user_id', $objectId)
            ->where('date', '>=', $oneWeekAgo)
            ->get();

        $summary = [
            'excellent' => 0,
            'good' => 0,
            'okay' => 0,
            'bad' => 0,
            'terrible' => 0,
        ];

        $points = 0;
        foreach ($moods as $mood) {
            $key = strtolower($mood->mood);
            if (isset($summary[$key])) {
                $summary[$key]++;
                // Simple score calculation
                if ($key === 'excellent') $points += 100;
                if ($key === 'good') $points += 75;
                if ($key === 'okay') $points += 50;
                if ($key === 'bad') $points += 25;
                if ($key === 'terrible') $points += 0;
            }
        }

        $count = $moods->count();
        $score = $count > 0 ? round($points / $count) : 0;
        
        // Pseudo-AI prediction logic
        $prediction = "Continuity predicted.";
        if ($score > 80) $prediction = "Upward emotional trajectory expected.";
        if ($score < 40) $prediction = "Caution: Emotional fatigue detected.";

        return response()->json([
            'summary' => $summary,
            'score' => $score,
            'prediction' => $prediction,
            'log_count' => $count
        ]);
    }

    public function alerts($userId)
    {
        $objectId = new \MongoDB\BSON\ObjectId($userId);
        $oneWeekAgo = Carbon::now()->subDays(7);

        $moods = Mood::where('user_id', $objectId)
            ->where('date', '>=', $oneWeekAgo)
            ->get();

        $terribleCount = $moods->where('mood', 'terrible')->count();
        $badCount = $moods->where('mood', 'bad')->count();

        $alerts = [];
        if ($terribleCount >= 2) {
            $alerts[] = "Critical Alert: High frequency of low-vibrational states. Initiating focus modules recommended.";
        } else if ($badCount >= 3) {
            $alerts[] = "Stability Alert: Persistent negative drift detected over 7 days.";
        }

        return response()->json(['alerts' => $alerts]);
    }

    public function streak($userId)
    {
        $objectId = new \MongoDB\BSON\ObjectId($userId);
        $moods = Mood::where('user_id', $objectId)->orderBy('date', 'desc')->get();

        if ($moods->isEmpty()) return response()->json(['streak' => 0]);

        $latestMood = $moods->first()->mood;
        $streak = 0;
        $currentDate = Carbon::today();
        
        // Simplified streak logic: how many consecutive days have any mood logged
        foreach ($moods as $mood) {
            $mDate = Carbon::parse($mood->date)->startOfDay();
            if ($mDate->equalTo($currentDate)) {
                $streak++;
                $currentDate->subDay();
            } else if ($mDate->lessThan($currentDate)) {
                break;
            }
        }

        return response()->json([
            'mood' => $latestMood,
            'streak' => $streak
        ]);
    }

    public function activity(Request $request, $userId)
{
    $objectId = new ObjectId($userId);

    // mood-based activities
    $moodActivities = Mood::where('user_id', $objectId)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function($m) {
            return [
                'id' => (string)($m->_id ?? $m->id),
                'type' => 'mood',
                'description' => 'Logged mood: ' . ucfirst($m->mood),
                'timestamp' => ($m->created_at ?? $m->updated_at ?? now())->toDateTimeString(),
            ];
        });

    // login/register activities (Activity model)
    $loginActivities = Activity::where('user_id', $objectId)
        ->orderBy('timestamp', 'desc')
        ->get()
        ->map(function($a) {
            return [
                'id' => (string)($a->_id ?? $a->id),
                'type' => $a->type,
                'description' => $a->description,
                'timestamp' => $a->timestamp instanceof \Carbon\Carbon
                    ? $a->timestamp->toDateTimeString()
                    : (string) $a->timestamp,
            ];
        });

    // merge + sort
    $all = $moodActivities->merge($loginActivities)
                 ->sortByDesc('timestamp')
                 ->values()
                 ->all();

    return response()->json([
        'status' => 'success',
        'count' => count($all),
        'activities' => $all
    ]);
}

}
