<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;


class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string',
            'description' => 'required|string|max:500',
            'rating' => 'nullable|integer',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json([
            'message' => 'Feedback submitted successfully!',
            'feedback' => $feedback
        ], 201);
    }

    
    public function index()
    {
        try {
            // Fetch feedback with all user data to ensure _id mapping
            $feedbacks = Feedback::with('user')->latest()->get();
            // Map to include userFirstname
            $data = $feedbacks->map(function ($feedback) {
                $name = 'Anonymous Entity';
                if ($feedback->user) {
                    $name = trim($feedback->user->firstname . ' ' . $feedback->user->lastname);
                    if (empty($name)) {
                        $name = $feedback->user->username ?? 'Unknown Identity';
                    }
                }
                return [
                    'id' => $feedback->id,
                    'description' => $feedback->description,
                    'rating' => $feedback->rating,
                    'created_at' => $feedback->created_at,
                    'userFirstname' => $name,
                ];
            });
            \Log::info('Feedback fetched: ' . $data->count());  // Add logging
            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error in feedback index: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch feedback'], 500);
        }
    }
}
