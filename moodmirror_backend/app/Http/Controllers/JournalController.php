<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Journal;

class JournalController extends Controller
{ 
    public function index()
    {
        try {
            // Fetch journals with user data, like Feedback
            $journals = Journal::with('user:id,firstName,lastName')->where('user_id', auth()->user()->_id)->latest()->get();
            // Map to include userFirstname
            $data = $journals->map(function ($journal) {
                return [
                    'id' => $journal->id,
                    'title' => $journal->title,
                    'content' => $journal->content,
                    'mood' => $journal->mood,
                    'created_at' => $journal->created_at,
                    'userFirstname' => $journal->user ? $journal->user->firstName . ' ' . $journal->user->lastName : 'Anonymous',
                ];
            });
            \Log::info('Journals fetched: ' . $data->count());  // Add logging like Feedback
            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error in journal index: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch journals'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'mood' => 'required|string',
        ]);

        $user = auth()->user();
        $journal = Journal::create([
            'user_id' => $user->_id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'mood' => $validated['mood'],
            'date' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Journal saved successfully!',
            'data' => $journal
        ], 201);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $journal = Journal::where('user_id', $user->_id)->where('_id', $id)->first();
        if (!$journal) {
            return response()->json(['message' => 'Journal not found'], 404);
        }
        $journal->delete();
        return response()->json(['message' => 'Journal deleted']);
    }
}

