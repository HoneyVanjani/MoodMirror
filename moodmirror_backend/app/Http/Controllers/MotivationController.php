<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Motivation;
use Carbon\Carbon;

use App\Models\Mood;

class MotivationController extends Controller
{
    public function getMotivation($mood)
    {
        $mood = strtolower($mood);

        // Fetch all quotes for this mood
        $quotes = Motivation::where('mood', $mood)->get();

        if ($quotes->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No motivational content found for this mood.'
            ], 404);
        }

        // Pick a random quote
        $motivation = $quotes->random();

        return response()->json([
            'status' => 'success',
            'mood' => $mood,
            'quote' => $motivation->quote 
        ]);
    }
    
    public function monthlyHealth($userId)
    {
        $objectId = new \MongoDB\BSON\ObjectId($userId);
        $startOfMonth = new \MongoDB\BSON\UTCDateTime(Carbon::now()->startOfMonth());
        $endOfMonth = new \MongoDB\BSON\UTCDateTime(Carbon::now()->endOfMonth());

        $moods = Mood::where('user_id', $objectId)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $sadCount = $moods->where('mood', 'sad')->count();
        $angryCount = $moods->where('mood', 'angry')->count();

        $suggestions = [];

        // 🔹 Resource pools
        $depressionResources = [
            "https://www.youtube.com/watch?v=inpok4MKVLM", // meditation
            "https://www.imdb.com/title/tt0107048/",       // movie: Groundhog Day
            "https://sketch.io/sketchpad/",                // draw your thoughts
            "https://www.youtube.com/watch?v=ZToicYcHIOU", // mindfulness meditation
            "https://www.netflix.com/in/title/70230640"    // movie: The Pursuit of Happyness
        ];

        $angerResources = [
            "https://www.youtube.com/watch?v=O-6f5wQXSu8", // guided relaxation
            "https://www.youtube.com/watch?v=U9YKY7fdwyg", // anger management meditation
            "https://paint.js.org/",                       // paint online
            "https://www.disneyplus.com/movies/inside-out/UzZ7C6d2Si5X", // Inside Out movie
            "https://www.youtube.com/watch?v=92i5m3tV5XY"  // calm piano music
        ];

        // 🔹 Apply thresholds
        if ($sadCount >= 10) {
            $suggestions[] = [
                'issue' => 'Possible signs of depression',
                'message' => 'You logged sadness many times this month. Here’s something uplifting ❤️',
                'resource' => $depressionResources[array_rand($depressionResources)]
            ];
        }

        if ($angryCount >= 10) {
            $suggestions[] = [
                'issue' => 'High anger detected',
                'message' => 'Anger can harm your health. Try these calming activities 🧘',
                'resource' => $angerResources[array_rand($angerResources)]
            ];
        }

        if (empty($suggestions)) {
            $suggestions[] = [
                'issue' => 'Healthy balance',
                'message' => 'Your moods look balanced this month. Keep journaling and practicing mindfulness!',
                'resource' => null
            ];
        }

        return response()->json([
            'user_id' => $userId,
            'month' => Carbon::now()->format('F Y'),
            'suggestions' => $suggestions
        ]);
    
    }
    
}
